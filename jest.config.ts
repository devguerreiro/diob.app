import { JestConfigWithTsJest } from "ts-jest";

export default {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
} as JestConfigWithTsJest;
