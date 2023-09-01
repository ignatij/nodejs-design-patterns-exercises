'use strict'

const { createDecipheriv } = require('crypto')
const { readFileSync, createWriteStream } = require('fs')
const {createServer} = require('net')
const path = require('path')
const {Readable} = require('stream')

const secret = readFileSync('secret.txt')

const rs = new Readable()
rs._read = () => {}

let newFile = true
let ws
let chunk
let filename
let iv
let decipher

const server = createServer((socket) => {
   socket
        .on('readable', () => {
            if(newFile) {
                // filename
                filename = socket.read(10)
                newFile = false
            }
            else if(iv == null) {
                // iv
                iv = socket.read(16)
                decipher = createDecipheriv('aes192', Buffer.from(secret, 'binary'), iv)
                ws = createWriteStream(path.join('received_files', filename.toString().trim()))
            } else {
                while((chunk = socket.read()) != null) {
                    const decrypted = Buffer.concat([decipher.update(chunk), decipher.final()]).toString()
                    ws.write(decrypted)
                }
        }
            
        })
        .on('end', () => {
            console.log(`File ${filename.toString().trim()} read`)
            ws = null
            newFile = true
            chunk = null
            filename = null
            decipher = null
            iv = null
        })
})
server.listen(3000, () => console.log('Listening on port 3000'))