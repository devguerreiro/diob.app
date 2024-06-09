import { Prisma } from "@prisma/client";

export type ProviderWithWorksModel = Prisma.ProviderModelGetPayload<{
  include: {
    works: {
      include: {
        jobs: true;
      };
    };
  };
}>;
