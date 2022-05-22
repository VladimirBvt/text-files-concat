const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

const iterate = function (paths) {
    for (let i = 1; i < paths.length; i ++) {
        fs.readFile(paths[i], 'utf8',
            function (error, data) {
                fs.appendFileSync(paths[0], data);
                if(error) throw error;
                paths.sort();
            });
    }
};

getFiles('files')
    .then(files => iterate(files))
    .catch(e => console.error(e));
