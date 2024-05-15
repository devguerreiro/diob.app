import { faker } from "@faker-js/faker";

import { makeFakeClient } from "./client.spec.fixture";
import { makeFakeProvider } from "./provider.spec.fixture";

import JobRequest from "./request";

export const makeFakeJobRequest = () =>
    new JobRequest(faker.string.uuid(), makeFakeClient(), makeFakeProvider());
