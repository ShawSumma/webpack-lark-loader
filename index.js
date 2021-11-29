const fs = require('fs');
const path = require('path');

const tmp = require('tmp');
const { PythonShell } = require('python-shell');

const pythonRunFile = path.resolve(__dirname, './run.py');

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
                
                const options = {
                    args: [inFile, outFile],
                };

                PythonShell.run(pythonRunFile, options, (err) => {
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
            })
        })
    });
};