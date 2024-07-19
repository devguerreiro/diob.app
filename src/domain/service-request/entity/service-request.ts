import User from "@/domain/@shared/entity/user";
import LogInterface from "@/domain/@shared/interface/log";

import Client from "@/domain/client/entity/client";

import Provider from "@/domain/provider/entity/provider";

export enum StatusEnum {
  CREATED = "CREATED",
  SCHEDULED = "SCHEDULED",
  RESCHEDULED = "RESCHEDULED",
  CANCELLED = "CANCELLED",
  CONFIRMED = "CONFIRMED",
  REFUSED = "REFUSED",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  RATED = "RATED",
}

type Log = LogInterface<StatusEnum>;
type Logs = Array<Log>;

export default class ServiceRequest {
  private _logs: Logs = [];

  constructor(
    private _id: string,
    private _client: Client,
    private _provider: Provider,
    private _scheduled_at: Date
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

  get logs(): Logs {
    return this._logs;
  }

  get currentLog(): Log {
    return this._logs[this._logs.length - 1];
  }

  get when(): Date {
    return this._scheduled_at;
  }

  private initialize(): void {
    this.saveLog(StatusEnum.CREATED, this._client);
  }

  private saveLog(status: StatusEnum, user: User, reason?: string): void {
    this._logs.push({
      status,
      by: user,
      at: new Date(),
      reason,
    });
  }

  schedule(by: User): void {
    if (by !== this._client) {
      throw new Error("Only the client can schedule the request");
    } else if (this.currentLog.status !== StatusEnum.CREATED) {
      throw new Error("The request can only be scheduled on CREATED stage");
    }

    this.saveLog(StatusEnum.SCHEDULED, by);
  }

  reschedule(by: User): void {
    if (by !== this._client) {
      throw new Error("Only the client can reschedule the request");
    } else if (
      [StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED].includes(
        this.currentLog.status
      )
    ) {
      throw new Error(
        "The request can only be rescheduled on SCHEDULED/RESCHEDULED stages"
      );
    }

    this.saveLog(StatusEnum.RESCHEDULED, by);
  }

  cancel(by: User, reason: string): void {
    if (by !== this._client) {
      throw new Error("Only the client can cancel the request");
    } else if (
      [StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED].includes(
        this.currentLog.status
      )
    ) {
      throw new Error(
        "The request can only be canceled on SCHEDULED/RESCHEDULED stages"
      );
    }

    this.saveLog(StatusEnum.CANCELLED, by, reason);
  }

  confirm(by: User): void {
    if (by !== this._provider) {
      throw new Error("Only the provider can confirm the request");
    } else if (
      [StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED].includes(
        this.currentLog.status
      )
    ) {
      throw new Error(
        "The request can only be confirmed on SCHEDULED/RESCHEDULED stages"
      );
    }

    this.saveLog(StatusEnum.CONFIRMED, by);
  }

  refuse(by: User): void {
    if (by !== this._provider) {
      throw new Error("Only the provider can refuse the request");
    } else if (
      [StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED].includes(
        this.currentLog.status
      )
    ) {
      throw new Error(
        "The request can only be refused on SCHEDULED/RESCHEDULED stages"
      );
    }

    this.saveLog(StatusEnum.REFUSED, by);
  }

  start(by: User): void {
    if (by !== this._provider) {
      throw new Error("Only the provider can start the request");
    } else if (this.currentLog.status !== StatusEnum.CONFIRMED) {
      throw new Error("The request can only be started on CONFIRMED stage");
    } else if (this._scheduled_at < new Date()) {
      throw new Error(
        "The request can only be started after the scheduled date and time"
      );
    }

    this.saveLog(StatusEnum.STARTED, by);
  }

  finish(by: User): void {
    if (this._logs.some((log) => log.status === StatusEnum.STARTED)) {
      throw new Error("The request can only be finished after STARTED stage");
    } else if (
      this._logs.some(
        (log) => log.status === StatusEnum.STARTED && log.by === by
      )
    ) {
      throw new Error("The request can only be finished once");
    }

    this.saveLog(StatusEnum.FINISHED, by);
  }

  rate(evaluator: User, evaluated: User, rating: number): void {
    if (this._logs.some((log) => log.status === StatusEnum.STARTED)) {
      throw new Error("The request can only be rated after FINISHED stage");
    } else if (
      this._logs.some(
        (log) => log.status === StatusEnum.STARTED && log.by === evaluator
      )
    ) {
      throw new Error("The request can only be rated once");
    }

    evaluator.rate(evaluated, rating);

    this.saveLog(StatusEnum.RATED, evaluator);
  }
}
