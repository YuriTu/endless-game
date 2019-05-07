import * as THREE from 'three';
import {hero, ground, block, particle} from './config';
import {Tree} from "./component/Tree";
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

            this.hero.name = 'hero';
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

            this.rolGround.name = 'ground';

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
            this.block = new Tree(this.scene);
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
        this.block.update();
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
