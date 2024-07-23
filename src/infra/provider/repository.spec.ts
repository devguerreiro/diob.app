import { mockedPrisma } from "@/lib/mocked-prisma";

import { makeFakeProvider } from "@/domain/provider/entity/provider.spec.fixture";

import ProviderRepository from "./repository";
import {
  ProviderCreateModel,
  ProviderReadModel,
  ProviderUpdateModel,
  ProviderWorkJobUpdateModel,
  ProviderWorkUpdateModel,
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
      works: provider.works.map((work) => ({
        work_id: work.work.id,
        min_cost: work.minCost,
        jobs: work.jobs.map((job) => ({
          job_id: job.workJob.id,
          cost: job.cost,
          estimated_duration: job.estimatedDuration,
        })),
      })),
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
        provider_id: provider.id,
        min_cost: work.minCost,
      })),
    };

    mockedPrisma.providerModel.create.mockResolvedValue(createdProvider);

    const returnedProvider = await repository.create(data);

    expect(returnedProvider).toEqual(provider);
    expect(mockedPrisma.providerModel.create).toHaveBeenCalledWith({
      data: {
        ...data,
        works: {
          createMany: {
            data: data.works.map((work) => ({
              work_id: work.work_id,
              min_cost: work.min_cost,
              jobs: {
                create: work.jobs.map((job) => ({
                  job_id: job.job_id,
                  cost: job.cost,
                  estimated_duration: job.estimated_duration,
                })),
              },
            })),
          },
        },
      },
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
      email: provider.email.value,
      contact: provider.contact.value,
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

  it("should be able to delete a provider work from database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();

    const updatedProvider: ProviderReadModel = {
      id: provider.id,
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
      dob: provider.dob,
      works: provider.works.map((work) => ({
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
        provider_id: provider.id,
        min_cost: work.minCost,
      })),
    };

    mockedPrisma.providerModel.update.mockResolvedValue(updatedProvider);

    const returnedProvider = await repository.removeWork(
      provider.id,
      provider.works[0].id
    );

    expect(returnedProvider).toEqual(provider);
    expect(mockedPrisma.providerModel.update).toHaveBeenCalledWith({
      where: { id: provider.id },
      data: {
        works: {
          delete: { id: provider.works[0].id },
        },
      },
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

  it("should be able to update a provider work on database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();

    const data: ProviderWorkUpdateModel = {
      min_cost: 99,
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
        provider_id: provider.id,
        min_cost: work.minCost,
      })),
    };

    mockedPrisma.providerModel.update.mockResolvedValue(updatedProvider);

    const returnedProvider = await repository.updateWork(
      provider.id,
      provider.works[0].id,
      data
    );

    expect(returnedProvider).toEqual(provider);
    expect(mockedPrisma.providerModel.update).toHaveBeenCalledWith({
      where: { id: provider.id },
      data: {
        works: {
          update: {
            where: { id: provider.works[0].id },
            data,
          },
        },
      },
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
});

it("should be able to delete a provider work job from database", async () => {
  const provider = makeFakeProvider();
  const repository = new ProviderRepository();

  const updatedProvider: ProviderReadModel = {
    id: provider.id,
    name: provider.name,
    document: provider.document.value,
    email: provider.email.value,
    contact: provider.contact.value,
    dob: provider.dob,
    works: provider.works.map((work) => ({
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
      provider_id: provider.id,
      min_cost: work.minCost,
    })),
  };

  mockedPrisma.providerModel.update.mockResolvedValue(updatedProvider);

  const returnedProvider = await repository.removeWorkJob(
    provider.id,
    provider.works[0].id,
    provider.works[0].jobs[0].id
  );

  expect(returnedProvider).toEqual(provider);
  expect(mockedPrisma.providerModel.update).toHaveBeenCalledWith({
    where: { id: provider.id },
    data: {
      works: {
        update: {
          where: { id: provider.works[0].id },
          data: {
            jobs: {
              delete: { id: provider.works[0].jobs[0].id },
            },
          },
        },
      },
    },
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

it("should be able to update a provider work job on database", async () => {
  const provider = makeFakeProvider();
  const repository = new ProviderRepository();

  const data: ProviderWorkJobUpdateModel = {
    cost: 99,
    estimated_duration: 240,
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
        id: work.work.id,
        name: work.work.name,
      },
      jobs: work.jobs.map((job) => ({
        id: job.id,
        job: {
          id: job.workJob.id,
          name: job.workJob.name,
          work_id: work.id,
        },
        provider_work_id: work.id,
        job_id: job.workJob.id,
        cost: job.cost,
        estimated_duration: job.estimatedDuration,
      })),
      id: work.id,
      work_id: work.work.id,
      provider_id: provider.id,
      min_cost: work.minCost,
    })),
  };

  mockedPrisma.providerModel.update.mockResolvedValue(updatedProvider);

  const returnedProvider = await repository.updateWorkJob(
    provider.id,
    provider.works[0].id,
    provider.works[0].jobs[0].id,
    data
  );

  expect(returnedProvider).toEqual(provider);
  expect(mockedPrisma.providerModel.update).toHaveBeenCalledWith({
    where: { id: provider.id },
    data: {
      works: {
        update: {
          where: { id: provider.works[0].id },
          data: {
            jobs: {
              update: {
                where: { id: provider.works[0].jobs[0].id },
                data,
              },
            },
          },
        },
      },
    },
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
