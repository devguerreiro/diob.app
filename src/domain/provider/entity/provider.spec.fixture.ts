import { faker } from "@faker-js/faker";

import { UserDocument } from "@/domain/@shared/value-object/user";

import Provider, { ProviderWork, ProviderWorkJob } from "./provider";

import {
    makeFakeLegalAgeUserDOB,
    makeFakeUnderAgeUserDOB,
    makeFakeUserContact,
    makeFakeUserEmail,
} from "@/domain/@shared/entity/user.spec.fixture";

export const makeFakeProviderWorkJob = () =>
    new ProviderWorkJob(
        faker.string.uuid(),
        faker.word.noun(),
        faker.number.float()
    );

export const makeFakeProviderWork = () =>
    new ProviderWork(
        faker.string.uuid(),
        faker.word.noun(),
        [makeFakeProviderWorkJob()],
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
        [makeFakeProviderWork()]
    );

export const makeFakeUnderageProvider = () =>
    new Provider(
        faker.string.uuid(),
        faker.person.fullName(),
        new UserDocument("881.971.600-31"),
        makeFakeUserEmail(),
        makeFakeUserContact(),
        makeFakeUnderAgeUserDOB(),
        [makeFakeProviderWork()]
    );

export const makeFakeProviderWithoutWork = () =>
    new Provider(
        faker.string.uuid(),
        faker.person.fullName(),
        new UserDocument("881.971.600-31"),
        makeFakeUserEmail(),
        makeFakeUserContact(),
        makeFakeLegalAgeUserDOB(),
        []
    );

export const makeFakeProviderWorkWithoutJob = () =>
    new ProviderWork(
        faker.string.uuid(),
        faker.word.noun(),
        [],
        faker.number.float()
    );
