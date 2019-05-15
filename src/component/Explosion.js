import * as THREE from 'three';
import {particle} from "../config";
import _ from "christina";
//todo 这里的爆炸直接消失 加个过渡
export class Explosion {
    constructor(scene){
        this.explosionScale = particle.scale;

        let particleGeo = new THREE.Geometry();
        let particleMat = new THREE.PointsMaterial({
            color: particle.color,
            size: particle.size
        });

        // 虽然可以每次碰撞再生成，不过粒子爆炸比较丑，后面改掉吧
        for (let i = 0; i < particle.count; i++){
            particleGeo.vertices.push(new THREE.Vector3(
                THREE.Math.randFloatSpread(particle.vectorLimit),
                THREE.Math.randFloatSpread(particle.vectorLimit),
                THREE.Math.randFloatSpread(particle.vectorLimit)
            ));
        }

        this.mesh = this.particles = new THREE.Points(particleGeo, particleMat);
        // this.particles.position.set(1,1,0)
        this.particles.visible = false;

        scene.add(this.particles);
    }

    explode(hero){

        this.particles.position.set(hero.position.x, particle.start.y, particle.start.z);
        this.explosionScale = particle.scaleEnd;
        this.particles.geometry.vertices = this.particles.geometry.vertices.map(() => {
            return new THREE.Vector3(
                THREE.Math.randFloatSpread(particle.vectorLimit),
                THREE.Math.randFloatSpread(particle.vectorLimit),
                THREE.Math.randFloatSpread(particle.vectorLimit)
            )
        })
        this.particles.visible = true;
        console.log(hero.position,this.particles.position)
    }

    update(){
        if (!this.particles.visible) return;
        this.particles.geometry.vertices.forEach(i => i.multiplyScalar(this.explosionScale));
        if (this.explosionScale > particle.scaleMaxLimit){
            this.explosionScale -= particle.scaleStep;
        } else {
            this.particles.visible = false;
        }
        this.particles.geometry.verticesNeedUpdate = true;
    }
}
