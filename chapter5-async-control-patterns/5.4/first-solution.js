'use strict'

const mapAsync = (arr, cb, concurrency) => {
    let index = 0
    let running = 0
    const result = []


    return new Promise((resolve, reject) => {
        const loop = () => {
            while(running < concurrency && index < arr.length) {
                running++
                const curr = index
                console.log("spanning consumer for ", index)
                cb(arr[curr]).then((data) => {
                    result[curr] = data
                    running --
                    console.log("finishing consumer for", curr)
                    loop()
                })
                index++
            }
            if(result.length === arr.length) {
                 resolve(result)
            }
        }
        loop()
    
    })
   

}

const mapFn = x => Promise.resolve(x * 2)
const arr = [1, 2, 3, 4]
mapAsync(arr, mapFn, 2)
.then(result => console.log(result))
.catch(e => {
    console.error('Error happened', e)
})