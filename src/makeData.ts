import { faker } from '@faker-js/faker';

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export type Person = {
  name: string;
  email: string;
  country: string;
  birthdate: Date;
  salary: number;
  phone: string;
  company: string;
  moli: number;
  subRows?: Person[];
};

const newPerson = (): Person => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    country: faker.location.country(),
    birthdate: faker.date.birthdate(),
    salary: faker.number.int({ min: 1000, max: 100000 }),
    phone: faker.phone.number(),
    company: faker.company.name(),
    moli: faker.number.int({ min: -100, max: 100 })
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
      };
    });
  };

  return makeDataLevel();
}
