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
}
