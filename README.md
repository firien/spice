# spice
Find planetary positions using NAIF SPICE Toolkit

https://naif.jpl.nasa.gov/naif/toolkit_C.html
https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/cspice/index.html

Download generic kernels

    wget -P data https://naif.jpl.nasa.gov/pub/naif/generic_kernels/lsk/naif0012.tls
    wget -P data https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de440.bsp
    wget -P data https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/pck00010.tpc

npm install https://github.com/firien/spice.git

```js
import spice, { azAlt } from 'spice';

spice.loadKernels("./data/naif0012.tls", "./data/de440.bsp", "./data/pck00010.tpc");

// moon position at London
let time = new Date();
time.setHours(0);
time.setMinutes(0);
time.setSeconds(0);
for (let x=0; x < 48; ++x) {
  time.setHours(time.getHours() + 1);
  let {ra, dec} = spice.getPosition('moon', time);
  let {azm, alt} = azAlt(ra, dec, time, 51.496751, -0.111716);
  console.log([time, azm, alt].join("\t"));
}
```
