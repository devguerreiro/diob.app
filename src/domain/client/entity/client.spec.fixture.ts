import { faker } from "@faker-js/faker";

import { UserDocument } from "@/domain/@shared/value-object/user";
import { ClientAddress } from "@/domain/client/value-object/client";

import Client from "./client";

import {
    makeFakeLegalAgeUserDOB,
    makeFakeUnderAgeUserDOB,
    makeFakeUserContact,
    makeFakeUserEmail,
} from "@/domain/@shared/entity/user.spec.fixture";

export const makeFakeClientAddress = () =>
    new ClientAddress(
        faker.helpers.fromRegExp("[0-9]{5}-[0-9]{3}"),
        faker.number.int()
    );

export const makeFakeClient = () =>
    new Client(
        faker.string.uuid(),
        faker.person.fullName(),
        new UserDocument("881.971.600-31"),
        makeFakeUserEmail(),
        makeFakeUserContact(),
        makeFakeLegalAgeUserDOB(),
        makeFakeClientAddress()
    );

export const makeFakeUnderageClient = () =>
    new Client(
        faker.string.uuid(),
        faker.person.fullName(),
        new UserDocument("881.971.600-31"),
        makeFakeUserEmail(),
        makeFakeUserContact(),
        makeFakeUnderAgeUserDOB(),
        makeFakeClientAddress()
    );
