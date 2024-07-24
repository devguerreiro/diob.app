import { prisma } from "@/lib/prisma";

import Provider from "@/domain/provider/entity/provider";
import ProviderFactory from "@/domain/provider/entity/provider.factory";

import {
  ProviderReadOptions,
  ProviderCreateModel,
  ProviderUpdateModel,
  ProviderWorkUpdateModel,
  ProviderWorkJobUpdateModel,
} from "./model";

const factory = new ProviderFactory();

export default class ProviderRepository {
  async create(data: ProviderCreateModel): Promise<Provider> {
    const createdProvider = await prisma.providerModel.create({
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
      ...ProviderReadOptions,
    });
    return factory.fromModel(createdProvider);
  }

  async all(): Promise<Array<Provider>> {
    const providers = await prisma.providerModel.findMany({
      ...ProviderReadOptions,
    });
    return providers.map(factory.fromModel);
  }

  async getByID(id: string): Promise<Provider | null> {
    const provider = await prisma.providerModel.findUnique({
      where: { id },
      ...ProviderReadOptions,
    });
    if (provider) return factory.fromModel(provider);
    return null;
  }

  async update(id: string, data: ProviderUpdateModel): Promise<Provider> {
    const updatedProvider = await prisma.providerModel.update({
      where: { id },
      data,
      ...ProviderReadOptions,
    });
    return factory.fromModel(updatedProvider);
  }

  async delete(id: string): Promise<void> {
    await prisma.providerModel.delete({ where: { id } });
  }

  async removeWork(id: string, workId: string): Promise<Provider> {
    const updatedProvider = await prisma.providerModel.update({
      where: { id },
      data: {
        works: {
          delete: { id: workId },
        },
      },
      ...ProviderReadOptions,
    });
    return factory.fromModel(updatedProvider);
  }

  async updateWork(
    id: string,
    workId: string,
    data: ProviderWorkUpdateModel
  ): Promise<Provider> {
    const updatedProvider = await prisma.providerModel.update({
      where: { id },
      data: {
        works: {
          update: {
            where: { id: workId },
            data,
          },
        },
      },
      ...ProviderReadOptions,
    });
    return factory.fromModel(updatedProvider);
  }

  async removeWorkJob(
    id: string,
    workId: string,
    workJobId: string
  ): Promise<Provider> {
    const updatedProvider = await prisma.providerModel.update({
      where: { id },
      data: {
        works: {
          update: {
            where: { id: workId },
            data: {
              jobs: {
                delete: { id: workJobId },
              },
            },
          },
        },
      },
      ...ProviderReadOptions,
    });
    return factory.fromModel(updatedProvider);
  }

  async updateWorkJob(
    id: string,
    workId: string,
    workJobId: string,
    data: ProviderWorkJobUpdateModel
  ): Promise<Provider> {
    const updatedProvider = await prisma.providerModel.update({
      where: { id },
      data: {
        works: {
          update: {
            where: { id: workId },
            data: {
              jobs: {
                update: {
                  where: { id: workJobId },
                  data,
                },
              },
            },
          },
        },
      },
      ...ProviderReadOptions,
    });
    return factory.fromModel(updatedProvider);
  }
}
