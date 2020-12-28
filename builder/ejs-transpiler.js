const through = require('through2');
const ejs = require('ejs')
const fs = require('fs')
function GetDataFile(path) {
    path = path.replace('.ejs', '.json');
    if (fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path).toString('utf8'))
    }
}
module.exports = function () {
    return through.obj(function (file, enc, cb) {
        try {
            let data = GetDataFile(file.path) || {};
            let transpiled = ejs.render(file.contents.toString('utf8'), data, {
                root: "src"
            });
            file.contents = Buffer.from(transpiled);
            file.extname = '.html'
            cb(null, file);
        } catch (err) {
            console.log(err)
            cb(null, file);
        }
    })
}