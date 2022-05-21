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
                if(error) throw error; // если возникла ошибка
            });
    }
};

//getFiles('files')
//    .then(files => console.log(files))
//    .catch(e => console.error(e));

getFiles('files')
    .then(files => iterate(files))
    .catch(e => console.error(e));

// чтение одного конкретного файла
/*fs.readFile('/Users/vladimir/WebstormProjects/HTML-academy/text-files-concat/files/folder-2/file-2-1.txt', 'utf8',
            function (error, data) {
                fs.appendFileSync('/Users/vladimir/WebstormProjects/HTML-academy/text-files-concat/files/folder-1/file-1-1.txt', data);
                console.log('Асинхронное чтение файла:');
                if(error) throw error; // если возникла ошибка
                console.log(data);  // выводим считанные данные
});

const wrigting = function (pathRead, pathWrite) {
    // дозаписывает в файл строки (позже содержимое предыдущего файла - вставить после чтения)
    fs.appendFileSync('/Users/vladimir/WebstormProjects/HTML-academy/text-files-concat/files/folder-1/file-1-1.txt', 'Привет мир!');

    fs.appendFile('/Users/vladimir/WebstormProjects/HTML-academy/text-files-concat/files/folder-1/file-1-1.txt', 'Привет МИД!', function(error){
        if(error) throw error; // если возникла ошибка

        console.log('Запись файла завершена. Содержимое файла:');
        let data = fs.readFileSync('/Users/vladimir/WebstormProjects/HTML-academy/text-files-concat/files/folder-1/file-1-1.txt', 'utf8');
        console.log(data);  // выводим считанные данные
    });
};*/

