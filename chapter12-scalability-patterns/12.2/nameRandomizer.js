"use strict";

const { faker } = require("@faker-js/faker");
const { createWriteStream } = require("fs");

function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
}

const wsFirstGroup = createWriteStream("a-d.json", { a: true });
const regexFirstGroup = /^[A-D].*/;
const firstGroup = [];

const wsSecondGroup = createWriteStream("e-p.json", { a: true });
const regexSecondGroup = /^[E-P].*/;
const secondGroup = [];

const wsThirdGroup = createWriteStream("q-z.json", { a: true });
const regexThirdGroup = /^[Q-Z].*/;
const thirdGroup = [];

for (let i = 0; i < 10000; i++) {
  const user = createRandomUser();
  if (regexFirstGroup.test(user.firstName)) {
    firstGroup.push(user);
  } else if (regexSecondGroup.test(user.firstName)) {
    secondGroup.push(user);
  } else {
    thirdGroup.push(user);
  }
}

wsFirstGroup.write(JSON.stringify(firstGroup));
wsSecondGroup.write(JSON.stringify(secondGroup));
wsThirdGroup.write(JSON.stringify(thirdGroup));
