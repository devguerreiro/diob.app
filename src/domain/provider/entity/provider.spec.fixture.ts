import { v4 as uuidV4 } from "uuid";

import { UserDocument } from "@/domain/@shared/value-object/user";

import Provider, { ProviderWork, ProviderWorkJob } from "./provider";

import {
    makeFakeLegalAgeUserDOB,
    makeFakeUnderAgeUserDOB,
    makeFakeUserContact,
    makeFakeUserEmail,
} from "@/domain/@shared/entity/user.spec.fixture";

export const makeFakeProviderWorkJob = () =>
    new ProviderWorkJob(uuidV4(), "Work Job", 50);

export const makeFakeProviderWork = () =>
    new ProviderWork(uuidV4(), "Work", [makeFakeProviderWorkJob()], 100);

export const makeFakeProvider = () =>
    new Provider(
        uuidV4(),
        "Provider",
        new UserDocument("881.971.600-31"),
        makeFakeUserEmail(),
        makeFakeUserContact(),
        makeFakeLegalAgeUserDOB(),
        [makeFakeProviderWork()]
    );

export const makeFakeUnderageProvider = () =>
    new Provider(
        uuidV4(),
        "Underage Provider",
        new UserDocument("881.971.600-31"),
        makeFakeUserEmail(),
        makeFakeUserContact(),
        makeFakeUnderAgeUserDOB(),
        [makeFakeProviderWork()]
    );

export const makeFakeProviderWithoutWork = () =>
    new Provider(
        uuidV4(),
        "Provider Without Work",
        new UserDocument("881.971.600-31"),
        makeFakeUserEmail(),
        makeFakeUserContact(),
        makeFakeLegalAgeUserDOB(),
        []
    );

export const makeFakeProviderWorkWithoutJob = () =>
    new ProviderWork(uuidV4(), "Provider Work Without Job", [], 100);
