const fs = require('fs/promises')
const { Readable } = require('stream')
const colors = require('colors/safe');
const { createServer } = require('http');


const loadFrames = async () => {
    const files = await fs.readdir('./frames')
    return await Promise.all(files.map(file => fs.readFile(`./frames/${file}`)))
}


const colorOptions = [
    'red',
    'yellow',
    'green',
    'blue',
    'magenta',
    'cyan',
    'white'
];


const displayFramesInterval = async (rs) => {
    const frames = await loadFrames()
    let index = 0
    let colorIndex
    return setInterval(() => {
        colorIndex = Math.floor(Math.random() * colorOptions.length)
        rs.push('\033[2J\033[3J\033[H');
        rs.push(colors[colorOptions[colorIndex]](frames[index].toString()))
        index = (index + 1) % frames.length
    }, 1000)
}


const server = createServer(async (req, res) => {
    const rs = new Readable()
    rs._read = () => {}
    rs.pipe(res)
    const interval = await displayFramesInterval(rs)
    req.on('close', () => {
        rs.destroy()
        clearInterval(interval)
    })
})

server.listen(8080, (err) => {
    if(err) {
        console.error(err)
        process.exit(1)
    }
    console.log('Server started on port 8080')   
})