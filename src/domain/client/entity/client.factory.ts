import { ClientModel } from "@prisma/client";

import {
  UserContact,
  UserDocument,
  UserEmail,
} from "@/domain/@shared/value-object/user";
import { ClientAddress } from "@/domain/client/value-object/client";

import Client from "./client";

export default class ClientFactory {
  static fromModel(model: ClientModel): Client {
    const _document = new UserDocument(model.document);
    const _contact = new UserContact(model.contact);
    const _email = new UserEmail(model.email);
    const address = new ClientAddress(
      model.address_cep,
      model.address_number,
      model.address_complement ?? undefined
    );
    return new Client(
      model.id,
      model.name,
      _document,
      _email,
      _contact,
      model.dob,
      address
    );
  }
}
