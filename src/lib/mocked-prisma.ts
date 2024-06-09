import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import { prisma } from "./prisma";

jest.mock("./prisma", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(mockedPrisma);
});

export const mockedPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;
