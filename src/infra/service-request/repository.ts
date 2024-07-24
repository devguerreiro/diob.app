import { prisma } from "@/lib/prisma";

import ServiceRequest from "@/domain/service-request/entity/service-request";
import ServiceRequestFactory from "@/domain/service-request/entity/service-request.factory";

import { ServiceRequestReadOptions, ServiceRequestCreateModel } from "./model";

const factory = new ServiceRequestFactory();

export default class ServiceRequestRepository {
  async create(data: ServiceRequestCreateModel): Promise<ServiceRequest> {
    const createdServiceRequest = await prisma.serviceRequestModel.create({
      data,
      ...ServiceRequestReadOptions,
    });
    return factory.fromModel(createdServiceRequest);
  }

  async all(): Promise<Array<ServiceRequest>> {
    const providers = await prisma.serviceRequestModel.findMany({
      ...ServiceRequestReadOptions,
    });
    return providers.map(factory.fromModel);
  }

  async getByID(id: string): Promise<ServiceRequest | null> {
    const provider = await prisma.serviceRequestModel.findUnique({
      where: { id },
      ...ServiceRequestReadOptions,
    });
    if (provider) return factory.fromModel(provider);
    return null;
  }
}
