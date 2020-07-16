(window.webpackJsonpDeezer = window.webpackJsonpDeezer || []).push([
  [133],
  {
    '2d1n': function (e, n, r) {
      'use strict';
      r.r(n);
      var a = {
        'MPEG-1': {
          1: [null, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
          2: [null, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
          3: [null, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
        },
        'MPEG-2': {
          1: [null, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
          2: [null, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]
        }
      };
      (a['MPEG-2'][3] = a['MPEG-2'][2]), (a['MPEG-2.5'] = a['MPEG-2']);
      var l = [void 0, 3, 2, 1],
        i = { 'MPEG-1': [void 0, 384, 1152, 1152], 'MPEG-2': [void 0, 384, 1152, 576] };
      i['MPEG-2.5'] = i['MPEG-2'];
      var o = { 'MPEG-1': [44100, 48e3, 32e3], 'MPEG-2': [22050, 24e3, 16e3], 'MPEG-2.5': [11025, 12e3, 8e3] },
        s = ['MPEG-2.5', void 0, 'MPEG-2', 'MPEG-1'];
      n.default = {
        frames: function (e) {
          for (var n = e.byteLength, r = [], M = 0; M < n - 3; M++) {
            var t = e[M],
              E = e[M + 1],
              G = e[M + 2],
              P = e[M + 3];
            if (73 === t && 68 === E && 51 === G && M + 6 < n) {
              var f = ((e[M + 6] << 24) + (e[M + 7] << 16) + (e[M + 8] << 8) + e[M + 9]) >>> 0;
              M += 10 + ((2130706432 & f) >> 3) + ((8323072 & f) >> 2) + ((32512 & f) >> 1) + (127 & f) - 1;
            } else if (255 === t && E >= 224) {
              var v = s[(E >> 3) & 3],
                u = l[(E >> 1) & 3];
              if (v && u) {
                var d = a[v][u][G >> 4],
                  p = o[v][(G >> 2) & 3];
                if (d && p) {
                  var h = (G >> 1) & 1,
                    c = Math.floor(1 === u ? 4 * ((12 * d * 1e3) / p + h) : (144 * d * 1e3) / p + h),
                    w = i[v][u];
                  M + c <= n &&
                    r.push({
                      bitrate: d,
                      channels: P >> 6 < 3 ? 2 : 1,
                      duration: (1e3 / p) * w,
                      layer: u,
                      offset: M,
                      samples: w,
                      sampling: p,
                      size: c,
                      version: v
                    }),
                    (M += c - 1);
                }
              }
            } else 1 === r.length && ((M = r[0].offset), (r.length = 0));
          }
          return r;
        }
      };
    }
  }
]);
//# sourceMappingURL=https://files.deezer.com/cache/js/player-MP3Parser.c31b646a86cf88a4b8dd.js.map.json
