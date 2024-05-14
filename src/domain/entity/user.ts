import dayjs from "dayjs";

import { UserDocument, UserContact, UserEmail } from "../value-object/user";

export default abstract class User {
    constructor(
        private _id: string,
        private _name: string,
        private _document: UserDocument,
        private _email: UserEmail,
        private _contact: UserContact,
        private _dob: Date
    ) {}

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get document(): UserDocument {
        return this._document;
    }

    get email(): UserEmail {
        return this._email;
    }

    get contact(): UserContact {
        return this._contact;
    }

    get dob(): Date {
        return this._dob;
    }

    changeName(name: string): void {
        this._name = name;
    }

    changeEmail(email: UserEmail): void {
        this._email = email;
    }

    changeContact(contact: UserContact): void {
        this._contact = contact;
    }

    validate(): void {
        const age = dayjs().diff(dayjs(this._dob), "year");

        if (age < 18) {
            throw new Error(`${this.constructor.name} must not be underage`);
        }
    }
}
