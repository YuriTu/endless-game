import * as THREE from 'three';
import {hero, ground, block, particle} from '../config';
import _ from 'christina';
import {Explosion} from "./Explosion";

const sphericalHelper = new THREE.Spherical();
// todo 计算buffer化
export class Tree {
    constructor(scene){
        this.treesPool = [];
        this.treesInPathPool = [];
        this.treesRemovePool = [];

        this.ground = scene.getObjectByName('ground');
        this.hero = scene.getObjectByName('hero');

        this.exploser = new Explosion(scene);

        // 初始化
        this.init = () => {
            this.initStableTree();
            this.initTreePool();

        }

        this.initStableTree = () => {
            for (let i = 0; i < block.scene.treeCount; i++){
                this.setTrees(false, i* block.scene.gap, true);
                this.setTrees(false, i* block.scene.gap, false);
            }
        }

        this.initTreePool = () => {
            for (let i = 0; i < block.maxTreesPool; i++){
                const tree = this.generateTree();
                this.treesPool.push(tree);
            }
        }

        this.setTrees = (isInPath, row, isLeft = false) => {
            let newTree = null;
            if (isInPath) {
                // debugger
                // console.log(this.treesPool.length)
                if (this.treesPool.length === 0) return;

                newTree = this.treesPool.pop();
                newTree.visible = true;
                // console.log('success add tree');

                this.treesInPathPool.push(newTree);
                // 根据球体坐标系，设置位置
                // todo theta 当前sphere的旋转角度
                // console.log(ground.radius - block.groundOffset, block.scene.pathAngleValues[row],-this.ground.rotation.x + 4 )
                // console.log(-this.ground.rotation.x + 4);
                sphericalHelper.set(ground.radius - block.groundOffset, block.scene.pathAngleValues[row],-this.ground.rotation.x + 4 );
            } else {
                newTree = this.generateTree();
                // angle 天顶角固定   row 方位角 圆形36分
                let angel = 0;
                if (isLeft){
                    angel = 1.68+Math.random()*0.1;
                }else{
                    angel = 1.46-Math.random()*0.1;
                }

                sphericalHelper.set(ground.radius - block.groundOffset, angel,row);
            }

            newTree.position.setFromSpherical(sphericalHelper);
            // 把树立起来 按照圆心的射线
            let rollingGroundVector = this.ground.position.clone().normalize();
            let treeVector = newTree.position.clone().normalize();
            newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
            newTree.rotation.x += (Math.random()*(2*Math.PI/10))+-Math.PI/10;
            // newTree.rotation.x = ((Math.PI/2));

            newTree.name = `tree${Math.random() * 10}`
            this.ground.add(newTree);
        }

        this.generateTree = () => {
            let treeGeo = new THREE.ConeGeometry(block.radius, block.height, block.radSeg, block.heightSeg);
            let treeMat = new THREE.MeshStandardMaterial({color: block.color, flatShading: THREE.FlatShading});
            let scalarMultiplier = _.random(block.scalarStart, block.scalarEnd);

            this.makeTreeUp(treeGeo.vertices, block.heiSeg, 0, scalarMultiplier);
            this.makeTreeTighten(treeGeo.vertices, block.heightSeg, 1);
            this.makeTreeUp(treeGeo.vertices, block.heiSeg, 2, scalarMultiplier * 1.1, true);
            this.makeTreeTighten(treeGeo.vertices, block.heightSeg, 3);
            this.makeTreeUp(treeGeo.vertices, block.heiSeg, 4, scalarMultiplier * 1.2);
            this.makeTreeTighten(treeGeo.vertices, block.heightSeg, 5);
            // for mate

            // gen top
            let treeTop = new THREE.Mesh(treeGeo, treeMat);
            treeTop.castShadow = true;
            // treeTop.receiveShadow = false;
            treeTop.position.y = block.posy;
            treeTop.rotation.y = (Math.random() * Math.PI);

            let trunkGeo = new THREE.CylinderGeometry(block.trunkRad, block.trunkRad, block.trunkHeight);
            let trunkMat = new THREE.MeshStandardMaterial({color: block.trunkColor, flatShading: THREE.FlatShading});
            let trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = block.trunkPosY;
            let tree = new THREE.Group();
            tree.add(treeTop);
            tree.add(trunk);

            // this.scene.add(tree);

            return tree;
        }

        // 扩大树轮范围 对高度进行差异化
        this.makeTreeUp = (vertices, heightSegment, currentRadiustSeg, scalarMultiplier, isOdd = false) => {
            const topPointVector = vertices[0].clone();
            for (let i = 0; i < heightSegment; i++) {
                let vertexIndex = (currentRadiustSeg * heightSegment) + 1;
                let vertex = vertices[vertexIndex + i].clone();
                topPointVector.y = vertex.y;
                let offset = vertex.sub(topPointVector);

                if ( isOdd === (!!(i % 2))) {
                    offset.normalize().multiplyScalar(scalarMultiplier);
                    vertices[i + vertexIndex].add(offset);
                    vertices[i + vertexIndex].y = vertices[i + vertexIndex + heightSegment].y + block.makeUpPosy;
                } else {
                    offset.normalize().multiplyScalar(scalarMultiplier / 6);
                    vertices[i + vertexIndex].add(offset);
                }
            }
        };


        this.makeTreeTighten = (vertices, heightSegment, currentRadiusSeg) => {
            let topPointVector = vertices[0].clone();
            for (let i=0;i<heightSegment;i++){
                let vertexIndex = currentRadiusSeg * heightSegment + 1;
                let vertexVector = vertices[i + vertexIndex].clone();
                topPointVector.y = vertexVector.y;
                let offset = vertexVector.sub(topPointVector);
                offset.normalize().multiplyScalar(block.tightenScale);
                vertices[i + vertexIndex].sub(offset);
            }
        }



        this.setTreesInPathToRemove = () => {
            let treePos = new THREE.Vector3();
            this.treesInPathPool.forEach(item => {
                let tree = item;

                treePos.setFromMatrixPosition(tree.matrixWorld);
                // console.log(treePos.z,tree.visible)
                if (treePos.z > 6 && tree.visible) {
                    //todo 直接处理
                    // console.log('will remove tree')
                    this.treesRemovePool.push(tree);
                } else if (treePos.distanceTo(this.hero.position) < block.triggerLimitDistance) {

                    this.hero.isDead = true;
                    // 不幂等
                    // if (!this.exploser.mesh.visible){
                        console.log('boom!!!');
                        this.exploser.explode(this.hero);
                    // }

                }
            })
        }

        this.removeTree = () => {
            // console.log(this.treesRemovePool.length);
            this.treesRemovePool.forEach(item => {
                // console.log('remove tree',item)
                let thisTree = item;
                let from = this.treesInPathPool.indexOf(thisTree);
                this.treesInPathPool.splice(from,1);
                this.treesPool.push(thisTree);
                thisTree.visible = false;
            });
            this.treesRemovePool = [];
        }

        this.init();
    }


    addTreeInPath(){
        let options = [0, 1, 2];
        let lane = Math.floor(Math.random() * 3);
        this.setTrees(true, lane);
        options.splice(lane, 1);
        if (Math.random() > .5){
            lane = Math.floor(Math.random() * 2);
            this.setTrees(true, options[lane])
        }
    }



    update(){

        this.setTreesInPathToRemove();
        this.removeTree();
        this.exploser.update();

    }
}
