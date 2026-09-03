const path = require('path');

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.join(__dirname, 'apps/my-app/tailwind.config.js'),
    },
    autoprefixer: {},
  },
};