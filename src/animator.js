import * as THREE from 'three';
import {hero, ground, block, particle} from './config';
import _ from 'christina';

export class Animator {
    constructor(props) {
        this.scene = props.scene;
        this.currentLane = 0;
        this.timer = new THREE.Clock();
        this.scorer = new Scorer();
        this.treeInPath = [];
        this.init = () => {
            this.initHero();
            this.initGroundSphere();
            this.initLight();
            this.initBlock();
            this.initExplosion();
        };
        this.initHero = () => {
            let geo = new THREE.DodecahedronGeometry(hero.radius, hero.detail);
            let mat = new THREE.MeshStandardMaterial({color: 0xe5f2f2, flatShading: THREE.FlatShading});
            this.hero = new THREE.Mesh(geo, mat);
            this.hero.jumpValue = hero.jumpY;

            this.hero.update = () => {
                this.hero.rotation.x += hero.rotXSpeed;
                if (this.hero.position.y <= hero.limitY) {
                    this.hero.isJumping = false;
                    this.hero.jumpValue = _.random(hero.jumpMin,hero.jumpMax);
                }
                this.hero.position.y += this.hero.jumpValue;
                // this.hero.position.x = THREE.Math.lerp(this.hero.position.x, this.currentLane,this.timer.getDelta());
                this.hero.jumpValue -= hero.gravity;
            };

            this.scene.add(this.hero);
        };

        this.initGroundSphere = () => {
            let sphereGeometry = this.genSphere();
            let sphereMaterial = new THREE.MeshStandardMaterial({color: 0xfffafa, flatShading: THREE.FlatShading});
            this.rolGround = new THREE.Mesh(sphereGeometry, sphereMaterial);
            this.rolGround.position.set(0, ground.posy, ground.posz);

            this.rolGround.update = () => {
                this.rolGround.rotation.x += ground.rotXSpeed;
            };

            this.scene.add(this.rolGround);
        };

        this.genSphere = () => {
            let geo = new THREE.SphereGeometry(ground.radius, ground.widSeg, ground.heiSeg);
            let firstVertex = null;
            // 这里理论上按照three.js的源码先遍历 heiseg会好理解一些
            // 经度
            for (let i = 0; i < ground.widSeg; i++) {
                // 维度忽视两级
                for (let j = 1; j < ground.heiSeg - 2; j++) {
                    let currentRowIndex = (j * ground.widSeg) + 1;
                    let currentVertex = geo.vertices[i + currentRowIndex].clone();

                    if (j % 2 === 0) {
                        (i === 0) && (firstVertex = currentVertex);
                        let nextVertex = (i === ground.widSeg - 1) ? firstVertex
                            : geo.vertices[i + currentRowIndex + 1].clone();
                        let lerpValue = _.random(ground.lerpStart, ground.lerpEnd);
                        currentVertex.lerp(nextVertex, lerpValue);
                    }

                    // 单数维度基础偏转
                    let heightValue = _.random(-ground.slopeHeight, ground.slopeHeight);
                    // 计算单位向量
                    let offset = geo.vertices[i + currentRowIndex].clone().normalize().multiplyScalar(heightValue);
                    // 加和
                    geo.vertices[i + currentRowIndex] = currentVertex.add(offset);
                }
            }
            return geo;
        };

        this.initLight = () => {
            const sun = new THREE.DirectionalLight(0xfffafa, 0.5);
            sun.position.set(0, 4, 1);
            sun.castShadow = true;
            this.scene.add(sun);
            sun.shadow.mapSize.width = 256;
            sun.shadow.mapSize.height = 256;
            sun.shadow.camera.near = 0.5;
            sun.shadow.camera.far = 50;

            const hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, .9);
            this.scene.add(hemisphereLight);
        };

        this.initBlock = () => {
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

            this.scene.add(tree);

            return tree;
        };
        // move to timer
        this.timerUpdate = () => {
            // todo tree path tree pool
            if (this.timer.getElapsedTime() > block.interval ){
                this.timer.start();
                //block judge
                // score.update();
                //this.scorer.update();

                this.hasCollided = false;
            }
        }

        //
        this.blockUpdate = () => {
            let pos = new THREE.Vector3();
            let tree;
            this.treeInPath.forEach((item, index) => {

            })
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

        //todo 这里的爆炸直接消失 加个过渡
        // todo 逻辑太多 抽个class
        this.initExplosion = () => {
            let particleGeo = new THREE.Geometry();
            let particleMat = new THREE.PointsMaterial({
                color: particle.color,
                size: particle.size
            });
            this.explosionScale = particle.scale;
            // 虽然可以每次碰撞再生成，不过粒子爆炸比较丑，后面改掉吧
            for (let i = 0; i < particle.count; i++){
                particleGeo.vertices.push(new THREE.Vector3(
                    _.random(-particle.vectorLimit, particle.vectorLimit)
                ));
            }
            this.particles = new THREE.Points(particleGeo, particleMat);
            this.particles.visible = false;

            this.particles.update = () => {
                if (!this.particles.visible) return;
                this.particles.geometry.vertices.forEach(i => i.multiplyScalar(this.explosionScale));
                if (this.explosionScale > particle.scaleMaxLimit){
                    this.explosionScale -= particle.scaleStep;
                } else {
                    this.particles.visible = false;
                }
                this.particles.geometry.verticesNeedUpdate = true;
            };
            this.particles.explode = () => {
                this.particles.position.set(this.hero.position.x, particle.start.y, particle.start.z);
                this.explosionScale = particle.scaleEnd;
                this.particles.visible = true;
            }

            this.scene.add(this.particles);
        }



        this.init();
    }

    update() {
        this.hero && this.hero.update();
        this.particles.update();
        this.rolGround && this.rolGround.update();
        this.blockUpdate();
        // tree.update()
        this.particles && this.particles.update();

    }
}


class Scorer {
    constructor(){

    }
    update(){

    }
}
