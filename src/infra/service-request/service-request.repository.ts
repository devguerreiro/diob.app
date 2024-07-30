import { prisma } from "@/lib/prisma";

import {
  EnlargedServiceRequestDTO,
  ServiceRequestCreateDTO,
  SummarizedServiceRequestDTO,
} from "./service-request.dto";

export default class ServiceRequestRepository {
  async create(data: ServiceRequestCreateDTO) {
    return await prisma.serviceRequestModel.create({
      data,
      include: {
        client: true,
        provider: true,
      },
    });
  }

  async all(): Promise<Array<SummarizedServiceRequestDTO>> {
    return await prisma.serviceRequestModel.findMany({
      select: {
        id: true,
        client_id: true,
        provider_id: true,
        scheduled_at: true,
      },
    });
  }

  async getByID(id: string): Promise<EnlargedServiceRequestDTO | null> {
    return await prisma.serviceRequestModel.findUnique({
      where: { id },
      include: {
        client: true,
        provider: true,
      },
    });
  }
}
