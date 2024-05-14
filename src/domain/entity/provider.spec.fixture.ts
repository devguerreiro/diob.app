import { faker } from "@faker-js/faker";

import { UserDocument } from "../value-object/user";

import Provider, { ProviderJob, ProviderJobService } from "./provider";

import {
    makeFakeLegalAgeUserDOB,
    makeFakeUnderAgeUserDOB,
    makeFakeUserContact,
    makeFakeUserEmail,
} from "./user.spec.fixture";

export const makeFakeProviderJobService = () =>
    new ProviderJobService(
        faker.string.uuid(),
        faker.word.noun(),
        faker.number.float()
    );

export const makeFakeProviderJob = () =>
    new ProviderJob(
        faker.string.uuid(),
        faker.word.noun(),
        [makeFakeProviderJobService()],
        faker.number.float()
    );

export const makeFakeProvider = () =>
    new Provider(
        faker.string.uuid(),
        faker.person.fullName(),
        new UserDocument("881.971.600-31"),
        makeFakeUserEmail(),
        makeFakeUserContact(),
        makeFakeLegalAgeUserDOB(),
        [makeFakeProviderJob()]
    );

export const makeFakeUnderageProvider = () =>
    new Provider(
        faker.string.uuid(),
        faker.person.fullName(),
        new UserDocument("881.971.600-31"),
        makeFakeUserEmail(),
        makeFakeUserContact(),
        makeFakeUnderAgeUserDOB(),
        [makeFakeProviderJob()]
    );

export const makeFakeProviderWithoutJob = () =>
    new Provider(
        faker.string.uuid(),
        faker.person.fullName(),
        new UserDocument("881.971.600-31"),
        makeFakeUserEmail(),
        makeFakeUserContact(),
        makeFakeLegalAgeUserDOB(),
        []
    );

export const makeFakeProviderJobWithoutService = () =>
    new ProviderJob(
        faker.string.uuid(),
        faker.word.noun(),
        [],
        faker.number.float()
    );
