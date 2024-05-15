import User from "./user";
import Client from "./client";
import Provider from "./provider";

enum JobRequestStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    DONE = "DONE",
}

interface JobRequestLogInterface {
    status: JobRequestStatus;
    changedBy: User;
    changedAt: Date;
}

export default class JobRequest {
    constructor(
        private _id: string,
        private _client: Client,
        private _provider: Provider,
        private _logs: Array<JobRequestLogInterface> = []
    ) {
        this.initiate();
    }

    get id(): string {
        return this._id;
    }

    get client(): Client {
        return this._client;
    }

    get provider(): Provider {
        return this._provider;
    }

    get logs(): Array<JobRequestLogInterface> {
        return this._logs;
    }

    get lastLog(): JobRequestLogInterface {
        return this._logs[this._logs.length - 1];
    }

    get totalCost(): number {
        return this._provider.jobs.reduce(
            (total, job) => total + job.totalCost,
            0
        );
    }

    initiate(): void {
        this._logs.push({
            status: JobRequestStatus.PENDING,
            changedBy: this._client,
            changedAt: new Date(),
        });
    }

    accept(provider: Provider): void {
        if (this.lastLog.status !== JobRequestStatus.PENDING)
            throw new Error(
                "It's not possible to ACCEPT a non-pending job request"
            );

        this._logs.push({
            status: JobRequestStatus.ACCEPTED,
            changedBy: provider,
            changedAt: new Date(),
        });
    }

    reject(provider: Provider): void {
        if (this.lastLog.status !== JobRequestStatus.PENDING)
            throw new Error(
                "It's not possible to REJECT a non-pending job request"
            );

        this._logs.push({
            status: JobRequestStatus.REJECTED,
            changedBy: provider,
            changedAt: new Date(),
        });
    }

    cancel(client: Client): void {
        if (this.lastLog.status !== JobRequestStatus.PENDING)
            throw new Error(
                "It's not possible to CANCEL a non-pending job request"
            );

        this._logs.push({
            status: JobRequestStatus.CANCELLED,
            changedBy: client,
            changedAt: new Date(),
        });
    }

    done(user: User): void {
        const userAlreadyDone = this._logs.some(
            (l) =>
                l.status === JobRequestStatus.DONE && l.changedBy.id === user.id
        );

        if (
            this.lastLog.status !== JobRequestStatus.ACCEPTED &&
            this.lastLog.status === JobRequestStatus.DONE &&
            userAlreadyDone
        )
            throw new Error(
                "It's not possible to DONE a non-accepted job request or if you already DONE"
            );

        this._logs.push({
            status: JobRequestStatus.DONE,
            changedBy: user,
            changedAt: new Date(),
        });
    }
}
