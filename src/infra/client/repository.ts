import { ClientModel } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import Client from "@/domain/client/entity/client";
import ClientFactory from "@/domain/client/entity/client.factory";

const factory = new ClientFactory();

export default class ClientRepository {
  async create(data: ClientModel): Promise<Client> {
    const createdClient = await prisma.clientModel.create({ data });
    return factory.fromModel(createdClient);
  }

  async all(): Promise<Array<Client>> {
    const clients = await prisma.clientModel.findMany();
    return clients.map(factory.fromModel);
  }

  async getByID(id: string): Promise<Client | null> {
    const client = await prisma.clientModel.findUnique({ where: { id } });
    if (client) return factory.fromModel(client);
    return null;
  }

  async update(id: string, data: ClientModel): Promise<Client> {
    const updatedClient = await prisma.clientModel.update({
      where: { id },
      data,
    });
    return factory.fromModel(updatedClient);
  }

  async delete(id: string): Promise<void> {
    await prisma.clientModel.delete({ where: { id } });
  }
}
