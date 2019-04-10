import * as THREE from 'three';
import {hero, ground} from './config';

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
            let sphereGeometry = new THREE.SphereGeometry(ground.radius, ground.widSeg, ground.heiSeg);
            let sphereMaterial = new THREE.MeshStandardMaterial({color: 0xfffafa, shading: THREE.FlatShading});
            this.rolGround = new THREE.Mesh(sphereGeometry, sphereMaterial);
            this.rolGround.position.set(0, ground.posy, ground.posz);

            this.rolGround.update = () => {
                this.rolGround.rotation.x += ground.rotXSpeed;
            };

            this.scene.add(this.rolGround);
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

        };

        this.init();
    }

    update() {
        this.hero.update();
        this.rolGround.update();
    }
}