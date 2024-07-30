import { Prisma } from "@prisma/client";

export type ServiceRequestCreateDTO = Prisma.ServiceRequestModelGetPayload<{
  select: {
    client_id: true;
    provider_id: true;
    scheduled_at: true;
  };
}>;

export type SummarizedServiceRequestDTO = Prisma.ServiceRequestModelGetPayload<{
  select: {
    id: true;
    client_id: true;
    provider_id: true;
    scheduled_at: true;
  };
}>;

export type EnlargedServiceRequestDTO = Prisma.ServiceRequestModelGetPayload<{
  select: {
    id: true;
    client_id: true;
    provider_id: true;
    scheduled_at: true;
  };
}>;
