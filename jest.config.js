module.exports = {
  roots: ['<rootDir>/'],
  testMatch: ['**/test/**/*.+(ts|js)'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/src/$1',
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
};
