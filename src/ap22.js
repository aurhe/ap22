m = Object.keys(this); // get all browser api property names to use in a deterministic random generator
o = 300; // car y position and size of each tile
s = r = 0; // car speed and rotation
x = y = o / 2; // car x position
d = []; // store keys pressed current state, truthy if the key is currently

// store canvas dimensions
p = a.width;
q = a.height;

// number of tiles the we need to render to not leave blank spaces on the screen
t = Math.floor(p / o / 2);
v = Math.floor(q / o / 2);

// abbreviations no longer used because regpack compresses better without them :/
// M = Math;
// c.l = c.lineTo;
// c.f = c.fillRect;

// set paint color
z = a => c.fillStyle = 'rgb(' + [a, a, a] + ')';

// draw building walls and windows
// a: lower face first point x coordinate
// b: lower face first point y coordinate
// e: lower face second point x coordinate
// f: lower face second point y coordinate
// h: height of the wall/window
// k: color
// g: starting height, used only for windows
// i, j: auxiliary variables, no need to initialized them on function call
w = (a, b, e, f, h, k, g = 1, i, j) => {

    // beginPath takes no argument it could be used to execute another function between () and save a ;
    // but regpack also compresses better without that so that technic is no longer used
    c.beginPath();
    c.moveTo((a - x) * g, (b - y) * g);
    c.lineTo((e - x) * g, (f - y) * g);
    c.lineTo((e - x) * h, (f - y) * h);
    c.lineTo((a - x) * h, (b - y) * h);
    c.closePath();

    // fill paint and stroke
    z(k);
    c.fill();
    c.stroke();

    // draw windows
    for (g = 1; (g += .2) < h - .3;) // iterate over rows
        // ^ is an alternative to !=
        for (b ^ f ? (i = b, j = f) : (i = a, j = e); (i += 34) < j - 32;) // iterate over columns
            b ^ f ? w(a, i, a, i + 32, g, k - 32, g + .1) : w(i, b, i + 32, b, g, k - 32, g + .1)
};

// setInterval is used instead of requestAnimationFrame because the function name is less verbose :)
setInterval(`

    // update car speed, up and down keys change the value linearly, 
    // no key pressed makes the car slow down in a more exponential way, not really the more realistic way but can't
    // reproduce all physical world physics in 1KB
    s += d[38] ? .1 : d[40] ? -.1 : -s * .01;

    // updates car rotation and x and y position, if speed is too low do not rotate car
    Math.abs(s) > .09 ? x += s * Math.sin(r += d[37] ? -.1 : d[39] ? .1 : 0) : 0;
    y -= s * Math.cos(r);

    // ~~ and 0| alternatives to Math.floor can't be used because they don't work for negative numbers
    a = Math.floor(x / o);
    b = Math.floor(y / o);

    // detect collisions
    a % 9 && b % 9 ? s = -s : 0;

    c.save();

    // clear canvas
    z(64); // road color
    c.fillRect(0, 0, p, q);

    c.translate(p / 2, q / 2);

    z(99); // sidewalk color

    // store all tiles that need to be rendered in an array with distance to car stored in property h
    // also draws the sidewalks
    for (e = [], i = a - t - 2; i++ < a + t + 1;)
        for (j = b - v - 2; j++ < b + v + 1;)
            if (i % 9 && j % 9)
                e.push({x: i, y: j, h: Math.hypot(i * o - x + o / 2, j * o - y + o / 2)}),
                    c.fillRect((i * o - x - 64), (j * o - y - 64), o + 128, o + 128);

    // sort tiles based on distance to car
    // for the perspective to look correct, further away buildings need to be drawn first in order for the closest 
    // buildings to be drawn over them and partially hide some of their walls
    e.sort((a, b) => b.h - a.h);

    // draw all buildings in order of distance
    for (i of e)

        // building vertices numbers
        // 5   6
        //  1 2
        //  3 4
        // 7   8

        // vertices coordinates
        // 1 = [a, b];
        // 2 = [f, b];
        // 3 = [a, j];
        // 4 = [f, j];
        a = i.x * o,
            b = i.y * o,
            f = a + o,
            j = b + o,

            // gerate buildings height (h) and color (k)
            // the length of the name of each browser api properties is used to provide a sort of deterministic random
            k = m[Math.abs(i.x + i.y) % m.length].length,
            h = 2 + k % 16 / 16,
            k = 32 + k % 6 * 16,

            // draw building sides
            // the color is slightly incremented in each face to provide a sense of directional light presence (sun)
            // north : south
            b > y ? w(a, b, f, b, h, k) : j < y ? w(a, j, f, j, h, k + 24) : 0,
            // east : west
            f < x ? w(f, b, f, j, h, k + 16) : a > x ? w(a, b, a, j, h, k + 8) : 0,

            // draw roof
            z(k),
            c.fillRect((a - x) * h, (b - y) * h, o * h, o * h);


    // draw car body
    c.rotate(r);
    c.fillStyle = '#911';
    c.fillRect(-16, -32, 32, 64);

    // car windows
    z(32);
    c.fillRect(-14, -16, 28, 40);

    // car roof
    c.fillStyle = '#911';
    c.fillRect(-13, -6, 26, 24);

    c.restore()

`, 16); // 60 fps

// detect keys pressed
onkeydown = onkeyup = a => d[a.which] = a.type[5] // keyup: 5 chars, keydown: 7 chars
