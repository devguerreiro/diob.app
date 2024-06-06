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
});
