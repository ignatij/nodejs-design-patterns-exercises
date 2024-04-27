"use strict";

class AsyncQueue {
  constructor() {
    this.items = [];
    this.setDone = false;
  }

  enqueue(item) {
    this.items.push(item);
  }

  done() {
    this.setDone = true;
  }

  [Symbol.asyncIterator]() {
    const iterator = this.items[Symbol.iterator]();
    const that = this;
    return {
      async next() {
        const curr = iterator.next();
        while (curr.done && !that.setDone) {}
        if (curr.done && that.setDone) {
          return {
            done: true,
          };
        }
        const value = await curr.value;
        return {
          done: false,
          value,
        };
      },
    };
  }
}

const timeout = (fn, ms) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn), ms);
  });
};

const queue = new AsyncQueue();
queue.enqueue(timeout(() => console.log("task 1 completed"), 200));
queue.enqueue(timeout(() => console.log("task 2 completed"), 300));
queue.enqueue(timeout(() => console.log("task 3 completed"), 500));
queue.enqueue(timeout(() => console.log("task 4 completed"), 7000));

const test = async () => {
  process.nextTick(() => queue.done());
  for await (const task of queue) {
    task();
  }
};

test();
