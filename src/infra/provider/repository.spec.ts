import { mockedPrisma } from "@/lib/mocked-prisma";

import { makeFakeProvider } from "@/domain/provider/entity/provider.spec.fixture";

import ProviderRepository from "./repository";
import {
  ProviderCreateModel,
  ProviderReadModel,
  ProviderUpdateModel,
} from "./model";

describe("Provider Repository tests", () => {
  it("should be able to insert a provider on database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();

    const data: ProviderCreateModel = {
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
    };

    const createdProvider: ProviderReadModel = {
      id: provider.id,
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
      works: provider.works.map((work) => ({
        work: {
          id: work.id,
          name: work.name,
        },
        jobs: work.jobs.map((job) => ({
          id: job.id,
          job: {
            id: job.id,
            name: job.name,
            work_id: work.id,
          },
          provider_work_id: work.id,
          job_id: job.id,
          cost: job.cost,
        })),
        id: work.id,
        work_id: work.id,
        provider_id: provider.id,
        min_cost: work.minCost,
      })),
    };

    mockedPrisma.providerModel.create.mockResolvedValue(createdProvider);

    const returnedProvider = await repository.create(data);

    expect(returnedProvider).toEqual(provider);
    expect(mockedPrisma.providerModel.create).toHaveBeenCalledWith({
      data,
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
    });
  });

  it("should be able to retrieve all providers from database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();

    const models: Array<ProviderReadModel> = Array(5).fill({
      id: provider.id,
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
      works: provider.works.map((work) => ({
        work: {
          id: work.id,
          name: work.name,
        },
        jobs: work.jobs.map((job) => ({
          id: job.id,
          job: {
            id: job.id,
            name: job.name,
            work_id: work.id,
          },
          provider_work_id: work.id,
          job_id: job.id,
          cost: job.cost,
        })),
        id: work.id,
        work_id: work.id,
        provider_id: provider.id,
        min_cost: work.minCost,
      })),
    });

    mockedPrisma.providerModel.findMany.mockResolvedValue(models);

    const providers = await repository.all();

    expect(providers).toEqual(Array(5).fill(provider));
    expect(mockedPrisma.providerModel.findMany).toHaveBeenCalledWith({
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
    });
  });

  it("should be able to retrieve a provider by id from database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();
    const model: ProviderReadModel = {
      id: provider.id,
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
      works: provider.works.map((work) => ({
        work: {
          id: work.id,
          name: work.name,
        },
        jobs: work.jobs.map((job) => ({
          id: job.id,
          job: {
            id: job.id,
            name: job.name,
            work_id: work.id,
          },
          provider_work_id: work.id,
          job_id: job.id,
          cost: job.cost,
        })),
        id: work.id,
        work_id: work.id,
        provider_id: provider.id,
        min_cost: work.minCost,
      })),
    };

    mockedPrisma.providerModel.findUnique.mockResolvedValue(model);

    const retrievedProvider = await repository.getByID(provider.id);

    expect(retrievedProvider).toEqual(provider);
    expect(mockedPrisma.providerModel.findUnique).toHaveBeenCalledWith({
      where: { id: provider.id },
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
    });
  });

  it("should return null if provider does not exist on database", async () => {
    const repository = new ProviderRepository();

    mockedPrisma.providerModel.findUnique.mockResolvedValue(null);

    const retrievedProvider = await repository.getByID("123");

    expect(retrievedProvider).toBe(null);
    expect(mockedPrisma.providerModel.findUnique).toHaveBeenCalledWith({
      where: { id: "123" },
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
    });
  });

  it("should be able to update a provider on database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();

    const data: ProviderUpdateModel = {
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
    };

    const updatedProvider: ProviderReadModel = {
      id: provider.id,
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
      works: provider.works.map((work) => ({
        work: {
          id: work.id,
          name: work.name,
        },
        jobs: work.jobs.map((job) => ({
          id: job.id,
          job: {
            id: job.id,
            name: job.name,
            work_id: work.id,
          },
          provider_work_id: work.id,
          job_id: job.id,
          cost: job.cost,
        })),
        id: work.id,
        work_id: work.id,
        provider_id: provider.id,
        min_cost: work.minCost,
      })),
    };

    mockedPrisma.providerModel.update.mockResolvedValue(updatedProvider);

    const returnedProvider = await repository.update(provider.id, data);

    expect(returnedProvider).toEqual(provider);
    expect(mockedPrisma.providerModel.update).toHaveBeenCalledWith({
      where: { id: provider.id },
      data,
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
    });
  });

  it("should be able to delete a provider from database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();

    await repository.delete(provider.id);

    expect(mockedPrisma.providerModel.delete).toHaveBeenCalledWith({
      where: { id: provider.id },
    });
  });
});
