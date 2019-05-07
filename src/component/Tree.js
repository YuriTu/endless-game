import * as THREE from 'three';
import {hero, ground, block, particle} from '../config';
import _ from 'christina';

const sphericalHelper = new THREE.Spherical();

export class Tree {
    constructor(scene){
        this.treesPool = [];
        this.treesInPathPool = [];
        this.ground = scene.getKey('ground')
        this.init = () => {
            for (let i = 0; i < block.scene.treeCount; i++){
                this.setTreesPool(false, i* block.scene.gap, true);
                this.setTreesPool(false, i* block.scene.gap, false);
            }
        }

        this.initTreePool = () => {

        }

        this.setTreesPool = (isInPath, row, isLeft = false) => {
            let newTree = null;
            if (isInPath) {
                if (this.treesPool.length === 0) return;
                newTree = this.treesPool.pop();
                newTree.visible = true;
                console.log('success add tree');

                this.treesInPathPool.push(newTree);
                // 根据球体坐标系，设置位置
                // todo theta 当前sphere的旋转角度
                sphericalHelper.set(ground.radius - 3, block.scene.pathAngleValues[row],this.ground.rotation.x );
            } else {
                newTree = this.generateTree();
            }

            newTree.position.setFromSpherical(sphericalHelper);

            this.ground.add(newTree);



        }

        this.generateTree = () => {

        }


        this.init();
    }


    add(container){

    }
    update(){

    }
}
