import { mockedPrisma } from "@/lib/mocked-prisma";

import { makeFakeServiceRequest } from "@/domain/service-request/entity/service-request.spec.fixture";

import ServiceRequestRepository from "./repository";
import { ServiceRequestCreateModel, ServiceRequestReadModel } from "./model";

describe("Service Request Repository tests", () => {
  it("should be able to insert a service request on database", async () => {
    const serviceRequest = makeFakeServiceRequest();
    const repository = new ServiceRequestRepository();

    const data: ServiceRequestCreateModel = {
      client_id: serviceRequest.client.id,
      provider_id: serviceRequest.provider.id,
      scheduled_at: serviceRequest.when,
    };

    const createdServiceRequest: ServiceRequestReadModel = {
      id: serviceRequest.id,
      client: {
        id: serviceRequest.client.id,
        name: serviceRequest.client.name,
        document: serviceRequest.client.document.value,
        email: serviceRequest.client.email.value,
        contact: serviceRequest.client.contact.value,
        dob: serviceRequest.client.dob,
        address_cep: serviceRequest.client.address.value.cep,
        address_number: serviceRequest.client.address.value.number,
        address_complement:
          serviceRequest.client.address.value.complement ?? null,
      },
      provider: {
        id: serviceRequest.provider.id,
        name: serviceRequest.provider.name,
        document: serviceRequest.provider.document.value,
        email: serviceRequest.provider.email.value,
        contact: serviceRequest.provider.contact.value,
        dob: serviceRequest.provider.dob,
        works: serviceRequest.provider.works.map((work) => ({
          work: {
            id: work.work.id,
            name: work.work.name,
          },
          jobs: work.jobs.map((job) => ({
            id: job.id,
            job: {
              id: job.workJob.id,
              name: job.workJob.name,
              work_id: work.work.id,
            },
            provider_work_id: work.id,
            job_id: job.workJob.id,
            cost: job.cost,
            estimated_duration: job.estimatedDuration,
          })),
          id: work.id,
          work_id: work.work.id,
          provider_id: serviceRequest.provider.id,
          min_cost: work.minCost,
        })),
      },
      scheduled_at: data.scheduled_at,
      client_id: serviceRequest.client.id,
      provider_id: serviceRequest.provider.id,
    };

    mockedPrisma.serviceRequestModel.create.mockResolvedValue(
      createdServiceRequest
    );

    const returnedServiceRequest = await repository.create(data);

    expect(returnedServiceRequest).toEqual(serviceRequest);
    expect(mockedPrisma.serviceRequestModel.create).toHaveBeenCalledWith({
      data,
      include: {
        client: true,
        provider: {
          include: {
            works: {
              include: {
                work: true,
                jobs: {
                  include: {
                    job: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  it("should be able to retrieve all service requests from database", async () => {
    const serviceRequest = makeFakeServiceRequest();
    const repository = new ServiceRequestRepository();

    const model: ServiceRequestReadModel = {
      id: serviceRequest.id,
      client: {
        id: serviceRequest.client.id,
        name: serviceRequest.client.name,
        document: serviceRequest.client.document.value,
        email: serviceRequest.client.email.value,
        contact: serviceRequest.client.contact.value,
        dob: serviceRequest.client.dob,
        address_cep: serviceRequest.client.address.value.cep,
        address_number: serviceRequest.client.address.value.number,
        address_complement:
          serviceRequest.client.address.value.complement ?? null,
      },
      provider: {
        id: serviceRequest.provider.id,
        name: serviceRequest.provider.name,
        document: serviceRequest.provider.document.value,
        email: serviceRequest.provider.email.value,
        contact: serviceRequest.provider.contact.value,
        dob: serviceRequest.provider.dob,
        works: serviceRequest.provider.works.map((work) => ({
          work: {
            id: work.work.id,
            name: work.work.name,
          },
          jobs: work.jobs.map((job) => ({
            id: job.id,
            job: {
              id: job.workJob.id,
              name: job.workJob.name,
              work_id: work.work.id,
            },
            provider_work_id: work.id,
            job_id: job.workJob.id,
            cost: job.cost,
            estimated_duration: job.estimatedDuration,
          })),
          id: work.id,
          work_id: work.work.id,
          provider_id: serviceRequest.provider.id,
          min_cost: work.minCost,
        })),
      },
      scheduled_at: serviceRequest.when,
      client_id: serviceRequest.client.id,
      provider_id: serviceRequest.provider.id,
    };

    const models: Array<ServiceRequestReadModel> = Array(5).fill(model);

    mockedPrisma.serviceRequestModel.findMany.mockResolvedValue(models);

    const serviceRequests = await repository.all();

    expect(serviceRequests).toEqual(Array(5).fill(serviceRequest));
    expect(mockedPrisma.serviceRequestModel.findMany).toHaveBeenCalledWith({
      include: {
        client: true,
        provider: {
          include: {
            works: {
              include: {
                work: true,
                jobs: {
                  include: {
                    job: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  it("should be able to retrieve a service request by id from database", async () => {
    const serviceRequest = makeFakeServiceRequest();
    const repository = new ServiceRequestRepository();

    const model: ServiceRequestReadModel = {
      id: serviceRequest.id,
      client: {
        id: serviceRequest.client.id,
        name: serviceRequest.client.name,
        document: serviceRequest.client.document.value,
        email: serviceRequest.client.email.value,
        contact: serviceRequest.client.contact.value,
        dob: serviceRequest.client.dob,
        address_cep: serviceRequest.client.address.value.cep,
        address_number: serviceRequest.client.address.value.number,
        address_complement:
          serviceRequest.client.address.value.complement ?? null,
      },
      provider: {
        id: serviceRequest.provider.id,
        name: serviceRequest.provider.name,
        document: serviceRequest.provider.document.value,
        email: serviceRequest.provider.email.value,
        contact: serviceRequest.provider.contact.value,
        dob: serviceRequest.provider.dob,
        works: serviceRequest.provider.works.map((work) => ({
          work: {
            id: work.work.id,
            name: work.work.name,
          },
          jobs: work.jobs.map((job) => ({
            id: job.id,
            job: {
              id: job.workJob.id,
              name: job.workJob.name,
              work_id: work.work.id,
            },
            provider_work_id: work.id,
            job_id: job.workJob.id,
            cost: job.cost,
            estimated_duration: job.estimatedDuration,
          })),
          id: work.id,
          work_id: work.work.id,
          provider_id: serviceRequest.provider.id,
          min_cost: work.minCost,
        })),
      },
      scheduled_at: serviceRequest.when,
      client_id: serviceRequest.client.id,
      provider_id: serviceRequest.provider.id,
    };

    mockedPrisma.serviceRequestModel.findUnique.mockResolvedValue(model);

    const retrievedServiceRequest = await repository.getByID(serviceRequest.id);

    expect(retrievedServiceRequest).toEqual(serviceRequest);
    expect(mockedPrisma.serviceRequestModel.findUnique).toHaveBeenCalledWith({
      where: { id: serviceRequest.id },
      include: {
        client: true,
        provider: {
          include: {
            works: {
              include: {
                work: true,
                jobs: {
                  include: {
                    job: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  it("should return null if service request does not exist on database", async () => {
    const repository = new ServiceRequestRepository();

    mockedPrisma.serviceRequestModel.findUnique.mockResolvedValue(null);

    const retrievedProvider = await repository.getByID("123");

    expect(retrievedProvider).toBe(null);
    expect(mockedPrisma.serviceRequestModel.findUnique).toHaveBeenCalledWith({
      where: { id: "123" },
      include: {
        client: true,
        provider: {
          include: {
            works: {
              include: {
                work: true,
                jobs: {
                  include: {
                    job: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  });
});
