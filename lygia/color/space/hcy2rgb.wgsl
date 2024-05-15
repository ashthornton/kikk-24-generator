#include "hue2rgb.wgsl"

fn hcy2rgb(hcy: vec3f) -> vec3f {
    var rta = hcy;
    let HCYwts = vec3f(0.299, 0.587, 0.114);
    let RGB = hue2rgb(hcy.x);
    let Z = dot(RGB, HCYwts);
    if (hcy.z < Z) {
        rta.y *= hcy.z / Z;
    } else if (Z < 1.0) {
        rta.y *= (1.0 - hcy.z) / (1.0 - Z);
    }
    return (RGB - Z) * rta.y + rta.z;
}
