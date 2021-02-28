import bindings from 'bindings';
const spice = bindings('spice');

const bodies = [
  "MARS BARYCENTER",// (4)
  "JUPITER BARYCENTER",// (5)
  "SATURN BARYCENTER",// (6)
  "URANUS BARYCENTER",// (7)
  "NEPTUNE BARYCENTER",// (8)
  "PLUTO BARYCENTER",// (9)
  "MERCURY",// (199)
  "VENUS",// (299)
  "MOON",// (301)
  "EARTH",// (399)
  "SUN",// (10)
]

spice.loadKernels = (...kernels) => {
  for (let kernel of kernels) {
    spice.loadKernel(kernel);
  }
}

const getTarget = (name) => {
  let target = bodies.find(b => b === name.toUpperCase())
  if (!target) {
    target = bodies.find(b => b === `${name.toUpperCase()} BARYCENTER`)
  }
  return target
}

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

spice.getPosition = (body, time=new Date()) => {
  let target = getTarget(body);
  // "2021 FEB 21 00:00"
  let dt = `${time.getFullYear()} ${months[time.getMonth()]} ${time.getDate()} ${time.getUTCHours()}:${time.getUTCMinutes()}`
  // console.log(dt)
  return spice.spkpos(dt, target);
}

const toRadian = (deg) => {
  return deg / 180.0 * Math.PI
}

const toDegree = (rad) => {
  return rad * 180.0 / Math.PI;
}

export const degreeToArc = (rad, hour=false) => {
  let degree = toDegree(rad);
  if (hour) {
    degree = degree / 15;
  }

  let deg = Math.floor(degree);
  let minutes = (degree - deg) * 60;
  let minute = Math.floor(minutes);
  let second = (minutes - minute) * 60;
  return` ${deg} ${minute} ${second}`;
}

// https://labod.co/posts/finding_positions_of_planets_using_spiceypy
// http://www.stjarnhimlen.se/comp/ppcomp.html#12b%5D(http://www.stjarnhimlen.se/comp/ppcomp.html
export const azAlt = (ra, dec, time, lat, lon) => {
  let lst = getLST(time, lon);
  let ha = lst - toDegree(ra) / 15;
  ha = toRadian(ha * 15);

  let x = Math.cos(ha) * Math.cos(dec);
  let y = Math.sin(ha) * Math.cos(dec);
  let z = Math.sin(dec);

  lat = toRadian(lat);

  let xhor = x * Math.sin(lat) - z * Math.cos(lat);
  let yhor = y;
  let zhor = x * Math.cos(lat) + z * Math.sin(lat);

  let azm = Math.atan2(yhor, xhor) + Math.PI;
  let alt = Math.atan2(zhor, Math.sqrt(xhor ** 2 + yhor ** 2));
  return { azm: toDegree(azm), alt: toDegree(alt) };

}

const normalize = (degrees) => {
  let d = degrees % 360;
  if (d < 0) {
    d += 360;
  }
  return d;
}

// local sidereal time in degrees
const getLST = (time, lon) => {
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let D = time.getDate();
  let UT = time.getUTCHours() + time.getUTCMinutes() / 60 + time.getUTCSeconds() / 3600;
  // need to do integer division
  let a = Math.floor( y + (m + 9) / 12 );
  let d = 367 * y - Math.floor(7 * a / 4) + Math.floor((275 * m) / 9) + D - 730530;
  d = d + UT / 24.0;
  // can we pull sun orbital elements from kernels?
  let M = normalize(356.0470 + 0.9856002585 * d);
  let w = 282.9404 + 4.70935E-5 * d
  let Ls = M + w;
  let GMST0 = normalize(Ls + 180) / 15;//hours
  let lst = GMST0 + UT + lon / 15;
  return lst
}

export default spice;
