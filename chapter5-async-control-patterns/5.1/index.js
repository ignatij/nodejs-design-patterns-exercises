'use strict'

const promiseAll = (promises) => {
   return new Promise(async (resolve, reject) => {
        const arr = []
        for(let i = 0; i < promises.length; i++) {
            try {
                const curr = await promises[i]
                arr.push(curr)
            }
            catch(err) {
                return reject(err)
            }
        }
        resolve(arr)
   })
}

const a = () => {
    return Promise.resolve('a')
}

const b = () => {
    return Promise.resolve('b')
}

const c = () => {
    return Promise.reject(new Error("Error happened"))
}

promiseAll([a(), b(), c()])
    .then((data) => console.log(data))
    .catch(e => {
        console.error(e)
    })