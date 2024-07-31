import { Prisma } from "@prisma/client";

export type ServiceRequestCreateDTO = Prisma.ServiceRequestModelGetPayload<{
  select: {
    client_id: true;
    provider_id: true;
    cost: true;
    estimated_duration: true;
    scheduled_at: true;
    logs: {
      select: {
        status: true;
        by_id: true;
        reason?: true;
      };
    };
    works: {
      select: {
        provider_work_id: true;
        jobs: {
          select: {
            provider_work_job_id: true;
          };
        };
      };
    };
  };
}>;

export type SummarizedServiceRequestDTO = Prisma.ServiceRequestModelGetPayload<{
  select: {
    id: true;
    client_id: true;
    provider_id: true;
    cost: true;
    estimated_duration: true;
    created_at: true;
    updated_at: true;
    scheduled_at: true;
  };
}>;

export type EnlargedServiceRequestDTO = Prisma.ServiceRequestModelGetPayload<{
  include: {
    client: {
      include: {
        user: true;
      };
    };
    provider: {
      include: {
        user: true;
      };
    };
    logs: true;
    works: {
      include: {
        provider_work: {
          include: {
            work: true;
          };
        };
        jobs: {
          include: {
            provider_work_job: {
              include: {
                job: true;
              };
            };
          };
        };
      };
    };
  };
}>;
