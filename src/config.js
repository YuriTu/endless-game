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
    rotXSpeed: -.1
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

export {
    common,
    hero,
    ground
};
