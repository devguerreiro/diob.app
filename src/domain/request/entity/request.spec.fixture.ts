import { faker } from "@faker-js/faker";

import JobRequest from "./request";

import { makeFakeClient } from "@/domain/client/entity/client.spec.fixture";
import { makeFakeProvider } from "@/domain/provider/entity/provider.spec.fixture";

export const makeFakeJobRequest = () =>
    new JobRequest(faker.string.uuid(), makeFakeClient(), makeFakeProvider());
