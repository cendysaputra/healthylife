import { useEffect, useId, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop, SvgXml } from 'react-native-svg';
import { ILUSTRASI } from '../lib/ilustrasi';
import { colors } from '../lib/theme';

// Ikon garis 24x24
const IKON = {
  beranda: <Path d="M4 11.2 12 4.8l8 6.4V19a1 1 0 0 1-1 1h-4.5v-5.2h-5V20H5a1 1 0 0 1-1-1z" />,
  jelajah: (
    <>
      <Circle cx="12" cy="12" r="8.5" />
      <Path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  aktivitas: (
    <>
      <Rect x="4" y="11" width="4" height="9" rx="2" />
      <Rect x="10" y="4" width="4" height="16" rx="2" />
      <Rect x="16" y="8" width="4" height="12" rx="2" />
    </>
  ),
  profil: (
    <>
      <Circle cx="12" cy="8.5" r="3.8" />
      <Path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </>
  ),
  bell: (
    <>
      <Path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 1.5h-15z" />
      <Path d="M10 21h4" />
    </>
  ),
  back: <Path d="M15 5l-7 7 7 7" />,
  arrow: <Path d="M4 12h15m-6-6 6 6-6 6" />,
  search: (
    <>
      <Circle cx="11" cy="11" r="6.5" />
      <Path d="M16 16l4 4" />
    </>
  ),
  close: <Path d="M6 6l12 12M18 6L6 18" />,
  'chevron-down': <Path d="M7 10l5 5 5-5" />,
  check: <Path d="M5 12.5l4.5 4.5L19 7.5" />,
  kategori: (
    <>
      <Rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
      <Rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
      <Rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
      <Rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
    </>
  )
};

export default function Ikon({ name, size = 24, color = colors.ink, strokeWidth = 1.7 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {IKON[name]}
    </Svg>
  );
}

// Ikon tab: garis saat diam, duotone (ungu + aksen oranye) saat aktif
const OREN = '#FF6600';
const IKON_ISI = {
  beranda: (w) => (
    <>
      <Path d="M3.5 11 12 4l8.5 7v8.2a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8z" fill={w} stroke={w} />
      <Rect x="9.6" y="13.6" width="4.8" height="7.4" rx="2.2" fill={OREN} stroke="none" />
    </>
  ),
  jelajah: (w) => (
    <>
      <Circle cx="12" cy="12" r="9" fill={w} stroke={w} />
      <Path d="M16 8 13.3 13.3 10.7 10.7z" fill={OREN} stroke={OREN} strokeWidth={1} />
      <Path d="M8 16 10.7 10.7 13.3 13.3z" fill="#fff" stroke="#fff" strokeWidth={1} />
    </>
  ),
  aktivitas: (w) => (
    <>
      <Rect x="3.5" y="11" width="4.5" height="9.5" rx="2.25" fill={w} stroke="none" />
      <Rect x="9.75" y="3.5" width="4.5" height="17" rx="2.25" fill={OREN} stroke="none" />
      <Rect x="16" y="7.5" width="4.5" height="13" rx="2.25" fill={w} stroke="none" />
    </>
  ),
  profil: (w) => (
    <>
      <Circle cx="12" cy="8" r="4.2" fill={OREN} stroke="none" />
      <Path d="M3.8 20.5c1.1-4 4.3-6.3 8.2-6.3s7.1 2.3 8.2 6.3z" fill={w} stroke={w} strokeLinejoin="round" />
    </>
  )
};

export function IkonTab({ name, aktif, color, size = 22 }) {
  if (!aktif) return <Ikon name={name} size={size} color={color} strokeWidth={1.3} />;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {IKON_ISI[name](color)}
    </Svg>
  );
}

// Latar gradien vertikal (isi penuh induknya, ukuran diukur agar akurat di native)
export function Gradien({ dari, ke, stops }) {
  // stops: [[offset, warna], ...] menimpa dari/ke
  const titik = stops || [
    [0, dari],
    [0.55, dari],
    [1, ke]
  ];
  const id = `g${useId().replace(/:/g, '')}`;
  const [ukuran, setUkuran] = useState(null);
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setUkuran((u) => (u && u.w === width && u.h === height ? u : { w: width, h: height }));
      }}
    >
      {ukuran ? (
        <Svg width={ukuran.w} height={ukuran.h}>
          <Defs>
            <LinearGradient id={id} x1="0" y1="0" x2="0" y2={ukuran.h} gradientUnits="userSpaceOnUse">
              {titik.map(([o, w]) => (
                <Stop key={o} offset={String(o)} stopColor={w} />
              ))}
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={ukuran.w} height={ukuran.h} fill={`url(#${id})`} />
        </Svg>
      ) : null}
    </View>
  );
}

