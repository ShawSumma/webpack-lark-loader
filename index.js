const fs = require('fs');
const path = require('path');

const tmp = require('tmp');
const { PythonShell } = require('python-shell');

const larkInstall = path.resolve(__dirname, './install.py')
const larkJs = path.resolve(__dirname, './lark/main.py');
module.exports = function (source) {
    let callback = this.async();

    tmp.file({ postfix: '.lark' }, (err, inFile, _, rmInFile) => {
        if (err != null) {
            return callback(err);
        }
        fs.writeFile(inFile, source, (err) => {
            if (err != null) {
                rmInFile();
                return callback(err);
            }
            tmp.file({ postfix: '.js' }, (err, outFile, _, rmOutFile) => {
                if (err != null) {
                    rmInFile();
                    return callback(err);
                }

                PythonShell.run(larkInstall, {}, (err) => {
                    if (err != null) {
                        rmInFile();
                        rmOutFile();
                        return callback(err);
                    }
                    const options = {
                        args: [inFile, '--out', outFile],
                    };
                    PythonShell.run(larkJs, options, (err) => {
                        rmInFile();
                        if (err != null) {
                            rmOutFile();
                            return callback(err);
                        }
                        fs.readFile(outFile, {}, (err, data) => {
                            rmOutFile();
                            if (err != null) {
                                return callback(err);
                            }
                            return callback(null, data);
                        });
                    });
                });
            })
        })
    });
};