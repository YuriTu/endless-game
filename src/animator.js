import * as THREE from 'three';
import {hero, ground, block} from './config';
import _ from 'christina';

export class Animator {
    constructor(props) {
        this.scene = props.scene;
        this.init = () => {
            this.initHero();
            this.initGroundSphere();
            this.initLight();
            this.initBlock();
        };
        this.initHero = () => {
            let geo = new THREE.DodecahedronGeometry(hero.radius, hero.detail);
            let mat = new THREE.MeshStandardMaterial({color: 0xe5f2f2, shading: THREE.FlatShading});
            this.hero = new THREE.Mesh(geo, mat);

            this.hero.update = () => {
                this.hero.rotation.x += hero.rotXSpeed;
            };

            this.scene.add(this.hero);
        };

        this.initGroundSphere = () => {
            let sphereGeometry = this.genSphere();
            let sphereMaterial = new THREE.MeshStandardMaterial({color: 0xfffafa, shading: THREE.FlatShading});
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
                        let lerpValue = _.random(ground.lerpStart,ground.lerpEnd);
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
            let treeGeo = new THREE.ConeGeometry(block.radius, block.height, block.heiSeg, block.radSeg);
            let treeMat = new THREE.MeshStandardMaterial({color: block.color, shading: THREE.FlatShading});
            
        };

        this.init();
    }

    update() {
        this.hero.update();
        this.rolGround.update();
    }
}
