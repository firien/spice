{
  "targets": [
    {
      "target_name": "spice",
      'include_dirs': [
        'cspice/include'
      ],
      'cflags': [ '-Wall' ],
      "sources": [
        "spice.c",
        '<!@(ls -1 cspice/src/cspice/*.c)',
        '<!@(ls -1 cspice/src/mkspk_c/*.c)',
      ]
    }
  ]
}
