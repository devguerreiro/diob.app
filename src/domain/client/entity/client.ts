import User from "@/domain/@shared/entity/user";

import {
    UserContact,
    UserDocument,
    UserEmail,
} from "@/domain/@shared/value-object/user";

import { ClientAddress } from "@/domain/client/value-object/client";

export default class Client extends User {
    constructor(
        id: string,
        name: string,
        document: UserDocument,
        email: UserEmail,
        contact: UserContact,
        dob: Date,
        private _address: ClientAddress
    ) {
        super(id, name, document, email, contact, dob);

        this.validate();
    }

    get address(): ClientAddress {
        return this._address;
    }

    changeAddress(address: ClientAddress): void {
        this._address = address;
    }
}
