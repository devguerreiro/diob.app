import dayjs from "dayjs";
import { faker } from "@faker-js/faker";

import { UserContact, UserEmail } from "@/domain/@shared/value-object/user";

export const makeFakeUserEmail = () => new UserEmail(faker.internet.email());

export const makeFakeUserContact = () =>
    new UserContact(faker.helpers.fromRegExp("([0-9]{2}) 9[0-9]{4}-[0-9]{4}"));

export const makeFakeLegalAgeUserDOB = () =>
    dayjs()
        .subtract(faker.number.int({ min: 18, max: 80 }), "year")
        .toDate();

export const makeFakeUnderAgeUserDOB = () =>
    dayjs()
        .subtract(faker.number.int({ min: 12, max: 17 }), "year")
        .toDate();
