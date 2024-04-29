"use strict";

const createAsyncCancelable = (generatorFn) => {
  return (...args) => {
    const generator = generatorFn(...args);
    let cancelRequested = false;

    const cancel = () => {
      cancelRequested = true;
    };

    const promise = new Promise((resolve, reject) => {
      const nextStep = async (curr) => {
        if (cancelRequested) {
          return reject(new Error("Cancel was requested"));
        }

        if (curr.done) {
          return resolve(curr.value);
        }

        try {
          nextStep(generator.next(await curr.value));
        } catch (err) {
          try {
            nextStep(generator.throw(err));
          } catch (e) {
            reject(e);
          }
        }
      };
      nextStep({});
    });

    return { cancel, promise, generator };
  };
};

const asyncRoutine = async (arg) => {
  const promise = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(arg), 1000);
    });
  return await promise();
};

const cancellableNested = createAsyncCancelable(function* () {
  const resA = yield asyncRoutine("NestedA");
  console.log(resA);
  const resB = yield asyncRoutine("NestedB");
  console.log(resB);
  const resC = yield asyncRoutine("NestedC");
  console.log(resC);
  const resD = yield asyncRoutine("NestedD");
  console.log(resD);
  const resE = yield asyncRoutine("NestedE");
  console.log(resE);
  const resF = yield asyncRoutine("NestedF");
  console.log(resF);
  const resG = yield asyncRoutine("NestedG");
  console.log(resG);
});

const cancellable = createAsyncCancelable(function* () {
  const resultNested = cancellableNested();
  setTimeout(() => {
    resultNested.cancel();
  }, 2000);
  try {
    yield resultNested.promise;
  } catch (err) {
    console.error("Error from inside, program should continue", err);
  }
  const resA = yield asyncRoutine("A");
  console.log(resA);
  const resB = yield asyncRoutine("B");
  console.log(resB);
  const resC = yield asyncRoutine("C");
  console.log(resC);
  const resD = yield asyncRoutine("D");
  console.log(resD);
  const resE = yield asyncRoutine("E");
  console.log(resE);
  const resF = yield asyncRoutine("F");
  console.log(resF);
  const resG = yield asyncRoutine("G");
  console.log(resG);
});

const { promise, cancel } = cancellable();
promise.catch((err) => {
  console.error("Main error, should trigger shutdown", err);
});

setTimeout(() => {
  cancel();
}, 5000);
