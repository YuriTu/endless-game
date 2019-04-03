import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

let SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;

let renderer,camera, scene, controls;

class Main {
    constructor(){
        this.init = () => {
            this.initScene();
            this.initDevTool();
        }

        this.initScene = () => {
            // 创建场景
            scene = new THREE.Scene();
            // 创建相机
            camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 1000);
            // 创建渲染器
            renderer = new THREE.WebGLRenderer();
            // 添加渲染器至dom
            document.body.appendChild(renderer.domElement);

            alert('success! Your browser supports WebGL.')
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

        this.animate = () => {
            window.requestAnimationFrame(this.animate.bind(this))
            renderer.render(scene,camera);
        }

        this.init();

        this.animate();
    }
}

let main = new Main();

