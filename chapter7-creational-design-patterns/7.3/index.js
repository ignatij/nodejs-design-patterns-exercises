'use strict'
const http = require('http')
const Queue = require('./queue')

const myQueue = new Queue(({enqueue}) => {
    // first enqueue random stuff
    enqueue('10')
    enqueue(20)
    enqueue('random text')

    // start the server and listen for messages
    http.createServer((req, res) => {
        let data = '';

        req.on('data', chunk => {
          data += chunk;
        });
  
        req.on('end', () => {
          enqueue(data);
          res.end();
        });
    }).listen(8081, async () => {
        console.log('Server listening on 8081')
        console.log('Waiting for messages...')

        while (true) {
            const msg = await myQueue.dequeue();
            console.log(`Dequeued message "${msg}"`);
          }
    })
})



