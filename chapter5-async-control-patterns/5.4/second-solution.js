'use strict'

const mapAsync = (arr, cb, concurrency) => {
    let running = 0
    const taskQueue = []

    const runTask = (task) => {
        return new Promise((resolve, reject) => {
            taskQueue.push(() => task().then(resolve, reject))
            process.nextTick(consumer)
        })
    }

    const consumer = async () => {

        while(running < concurrency && taskQueue.length !== 0) {
            console.log("spanning new consumer")
            running ++
            const curr = taskQueue.shift()
            await curr()
            running --
            console.log("shutting down consumer")
            consumer()
        }

    }

    return Promise.all(arr.map(item => runTask(() => cb(item))))

}


const mapFn = x => Promise.resolve(x * 2)
const arr = [1, 2, 3, 4]
mapAsync(arr, mapFn, 2)
.then(result => console.log(result))
.catch(e => {
    console.error('Error happened', e)
})