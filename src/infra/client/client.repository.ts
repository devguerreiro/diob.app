import { ClientModel } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import {
  ClientCreateDTO,
  ClientUpdateDTO,
  EnlargedClientDTO,
  SummarizedClientDTO,
} from "./client.dto";

export default class ClientRepository {
  async create(data: ClientCreateDTO): Promise<ClientModel> {
    return await prisma.clientModel.create({ data });
  }

  async all(): Promise<Array<SummarizedClientDTO>> {
    return await prisma.clientModel.findMany({
      select: {
        id: true,
        name: true,
        document: true,
        email: true,
        contact: true,
      },
    });
  }

  async getByID(id: string): Promise<EnlargedClientDTO | null> {
    return await prisma.clientModel.findUnique({ where: { id } });
  }

  async update(id: string, data: ClientUpdateDTO): Promise<ClientModel> {
    return await prisma.clientModel.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.clientModel.delete({ where: { id } });
  }
}
