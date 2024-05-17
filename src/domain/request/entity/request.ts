import User from "@/domain/@shared/entity/user";
import LogInterface from "@/domain/@shared/interface/log";
import Client from "@/domain/client/entity/client";
import Provider, { ProviderWork } from "@/domain/provider/entity/provider";

export enum RequestStatus {
    CREATED = "CREATED",
    BEGAN = "BEGAN",
    CANCELLED = "CANCELLED",
    FINISHED = "FINISHED",
    RATED = "RATED",
}

type TRequestStatus<T> = RequestStatus | T;

interface RequestLogInterface<T> extends LogInterface<TRequestStatus<T>> {}

export default abstract class Request<T> {
    private _logs: Array<RequestLogInterface<T>> = [];

    constructor(
        private _id: string,
        private _client: Client,
        private _provider: Provider,
        private _work: ProviderWork
    ) {
        this.initialize();
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

    get work(): ProviderWork {
        return this._work;
    }

    get logs(): Array<RequestLogInterface<T>> {
        return this._logs;
    }

    get currentLog(): RequestLogInterface<T> {
        return this._logs[this._logs.length - 1];
    }

    get totalCost(): number {
        return this._work.totalCost;
    }

    private initialize(): void {
        this.saveLog(RequestStatus.CREATED, this._client);
    }

    protected saveLog(status: TRequestStatus<T>, user: User): void {
        this._logs.push({
            status,
            changedBy: user,
            changedAt: new Date(),
        });
    }

    cancel(user: User): void {
        const alreadyFinished = this._logs.some(
            (log) => log.status === RequestStatus.FINISHED
        );

        if (alreadyFinished)
            throw new Error(
                "It's not possible to cancel the request if it already finished"
            );

        this.saveLog(RequestStatus.CANCELLED, user);
    }

    begin(user: User, additionalValidation: () => void): void {
        if (user !== this._provider)
            throw new Error("Only the provider can begin the request");

        additionalValidation();

        this.saveLog(RequestStatus.BEGAN, user);
    }

    finish(user: User): void {
        const alreadyBegan = this._logs.some(
            (log) => log.status === RequestStatus.BEGAN
        );

        if (!alreadyBegan)
            throw new Error(
                "It's not possible to finish the request before begin it"
            );

        this.saveLog(RequestStatus.FINISHED, user);
    }

    rate(evaluator: User): void {
        if (evaluator === this._client) {
            const clientAlreadyFinish = this._logs.some(
                (log) =>
                    log.status === RequestStatus.FINISHED &&
                    log.changedBy === evaluator
            );

            if (!clientAlreadyFinish)
                throw new Error(
                    "It's not possible to rate the request provider before finishing it"
                );
        } else if (evaluator === this._provider) {
            const providerAlreadyFinish = this._logs.some(
                (log) =>
                    log.status === RequestStatus.FINISHED &&
                    log.changedBy === evaluator
            );

            if (!providerAlreadyFinish)
                throw new Error(
                    "It's not possible to rate the request client before finishing it"
                );
        }

        this.saveLog(RequestStatus.RATED, evaluator);
    }
}
