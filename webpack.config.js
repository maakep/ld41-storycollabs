module.exports = {
    entry: {
        game: "./src/game/index.tsx",
    },

    mode: "development",

    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
        ]
    },
    
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },   
};