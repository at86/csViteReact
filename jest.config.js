module.exports = {
  verbose: true,

  //atdo next two `config` is rfc not real.
  // showConsoleMessageOrigin: false, // Simply dont show the origin of console message,
  // consoleOutputTemplate: "console.{typeMessage}\n{message} at {lineNumber}",

  testEnvironment: "jsdom", //node
  /**
   * @jest-environment jsdom
   */

  roots: ["<rootDir>/src"],

  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],

  //atdo ts-jest slow? 5-7s every single test file.
  transform: {
    "^.+\\.(ts|tsx|js)$": "ts-jest",
  },

  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/src/$1",
  },

  // atdo --maxWorkers=1
  // preset: "ts-jest",
  // testEnvironment: "node",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};

// atdo  npm install -g jest
// "jest": "^27.1.0",
