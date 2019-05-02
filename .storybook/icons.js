const requireSvgs = require.context('../src/components/SvgSymbol/svgs/', false, /\.svg$/)
const icons = {};

requireSvgs.keys().forEach(s => {
  const baseFileName = s.replace(/\.svg$/,"").replace(/^\.\//,"");

  icons[baseFileName] = baseFileName;
});

export default icons;
