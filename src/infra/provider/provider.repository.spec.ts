import { mockedPrisma } from "@/lib/mocked-prisma";

import { makeFakeProvider } from "@/domain/provider/entity/provider.spec.fixture";

import ProviderRepository from "./provider.repository";

describe("Provider Repository tests", () => {
  it("should be able to insert a provider on database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();

    const data = {
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

    const createdProvider = {
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

    expect(returnedProvider).toEqual(createdProvider);
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

    const models = Array(5).fill({
      id: provider.id,
      name: provider.name,
      document: provider.document.value,
      email: provider.email.value,
      contact: provider.contact.value,
    });

    mockedPrisma.providerModel.findMany.mockResolvedValue(models);

    const providers = await repository.all();

    expect(providers).toEqual(models);
    expect(mockedPrisma.providerModel.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        document: true,
        email: true,
        contact: true,
      },
    });
  });

  it("should be able to retrieve a provider by id from database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();

    const model = {
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

    expect(retrievedProvider).toEqual(model);
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

    const data = {
      name: provider.name,
      email: provider.email.value,
      contact: provider.contact.value,
    };

    const updatedProvider = {
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

    expect(returnedProvider).toEqual(updatedProvider);
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

  it("should be able to add a provider work to database", async () => {
    const provider = makeFakeProvider();
    const repository = new ProviderRepository();

    const data = {
      work_id: "1",
      provider_id: provider.id,
      jobs: [
        {
          job_id: "1",
          cost: 99,
          estimated_duration: 99,
        },
      ],
      min_cost: 99,
    };

    const addedWork = {
      id: "2",
      work_id: "1",
      provider_id: provider.id,
      jobs: [
        {
          id: "2",
          provider_work_id: "2",
          job_id: "1",
          cost: 99,
          estimated_duration: 99,
          job: {
            id: "1",
            name: "Job 1",
            work_id: "1",
          },
        },
      ],
      min_cost: 99,
    };

    mockedPrisma.providerWorkModel.create.mockResolvedValue(addedWork);

    const returnedWork = await repository.addWork(data);

    expect(returnedWork).toEqual(addedWork);
    expect(mockedPrisma.providerWorkModel.create).toHaveBeenCalledWith({
      data: {
        ...data,
        jobs: {
          createMany: {
            data: data.jobs,
          },
        },
      },
      include: {
        jobs: {
          include: {
            job: true,
          },
        },
      },
    });
  });

  it("should be able to update a provider work on database", async () => {
    const provider = makeFakeProvider();
    const work = provider.works[0];

    const repository = new ProviderRepository();

    const data = {
      min_cost: 199,
    };

    const updatedWork = {
      id: work.id,
      work_id: work.work.id,
      provider_id: provider.id,
      min_cost: 199,
    };

    mockedPrisma.providerWorkModel.update.mockResolvedValue(updatedWork);

    const returnedWork = await repository.updateWork(work.id, data);

    expect(returnedWork).toEqual(updatedWork);
    expect(mockedPrisma.providerWorkModel.update).toHaveBeenCalledWith({
      where: { id: work.id },
      data,
    });
  });

  it("should be able to delete a provider work from database", async () => {
    const provider = makeFakeProvider();
    const work = provider.works[0];
    const repository = new ProviderRepository();

    await repository.removeWork(work.id);

    expect(mockedPrisma.providerWorkModel.delete).toHaveBeenCalledWith({
      where: { id: work.id },
    });
  });

  it("should be able to add a provider work job to database", async () => {
    const provider = makeFakeProvider();
    const work = provider.works[0];

    const repository = new ProviderRepository();

    const data = {
      provider_work_id: work.id,
      job_id: "1",
      cost: 99,
      estimated_duration: 99,
    };

    const addedWorkJob = {
      id: "2",
      provider_work_id: work.id,
      job_id: "1",
      cost: 99,
      estimated_duration: 99,
      job: {
        id: "1",
        name: "Job 1",
        work_id: work.id,
      },
    };

    mockedPrisma.providerWorkJobModel.create.mockResolvedValue(addedWorkJob);

    const returnedWorkJob = await repository.addWorkJob(data);

    expect(returnedWorkJob).toEqual(addedWorkJob);
    expect(mockedPrisma.providerWorkJobModel.create).toHaveBeenCalledWith({
      data,
      include: {
        job: true,
      },
    });
  });

  it("should be able to update a provider work job on database", async () => {
    const provider = makeFakeProvider();
    const work = provider.works[0];
    const workJob = work.jobs[0];

    const repository = new ProviderRepository();

    const data = {
      cost: 199,
      estimated_duration: 199,
    };

    const updatedWorkJob = {
      id: workJob.id,
      provider_work_id: work.id,
      job_id: workJob.workJob.id,
      cost: 199,
      estimated_duration: 199,
    };

    mockedPrisma.providerWorkJobModel.update.mockResolvedValue(updatedWorkJob);

    const returnedWorkJob = await repository.updateWorkJob(workJob.id, data);

    expect(returnedWorkJob).toEqual(updatedWorkJob);
    expect(mockedPrisma.providerWorkJobModel.update).toHaveBeenCalledWith({
      where: { id: workJob.id },
      data,
    });
  });

  it("should be able to delete a provider work from database", async () => {
    const provider = makeFakeProvider();
    const work = provider.works[0];
    const workJob = work.jobs[0];

    const repository = new ProviderRepository();

    await repository.removeWorkJob(workJob.id);

    expect(mockedPrisma.providerWorkJobModel.delete).toHaveBeenCalledWith({
      where: { id: workJob.id },
    });
  });
});
