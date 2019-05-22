import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import {common} from './config';
import {Animator} from './animator';
import _ from 'christina';
import './index.less';


let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

let renderer;
let camera;
let scene;
let controls;

class Main {
    constructor(props) {
        this.init = () => {
            this.initScene();
            (__ENV__ === 'DEV') && this.initDevTool();
            this.handleResize();
            this.actor = new Animator({
                scene,
                toastEnd:props.renderEnd,
                setScore:props.setScore
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

        this.handleResize = () => {
            let fn = _.debounce(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth , window.innerHeight);
            },500)
            window.addEventListener('resize',fn,false);
        }


        this.render = () => {

            this.actor.update();

            renderer.render(scene, camera);
        };

        this.init();
    }

    reset(){
        this.actor.reset();
    }

    animate() {
        window.rafID = window.requestAnimationFrame(this.animate.bind(this));
        controls && controls.update();
        this.render();
    }

}

//todo 这里应该考虑抽成一个小框架的
class Controller {
    constructor() {
        // start -1 gameing 0 end 1
        this.state = {
            state: -1,
            score:0

        }
        this.container = document.querySelector('.container');

        this.renderEnd = () => {

            this.state.state = 1;
            this.toggleShadow();
            this.render();
        }

        this.setScore = (num) => {
            this.state.score = num;
        }

        this.main = new Main({
            renderEnd: this.renderEnd,
            setScore: this.setScore
        });

        this.handle = () => {
            // todo setter
            document.addEventListener('click',(e) => {
                if (e.target.classList.contains('start')) {
                    this.toggleShadow();
                    this.state.state = +e.target.value;
                    this.render();
                    this.main.reset();
                    this.main.animate();
                }

            })
        }

    }
    toggleShadow(){
        // slide down css
        document.querySelector('.shadow').classList.toggle('hide');
    }
    render(){
        this.container.innerHTML = this.state.state === -1
            ? `<div class="game-start">
                <h2>Hearts of Iron</h2>
                <button class="start" value="0">start!</button>
            </div> `
            : this.state.state === 1 ? `<div class=${`game-end ${this.state.state === 1 || 'hide'}`}>
                <h3 class="score">Your socre is ${this.state.score}</h3>
                <button class="re-start start" value="0">restart!</button>
            </div> ` : '';
    }
    start(){
        this.render();
        this.handle();
        // this.main.render();
    }

}
let controller = new Controller();
controller.start();



