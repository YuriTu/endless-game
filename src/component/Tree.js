import * as THREE from 'three';
import {hero, ground, block, particle} from '../config';
import _ from 'christina';

const sphericalHelper = new THREE.Spherical();

export class Tree {
    constructor(scene){
        this.treesPool = [];
        this.treesInPathPool = [];
        this.ground = scene.getObjectByName('ground')
        // 初始化常驻数目
        this.init = () => {
            for (let i = 0; i < block.scene.treeCount; i++){
                this.setTreesPool(false, i* block.scene.gap, true);
                this.setTreesPool(false, i* block.scene.gap, false);
            }
        }

        this.initTreePool = () => {

        }

        this.setTreesPool = (isInPath, row, isLeft = false) => {
            let newTree = null;
            if (isInPath) {
                if (this.treesPool.length === 0) return;
                newTree = this.treesPool.pop();
                newTree.visible = true;
                console.log('success add tree');

                this.treesInPathPool.push(newTree);
                // 根据球体坐标系，设置位置
                // todo theta 当前sphere的旋转角度
                sphericalHelper.set(ground.radius - 3, block.scene.pathAngleValues[row],this.ground.rotation.x );
            } else {
                console.log('add trree world')
                newTree = this.generateTree();
                let angel = 1.68 - Math.random() * 0.1
                sphericalHelper.set(ground.radius - 3, angel,row);
            }

            newTree.position.setFromSpherical(sphericalHelper);
            // 把树立起来
            // let rollingGroundVector = this.ground.position.clone().normalize();
            // let treeVector = newTree.position.clone().normalize();
            // newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
            // newTree.rotation.x += (Math.random()*(2*Math.PI/10));
            newTree.rotation.x = ((Math.PI/2));

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

            let trunkGeo = new THREE.CylinderGeometry(block.trunkRad, block.trunkRad, block.height);
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
                let offset = vertex.sub(topPointVector);

                if ( isOdd === (!!(i % 2))) {
                    offset.normalize().multiplyScalar(scalarMultiplier);
                    vertices[i + vertexIndex].add(offset);
                    vertices[i + vertexIndex].y = vertices[i + vertexIndex + heightSegment].y + 0.5;
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
                offset.normalize().multiplyScalar(6);
                vertices[i + vertexIndex].sub(offset);
            }
        }

        this.removeTree = () => {

        }


        this.init();
    }


    add(container){

    }



    update(){
        let pos = new THREE.Vector3();
        let tree;
        // 路径中
        // this.treesInPathPool.forEach((item, index) => {
        //
        // })
        // blcok的消失

    }
}
