# spice
Find planetary positions using NAIF SPICE Toolkit

https://naif.jpl.nasa.gov/naif/toolkit_C.html
https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/cspice/index.html

Download PC, Linux, gCC, 64bit SPICE toolkit http://naif.jpl.nasa.gov/pub/naif/toolkit//C/PC_Linux_GCC_64bit/packages/cspice.tar.Z


    wget https://naif.jpl.nasa.gov/pub/naif/toolkit//C/PC_Linux_GCC_64bit/packages/cspice.tar.Z
    gzip -d cspice.tar.Z
    tar xfv cspice.tar

> npx node-gyp build

Download generic kernels

    mkdir data
    wget -P data https://naif.jpl.nasa.gov/pub/naif/generic_kernels/lsk/naif0012.tls
    wget -P data https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de440.bsp
    wget -P data https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/pck00010.tpc