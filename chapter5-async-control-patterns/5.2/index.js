'use strict'
const { EventEmitter } = require('events')

class TaskQueue extends EventEmitter {
    constructor(concurrent) {
      super();
      this.concurrent = concurrent;
    }
  
    queue = [];
    concurrent = 0;
    running = 0;
  
    addTask(task) {
      return new Promise((resolve, reject) => {
        this.queue.push(async () => {
            try {
                const curr = await task()
                return resolve(curr)
            }
            catch(err) {
                return reject(err)
            }
        });
        this.next()
      });
    }
  
    async next() {
      while (this.running < this.concurrent && this.queue.length !== 0) {
        const curr = this.queue.shift();
        try {
            await curr()
        }
        finally {
            this.running--;
            this.next();
        }
        this.running++;
      }
    }
  }


const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
    })
}

const taskA = async () => {
    console.log("starting task a")
    await delay(5000)
    return Promise.resolve('a')
}

const taskB = async () => {
    console.log("starting task b")
    await delay(1000)
    return Promise.resolve('b')
}

const taskC = async () => {
    console.log("starting task c")
    await delay(2000)
    return Promise.resolve('c')
}

const queue = new TaskQueue(2)
queue.addTask(taskA).then(data => console.log(data))
queue.addTask(taskB).then(data => console.log(data))
queue.addTask(taskC).then(data => console.log(data))