// Bookmark (isi saat tersimpan)
export function IkonBookmark({ size = 20, color = colors.ink, terisi = false }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M7 4h10q2 0 2 2v13q0 2-2 .8l-4-2.4q-1-.6-2 0l-4 2.4Q5 21 5 19V6q0-2 2-2Z"
        fill={terisi ? color : 'none'}
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Ilustrasi berwarna dari web
export function Simbol({ id, size = 34 }) {
  const xml = ILUSTRASI[id];
  if (!xml) return null;
  return <SvgXml xml={xml} width={size} height={size} />;
}

// Geometri maskot (web/src/data/maskot.js)
const MASKOT = {
  ungu: {
    mataY: 0.39,
    s: 78,
    bg: '#C088FF',
    ink: '#260052',
    eyes: [
      'M34.9599 36.2226C33.2077 35.9137 32.1497 33.6072 32.5969 31.071C33.0441 28.5348 34.8271 26.7293 36.5794 27.0382C38.3317 27.3472 39.3897 29.6537 38.9425 32.1899C38.4953 34.7261 36.7122 36.5316 34.9599 36.2226Z',
      'M13.1728 33.7438C11.4205 33.4349 10.3626 31.1284 10.8098 28.5922C11.257 26.056 13.04 24.2505 14.7923 24.5594C16.5446 24.8684 17.6026 27.1749 17.1554 29.7111C16.7082 32.2473 14.9251 34.0528 13.1728 33.7438Z'
    ],
    smile:
      'M27.5724 42.9843C28.1112 42.4638 28.9701 42.4786 29.4906 43.0174C30.0112 43.5562 29.9964 44.4151 29.4576 44.9356C25.3088 48.9438 18.3016 48.1669 15.436 43.1989C15.0617 42.55 15.2846 41.7197 15.9335 41.3453C16.5825 40.971 17.4128 41.1939 17.7871 41.8428C19.7142 45.1838 24.6104 45.846 27.5724 42.9843Z'
  },
  lavender: {
    mataY: 0.52,
    s: 118,
    bg: '#D9B8FF',
    ink: '#7500B4',
    eyes: [
      'M43.5511 69.795C46.202 69.3276 47.8025 65.8383 47.126 62.0015C46.4494 58.1647 43.752 55.4332 41.1011 55.9007C38.4502 56.3681 36.8497 59.8574 37.5262 63.6942C38.2028 67.531 40.9002 70.2624 43.5511 69.795Z',
      'M76.5106 66.045C79.1615 65.5776 80.762 62.0883 80.0855 58.2515C79.4089 54.4147 76.7115 51.6833 74.0606 52.1507C71.4097 52.6181 69.8092 56.1074 70.4857 59.9442C71.1623 63.781 73.8597 66.5125 76.5106 66.045Z'
    ],
    smile:
      'M67.5004 77.1832C68.0836 76.2113 69.3443 75.8962 70.3162 76.4793C71.288 77.0624 71.6032 78.3231 71.0201 79.295C66.5301 86.7783 55.9871 88.3911 49.852 82.256C49.0506 81.4546 49.0506 80.154 49.852 79.3526C50.6535 78.5512 51.954 78.5512 52.7554 79.3526C56.8813 83.4785 64.2948 82.526 67.5004 77.1832Z'
  },
  kuning: {
    mataY: 0.41,
    s: 100,
    bg: '#FFC015',
    ink: '#1B1B1B',
    eyes: [
      'M50.1439 48.6701C52.3904 48.2739 53.7468 45.3169 53.1735 42.0654C52.6001 38.8138 50.3142 36.4991 48.0677 36.8952C45.8212 37.2913 44.4648 40.2483 45.0381 43.4999C45.6114 46.7514 47.8974 49.0662 50.1439 48.6701Z',
      'M78.0756 45.4921C80.3221 45.096 81.6785 42.139 81.1051 38.8875C80.5318 35.6359 78.2458 33.3211 75.9993 33.7173C73.7528 34.1134 72.3964 37.0704 72.9698 40.3219C73.5431 43.5735 75.829 45.8883 78.0756 45.4921Z'
    ],
    smile:
      'M71.4656 58.8446C71.9598 58.021 73.0282 57.7539 73.8519 58.2481C74.6755 58.7423 74.9426 59.8107 74.4484 60.6343C70.6433 66.9761 61.7086 68.3428 56.5094 63.1436C55.8302 62.4645 55.8302 61.3623 56.5094 60.6831C57.1886 60.004 58.2907 60.004 58.9699 60.6831C62.4664 64.1796 68.749 63.3724 71.4656 58.8446Z'
  },
  putih: {
    mataY: 0.54,
    s: 104,
    bg: '#FFFFFF',
    ink: '#1B1B1B',
    eyes: [
      'M43.3897 64.2968C45.726 63.8848 47.1367 60.8095 46.5404 57.4279C45.9442 54.0463 43.5668 51.639 41.2304 52.0509C38.894 52.4629 37.4834 55.5382 38.0796 58.9198C38.6759 62.3014 41.0533 64.7088 43.3897 64.2968Z',
      'M72.4392 60.9918C74.7756 60.5798 76.1863 57.5045 75.59 54.1229C74.9937 50.7413 72.6163 48.3339 70.28 48.7459C67.9436 49.1579 66.5329 52.2332 67.1292 55.6148C67.7255 58.9964 70.1029 61.4037 72.4392 60.9918Z'
    ],
    smile:
      'M64.4978 70.8085C65.0118 69.9519 66.1229 69.6741 66.9795 70.1881C67.8361 70.702 68.1139 71.8132 67.5999 72.6697C63.6426 79.2652 54.3505 80.6866 48.9433 75.2794C48.237 74.5731 48.237 73.4268 48.9433 72.7205C49.6497 72.0142 50.7959 72.0142 51.5023 72.7205C55.1386 76.3568 61.6725 75.5174 64.4978 70.8085Z'
  },
  krem: {
    mataY: 0.29,
    s: 123,
    bg: '#FFDEC9',
    ink: '#121212',
    eyes: [
      'M19.8301 45.2418C22.5809 45.795 25.4599 43.0159 26.2606 39.0346C27.0613 35.0532 25.4805 31.3772 22.7297 30.824C19.979 30.2707 17.0999 33.0498 16.2992 37.0312C15.4985 41.0126 17.0793 44.6886 19.8301 45.2418Z',
      'M55.9834 41.469C58.7861 41.3368 60.9031 37.9411 60.7118 33.8845C60.5205 29.828 58.0934 26.6466 55.2906 26.7788C52.4879 26.9109 50.3709 30.3066 50.5622 34.3632C50.7535 38.4198 53.1806 41.6011 55.9834 41.469Z'
    ],
    smile:
      'M46.0227 53.0389C46.6306 52.0259 47.9447 51.6973 48.9578 52.3052C49.9708 52.913 50.2994 54.2271 49.6915 55.2402C45.0113 63.0406 34.0215 64.7217 27.6265 58.3267C26.7912 57.4913 26.7912 56.1356 27.6265 55.3002C28.4619 54.4649 29.8176 54.4649 30.653 55.3002C34.9536 59.6009 42.6813 58.6081 46.0227 53.0389Z'
  }
};

const acak = (min, max) => min + Math.random() * (max - min);

// Gerak menoleh & kedip (meniru useHidup di web)
function useHidup({ ukuran, menoleh: bisaMenoleh = true }) {
  const geser = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const putar = useRef(new Animated.Value(0)).current;
  const kedip = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let aktif = true;
    const timer = [];
    const nanti = (fn, ms) => timer.push(setTimeout(() => aktif && fn(), ms));
    const maksX = ukuran * 0.1;
    const maksY = ukuran * 0.07;

    const menoleh = () => {
      const x = Math.random() < 0.25 ? 0 : acak(-maksX, maksX);
      const y = Math.random() < 0.25 ? 0 : acak(-maksY, maksY);
      const durasi = acak(700, 1100);
      const ease = Easing.inOut(Easing.quad);
      Animated.parallel([
        Animated.timing(geser, { toValue: { x, y }, duration: durasi, easing: ease, useNativeDriver: true }),
        Animated.timing(putar, { toValue: (x / maksX) * 4, duration: durasi, easing: ease, useNativeDriver: true })
      ]).start(() => nanti(menoleh, acak(1200, 3200)));
    };

    const berkedip = () => {
      const kali = Math.random() < 0.25 ? 2 : 1;
      const langkah = [];
      for (let i = 0; i < kali; i++) {
        langkah.push(Animated.timing(kedip, { toValue: 0.1, duration: 70, useNativeDriver: true }));
        langkah.push(Animated.timing(kedip, { toValue: 1, duration: 70, useNativeDriver: true }));
      }
      Animated.sequence(langkah).start(() => nanti(berkedip, acak(2200, 5000)));
    };

    // Hormati pengaturan kurangi gerakan
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((kurangi) => {
        if (kurangi || !aktif) return;
        if (bisaMenoleh) nanti(menoleh, acak(400, 1600));
        nanti(berkedip, acak(1000, 3000));
      });

    return () => {
      aktif = false;
      timer.forEach(clearTimeout);
      geser.stopAnimation();
      putar.stopAnimation();
      kedip.stopAnimation();
    };
  }, [ukuran, bisaMenoleh, geser, putar, kedip]);

  const rotate = putar.interpolate({ inputRange: [-4, 4], outputRange: ['-4deg', '4deg'] });
  return { geser, rotate, kedip };
}

