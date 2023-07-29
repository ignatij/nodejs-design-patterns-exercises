'use strict'

class TaskQueuePCPromisified {

    consumerQueue = []
    taskQueue = []
    constructor(concurrent) {
        for(let i = 0; i < concurrent; i++) {
            this.consumer()
        }
    } 

    async consumer() {
        const _this = this
        return new Promise((resolve, reject) => {
            (function loop(){
                _this.getNextTask()
                    .then(currTask => currTask())
                    .catch(err => reject(err))
                    .then(() => process.nextTick(loop.bind(_this)))
            })() 
        })
    }

    async getNextTask() {
        return new Promise((resolve, reject) => {
            if(this.taskQueue.length !== 0) {
                const currTask = this.taskQueue.shift()
                return resolve(currTask)
            }
            this.consumerQueue.push(resolve)
        })
    }

    async runTask(task) {
        return new Promise((resolve, reject) => {
            const taskWrapper = () => {
                const taskPromise = task()
                taskPromise.then(resolve, reject)
                return taskPromise
            }
            if(this.consumerQueue.length !== 0) {
                const currConsumer = this.consumerQueue.shift()
                currConsumer(taskWrapper)
            } else {
                this.taskQueue.push(taskWrapper)
            }
        })
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
    return Promise.reject(new Error("Error happened while resolving task c"))
}

const queue = new TaskQueuePCPromisified(2)

queue.runTask(taskA).then(data => console.log(data))
queue.runTask(taskB).then(data => console.log(data))
queue.runTask(taskC).then(data => console.log(data)).catch((e) => console.error(e))