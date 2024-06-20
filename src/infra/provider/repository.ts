import { prisma } from "@/lib/prisma";

import RepositoryInterface from "@/domain/@shared/interface/repository";

import Provider from "@/domain/provider/entity/provider";
import ProviderFactory from "@/domain/provider/entity/provider.factory";

import {
  ProviderReadOptions,
  ProviderCreateModel,
  ProviderUpdateModel,
} from "./model";

const factory = new ProviderFactory();

export default class ProviderRepository
  implements RepositoryInterface<Provider>
{
  async create(data: ProviderCreateModel): Promise<Provider> {
    const createdProvider = await prisma.providerModel.create({
      data,
      ...ProviderReadOptions,
    });
    return factory.fromModel(createdProvider);
  }

  async all(): Promise<Array<Provider>> {
    const providers = await prisma.providerModel.findMany({
      ...ProviderReadOptions,
    });
    return providers.map((provider) => factory.fromModel(provider));
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
}
