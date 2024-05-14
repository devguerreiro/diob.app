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

        this.validate();
    }

    get jobs(): Array<ProviderJob> {
        return this._jobs;
    }

    validate(): void {
        super.validate();

        if (this._jobs.length === 0)
            throw new Error("Provider must have at least one job");
    }

    addJob(job: ProviderJob): void {
        const jobIndex = this._jobs.findIndex((j) => j.id === job.id);

        if (jobIndex !== -1)
            throw new Error("It's not possible to add the same job twice");

        this._jobs.push(job);
    }

    removeJob(job: ProviderJob): void {
        const jobIndex = this._jobs.findIndex((j) => j.id === job.id);

        if (jobIndex === -1)
            throw new Error(
                "It's not possible to remove a non-practicable job"
            );

        this._jobs.splice(jobIndex, 1);
    }
}

export class ProviderJob implements JobInterface {
    constructor(
        private _id: string,
        private _name: string,
        private _services: Array<ProviderJobService>,
        private _minCost: number
    ) {
        this.validate();
    }

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

    validate(): void {
        if (this._services.length === 0)
            throw new Error("Provider job must have at least one service");
    }

    addService(service: ProviderJobService): void {
        const serviceIndex = this._services.findIndex(
            (s) => s.id === service.id
        );

        if (serviceIndex !== -1)
            throw new Error("It's not possible to add the same service twice");

        this._services.push(service);
    }

    removeService(service: ProviderJobService): void {
        const serviceIndex = this._services.findIndex(
            (j) => j.id === service.id
        );

        if (serviceIndex === -1)
            throw new Error(
                "It's not possible to remove a non-practicable service"
            );

        this._services.splice(serviceIndex, 1);
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
