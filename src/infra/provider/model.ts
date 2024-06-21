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
    works: {
      select: {
        min_cost: true;
        work_id: true;
        jobs: {
          select: {
            cost: true;
            job_id: true;
          };
        };
      };
    };
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

export type ProviderWorkUpdateModel = Prisma.ProviderWorkModelGetPayload<{
  select: {
    min_cost: true;
  };
}>;

export type ProviderWorkJobUpdateModel = Prisma.ProviderWorkJobModelGetPayload<{
  select: {
    cost: true;
  };
}>;
