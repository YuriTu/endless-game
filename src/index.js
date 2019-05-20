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

class Controller {
    constructor(props) {
        // start -1 gameing 0 end 1
        this.state = {
            state: 1,
            score:0

        }
        this.container = document.querySelector('.container');
        this.main = new Main({
            renderEnd: this.renderEnd,
            setScore: this.setScore
        });


        this.renderEnd = () => {
            this.state.state = 1;
        }

        this.setScore = (num) => {
            this.state.score = num;
            this.render();
        }


        this.handle = () => {
            document.querySelector('.start').addEventListener('click',(e) => {
                this.toggleShadow();
                this.state.state = e.target.value;
                this.main.animate();
            })
        }
    }
    toggleShadow(){
        // slide down css
    }
    render(){
        this.container.innerHTML = `
            <div class=${`game-start ${this.state.state === -1 || 'hide' }`}>
                <div>title</div>
                <div class="start">start!</div>
            </div>
            <div class=${`game-end ${this.state.state === 1 || 'hide'}`}>
                <div class="score">${this.state.score}</div>
                <div class="re-start start">restart!</div>
            </div>
        `;
    }
    start(){
        this.render();
        this.handle();
    }

}
let controller = new Controller();
controller.start();



