import User from "@/domain/@shared/entity/user";

import {
    WorkInterface,
    WorkJobInterface,
} from "@/domain/@shared/interface/work";

import {
    UserContact,
    UserDocument,
    UserEmail,
} from "@/domain/@shared/value-object/user";

export default class Provider extends User {
    constructor(
        id: string,
        name: string,
        document: UserDocument,
        email: UserEmail,
        contact: UserContact,
        dob: Date,
        private _works: Array<ProviderWork>
    ) {
        super(id, name, document, email, contact, dob);

        this.validate();
    }

    get works(): Array<ProviderWork> {
        return this._works;
    }

    validate(): void {
        super.validate();

        if (this._works.length === 0)
            throw new Error("Provider must have at least one work");
    }

    addWork(work: ProviderWork): void {
        const workIndex = this._works.findIndex((j) => j.id === work.id);

        if (workIndex !== -1)
            throw new Error("It's not possible to add the same work twice");

        this._works.push(work);
    }

    removeWork(work: ProviderWork): void {
        const workIndex = this._works.findIndex((j) => j.id === work.id);

        if (workIndex === -1)
            throw new Error(
                "It's not possible to remove a non-practicable work"
            );

        this._works.splice(workIndex, 1);
    }
}

export class ProviderWork implements WorkInterface {
    constructor(
        private _id: string,
        private _name: string,
        private _jobs: Array<ProviderWorkJob>,
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

    get jobs(): Array<ProviderWorkJob> {
        return this._jobs;
    }

    get minCost(): number {
        return this._minCost;
    }

    get totalCost(): number {
        const jobsTotal = this._jobs.reduce(
            (total, job) => total + job.cost,
            0
        );
        return Math.max(jobsTotal, this._minCost);
    }

    validate(): void {
        if (this._jobs.length === 0)
            throw new Error("Provider work must have at least one job");
    }

    addJob(job: ProviderWorkJob): void {
        const jobIndex = this._jobs.findIndex((s) => s.id === job.id);

        if (jobIndex !== -1)
            throw new Error("It's not possible to add the same job twice");

        this._jobs.push(job);
    }

    removeJob(job: ProviderWorkJob): void {
        const jobIndex = this._jobs.findIndex((j) => j.id === job.id);

        if (jobIndex === -1)
            throw new Error(
                "It's not possible to remove a non-practicable job"
            );

        this._jobs.splice(jobIndex, 1);
    }
}

export class ProviderWorkJob implements WorkJobInterface {
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
