import fs from 'fs';

import { get_parser } from './grammar.lark';
import * as transformer from './transforms.js';
import run from './run.js';

const parser = get_parser({ transformer });

const fileToParse = process.argv[2];

fs.readFile(fileToParse, (err, data) => {
    if (err != null) {
        throw err;
    }
    const src = String(data);
    const ast = parser.parse(src);
    run(ast);
});
