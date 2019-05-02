module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    autoprefixer: {
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ]
    },
    'postcss-normalize': {}
  }
};
