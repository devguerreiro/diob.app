import Client from "./client";

import { makeFakeUserContact, makeFakeUserEmail } from "./user.spec.fixture";
import {
    makeFakeClient,
    makeFakeClientAddress,
    makeFakeUnderageClient,
} from "./client.spec.fixture";

describe("Client Entity", () => {
    it("should not be underage", () => {
        expect(makeFakeUnderageClient).toThrow("Client must not be underage");
    });

    it("should be able to create if legal age", () => {
        expect(makeFakeClient()).toBeInstanceOf(Client);
    });

    it("should be able to change its name", () => {
        const client = makeFakeClient();

        client.changeName("New Name");

        expect(client.name).toBe("New Name");
    });

    it("should be able to change its email", () => {
        const client = makeFakeClient();

        const newEmail = makeFakeUserEmail();
        client.changeEmail(newEmail);

        expect(client.email).toBe(newEmail);
    });

    it("should be able to change its contact", () => {
        const client = makeFakeClient();

        const newContact = makeFakeUserContact();
        client.changeContact(newContact);

        expect(client.contact).toBe(newContact);
    });

    it("should be able to change its address", () => {
        const client = makeFakeClient();

        const newAddress = makeFakeClientAddress();
        client.changeAddress(newAddress);

        expect(client.address).toBe(newAddress);
    });
});
