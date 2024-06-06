import { ClientModel } from "@prisma/client";

import { mockedPrisma } from "@/infra/lib/mocked-prisma";

import { makeFakeClient } from "@/domain/client/entity/client.spec.fixture";

import ClientRepository from "./repository";

describe("Client Repository tests", () => {
  it("should be able to insert a client on database", async () => {
    const client = makeFakeClient();
    const repository = new ClientRepository();
    const model: ClientModel = {
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

    mockedPrisma.clientModel.create.mockResolvedValue(model);

    const createdClient = await repository.create(model);

    expect(createdClient).toEqual(client);
    expect(mockedPrisma.clientModel.create).toHaveBeenCalledWith({
      data: model,
    });
  });

  it("should be able to retrieve all clients from database", async () => {
    const client = makeFakeClient();
    const repository = new ClientRepository();
    const models: Array<ClientModel> = Array(5).fill({
      id: client.id,
      name: client.name,
      document: client.document.value,
      email: client.email.value,
      contact: client.contact.value,
      dob: client.dob,
      address_cep: client.address.value.cep,
      address_number: client.address.value.number,
      address_complement: client.address.value.complement ?? null,
    });

    mockedPrisma.clientModel.findMany.mockResolvedValue(models);

    const clients = await repository.all();

    expect(clients).toEqual(Array(5).fill(client));
    expect(mockedPrisma.clientModel.findMany).toHaveBeenCalled();
  });

  it("should be able to retrieve a client by id from database", async () => {
    const client = makeFakeClient();
    const repository = new ClientRepository();
    const model: ClientModel = {
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

    expect(retrievedClient).toEqual(client);
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
});
