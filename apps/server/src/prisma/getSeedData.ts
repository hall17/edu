import { fakerTR as faker } from '@faker-js/faker';

export function getSeedData() {
  faker.seed(123);

  const students = Array.from({ length: 10 }, () => ({
    id: crypto.randomUUID(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }));

  const teachers = Array.from({ length: 10 }, () => ({
    id: crypto.randomUUID(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }));

  const parents = Array.from({ length: 10 }, () => ({
    id: crypto.randomUUID(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }));

  return {
    users: {
      students,
      teachers,
      parents,
    },
  };
}
