const defaults = require("./webpack.config");

module.exports = {
  ...defaults,
  mode: "development",
  devServer: {
    static: "./playground",
    hot: true,
    compress: true,
    port: 9000,
    historyApiFallback: true, // Para manejar el enrutamiento en aplicaciones SPA
  },
}