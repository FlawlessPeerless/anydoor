// route module
const fs = require('fs')
const promisify = require('util').promisify

//  美化异步回调
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath)
        if (stats.isFile()) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            fs.createReadStream(filePath).pipe(res)
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath)
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.end(files.join(','))
        }
    } catch (err) {
        console.error(err)
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end(`${filePath} is not a directory or file\n ${err.toString()}`)
    }
}