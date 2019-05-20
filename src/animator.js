import * as THREE from 'three';
import {hero, ground, block, particle} from './config';
import {Tree} from "./component/Tree";
import _ from 'christina';

export class Animator {
    constructor(props) {
        this.scene = props.scene;
        this.timer = new THREE.Clock();
        this.scorer = new Scorer();
        this.init = () => {
            this.initHero();
            this.initGroundSphere();
            this.initLight();
            this.initBlock();
            this.handleEvent();
        };
        this.initHero = () => {
            let geo = new THREE.DodecahedronGeometry(hero.radius, hero.detail);
            let mat = new THREE.MeshStandardMaterial({color: 0xe5f2f2, flatShading: THREE.FlatShading});
            this.hero = new THREE.Mesh(geo, mat);

            this.hero.jumpValue = hero.jumpBaseY;
            this.hero.jumping = false;

            this.hero.receiveShadow = true;
            this.hero.castShadow = true;

            this.hero.middleLane = 0;
            this.hero.currentLane = this.hero.middleLane;
            this.hero.leftLane = -1;
            this.hero.rightLane = 1;

            this.hero.isDead = false;

            this.hero.position.x = this.hero.currentLane;
            this.hero.position.y = hero.basePosY;
            this.hero.position.z = hero.basePosZ;

            this.hero.update = () => {
                this.hero.rotation.x += hero.rotXSpeed;
                if (this.hero.position.y <= hero.basePosY) {
                    this.hero.jumping = false;
                    this.hero.jumpValue = _.random(hero.jumpMin,hero.jumpMax);
                }
                this.hero.position.y += this.hero.jumpValue;
                this.hero.position.x = THREE.Math.lerp(this.hero.position.x, this.hero.currentLane,2 * this.timer.getDelta());
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
            this.rolGround.rotation.z = -Math.PI / 2;

            this.rolGround.update = () => {
                this.rolGround.rotation.x += ground.rotXSpeed;
            };

            this.rolGround.name = 'ground';

            this.scene.add(this.rolGround);
        };

        this.genSphere = () => {
            let geo = new THREE.SphereGeometry(ground.radius, ground.widSeg, ground.heiSeg);
            let firstVertex = null;
            // 这里理论上按照three.js的源码先遍历 heiseg会好理解一些 先从widseg遍历会让firstvext造成覆盖 且不好取
            // 经度
            for (let j = 1; j < ground.heiSeg - 2; j++) {
                for (let i = 0; i < ground.widSeg; i++) {
                // 维度忽视两级
                    let currentRowIndex = (j * ground.widSeg) + 1;
                    let currentVertex = geo.vertices[i + currentRowIndex].clone();

                    if (j % 2 !== 0){
                        if (i === 0){
                            firstVertex = currentVertex.clone();
                        }
                        let nextVertex = (i === ground.widSeg - 1) ? firstVertex
                            : geo.vertices[i + currentRowIndex + 1].clone();
                        // let nextVertex = geo.vertices[i + currentRowIndex + 1].clone();
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
                this.block.addTreeInPath()
                if (this.hero.isDead){
                    this.gameOverCatcher();
                } else {
                    this.scorer.update();
                }

            }
        }

        this.gameOverCatcher = () => {
            //todo 需要做一些延迟加缓动，让爆炸效果跑完
            // todo 加个 tobecontinued似乎也不错
            //  延迟 -》 缓动
            setTimeout(() => {
                cancelAnimationFrame(window.rafID);
                props.toastEnd();
            },2000)
        }

        this.handleEvent = () => {
            this.handleKeyDown();
            this.handleResize();
        }

        this.handleKeyDown = () => {
            document.addEventListener('keydown',(e) => {

                if (this.hero.jumping) return;

                let validMove = true;
                const code = e.keyCode;
                switch (code) {
                    // left
                    case 37:
                        console.log('left',this.hero.currentLane);
                        if (this.hero.currentLane === this.hero.leftLane){
                            validMove = false;
                        } else {
                            this.hero.currentLane += hero.moveLeftLane;
                        }
                        break;
                    // right
                    case 39:
                        console.log('right');
                        if (this.hero.currentLane === this.hero.rightLane){
                            validMove = false;
                        } else {
                            this.hero.currentLane += hero.moveRightLane;
                        }
                        break;
                    // up
                    case 38:
                        console.log('up');
                        this.hero.jumpValue = hero.jumpStep;
                        this.hero.jumping = true;
                        validMove = false;
                        break;
                    default:
                        validMove = false;
                        break;
                }

                if (validMove) {
                    this.hero.jumping = true;
                    this.hero.jumpValue = hero.validMoveJumpStep;
                }
            })

        }

        this.handleResize = () => {

        }



        this.init();
    }

    update() {
        this.hero && this.hero.update();
        this.rolGround && this.rolGround.update();
        this.block && this.block.update();
        this.timerUpdate();
    }

}


class Scorer {
    constructor(){
        this.score = 0;

        const st = document.createElement('div');
        st.style.position = 'absolute';
        st.style.top = '20px';
        st.style.left = '10px';
        document.body.appendChild(st);

        this.st = st;

    }
    update(){
        this.score += 2 * block.interval;
        this.st.innerHTML = this.score;
    }
}
