import dayjs from "dayjs";

import Provider, { ProviderJob, ProviderJobService } from "./provider";

import { UserContact, UserDocument, UserEmail } from "../value-object/user";

const document = new UserDocument("881.971.600-31");
const email = new UserEmail("email@email.com");
const contact = new UserContact("(47) 98877-6655");
// 18 years ago
const dob = dayjs().subtract(18, "year").toDate();

const jobService = new ProviderJobService("1", "Service", 10);
const job = new ProviderJob("1", "Job", [jobService], 50);

const makeValidProvider = () =>
    new Provider("1", "Name", document, email, contact, dob, [job]);

describe("Provider Entity", () => {
    it("should not be underage", () => {
        const provider = makeValidProvider();
        // 17 years ago
        const dob = dayjs().subtract(17, "year").toDate();

        expect(() => {
            const _ = new Provider(
                provider.id,
                provider.name,
                provider.document,
                provider.email,
                provider.contact,
                dob,
                provider.jobs
            );
        }).toThrow("Provider must not be underage");
    });

    it("should be able to create a provider of legal age", () => {
        expect(makeValidProvider()).toBeInstanceOf(Provider);
    });

    it("should be able to change its name", () => {
        const provider = makeValidProvider();

        provider.changeName("New Name");

        expect(provider.name).toBe("New Name");
    });

    it("should be able to change its email", () => {
        const provider = makeValidProvider();

        const newEmail = new UserEmail("new@email.com");
        provider.changeEmail(newEmail);

        expect(provider.email).toBe(newEmail);
    });

    it("should be able to change its contact", () => {
        const provider = makeValidProvider();

        const newContact = new UserContact("(47) 91122-3344");
        provider.changeContact(newContact);

        expect(provider.contact).toBe(newContact);
    });

    it("should not be able to create a provider without job", () => {
        const provider = makeValidProvider();

        expect(() => {
            const _ = new Provider(
                provider.id,
                provider.name,
                provider.document,
                provider.email,
                provider.contact,
                provider.dob,
                []
            );
        }).toThrow("Provider must have at least one job");
    });

    it("should be able to add new jobs", () => {
        const provider = makeValidProvider();
        const newJob = new ProviderJob("2", "Job", [jobService], 50);

        provider.addJob(newJob);

        expect(provider.jobs.length).toEqual(2);
        expect(provider.jobs[0]).toBe(job);
        expect(provider.jobs[1]).toBe(newJob);
    });

    it("should not be able to add same job", () => {
        const provider = makeValidProvider();
        const existingJob = provider.jobs[0];

        const newJob = new ProviderJob(
            existingJob.id,
            existingJob.name,
            existingJob.services,
            existingJob.minCost
        );

        expect(() => {
            provider.addJob(existingJob);
        }).toThrow("It's not possible to add the same job twice");

        expect(() => {
            provider.addJob(newJob);
        }).toThrow("It's not possible to add the same job twice");
    });

    it("should be able to remove jobs", () => {
        const provider = makeValidProvider();
        const newJob = new ProviderJob("2", "Job", [jobService], 50);

        provider.addJob(newJob);

        expect(provider.jobs.length).toEqual(2);
        expect(provider.jobs[0]).toBe(job);
        expect(provider.jobs[1]).toBe(newJob);

        provider.removeJob(job);

        expect(provider.jobs.length).toEqual(1);
        expect(provider.jobs[0]).toBe(newJob);

        provider.removeJob(newJob);
        expect(provider.jobs.length).toEqual(0);
    });

    it("should not be able to remove a non-practicable job", () => {
        const provider = makeValidProvider();
        const newJob = new ProviderJob("2", "Job", [jobService], 50);

        expect(() => {
            provider.removeJob(newJob);
        }).toThrow("It's not possible to remove a non-practicable job");
    });
});
