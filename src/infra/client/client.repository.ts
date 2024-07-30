import { prisma } from "@/lib/prisma";

import {
  ClientCreateDTO,
  ClientUpdateDTO,
  EnlargedClientDTO,
  SummarizedClientDTO,
} from "./client.dto";

export default class ClientRepository {
  async create(data: ClientCreateDTO) {
    return await prisma.clientModel.create({
      data: {
        ...data,
        user: {
          connectOrCreate: {
            where: { document: data.user.document },
            create: {
              ...data.user,
            },
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  async all(): Promise<Array<SummarizedClientDTO>> {
    return await prisma.clientModel.findMany({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            document: true,
            email: true,
            contact: true,
          },
        },
      },
    });
  }

  async getByID(id: string): Promise<EnlargedClientDTO | null> {
    return await prisma.clientModel.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, data: ClientUpdateDTO) {
    return await prisma.clientModel.update({
      where: { id },
      data: {
        ...data,
        user: {
          update: {
            where: { id: data.user.id },
            data: {
              name: data.user.name,
              email: data.user.email,
              contact: data.user.contact,
            },
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.clientModel.delete({ where: { id } });
  }
}