// Skala kedip berpusat di tinggi mata
const gayaKedip = (kedip, size, mataY) => {
  const dy = size * (mataY - 0.5);
  return { transform: [{ translateY: dy }, { scaleY: kedip }, { translateY: -dy }] };
};

// Wajah bulat tersenyum
export function Maskot({ varian = 'putih', size = 60, style }) {
  const m = MASKOT[varian];
  const { geser, rotate, kedip } = useHidup({ ukuran: size });
  const kotak = `0 0 ${m.s} ${m.s}`;

  return (
    <View
      pointerEvents="none"
      style={[{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: m.bg }, style]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX: geser.x }, { translateY: geser.y }, { rotate }] }
        ]}
      >
        <Svg width={size} height={size} viewBox={kotak} style={StyleSheet.absoluteFill}>
          <Path d={m.smile} fill={m.ink} />
        </Svg>
        <Animated.View style={[StyleSheet.absoluteFill, gayaKedip(kedip, size, m.mataY)]}>
          <Svg width={size} height={size} viewBox={kotak}>
            <G fill={m.ink}>
              {m.eyes.map((d) => (
                <Path key={d} d={d} />
              ))}
            </G>
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// Mata kartu ungu (berkedip)
export function MataKartu({ size = 34, style }) {
  const { kedip } = useHidup({ ukuran: size, menoleh: false });
  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, gayaKedip(kedip, size, 0.5)]}>
        <Svg width={size} height={size} viewBox="0 0 40 40">
          <G fill="#fff">
            <Ellipse cx="13" cy="15" rx="6" ry="8.5" transform="rotate(28 13 15)" />
            <Ellipse cx="29" cy="25" rx="6" ry="8.5" transform="rotate(28 29 25)" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

// Pola awan [diameter, tinggi terlihat] (web/src/components/Cloud.js)
const POLA = [
  [300, 86],
  [256, 128],
  [172, 64],
  [196, 56],
  [110, 50],
  [176, 42],
  [164, 46],
  [236, 84],
  [300, 100]
];

// Tepi awan di atas blok berwarna
export function Awan({ warna, mulai = 0, tinggi = 44, skala = 0.42 }) {
  const { width } = useWindowDimensions();
  const pola = [...POLA.slice(mulai % POLA.length), ...POLA.slice(0, mulai % POLA.length)];
  const lingkaran = [];
  let x = -20;
  for (let i = 0; x < width + 40; i++) {
    const [d, l] = pola[i % pola.length];
    const r = (d * skala) / 2;
    const atas = Math.max(tinggi - l * skala, 0);
    lingkaran.push({ cx: x + r, cy: atas + r, r });
    x += r * 1.55;
  }
  return (
    <Svg width={width} height={tinggi} style={{ marginBottom: -1 }}>
      {lingkaran.map((c, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={warna} />
      ))}
      <Rect x={0} y={tinggi - 4} width={width} height={4} fill={warna} />
    </Svg>
  );
}
