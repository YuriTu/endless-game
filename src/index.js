import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import {common} from './config';
import {Animator} from './animator';

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

let renderer;
let camera;
let scene;
let controls;

class Main {
    constructor() {
        this.init = () => {
            this.initScene();
            this.initDevTool();
            this.actor = new Animator({
                scene,
                toastEnd:this.toashEnd
            });
        };

        this.initScene = () => {
            scene = new THREE.Scene();
            // scene.fog = new THREE.FogExp2(common.fog, 0.14 );
            camera = new THREE.PerspectiveCamera(60, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 1000);
            camera.position.z = common.camz;
            camera.position.y = common.camy;
            renderer = new THREE.WebGLRenderer({alpha: true});
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setClearColor(common.bg, 1);
            document.body.appendChild(renderer.domElement);

            window.scene = scene;
        };

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
                this.render();
            });
        };

        this.toastEnd = () => {

        }

        this.render = () => {

            this.actor.update();

            renderer.render(scene, camera);
        };

        this.init();
    }

    animate() {
        window.rafID = window.requestAnimationFrame(this.animate.bind(this));
        controls && controls.update();
        this.render();
    }

}

let main = new Main();
main.animate();

