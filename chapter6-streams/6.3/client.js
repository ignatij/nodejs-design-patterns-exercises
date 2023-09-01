'use strict'

const { createCipheriv, randomBytes } = require("crypto")
const { createReadStream, readFileSync } = require("fs")
const { connect } = require("net")
const { PassThrough } = require("stream")


const filename = process.argv[2]
if(filename.length > 10) {
    console.error('Please provide name up to 10 chars. Protocol is protocol')
    process.exit(1)
}
let preparedFilename = filename.slice(0, 10)
if(preparedFilename.length < 10) {
    let index = preparedFilename.length
    while(index < 10) {
        preparedFilename += ' '
        index++
    }
}

const secret = readFileSync('./secret.txt', 'utf-8')
const iv = randomBytes(16)

const socket = connect(3000, () => {

    let outbuff = Buffer.alloc(10)
    outbuff.write(preparedFilename)
    // first 10 bytes the file name
    socket.write(outbuff)
    // second 16 bytes is the iv
    socket.write(iv)
    const cipher = createCipheriv('aes192', Buffer.from(secret, 'binary'), iv)
    const rs = createReadStream(filename).pipe(cipher)

    rs
        .on('data', (data) => {
            socket.write(data)
        })
        .on('error', (err) => {
            console.error(err)
            process.exit(1)
        })
        .on('end', () => {
            console.log(`${filename} sent`)
            process.exit(0)
        })
})

