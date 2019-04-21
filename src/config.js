const common = {
    color: '',
    bg: 0xfffafa,
    fog: 0xf0fff0,
    camz: 100,
    camy: 10
};

const hero = {
    radius: 10,
    detail: 1,
    rotXSpeed: -.1,
    limitY:18,
    jumpY:1,
    jumpMin:.04,
    jumpMax:.005

};

const ground = {
    radius: 130,
    widSeg: 40,
    heiSeg: 40,
    posy: -130 + (-hero.radius),
    posz: 0,
    rotXSpeed: .01,
    slopeHeight: 1,
    lerpStart: 0.25,
    lerpEnd: 0.75
};

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
