import User from "@/domain/@shared/entity/user";
import LogInterface from "@/domain/@shared/interface/log";

import Client from "@/domain/client/entity/client";

import Provider from "@/domain/provider/entity/provider";

export enum StatusEnum {
  SCHEDULED = "SCHEDULED",
  RESCHEDULED = "RESCHEDULED",
  CANCELLED = "CANCELLED",
  CONFIRMED = "CONFIRMED",
  REFUSED = "REFUSED",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  RATED = "RATED",
}

export type Log = LogInterface<StatusEnum>;
type Logs = Array<Log>;

export default class ServiceRequest {
  private _logs: Logs = [];

  constructor(
    private _client: Client,
    private _provider: Provider,
    private _scheduled_at: Date,
    private _id: string | null = null
  ) {}

  get id(): string | null {
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
    return this.logs[this.logs.length - 1];
  }

  get when(): Date {
    return this._scheduled_at;
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
    } else if (this.logs.length > 0) {
      throw new Error("The request cannot be scheduled on current stage");
    }

    this.saveLog(StatusEnum.SCHEDULED, by);
  }

  reschedule(by: User, when: Date): void {
    if (by !== this._client) {
      throw new Error("Only the client can reschedule the request");
    } else if (
      ![StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED].includes(
        this.currentLog.status
      )
    ) {
      throw new Error("The request cannot be rescheduled on current stage");
    }

    this._scheduled_at = when;
    this.saveLog(StatusEnum.RESCHEDULED, by);
  }

  cancel(by: User, reason: string): void {
    if (by !== this._client) {
      throw new Error("Only the client can cancel the request");
    } else if (
      this.logs.some(
        (log) => log.status === StatusEnum.CANCELLED && log.by === by
      )
    ) {
      throw new Error("The request can only be canceled once");
    } else if (
      ![
        StatusEnum.SCHEDULED,
        StatusEnum.RESCHEDULED,
        StatusEnum.CONFIRMED,
      ].includes(this.currentLog.status)
    ) {
      throw new Error("The request cannot be canceled on current stage");
    }

    this.saveLog(StatusEnum.CANCELLED, by, reason);
  }

  confirm(by: User): void {
    if (by !== this._provider) {
      throw new Error("Only the provider can confirm the request");
    } else if (
      ![StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED].includes(
        this.currentLog.status
      )
    ) {
      throw new Error("The request cannot be confirmed on current stage");
    }

    this.saveLog(StatusEnum.CONFIRMED, by);
  }

  refuse(by: User): void {
    if (by !== this._provider) {
      throw new Error("Only the provider can refuse the request");
    } else if (
      ![StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED].includes(
        this.currentLog.status
      )
    ) {
      throw new Error("The request cannot be refused on current stage");
    }

    this.saveLog(StatusEnum.REFUSED, by);
  }

  start(by: User): void {
    if (by !== this._provider) {
      throw new Error("Only the provider can start the request");
    } else if (this.currentLog.status !== StatusEnum.CONFIRMED) {
      throw new Error("The request cannot be started on current stage");
    } else if (new Date() < this.when) {
      throw new Error(
        "The request can only be started after the scheduled date and time"
      );
    }

    this.saveLog(StatusEnum.STARTED, by);
  }

  finish(by: User): void {
    if (
      this.logs.some(
        (log) => log.status === StatusEnum.FINISHED && log.by === by
      )
    ) {
      throw new Error("The request can only be finished once");
    } else if (
      ![StatusEnum.STARTED, StatusEnum.FINISHED].includes(
        this.currentLog.status
      )
    ) {
      throw new Error("The request cannot be finished on current stage");
    } else this.saveLog(StatusEnum.FINISHED, by);
  }

  rate(by: User): void {
    if (
      this.logs.some((log) => log.status === StatusEnum.RATED && log.by === by)
    ) {
      throw new Error("The request can only be rated once");
    } else if (
      ![StatusEnum.FINISHED, StatusEnum.RATED].includes(this.currentLog.status)
    ) {
      throw new Error("The request cannot be rated on current stage");
    }

    this.saveLog(StatusEnum.RATED, by);
  }
}
