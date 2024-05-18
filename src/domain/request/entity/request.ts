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

    cancel(user: User, additionalValidation: () => void): void {
        const alreadyBegan = this._logs.some(
            (log) =>
                log.status === RequestStatus.BEGAN && log.changedBy === user
        );

        if (user === this._provider && !alreadyBegan)
            throw new Error(
                "It's not possible to cancel the request before beginning"
            );

        const alreadyFinished = this._logs.some(
            (log) => log.status === RequestStatus.FINISHED
        );

        if (alreadyFinished)
            throw new Error(
                "It's not possible to cancel the request after finished"
            );

        additionalValidation();

        this.saveLog(RequestStatus.CANCELLED, user);
    }

    begin(user: User, additionalValidation: () => void): void {
        if (user !== this._provider)
            throw new Error("Only the provider should begin the request");

        additionalValidation();

        this.saveLog(RequestStatus.BEGAN, user);
    }

    finish(user: User): void {
        const alreadyBegan = this._logs.some(
            (log) => log.status === RequestStatus.BEGAN
        );

        if (!alreadyBegan)
            throw new Error(
                "It's not possible to finish the request before beginning"
            );

        const alreadyCancelled = this._logs.some(
            (log) => log.status === RequestStatus.CANCELLED
        );

        if (alreadyCancelled)
            throw new Error(
                "It's not possible to finish the request after cancelled"
            );

        const alreadyFinished = this._logs.some(
            (log) =>
                log.status === RequestStatus.FINISHED && log.changedBy === user
        );

        if (alreadyFinished)
            throw new Error(
                "It's not possible to finish the request more than once"
            );

        this.saveLog(RequestStatus.FINISHED, user);
    }

    rate(evaluator: User): void {
        const evaluatorAlreadyFinished = this._logs.some(
            (log) =>
                log.status === RequestStatus.FINISHED &&
                log.changedBy === evaluator
        );

        if (!evaluatorAlreadyFinished)
            throw new Error(
                "It's not possible to rate the request before finishing"
            );

        const evaluatorAlreadyRated = this._logs.some(
            (log) =>
                log.status === RequestStatus.RATED &&
                log.changedBy === evaluator
        );

        if (evaluatorAlreadyRated)
            throw new Error(
                "It's not possible to rate the request more than once"
            );

        this.saveLog(RequestStatus.RATED, evaluator);
    }
}
