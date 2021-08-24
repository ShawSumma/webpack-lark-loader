const webpack = require('webpack');

const path = require('path');

const io = (inFilePath, outFilePath, callback) => {
    const inFile = path.resolve(process.cwd(), inFilePath);
    const outFile = path.resolve(process.cwd(), outFilePath);
    const compiler = webpack({
        context: __dirname,
        entry: inFile,
        mode: 'development',
        output: {
            path: path.dirname(outFile),
            filename: path.basename(outFile),
        },
        module: {
            rules: [
                {
                    test: /\.lark$/,
                    use: {
                        loader: path.resolve(__dirname, '../src/loader.js'),
                    },
                },
            ],
        },
    });

    compiler.run((err, status) => {
        if (err != null) {
            return callback(err);
        }
        if (status.hasErrors()) {
            return callback(status.toJson().errors);
        }
        callback(null, status);
    })
};

const runMain = () => {
    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    });

    io(process.argv[2], process.argv[3], (err, status) => {
        if (err != null) {
            throw err;
        }
    });
};

try {
    runMain();
} catch (err) {
    console.error(err);
}
