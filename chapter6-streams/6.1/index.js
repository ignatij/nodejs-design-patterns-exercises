'use strict'

const { createReadStream, createWriteStream } = require('fs')
const { pipeline, PassThrough } = require('stream')
const {createGzip, createGunzip, createBrotliCompress, createBrotliDecompress, createDeflate, createDeflateRaw} = require('zlib')

const fs = createReadStream('input.txt')
const ws = createWriteStream('./output.txt')

class MonitorData extends PassThrough {
    constructor() {
        super()
        this.totalSize = 0
    }
    _transform(chunk, enc, cb) {
        this.totalSize += chunk.length
        cb()
    }
}

const algorithms = {
    gzip: createGzip,
    brotli: createBrotliCompress,
    deflate: createDeflate
}

const compressAndMeasure = (algorithmName, algorithm) => {
    const initiator = new PassThrough()
    const monitor = new MonitorData()
    fs.pipe(initiator)
    const startTime = new Date().getTime()
    return new Promise((resolve, reject) => {
        pipeline(
            initiator,
            algorithm(),
            monitor,
            (err) => {
                if(err) {
                    console.error(err)
                    process.exit()
                }
                const totalTime = new Date().getTime() - startTime
                console.log(`${algorithmName} finished successfully, with total time of: ${totalTime} and total size of ${monitor.totalSize}`)
                ws.write(`${algorithmName}: ${totalTime}ms, ${monitor.totalSize}\n`)
                resolve()
            }
        )
    })


}

const runAlgorithms = async () => {
    for (const key in algorithms) {
        await compressAndMeasure(key, algorithms[key])
   }
   ws.end()
}
runAlgorithms()
