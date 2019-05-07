import * as THREE from 'three';
import {hero, ground, block, particle} from '../config';
import _ from 'christina';

export class Tree {
    constructor(){
        this.init = () => {
            for (let i = 0; i < block.scene.treeCount; i++){
                this.setTreePool(false, i* block.scene.gap, true);
                this.setTreePool(false, i* block.scene.gap, false);
            }
        }

        this.initTreePool = () => {

        }

        this.setTreePool = (isInPath, row, isLeft = false) => {

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
