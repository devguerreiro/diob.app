import { prisma } from "@/lib/prisma";

import {
  EnlargedServiceRequestDTO,
  ServiceRequestCreateDTO,
  SummarizedServiceRequestDTO,
} from "./service-request.dto";

export default class ServiceRequestRepository {
  async create(data: ServiceRequestCreateDTO) {
    return await prisma.serviceRequestModel.create({
      data: {
        ...data,
        logs: {
          createMany: {
            data: data.logs.map((log) => ({
              status: log.status,
              by_id: log.by_id,
              reason: log.reason,
            })),
          },
        },
        works: {
          createMany: {
            data: data.works.map((work) => ({
              provider_work_id: work.provider_work_id,
              jobs: {
                createMany: {
                  data: work.jobs.map((job) => ({
                    provider_work_job_id: job.provider_work_job_id,
                  })),
                },
              },
            })),
          },
        },
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        provider: {
          include: {
            user: true,
          },
        },
        logs: true,
        works: {
          include: {
            provider_work: {
              include: {
                work: true,
              },
            },
            jobs: {
              include: {
                provider_work_job: {
                  include: {
                    job: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async all(): Promise<Array<SummarizedServiceRequestDTO>> {
    return await prisma.serviceRequestModel.findMany({
      select: {
        id: true,
        client_id: true,
        provider_id: true,
        cost: true,
        estimated_duration: true,
        created_at: true,
        updated_at: true,
        scheduled_at: true,
      },
    });
  }

  async getByID(id: string): Promise<EnlargedServiceRequestDTO | null> {
    return await prisma.serviceRequestModel.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        provider: {
          include: {
            user: true,
          },
        },
        logs: true,
        works: {
          include: {
            provider_work: {
              include: {
                work: true,
              },
            },
            jobs: {
              include: {
                provider_work_job: {
                  include: {
                    job: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
