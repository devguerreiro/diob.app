import { mockedPrisma } from "@/lib/mocked-prisma";

import {
  makeFakeServiceRequest,
  makeFakeServiceRequestLog,
} from "@/domain/service-request/entity/service-request.spec.fixture";

import ServiceRequestRepository from "./service-request.repository";

describe("Service Request Repository tests", () => {
  it("should be able to insert a service request on database", async () => {
    const serviceRequest = makeFakeServiceRequest();
    const repository = new ServiceRequestRepository();

    const data = {
      client_id: serviceRequest.client.id,
      provider_id: serviceRequest.provider.id,
      cost: 190,
      estimated_duration: 190,
      scheduled_at: serviceRequest.when,
      logs: [
        {
          status: "SCHEDULED",
          by_id: serviceRequest.client.id,
          reason: null,
        },
      ],
      works: serviceRequest.provider.works.map((work) => ({
        provider_work_id: work.id,
        jobs: work.jobs.map((job) => ({
          provider_work_job_id: job.id,
        })),
      })),
    };

    const createdServiceRequest = {
      id: serviceRequest.id as string,
      client_id: serviceRequest.client.id,
      provider_id: serviceRequest.provider.id,
      created_at: new Date(),
      updated_at: new Date(),
      scheduled_at: data.scheduled_at,
      cost: 190,
      estimated_duration: 190,
      works: serviceRequest.provider.works.map((work) => ({
        provider_work_id: work.id,
        provider_work: {
          id: work.id,
          min_cost: work.minCost,
          work: {
            id: work.work.id,
            name: work.work.name,
          },
        },
        jobs: work.jobs.map((job) => ({
          provider_work_job_id: job.id,
          provider_work_job: {
            id: job.id,
            job: {
              id: job.workJob.id,
              name: job.workJob.name,
              work_id: work.work.id,
            },
          },
        })),
      })),
      logs: [
        {
          id: "1",
          status: "SCHEDULED",
          by_id: serviceRequest.client.id,
          at: new Date(),
          reason: null,
        },
      ],
    };

    mockedPrisma.serviceRequestModel.create.mockResolvedValue(
      createdServiceRequest
    );

    const returnedServiceRequest = await repository.create(data);

    expect(returnedServiceRequest).toEqual(createdServiceRequest);
    expect(mockedPrisma.serviceRequestModel.create).toHaveBeenCalledWith({
      data: {
        ...data,
        logs: {
          createMany: {
            data: data.logs.map((log) => ({
              status: log.status,
              by_id: log.by_id,
              reason: log.reason,
            })),
          },
        },
        works: {
          createMany: {
            data: data.works.map((work) => ({
              provider_work_id: work.provider_work_id,
              jobs: {
                createMany: {
                  data: work.jobs.map((job) => ({
                    provider_work_job_id: job.provider_work_job_id,
                  })),
                },
              },
            })),
          },
        },
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        provider: {
          include: {
            user: true,
          },
        },
        logs: true,
        works: {
          include: {
            provider_work: {
              include: {
                work: true,
              },
            },
            jobs: {
              include: {
                provider_work_job: {
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

    const models = Array(5).fill({
      id: serviceRequest.id,
      client_id: serviceRequest.client.id,
      provider_id: serviceRequest.provider.id,
      cost: 190,
      estimated_duration: 190,
      created_at: new Date(),
      updated_at: new Date(),
      scheduled_at: serviceRequest.when,
    });

    mockedPrisma.serviceRequestModel.findMany.mockResolvedValue(models);

    const serviceRequests = await repository.all();

    expect(serviceRequests).toEqual(models);
    expect(mockedPrisma.serviceRequestModel.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        client_id: true,
        provider_id: true,
        cost: true,
        estimated_duration: true,
        created_at: true,
        updated_at: true,
        scheduled_at: true,
      },
    });
  });

  it("should be able to retrieve a service request by id from database", async () => {
    const serviceRequest = makeFakeServiceRequest();
    const repository = new ServiceRequestRepository();

    const model = {
      id: serviceRequest.id as string,
      client: {
        id: serviceRequest.client.id,
        user: {
          id: serviceRequest.client.user.id,
          name: serviceRequest.client.user.name,
          document: serviceRequest.client.user.document.value,
          email: serviceRequest.client.user.email.value,
          contact: serviceRequest.client.user.contact.value,
          dob: serviceRequest.client.user.dob,
        },
        user_id: serviceRequest.client.id,
        address_cep: serviceRequest.client.address.value.cep,
        address_number: serviceRequest.client.address.value.number,
        address_complement:
          serviceRequest.client.address.value.complement ?? null,
      },
      provider: {
        id: serviceRequest.provider.id,
        user: {
          id: serviceRequest.provider.user.id,
          name: serviceRequest.provider.user.name,
          document: serviceRequest.provider.user.document.value,
          email: serviceRequest.provider.user.email.value,
          contact: serviceRequest.provider.user.contact.value,
          dob: serviceRequest.provider.user.dob,
        },
        user_id: serviceRequest.provider.id,
      },
      client_id: serviceRequest.client.id,
      provider_id: serviceRequest.provider.id,
      cost: 190,
      estimated_duration: 190,
      created_at: new Date(),
      updated_at: new Date(),
      scheduled_at: serviceRequest.when,
      works: serviceRequest.provider.works.map((work) => ({
        provider_work_id: work.id,
        provider_work: {
          id: work.id,
          min_cost: work.minCost,
          work: {
            id: work.work.id,
            name: work.work.name,
          },
        },
        jobs: work.jobs.map((job) => ({
          provider_work_job_id: job.id,
          provider_work_job: {
            id: job.id,
            job: {
              id: job.workJob.id,
              name: job.workJob.name,
              work_id: work.work.id,
            },
          },
        })),
      })),
      logs: [
        {
          id: "1",
          status: "SCHEDULED",
          by_id: serviceRequest.client.id,
          at: new Date(),
          reason: null,
        },
      ],
    };

    mockedPrisma.serviceRequestModel.findUnique.mockResolvedValue(model);

    const retrievedServiceRequest = await repository.getByID(
      serviceRequest.id as string
    );

    expect(retrievedServiceRequest).toEqual(model);
    expect(mockedPrisma.serviceRequestModel.findUnique).toHaveBeenCalledWith({
      where: { id: serviceRequest.id },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        provider: {
          include: {
            user: true,
          },
        },
        logs: true,
        works: {
          include: {
            provider_work: {
              include: {
                work: true,
              },
            },
            jobs: {
              include: {
                provider_work_job: {
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
        client: {
          include: {
            user: true,
          },
        },
        provider: {
          include: {
            user: true,
          },
        },
        logs: true,
        works: {
          include: {
            provider_work: {
              include: {
                work: true,
              },
            },
            jobs: {
              include: {
                provider_work_job: {
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

  it("should be able to insert a service request log on database", async () => {
    const serviceRequest = makeFakeServiceRequest();
    const log = makeFakeServiceRequestLog();
    const repository = new ServiceRequestRepository();

    const data = {
      status: log.status,
      by_id: log.by.id,
      reason: null,
    };

    const createdLog = {
      id: "1",
      status: "SCHEDULED",
      by_id: serviceRequest.client.id,
      at: new Date(),
      reason: null,
      service_request_id: serviceRequest.id as string,
    };

    mockedPrisma.logModel.create.mockResolvedValue(createdLog);

    const returnedLog = await repository.addLog(
      serviceRequest.id as string,
      data
    );

    expect(returnedLog).toEqual(createdLog);
    expect(mockedPrisma.logModel.create).toHaveBeenCalledWith({
      data: {
        ...data,
        service_request_id: serviceRequest.id,
      },
    });
  });
});
