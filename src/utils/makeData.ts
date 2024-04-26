/* eslint-disable @typescript-eslint/no-unused-vars */
// import { faker } from '@faker-js/faker'
import { GeneralStatistics, Player, Statistic, User } from '../types'

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Person[]
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

// Function to generate random integer within a range
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate random user data
const generateRandomUser = (): User => {
  const names = ['John', 'Emma', 'Michael', 'Sophia', 'James'];
  // const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
  const name = names[Math.floor(Math.random() * names.length)];
  // const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return {
    name
  };
};

// Function to generate random statistic data
const generateRandomStatistic = (): Statistic => {
  return {
    points: getRandomInt(0, 100),
    goals: getRandomInt(0, 50),
    secondAssists: getRandomInt(0, 20),
    assists: getRandomInt(0, 50),
    totalAssists: getRandomInt(0, 100),
    throws: getRandomInt(0, 200),
    throwCompletions: getRandomInt(0, 150),
    throwErrors: getRandomInt(0, 50),
    retentionRate: Math.random(),
    catches: getRandomInt(0, 200),
    catchCompletion: getRandomInt(0, 150),
    catcherErrors: getRandomInt(0, 50),
    catchPercentage: Math.random(),
    blocks: getRandomInt(0, 50),
    gDefensiveErrors: getRandomInt(0, 20),
    aDefensiveErrors: getRandomInt(0, 20),
    usageRate: Math.random(),
    touches: getRandomInt(0, 200),
  };
};

// Function to generate random general statistics data
const generateRandomGeneralStatistics = (): GeneralStatistics => {
  return {
    matches: getRandomInt(0, 20),
    pointsPerMatch: Math.random() * 10,
    goalsPerMatch: Math.random() * 5,
    assistsPerMatch: Math.random() * 5,
    throwsPerMatch: Math.random() * 20,
    throwErrorsPerMatch: Math.random() * 10,
    catchesPerMatch: Math.random() * 20,
    catcherErrorsPerMatch: Math.random() * 5,
    blocksPerMatch: Math.random() * 5,
    touchesPerMatch: Math.random() * 50,
  };
};

// Example usage:
// const user: User = generateRandomUser();
// const statistic: Statistic = generateRandomStatistic();
// const generalStatistics: GeneralStatistics = generateRandomGeneralStatistics();
export const newPlayer = (): Player => {
  return {
    ...generateRandomUser(),
    ...generateRandomStatistic(),
    ...generateRandomGeneralStatistics(),
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Player[] => {
    const len = lens[depth]!
    return range(len).map((d): Player => {
      return {
        ...newPlayer(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}