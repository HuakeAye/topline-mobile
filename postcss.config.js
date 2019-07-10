const path = require('path')
module.exports = (data) => {
  const rootValue = data.file.dirname.indexOf(`node_modules${path.sep}vant`) !== -1 ? 37.5 : 75
  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}

// module.exports = {
//   plugins: {
//     'autoprefixer': {
//       browsers: ['Android >= 4.0', 'iOS >= 7']
//     },
//     'postcss-pxtorem': {
//       rootValue: 37.5,
//       propList: ['*']
//     }
//   }
// }
