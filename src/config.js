const common = {
    color: '',
    bg: 0xfffafa,
    fog: 0xf0fff0,
    camz: 6.5,
    camy: 2.5,

};


const ground = {
    radius: 26,
    widSeg: 40,
    heiSeg: 40,
    posy: -24,
    posz: 2,
    rotXSpeed: .008,
    slopeHeight: .07,
    lerpStart: 0.25,
    lerpEnd: 0.75
};


const hero = {
    basePosZ:4.8,
    basePosY:1.8,
    radius: .2,
    detail: 1,
    limitY:18,
    jumpBaseY:1,
    jumpMin:.04,
    jumpMax:.005,
    jumpStep: .1,
    validMoveJumpStep:.6,
    gravity: .005,
    moveLeftLane: -1,
    moveRightLane: 1
};
hero.rotXSpeed = (ground.rotXSpeed * ground.radius / hero.radius) / 5;

const block = {
    radius: 10,
    height: 10,
    heightSeg: 6,
    radSeg: 8,
    color: '#33ff33',
    posy:12,
    scalarStart: 5,
    scalarEnd: 20,
    trunkRad: 5,
    trunkHeight: 25,
    trunkPosY:5,
    trunkColor: '#886633',
    interval:.5,

    scene: {
        treeCount:36,
        gap: 6.28 / 36,
        pathAngleValues:[1.52,1.57,1.62]
    },

    maxTreesPool: 10,


};

const particle = {
    count:20,
    color: '#fffafa',
    size: 0.2,
    scale:1.06,
    scaleMaxLimit: 1.005,
    scaleStep:.001,
    start:{
        y:20,
        z:48,
    },
    vectorLimit:2,
    scaleEnd:1.07

}

export {
    common,
    hero,
    ground,
    block,
    particle
};
