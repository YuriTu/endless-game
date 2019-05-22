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
    basePosY:1.85,
    radius: .2,
    detail: 1,
    limitY:18,
    jumpBaseY:1,
    jumpMin:.045,
    jumpMax:.005,
    jumpStep: .1,
    validMoveJumpStep:.06,
    gravity: .005,
    moveLeftLane: -1,
    moveRightLane: 1
};
hero.rotXSpeed = (ground.rotXSpeed * ground.radius / hero.radius) / 5;

const block = {
    radius: .5,
    height: 1,
    heightSeg: 6,
    radSeg: 8,
    color: '#33ff33',
    posy:.9,
    scalarStart: .1,
    scalarEnd: .25,
    trunkRad: .1,
    trunkHeight: .5,
    trunkPosY:.25,
    trunkColor: '#886633',
    interval:.5,

    scene: {
        treeCount:36,
        gap: 6.28 / 36,
        pathAngleValues:[1.52,1.57,1.62],
    },
    groundOffset:.3,
    groundLeftPhi:1.68+Math.random()*0.1,
    groundRightPhi:1.46-Math.random()*0.1,

    makeUpPosy:.05,
    tightenScale:.06,

    triggerLimitDistance: .6,

    maxTreesPool: 6,


};

const particle = {
    count:20,
    color: '#000000',
    size: .2,
    scale:1.06,
    scaleMaxLimit: 1.005,
    scaleStep:.001,
    start:{
        y:2,
        z:4.8,
    },
    vectorLimit:.2,
    scaleEnd:1.07

}

export {
    common,
    hero,
    ground,
    block,
    particle
};
