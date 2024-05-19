import Client from "@/domain/client/entity/client";
import Provider, { ProviderWork } from "@/domain/provider/entity/provider";
import User from "@/domain/@shared/entity/user";

import Request, { RequestStatus } from "./request";
import {
    onlyClient,
    requireStage,
    requireStages,
    requireStatus,
} from "./request.decorators";

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

    @onlyClient("Only the client should schedule the request")
    @requireStage<ScheduledRequestStatus>(
        RequestStatus.CREATED,
        "It's not possible to schedule the request if not on CREATED stage"
    )
    schedule(user: User): void {
        this.saveLog(ScheduledRequestStatus.SCHEDULED, this.client);
    }

    @onlyClient("Only the client should reschedule the request")
    @requireStages<ScheduledRequestStatus>(
        [ScheduledRequestStatus.SCHEDULED, ScheduledRequestStatus.RESCHEDULED],
        "It's not possible to reschedule the request if not on SCHEDULED or RESCHEDULED stage"
    )
    reschedule(user: User): void {
        this.saveLog(ScheduledRequestStatus.RESCHEDULED, user);
    }

    @requireStages<ScheduledRequestStatus>(
        [ScheduledRequestStatus.SCHEDULED, ScheduledRequestStatus.RESCHEDULED],
        "It's not possible to begin the request if not on SCHEDULED or RESCHEDULED stage"
    )
    begin(user: User): void {
        if (this.when < new Date()) {
            throw new Error(
                "It's not possible to begin the request before the scheduled date and time comes"
            );
        }

        super.begin(user);
    }

    @requireStatus<ScheduledRequestStatus>(
        ScheduledRequestStatus.SCHEDULED,
        "It's not possible to cancel the request before scheduling"
    )
    cancel(user: User, reason: string): void {
        super.cancel(user, reason);
    }
}
