/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: 'tests/.*.test.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'js'],
  coveragePathIgnorePatterns: ['node_modules', 'dist'],
}
