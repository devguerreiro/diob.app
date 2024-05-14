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
        // 17 years ago
        const dob = dayjs().subtract(17, "year").toDate();

        expect(() => {
            const _ = new Provider("1", "Name", document, email, contact, dob, [
                job,
            ]);
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
});
