const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  presets: [
    ['@jitesoft/main', { exclude: isProd ? ['transform-runtime'] : [] }],
    '@babel/preset-typescript',
  ],
};
