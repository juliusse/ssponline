import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
import path from "path";

const config: Config = {
  verbose: true,
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.svg$": "./jest.transform.js",
    "^.+\\.sass": "./jest.transform.js",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|woff|woff2)$": "<rootDir>/src/test/styleMock.js",
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: path.resolve(__dirname, "./"),
    }),
  },
};

export default config;
