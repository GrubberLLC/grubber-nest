const config = {
  verbose: true,
  // preset: 'ts-jest/presets/default-esm',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src', // Or '.' if your tests and src are structured differently, common for NestJS to have tests alongside src or in a separate test dir
  testRegex: '.*\\.(spec|test)\\.ts$', // Or '.*\\.test\\.ts$' if you use that naming
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/../tsconfig.spec.json',
      },
    ],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage', // Coverage report output directory
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  // moduleNameMapper is crucial for resolving custom path aliases defined in tsconfig.json
  // If you have path aliases like "@/*" in your tsconfig.json:
  moduleNameMapper: {
    // This regex maps imports ending in .js to themselves without the .js extension,
    // allowing ts-jest to then resolve them to .ts files.
    '^(.{1,2}/.*).js$': '$1',
    '^@/(.*)$': '<rootDir>/$1',
    // Add other aliases here if you have them, for example:
    // '^@services/(.*)$': '<rootDir>/services/$1',
    // '^@controllers/(.*)$': '<rootDir>/controllers/$1',
  },
};

export default config;
