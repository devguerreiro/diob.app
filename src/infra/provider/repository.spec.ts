import { mockedPrisma } from "@/lib/mocked-prisma";

import { makeFakeProvider } from "@/domain/provider/entity/provider.spec.fixture";

import ProviderRepository from "./repository";
import { ProviderWithWorksModel } from "./model";

describe("Provider Repository tests", () => {
  it("should be able to insert a provider on database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();
    const model: ProviderWithWorksModel = {
      id: provider.id,
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
      works: provider.works.map((work) => {
        return {
          id: work.id,
          name: work.name,
          min_cost: work.minCost,
          jobs: work.jobs.map((job) => {
            return {
              id: job.id,
              name: job.name,
              cost: job.cost,
              provider_work_id: work.id,
            };
          }),
        };
      }),
    };

    mockedPrisma.providerModel.create.mockResolvedValue(model);

    const createdProvider = await repository.create(model);

    expect(createdProvider).toEqual(provider);
    expect(mockedPrisma.providerModel.create).toHaveBeenCalledWith({
      data: {
        ...model,
        works: {
          connect: model.works.map((work) => ({ id: work.id })),
        },
      },
      include: {
        works: {
          include: {
            jobs: true,
          },
        },
      },
    });
  });

  it("should be able to retrieve all providers from database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();
    const models: Array<ProviderWithWorksModel> = Array(5).fill({
      id: provider.id,
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
      works: provider.works.map((work) => {
        return {
          id: work.id,
          name: work.name,
          min_cost: work.minCost,
          jobs: work.jobs.map((job) => {
            return {
              id: job.id,
              name: job.name,
              cost: job.cost,
              provider_work_id: work.id,
            };
          }),
        };
      }),
    });

    mockedPrisma.providerModel.findMany.mockResolvedValue(models);

    const providers = await repository.all();

    expect(providers).toEqual(Array(5).fill(provider));
    expect(mockedPrisma.providerModel.findMany).toHaveBeenCalledWith({
      include: {
        works: {
          include: {
            jobs: true,
          },
        },
      },
    });
  });

  it("should be able to retrieve a provider by id from database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();
    const model: ProviderWithWorksModel = {
      id: provider.id,
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
      works: provider.works.map((work) => {
        return {
          id: work.id,
          name: work.name,
          min_cost: work.minCost,
          jobs: work.jobs.map((job) => {
            return {
              id: job.id,
              name: job.name,
              cost: job.cost,
              provider_work_id: work.id,
            };
          }),
        };
      }),
    };

    mockedPrisma.providerModel.findUnique.mockResolvedValue(model);

    const retrievedProvider = await repository.getByID(provider.id);

    expect(retrievedProvider).toEqual(provider);
    expect(mockedPrisma.providerModel.findUnique).toHaveBeenCalledWith({
      where: { id: provider.id },
      include: {
        works: {
          include: {
            jobs: true,
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
            jobs: true,
          },
        },
      },
    });
  });

  it("should be able to update a provider on database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();
    const model: ProviderWithWorksModel = {
      id: provider.id,
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
      works: provider.works.map((work) => {
        return {
          id: work.id,
          name: work.name,
          min_cost: work.minCost,
          jobs: work.jobs.map((job) => {
            return {
              id: job.id,
              name: job.name,
              cost: job.cost,
              provider_work_id: work.id,
            };
          }),
        };
      }),
    };

    mockedPrisma.providerModel.update.mockResolvedValue(model);

    const updatedProvider = await repository.update(provider.id, model);

    expect(updatedProvider).toEqual(provider);
    expect(mockedPrisma.providerModel.update).toHaveBeenCalledWith({
      where: { id: provider.id },
      data: {
        ...model,
        works: {
          connect: model.works.map((work) => ({ id: work.id })),
        },
      },
      include: {
        works: {
          include: {
            jobs: true,
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
