// Import required modules
const path = require('path');

module.exports = {
    // Other configuration options...

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Translates CSS into CommonJS
                    'style-loader',
                    // Parses CSS files
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            // Other rules...
        ],
    },
};
