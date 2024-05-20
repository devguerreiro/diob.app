import { v4 as uuidV4 } from "uuid";

import ScheduledRequest from "./scheduled-request";

import { makeFakeClient } from "@/domain/client/entity/client.spec.fixture";
import {
    makeFakeProvider,
    makeFakeProviderWork,
} from "@/domain/provider/entity/provider.spec.fixture";

export const makeFakeScheduledRequest = () =>
    new ScheduledRequest(
        uuidV4(),
        makeFakeClient(),
        makeFakeProvider(),
        makeFakeProviderWork(),
        new Date()
    );
