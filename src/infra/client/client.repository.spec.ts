import { mockedPrisma } from "@/lib/mocked-prisma";

import { makeFakeClient } from "@/domain/client/entity/client.spec.fixture";

import ClientRepository from "./client.repository";

describe("Client Repository tests", () => {
  it("should be able to insert a client on database", async () => {
    const client = makeFakeClient();
    const repository = new ClientRepository();

    const data = {
      name: client.name,
      document: client.document.value,
      email: client.email.value,
      contact: client.contact.value,
      dob: client.dob,
      address_cep: client.address.value.cep,
      address_number: client.address.value.number,
      address_complement: client.address.value.complement ?? null,
    };

    const createdClient = {
      id: client.id,
      name: client.name,
      document: client.document.value,
      email: client.email.value,
      contact: client.contact.value,
      dob: client.dob,
      address_cep: client.address.value.cep,
      address_number: client.address.value.number,
      address_complement: client.address.value.complement ?? null,
    };

    mockedPrisma.clientModel.create.mockResolvedValue(createdClient);

    const returnedClient = await repository.create(data);

    expect(returnedClient).toEqual(createdClient);
    expect(mockedPrisma.clientModel.create).toHaveBeenCalledWith({
      data,
    });
  });

  it("should be able to retrieve all clients from database", async () => {
    const client = makeFakeClient();
    const repository = new ClientRepository();

    const models = Array(5).fill({
      id: client.id,
      name: client.name,
      document: client.document.value,
      email: client.email.value,
      contact: client.contact.value,
    });

    mockedPrisma.clientModel.findMany.mockResolvedValue(models);

    const clients = await repository.all();

    expect(clients).toEqual(models);
    expect(mockedPrisma.clientModel.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        document: true,
        email: true,
        contact: true,
      },
    });
  });

  it("should be able to retrieve a client by id from database", async () => {
    const client = makeFakeClient();
    const repository = new ClientRepository();

    const model = {
      id: client.id,
      name: client.name,
      document: client.document.value,
      email: client.email.value,
      contact: client.contact.value,
      dob: client.dob,
      address_cep: client.address.value.cep,
      address_number: client.address.value.number,
      address_complement: client.address.value.complement ?? null,
    };

    mockedPrisma.clientModel.findUnique.mockResolvedValue(model);

    const retrievedClient = await repository.getByID(client.id);

    expect(retrievedClient).toEqual(model);
    expect(mockedPrisma.clientModel.findUnique).toHaveBeenCalledWith({
      where: { id: client.id },
    });
  });

  it("should return null if client does not exist on database", async () => {
    const repository = new ClientRepository();

    mockedPrisma.clientModel.findUnique.mockResolvedValue(null);

    const retrievedClient = await repository.getByID("123");

    expect(retrievedClient).toBe(null);
    expect(mockedPrisma.clientModel.findUnique).toHaveBeenCalledWith({
      where: { id: "123" },
    });
  });

  it("should be able to update a client on database", async () => {
    const client = makeFakeClient();
    const repository = new ClientRepository();

    const data = {
      name: "New Name",
      email: "new@email.com",
      contact: "123456789",
      address_cep: "123456",
      address_number: 123,
      address_complement: null,
    };

    const updatedModel = {
      id: client.id,
      name: "New Name",
      document: client.document.value,
      email: "new@email.com",
      contact: "123456789",
      dob: client.dob,
      address_cep: "123456",
      address_number: 123,
      address_complement: null,
    };

    mockedPrisma.clientModel.update.mockResolvedValue(updatedModel);

    const returnedClient = await repository.update(client.id, data);

    expect(returnedClient).toEqual(updatedModel);
    expect(mockedPrisma.clientModel.update).toHaveBeenCalledWith({
      where: { id: client.id },
      data,
    });
  });

  it("should be able to delete a client from database", async () => {
    const client = makeFakeClient();
    const repository = new ClientRepository();

    await repository.delete(client.id);

    expect(mockedPrisma.clientModel.delete).toHaveBeenCalledWith({
      where: { id: client.id },
    });
  });
});
