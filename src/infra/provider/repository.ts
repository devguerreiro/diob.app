import { prisma } from "@/lib/prisma";

import RepositoryInterface from "@/domain/@shared/interface/repository";

import Provider from "@/domain/provider/entity/provider";
import ProviderFactory from "@/domain/provider/entity/provider.factory";

import { ProviderWithWorksModel } from "./model";

const factory = new ProviderFactory();

export default class ProviderRepository
  implements RepositoryInterface<Provider, ProviderWithWorksModel>
{
  async create(data: ProviderWithWorksModel): Promise<Provider> {
    const createdProvider = await prisma.providerModel.create({
      data: {
        ...data,
        works: {
          connect: data.works.map((work) => ({ id: work.id })),
        },
      },
      include: {
        works: {
          include: {
            jobs: true,
          },
        },
      },
    });
    return factory.fromModel(createdProvider);
  }

  async all(): Promise<Array<Provider>> {
    const providers = await prisma.providerModel.findMany({
      include: {
        works: {
          include: {
            jobs: true,
          },
        },
      },
    });
    return providers.map((provider) => factory.fromModel(provider));
  }

  async getByID(id: string): Promise<Provider | null> {
    const provider = await prisma.providerModel.findUnique({
      where: { id },
      include: {
        works: {
          include: {
            jobs: true,
          },
        },
      },
    });
    if (provider) return factory.fromModel(provider);
    return null;
  }

  async update(id: string, data: ProviderWithWorksModel): Promise<Provider> {
    const updatedProvider = await prisma.providerModel.update({
      where: { id },
      data: {
        ...data,
        works: {
          connect: data.works.map((work) => ({ id: work.id })),
        },
      },
      include: {
        works: {
          include: {
            jobs: true,
          },
        },
      },
    });
    return factory.fromModel(updatedProvider);
  }

  async delete(id: string): Promise<void> {
    await prisma.providerModel.delete({ where: { id } });
  }
}
