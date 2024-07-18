const defaults = require("./webpack.config");
const path = require("path");

module.exports = {
  ...defaults,
  mode: "development",
  devServer: {
    static: "./playground",
    compress: true,
    port: 9000,
    historyApiFallback: true, // Para manejar el enrutamiento en aplicaciones SPA
  },
}