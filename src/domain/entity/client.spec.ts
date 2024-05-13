import dayjs from "dayjs";

import Client from "./client";

import { UserContact, UserDocument, UserEmail } from "../value-object/user";
import { ClientAddress } from "../value-object/client";

const document = new UserDocument("881.971.600-31");
const email = new UserEmail("email@email.com");
const contact = new UserContact("(47) 98877-6655");
const address = new ClientAddress("12345-678", 123);
// 18 years ago
const dob = dayjs().subtract(18, "year").toDate();

const makeValidClient = () =>
    new Client("1", "Name", document, email, contact, dob, address);

describe("Client Entity", () => {
    it("should not be underage", () => {
        // 17 years ago
        const dob = dayjs().subtract(17, "year").toDate();

        expect(() => {
            const _ = new Client(
                "1",
                "Name",
                document,
                email,
                contact,
                dob,
                address
            );
        }).toThrow("Client must not be underage");
    });

    it("should be able to create a client of legal age", () => {
        expect(makeValidClient()).toBeInstanceOf(Client);
    });

    it("should be able to change its name", () => {
        const client = makeValidClient();

        client.changeName("New Name");

        expect(client.name).toBe("New Name");
    });

    it("should be able to change its email", () => {
        const client = makeValidClient();

        const newEmail = new UserEmail("new@email.com");
        client.changeEmail(newEmail);

        expect(client.email).toBe(newEmail);
    });

    it("should be able to change its contact", () => {
        const client = makeValidClient();

        const newContact = new UserContact("(47) 91122-3344");
        client.changeContact(newContact);

        expect(client.contact).toBe(newContact);
    });

    it("should be able to change its address", () => {
        const client = makeValidClient();

        const newAddress = new ClientAddress("98765-432", 321);
        client.changeAddress(newAddress);

        expect(client.address).toBe(newAddress);
    });
});
