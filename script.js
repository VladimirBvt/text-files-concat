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

getFiles('files')
    .then(files => console.log(files))
    .catch(e => console.error(e));

fs.readFile('/Users/vladimir/WebstormProjects/HTML-academy/text-files-concat/files/folder-1/file-1-1.txt', 'utf8',
            function (error, data) {
                console.log("Асинхронное чтение файла:");
                if(error) throw error; // если возникла ошибка
                console.log(data);  // выводим считанные данные
});
