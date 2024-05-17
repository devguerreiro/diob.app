import { faker } from "@faker-js/faker";

import ScheduledRequest from "./scheduled-request";

import { makeFakeClient } from "@/domain/client/entity/client.spec.fixture";
import {
    makeFakeProvider,
    makeFakeProviderWork,
} from "@/domain/provider/entity/provider.spec.fixture";

export const makeFakeScheduledRequest = () =>
    new ScheduledRequest(
        faker.string.uuid(),
        makeFakeClient(),
        makeFakeProvider(),
        makeFakeProviderWork(),
        new Date()
    );
