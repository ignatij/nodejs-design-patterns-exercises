'use strict'
const http = require('node:http')

class MyHttpRequest {

    static instance() {
        return new MyHttpRequest()
    }

    withUrl(url) {
        this.url = url
        return this;
    }

    withHttpMethod(httpMethod) {
        this.method = httpMethod
        return this;
    }

    async invoke() {
        return new Promise((resolve, reject) => {
            const urlParts = this.url.split('https://') || this.url.split('http://')
            const hostAndParams = urlParts[1].split('/')
            const options = {
                hostname: hostAndParams[0],
                port: 80,
                path: hostAndParams[1] || '/',
                method: this.method,
                headers: this.method === 'POST' ? {
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(postData),
                } : {},
              }
              const req = http.request(options, (res) => {
                resolve(res)
              })
              req.end()
              req.on('error', () => {
                console.error('Error while trying to do the http request. Aborting...')
                reject(new Error('Error with the request'))
              })
        })
    
    }

}

(async () => {
    const response = await MyHttpRequest.instance()
        .withUrl('https://www.google.com')
        .withHttpMethod('GET')
        .invoke()
    console.log(response.statusCode)
})()
