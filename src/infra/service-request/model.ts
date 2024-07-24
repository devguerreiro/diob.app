import { Prisma } from "@prisma/client";

export const ServiceRequestReadOptions = {
  include: {
    client: true,
    provider: {
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
    },
  },
};

export type ServiceRequestReadModel = Prisma.ServiceRequestModelGetPayload<
  typeof ServiceRequestReadOptions
>;

export type ServiceRequestCreateModel = Prisma.ServiceRequestModelGetPayload<{
  select: {
    client_id: true;
    provider_id: true;
    scheduled_at: true;
  };
}>;
