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
            throw new Error("Only the client can schedule the request");

        this.saveLog(ScheduledRequestStatus.SCHEDULED, this.client);
    }

    reschedule(user: User): void {
        if (this.currentLog.status !== ScheduledRequestStatus.SCHEDULED)
            throw new Error(
                "It's not possible to RESCHEDULE a not yet scheduled request"
            );
        else if (user !== this.client)
            throw new Error("Only the client can reschedule the request");

        this.saveLog(ScheduledRequestStatus.RESCHEDULED, user);
    }

    begin(user: User): void {
        super.begin(user, () => {
            if (this.when < new Date()) {
                throw new Error(
                    "It's not possible to begin the request before the scheduled date and time comes"
                );
            }
        });
    }
}
