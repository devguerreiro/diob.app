import { UserContact, UserDocument, UserEmail } from "../value-object/user";
import { JobInterface, JobServiceInterface } from "./job.interface";

import User from "./user";

export default class Provider extends User {
    constructor(
        id: string,
        name: string,
        document: UserDocument,
        email: UserEmail,
        contact: UserContact,
        dob: Date,
        private _jobs: Array<ProviderJob>
    ) {
        super(id, name, document, email, contact, dob);
    }

    get jobs(): Array<ProviderJob> {
        return this._jobs;
    }
}

export class ProviderJob implements JobInterface {
    constructor(
        private _id: string,
        private _name: string,
        private _services: Array<ProviderJobService>,
        private _minCost: number
    ) {}

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get services(): Array<ProviderJobService> {
        return this._services;
    }

    get minCost(): number {
        return this._minCost;
    }
}

export class ProviderJobService implements JobServiceInterface {
    constructor(
        private _id: string,
        private _name: string,
        private _cost: number
    ) {}

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get cost(): number {
        return this._cost;
    }
}
