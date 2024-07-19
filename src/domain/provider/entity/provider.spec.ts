import Provider, { ProviderWork, ProviderWorkJob } from "./provider";

import {
  makeFakeUserContact,
  makeFakeUserEmail,
} from "@/domain/@shared/entity/user.spec.fixture";

import {
  makeFakeProviderWork,
  makeFakeProvider,
  makeFakeProviderWorkWithoutJob,
  makeFakeProviderWithoutWork,
  makeFakeUnderageProvider,
  makeFakeProviderWorkJob,
} from "./provider.spec.fixture";
import { makeFakeClient } from "@/domain/client/entity/client.spec.fixture";

describe("Provider Entity", () => {
  it("should not be underage", () => {
    expect(makeFakeUnderageProvider).toThrow("Provider must not be underage");
  });

  it("should be able to create if legal age", () => {
    expect(makeFakeProvider()).toBeInstanceOf(Provider);
  });

  it("should be able to change its name", () => {
    const provider = makeFakeProvider();

    provider.changeName("New Name");

    expect(provider.name).toBe("New Name");
  });

  it("should be able to change its email", () => {
    const provider = makeFakeProvider();

    const newEmail = makeFakeUserEmail();
    provider.changeEmail(newEmail);

    expect(provider.email).toBe(newEmail);
  });

  it("should be able to change its contact", () => {
    const provider = makeFakeProvider();

    const newContact = makeFakeUserContact();
    provider.changeContact(newContact);

    expect(provider.contact).toBe(newContact);
  });

  it("should be able to rate", () => {
    const provider = makeFakeProvider();
    const client = makeFakeClient();

    provider.rate(client, 5);
    provider.rate(client, 1);
    provider.rate(client, 3);

    expect(client.rating).toEqual(3);
  });

  it("should not be able to rate ", () => {
    const provider = makeFakeProvider();
    const client = makeFakeClient();

    expect(() => {
      provider.rate(client, 0.99);
    }).toThrow("Rating must be between 1 and 5");

    expect(() => {
      provider.rate(client, 5.01);
    }).toThrow("Rating must be between 1 and 5");
  });

  it("should not be able to create if has no work", () => {
    expect(makeFakeProviderWithoutWork).toThrow(
      "Provider must have at least one work"
    );
  });

  it("should be able to add a new work", () => {
    const provider = makeFakeProvider();

    expect(provider.works.length).toEqual(1);

    const newWork = makeFakeProviderWork();

    provider.addWork(newWork);

    expect(provider.works.length).toEqual(2);
    expect(provider.works[1]).toBe(newWork);
  });

  it("should not be able to add same work", () => {
    const provider = makeFakeProvider();
    const existingWork = provider.works[0];

    expect(() => {
      provider.addWork(existingWork);
    }).toThrow("It's not possible to add the same work twice");

    const newWork = new ProviderWork(
      existingWork.id,
      existingWork.name,
      existingWork.minCost,
      existingWork.jobs
    );

    expect(() => {
      provider.addWork(newWork);
    }).toThrow("It's not possible to add the same work twice");
  });

  it("should be able to remove a work", () => {
    const provider = makeFakeProvider();

    expect(provider.works.length).toEqual(1);

    const newWork = makeFakeProviderWork();

    provider.addWork(newWork);

    expect(provider.works.length).toEqual(2);
    expect(provider.works[1]).toBe(newWork);

    provider.removeWork(provider.works[0]);

    expect(provider.works.length).toEqual(1);
    expect(provider.works[0]).toBe(newWork);

    provider.removeWork(newWork);

    expect(provider.works.length).toEqual(0);
  });

  it("should not be able to remove a non-practicable work", () => {
    const provider = makeFakeProvider();
    const newWork = makeFakeProviderWork();

    expect(() => {
      provider.removeWork(newWork);
    }).toThrow("It's not possible to remove a non-practicable work");
  });

  it("should not be able to create a provider work without job", () => {
    expect(makeFakeProviderWorkWithoutJob).toThrow(
      "Provider work must have at least one job"
    );
  });

  it("should be able to add new job to provider work", () => {
    const provider = makeFakeProvider();
    const existingWork = provider.works[0];
    const existingWorkJob = existingWork.jobs[0];

    expect(existingWork.jobs.length).toEqual(1);
    expect(existingWork.jobs[0]).toBe(existingWorkJob);

    const newWorkJob = makeFakeProviderWorkJob();

    existingWork.addJob(newWorkJob);

    expect(existingWork.jobs.length).toEqual(2);
    expect(existingWork.jobs[1]).toBe(newWorkJob);
  });

  it("should not be able to add same job to provider work", () => {
    const provider = makeFakeProvider();
    const existingWork = provider.works[0];
    const existingWorkJob = existingWork.jobs[0];

    expect(() => {
      existingWork.addJob(existingWorkJob);
    }).toThrow("It's not possible to add the same job twice");

    const newJobService = new ProviderWorkJob(
      existingWorkJob.id,
      existingWorkJob.name,
      existingWorkJob.cost
    );

    expect(() => {
      existingWork.addJob(newJobService);
    }).toThrow("It's not possible to add the same job twice");
  });

  it("should be able to remove a job", () => {
    const provider = makeFakeProvider();
    const existingWork = provider.works[0];

    expect(existingWork.jobs.length).toEqual(1);

    const newWorkJob = makeFakeProviderWorkJob();

    existingWork.addJob(newWorkJob);

    expect(existingWork.jobs.length).toEqual(2);
    expect(existingWork.jobs[1]).toBe(newWorkJob);

    existingWork.removeJob(existingWork.jobs[0]);

    expect(existingWork.jobs.length).toEqual(1);
    expect(existingWork.jobs[0]).toBe(newWorkJob);

    existingWork.removeJob(newWorkJob);

    expect(existingWork.jobs.length).toEqual(0);
  });

  it("should not be able to remove a non-practicable job", () => {
    const provider = makeFakeProvider();
    const existingWork = provider.works[0];
    const newWorkJob = makeFakeProviderWorkJob();

    expect(() => {
      existingWork.removeJob(newWorkJob);
    }).toThrow("It's not possible to remove a non-practicable job");
  });

  it("should calculate the total amount of the provider work", () => {
    const provider = makeFakeProvider();
    const providerWork = provider.works[0];
    const providerWorkJobsTotal = providerWork.jobs.reduce(
      (total, job) => total + job.cost,
      0
    );
    const totalExpected = Math.max(providerWorkJobsTotal, providerWork.minCost);

    const totalCalculated = providerWork.totalCost;

    expect(totalExpected).toEqual(totalCalculated);
  });
});
