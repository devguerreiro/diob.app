import Provider, { ProviderJob, ProviderJobService } from "./provider";

import { makeFakeUserContact, makeFakeUserEmail } from "./user.spec.fixture";
import {
    makeFakeProviderJob,
    makeFakeProvider,
    makeFakeProviderJobWithoutService,
    makeFakeProviderWithoutJob,
    makeFakeUnderageProvider,
    makeFakeProviderJobService,
} from "./provider.spec.fixture";

describe("Provider Entity", () => {
    it("should not be underage", () => {
        expect(makeFakeUnderageProvider).toThrow(
            "Provider must not be underage"
        );
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

    it("should not be able to create if has no job", () => {
        expect(makeFakeProviderWithoutJob).toThrow(
            "Provider must have at least one job"
        );
    });

    it("should be able to add a new job", () => {
        const provider = makeFakeProvider();

        expect(provider.jobs.length).toEqual(1);

        const newJob = makeFakeProviderJob();

        provider.addJob(newJob);

        expect(provider.jobs.length).toEqual(2);
        expect(provider.jobs[1]).toBe(newJob);
    });

    it("should not be able to add same job", () => {
        const provider = makeFakeProvider();
        const existingJob = provider.jobs[0];

        expect(() => {
            provider.addJob(existingJob);
        }).toThrow("It's not possible to add the same job twice");

        const newJob = new ProviderJob(
            existingJob.id,
            existingJob.name,
            existingJob.services,
            existingJob.minCost
        );

        expect(() => {
            provider.addJob(newJob);
        }).toThrow("It's not possible to add the same job twice");
    });

    it("should be able to remove a job", () => {
        const provider = makeFakeProvider();

        expect(provider.jobs.length).toEqual(1);

        const newJob = makeFakeProviderJob();

        provider.addJob(newJob);

        expect(provider.jobs.length).toEqual(2);
        expect(provider.jobs[1]).toBe(newJob);

        provider.removeJob(provider.jobs[0]);

        expect(provider.jobs.length).toEqual(1);
        expect(provider.jobs[0]).toBe(newJob);

        provider.removeJob(newJob);

        expect(provider.jobs.length).toEqual(0);
    });

    it("should not be able to remove a non-practicable job", () => {
        const provider = makeFakeProvider();
        const newJob = makeFakeProviderJob();

        expect(() => {
            provider.removeJob(newJob);
        }).toThrow("It's not possible to remove a non-practicable job");
    });

    it("should not be able to create a provider job without service", () => {
        expect(makeFakeProviderJobWithoutService).toThrow(
            "Provider job must have at least one service"
        );
    });

    it("should be able to add new service to provider job", () => {
        const provider = makeFakeProvider();
        const existingJob = provider.jobs[0];
        const existingJobService = existingJob.services[0];

        expect(existingJob.services.length).toEqual(1);
        expect(existingJob.services[0]).toBe(existingJobService);

        const newJobService = makeFakeProviderJobService();

        existingJob.addService(newJobService);

        expect(existingJob.services.length).toEqual(2);
        expect(existingJob.services[1]).toBe(newJobService);
    });

    it("should not be able to add same service to provider job", () => {
        const provider = makeFakeProvider();
        const existingJob = provider.jobs[0];
        const existingJobService = existingJob.services[0];

        expect(() => {
            existingJob.addService(existingJobService);
        }).toThrow("It's not possible to add the same service twice");

        const newJobService = new ProviderJobService(
            existingJobService.id,
            existingJobService.name,
            existingJobService.cost
        );

        expect(() => {
            existingJob.addService(newJobService);
        }).toThrow("It's not possible to add the same service twice");
    });

    it("should be able to remove a service", () => {
        const provider = makeFakeProvider();
        const existingJob = provider.jobs[0];

        expect(existingJob.services.length).toEqual(1);

        const newJobService = makeFakeProviderJobService();

        existingJob.addService(newJobService);

        expect(existingJob.services.length).toEqual(2);
        expect(existingJob.services[1]).toBe(newJobService);

        existingJob.removeService(existingJob.services[0]);

        expect(existingJob.services.length).toEqual(1);
        expect(existingJob.services[0]).toBe(newJobService);

        existingJob.removeService(newJobService);

        expect(existingJob.services.length).toEqual(0);
    });

    it("should not be able to remove a non-practicable service", () => {
        const provider = makeFakeProvider();
        const existingJob = provider.jobs[0];
        const newJobService = makeFakeProviderJobService();

        expect(() => {
            existingJob.removeService(newJobService);
        }).toThrow("It's not possible to remove a non-practicable service");
    });
});
