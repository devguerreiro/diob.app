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
import {
  makeFakeServiceRequest,
  makeFakeServiceRequestLog,
} from "@/domain/service-request/entity/service-request.spec.fixture";
import ServiceRequest, {
  StatusEnum,
} from "@/domain/service-request/entity/service-request";

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
      existingWork.minCost,
      existingWork.jobs,
      existingWork.work
    );

    expect(() => {
      provider.addWork(newWork);
    }).toThrow("It's not possible to add the same work twice");
  });

  it("should be able to update a work", () => {
    const provider = makeFakeProvider();
    const work = provider.works[0];
    const currentMinCost = work.minCost;

    provider.updateWork(work.id, currentMinCost + 1);

    expect(work.minCost).toEqual(currentMinCost + 1);
  });

  it("should not be able to update a non-practicable work", () => {
    const provider = makeFakeProvider();
    const nonPracticableWork = makeFakeProviderWork();

    expect(() => {
      provider.updateWork(nonPracticableWork.id, 0);
    }).toThrow("It's not possible to update a non-practicable work");
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
    const nonPracticableWork = makeFakeProviderWork();

    expect(() => {
      provider.removeWork(nonPracticableWork);
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
      existingWorkJob.cost,
      existingWorkJob.estimatedDuration,
      existingWorkJob.workJob
    );

    expect(() => {
      existingWork.addJob(newJobService);
    }).toThrow("It's not possible to add the same job twice");
  });

  it("should be able to update a job", () => {
    const provider = makeFakeProvider();
    const work = provider.works[0];
    const job = work.jobs[0];
    const currentCost = job.cost;
    const currentEstimatedDuration = job.estimatedDuration;

    work.updateJob(job.id, currentCost + 1, currentEstimatedDuration + 1);

    expect(job.cost).toEqual(currentCost + 1);
    expect(job.estimatedDuration).toEqual(currentEstimatedDuration + 1);
  });

  it("should not be able to update a non-practicable job", () => {
    const provider = makeFakeProvider();
    const work = provider.works[0];
    const nonPracticableJob = makeFakeProviderWorkJob();

    expect(() => {
      work.updateJob(nonPracticableJob.id, 0, 0);
    }).toThrow("It's not possible to update a non-practicable job");
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
    const nonPracticableJob = makeFakeProviderWorkJob();

    expect(() => {
      existingWork.removeJob(nonPracticableJob);
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

  it("should be able to confirm a service request", () => {
    const serviceRequest = makeFakeServiceRequest();

    jest
      .spyOn(ServiceRequest.prototype, "logs", "get")
      .mockReturnValue([makeFakeServiceRequestLog()]);

    serviceRequest.provider.confirmRequest(serviceRequest);

    jest.restoreAllMocks();

    expect(serviceRequest.logs.length).toEqual(1);
    expect(serviceRequest.logs[0].status).toEqual(StatusEnum.CONFIRMED);
    expect(serviceRequest.logs[0].by).toEqual(serviceRequest.provider);
  });

  it("should be able to refuse a service request", () => {
    const serviceRequest = makeFakeServiceRequest();

    jest
      .spyOn(ServiceRequest.prototype, "logs", "get")
      .mockReturnValue([makeFakeServiceRequestLog()]);

    serviceRequest.provider.refuseRequest(serviceRequest);

    jest.restoreAllMocks();

    expect(serviceRequest.logs.length).toEqual(1);
    expect(serviceRequest.logs[0].status).toEqual(StatusEnum.REFUSED);
    expect(serviceRequest.logs[0].by).toEqual(serviceRequest.provider);
  });

  it("should be able to start a service request", () => {
    const serviceRequest = makeFakeServiceRequest();

    jest
      .spyOn(ServiceRequest.prototype, "logs", "get")
      .mockReturnValue([makeFakeServiceRequestLog(StatusEnum.CONFIRMED)]);

    serviceRequest.provider.startRequest(serviceRequest);

    jest.restoreAllMocks();

    expect(serviceRequest.logs.length).toEqual(1);
    expect(serviceRequest.logs[0].status).toEqual(StatusEnum.STARTED);
    expect(serviceRequest.logs[0].by).toEqual(serviceRequest.provider);
  });

  it("should be able to finish a service request", () => {
    const serviceRequest = makeFakeServiceRequest();

    jest
      .spyOn(ServiceRequest.prototype, "logs", "get")
      .mockReturnValue([makeFakeServiceRequestLog(StatusEnum.STARTED)]);

    serviceRequest.provider.finishRequest(serviceRequest);

    jest.restoreAllMocks();

    expect(serviceRequest.logs.length).toEqual(1);
    expect(serviceRequest.logs[0].status).toEqual(StatusEnum.FINISHED);
    expect(serviceRequest.logs[0].by).toEqual(serviceRequest.provider);
  });

  it.each([1, 2, 3, 4, 5, 1.23])(
    "should be able to rate the service request client",
    (rating) => {
      const serviceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "logs", "get")
        .mockReturnValue([makeFakeServiceRequestLog(StatusEnum.FINISHED)]);

      serviceRequest.provider.rateRequestClient(serviceRequest, rating);

      jest.restoreAllMocks();

      expect(serviceRequest.logs.length).toEqual(1);
      expect(serviceRequest.logs[0].status).toEqual(StatusEnum.RATED);
      expect(serviceRequest.logs[0].by).toEqual(serviceRequest.provider);

      expect(serviceRequest.client.rating).toEqual(rating);
    }
  );

  it.each([0, 6, 0.99, 5.01])(
    "should not be able to rate the service request client",
    (rating) => {
      const serviceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "logs", "get")
        .mockReturnValue([makeFakeServiceRequestLog(StatusEnum.FINISHED)]);

      expect(() => {
        serviceRequest.provider.rateRequestClient(serviceRequest, rating);
      }).toThrow("Rating must be between 1 and 5");
    }
  );
});
