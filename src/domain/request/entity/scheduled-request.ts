import Client from "@/domain/client/entity/client";
import Provider, { ProviderWork } from "@/domain/provider/entity/provider";
import User from "@/domain/@shared/entity/user";

import Request, { RequestStatus } from "./request";

export enum ScheduledRequestStatus {
    SCHEDULED = "SCHEDULED",
    RESCHEDULED = "RESCHEDULED",
}

export default class ScheduledRequest extends Request<ScheduledRequestStatus> {
    constructor(
        id: string,
        client: Client,
        provider: Provider,
        work: ProviderWork,
        private _when: Date
    ) {
        super(id, client, provider, work);
    }

    get when(): Date {
        return this._when;
    }

    schedule(user: User): void {
        if (user !== this.client)
            throw new Error("Only the client should schedule the request");
        else if (this.currentLog.status !== RequestStatus.CREATED)
            throw new Error(
                "It's not possible to schedule the request if not on CREATED stage"
            );

        this.saveLog(ScheduledRequestStatus.SCHEDULED, this.client);
    }

    reschedule(user: User): void {
        if (
            this.currentLog.status !== ScheduledRequestStatus.SCHEDULED &&
            this.currentLog.status !== ScheduledRequestStatus.RESCHEDULED
        )
            throw new Error(
                "It's not possible to reschedule the request if not on SCHEDULED or RESCHEDULED stage"
            );
        else if (user !== this.client)
            throw new Error("Only the client should reschedule the request");

        this.saveLog(ScheduledRequestStatus.RESCHEDULED, user);
    }

    begin(user: User): void {
        super.begin(user, () => {
            if (
                this.currentLog.status !== ScheduledRequestStatus.SCHEDULED &&
                this.currentLog.status !== ScheduledRequestStatus.RESCHEDULED
            )
                throw new Error(
                    "It's not possible to begin the request if not on SCHEDULED or RESCHEDULED stage"
                );
            else if (this.when < new Date()) {
                throw new Error(
                    "It's not possible to begin the request before the scheduled date and time comes"
                );
            }
        });
    }

    cancel(user: User): void {
        super.cancel(user, () => {
            if (
                !this.logs.some(
                    (log) => log.status === ScheduledRequestStatus.SCHEDULED
                )
            )
                throw new Error(
                    "It's not possible to cancel the request before scheduling"
                );
        });
    }
}
