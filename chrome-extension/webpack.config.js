const path = require("path");

module.exports = {
  mode: "production", // Use 'production' for production builds
  entry: {
    // Specify your entry files here
    content: "./content.js", // Example for content script
    // Add popup or options if needed
  },
  optimization: {
    minimize: false,
  },
  output: {
    path: path.resolve(__dirname, "./"), // Output directory
    filename: "content.bundle.js", // Output bundled files
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply babel-loader for JS files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], // Transpile ES6 to ES5
          },
        },
      },
    ],
  },
};
