import { ClientModel } from "@prisma/client";

import { prisma } from "@/infra/lib/prisma";

import { Repository } from "@/domain/@shared/interface/repository";

import Client from "@/domain/client/entity/client";
import ClientFactory from "@/domain/client/entity/client.factory";

export default class ClientRepository
  implements Repository<Client, ClientModel>
{
  async create(data: ClientModel): Promise<Client> {
    const createdClient = await prisma.clientModel.create({ data });
    return ClientFactory.fromModel(createdClient);
  }

  async all(): Promise<Array<Client>> {
    const clients = await prisma.clientModel.findMany();
    return clients.map((client) => ClientFactory.fromModel(client));
  }

  async getByID(id: string): Promise<Client | null> {
    const client = await prisma.clientModel.findUnique({ where: { id } });
    if (client) return ClientFactory.fromModel(client);
    return null;
  }
}
