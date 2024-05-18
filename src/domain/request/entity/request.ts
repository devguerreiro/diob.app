import User from "@/domain/@shared/entity/user";
import LogInterface from "@/domain/@shared/interface/log";
import Client from "@/domain/client/entity/client";
import Provider, { ProviderWork } from "@/domain/provider/entity/provider";
import {
    requireStatus,
    requireStatusByUser,
    statusExistsByUser,
    statusExists,
    onlyProvider,
    requireStatusByUserAndProvider,
} from "./request.decorators";

export enum RequestStatus {
    CREATED = "CREATED",
    BEGAN = "BEGAN",
    CANCELLED = "CANCELLED",
    FINISHED = "FINISHED",
    RATED = "RATED",
}

export type TRequestStatus<T> = RequestStatus | T;

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

    @statusExists<T>(
        RequestStatus.CANCELLED,
        "It's not possible to cancel the request more than once"
    )
    @statusExists<T>(
        RequestStatus.FINISHED,
        "It's not possible to cancel the request after finished"
    )
    @requireStatusByUserAndProvider<T>(
        RequestStatus.BEGAN,
        "It's not possible to cancel the request before beginning"
    )
    cancel(user: User): void {
        this.saveLog(RequestStatus.CANCELLED, user);
    }

    @onlyProvider("Only the provider should begin the request")
    begin(user: User): void {
        this.saveLog(RequestStatus.BEGAN, user);
    }

    @requireStatus<T>(
        RequestStatus.BEGAN,
        "It's not possible to finish the request before beginning"
    )
    @statusExists<T>(
        RequestStatus.CANCELLED,
        "It's not possible to finish the request after cancelled"
    )
    @statusExistsByUser<T>(
        RequestStatus.FINISHED,
        "It's not possible to finish the request more than once"
    )
    finish(user: User): void {
        this.saveLog(RequestStatus.FINISHED, user);
    }

    @statusExistsByUser<T>(
        RequestStatus.RATED,
        "It's not possible to rate the request more than once"
    )
    @requireStatusByUser<T>(
        RequestStatus.FINISHED,
        "It's not possible to rate the request before finishing"
    )
    rate(evaluator: User): void {
        this.saveLog(RequestStatus.RATED, evaluator);
    }
}
