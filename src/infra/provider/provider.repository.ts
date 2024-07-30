import { ProviderWorkJobModel, ProviderWorkModel } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import {
  EnlargedProviderDTO,
  ProviderCreateDTO,
  ProviderUpdateDTO,
  ProviderWorkCreateDTO,
  ProviderWorkJobCreateDTO,
  ProviderWorkJobUpdateDTO,
  ProviderWorkUpdateDTO,
  SummarizedProviderDTO,
} from "./provider.dto";

export default class ProviderRepository {
  async create(data: ProviderCreateDTO) {
    return await prisma.providerModel.create({
      data: {
        ...data,
        works: {
          createMany: {
            data: data.works.map((work) => ({
              work_id: work.work_id,
              min_cost: work.min_cost,
              jobs: {
                create: work.jobs.map((job) => ({
                  job_id: job.job_id,
                  cost: job.cost,
                  estimated_duration: job.estimated_duration,
                })),
              },
            })),
          },
        },
      },
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
    });
  }

  async all(): Promise<Array<SummarizedProviderDTO>> {
    return await prisma.providerModel.findMany({
      select: {
        id: true,
        name: true,
        document: true,
        email: true,
        contact: true,
      },
    });
  }

  async getByID(id: string): Promise<EnlargedProviderDTO | null> {
    return await prisma.providerModel.findUnique({
      where: { id },
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
    });
  }

  async update(id: string, data: ProviderUpdateDTO) {
    return await prisma.providerModel.update({
      where: { id },
      data,
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
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.providerModel.delete({ where: { id } });
  }

  async addWork(data: ProviderWorkCreateDTO) {
    return await prisma.providerWorkModel.create({
      data: {
        ...data,
        jobs: {
          createMany: {
            data: data.jobs,
          },
        },
      },
      include: {
        jobs: {
          include: {
            job: true,
          },
        },
      },
    });
  }

  async updateWork(
    id: string,
    data: ProviderWorkUpdateDTO
  ): Promise<ProviderWorkModel> {
    return await prisma.providerWorkModel.update({
      where: { id },
      data,
    });
  }

  async removeWork(id: string): Promise<void> {
    await prisma.providerWorkModel.delete({ where: { id } });
  }

  async addWorkJob(data: ProviderWorkJobCreateDTO) {
    return await prisma.providerWorkJobModel.create({
      data,
      include: {
        job: true,
      },
    });
  }

  async updateWorkJob(
    id: string,
    data: ProviderWorkJobUpdateDTO
  ): Promise<ProviderWorkJobModel> {
    return await prisma.providerWorkJobModel.update({
      where: { id },
      data,
    });
  }

  async removeWorkJob(id: string): Promise<void> {
    await prisma.providerWorkJobModel.delete({ where: { id } });
  }
}
