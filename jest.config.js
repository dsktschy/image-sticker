module.exports = {
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/src/$1'
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  // https://stackoverflow.com/questions/49603939/
  testTimeout: 30000
}
