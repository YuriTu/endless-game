import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

let SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;

let renderer,camera, scene, controls;

import {hero, ground, common } from "./config";

class Main {
    constructor(){

        this.init = () => {
            this.initScene();
            this.initDevTool();
            this.initObject();
        }

        this.initScene = () => {
            scene = new THREE.Scene();
            // scene.fog = new THREE.FogExp2(common.fog, 0.14 );
            camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 1000);
            camera.position.z = common.camz;
            camera.position.y = common.camy;
            renderer = new THREE.WebGLRenderer({alpha:true});
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setClearColor(common.bg, 1);
            document.body.appendChild(renderer.domElement);

            window.scene = scene;
        }

        this.initDevTool = () => {
            // axes
            scene.add(new THREE.AxesHelper(2000));
            controls = new TrackballControls(camera);
            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.noZoom = false;
            controls.noPan = false;
            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;
            controls.keys = [65, 83, 68];
            controls.addEventListener('change', () => {
                this.render(scene,camera);
            });
        }

        this.initObject = () => {
            this.initHero();
            this.initGroundSphere();
            this.initLight();

        }

        this.initHero = () => {
            let geo = new THREE.DodecahedronGeometry( hero.radius, 1);
            let mat = new THREE.MeshStandardMaterial( { color: 0xe5f2f2 ,shading:THREE.FlatShading} )
            this.hero = new THREE.Mesh(geo,mat);
            scene.add(this.hero);
        }

        this.initGroundSphere = () => {
            let sphereGeometry = new THREE.SphereGeometry( ground.radius, ground.widSeg,ground.heiSeg);
            let sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xfffafa ,shading:THREE.FlatShading} )
            this.rollingGroundSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
            this.rollingGroundSphere.position.set(0,ground.posy,ground.posz);
            scene.add(this.rollingGroundSphere);
        }

        this.initLight = () => {
            const sun = new THREE.DirectionalLight(0xfffafa,0.5);
            sun.position.set(0,4,1);
            sun.castShadow = true;
            scene.add(sun);
            sun.shadow.mapSize.width = 256;
            sun.shadow.mapSize.height = 256;
            sun.shadow.camera.near = 0.5;
            sun.shadow.camera.far = 50 ;

            const hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
            scene.add(hemisphereLight);
        }

        this.init();
    }

    animate(){
        window.requestAnimationFrame(this.animate.bind(this))
        renderer.render(scene,camera);
    }
}

let main = new Main();
main.animate();

