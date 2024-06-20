import { Prisma } from "@prisma/client";

export const ProviderReadOptions = {
  include: {
    works: {
      include: {
        work: true,
        jobs: {
          include: {
            job: true,
          },
        },
      },
    },
  },
};

export type ProviderReadModel = Prisma.ProviderModelGetPayload<
  typeof ProviderReadOptions
>;

export type ProviderCreateModel = Prisma.ProviderModelGetPayload<{
  select: {
    name: true;
    document: true;
    email: true;
    contact: true;
    dob: true;
  };
}>;

export type ProviderUpdateModel = Prisma.ProviderModelGetPayload<{
  select: {
    name: true;
    document: true;
    email: true;
    contact: true;
    dob: true;
  };
}>;
