import { Prisma } from "@prisma/client";

export type ProviderCreateDTO = Prisma.ProviderModelGetPayload<{
  select: {
    user: {
      select: {
        name: true;
        document: true;
        email: true;
        contact: true;
        dob: true;
      };
    };
    works: {
      select: {
        min_cost: true;
        work_id: true;
        jobs: {
          select: {
            cost: true;
            job_id: true;
            estimated_duration: true;
          };
        };
      };
    };
  };
}>;

export type ProviderUpdateDTO = Prisma.ProviderModelGetPayload<{
  select: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        contact: true;
      };
    };
  };
}>;

export type SummarizedProviderDTO = Prisma.ProviderModelGetPayload<{
  select: {
    id: true;
    user: {
      select: {
        id: true;
        name: true;
        document: true;
        email: true;
        contact: true;
      };
    };
  };
}>;

export type EnlargedProviderDTO = Prisma.ProviderModelGetPayload<{
  include: {
    user: true;
    works: {
      include: {
        work: true;
        jobs: {
          include: {
            job: true;
          };
        };
      };
    };
  };
}>;

export type ProviderWorkCreateDTO = Prisma.ProviderWorkModelGetPayload<{
  select: {
    work_id: true;
    provider_id: true;
    jobs: {
      select: {
        job_id: true;
        cost: true;
        estimated_duration: true;
      };
    };
    min_cost: true;
  };
}>;

export type ProviderWorkUpdateDTO = Prisma.ProviderWorkModelGetPayload<{
  select: {
    min_cost: true;
  };
}>;

export type ProviderWorkJobCreateDTO = Prisma.ProviderWorkJobModelGetPayload<{
  select: {
    provider_work_id: true;
    job_id: true;
    cost: true;
    estimated_duration: true;
  };
}>;

export type ProviderWorkJobUpdateDTO = Prisma.ProviderWorkJobModelGetPayload<{
  select: {
    cost: true;
    estimated_duration: true;
  };
}>;
