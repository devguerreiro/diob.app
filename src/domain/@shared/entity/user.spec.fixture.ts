import dayjs from "dayjs";

import { UserContact, UserEmail } from "@/domain/@shared/value-object/user";

export const makeFakeUserEmail = () => new UserEmail("example@example.com");

export const makeFakeUserContact = () => new UserContact("(47) 98877-6655");

export const makeFakeLegalAgeUserDOB = () =>
    dayjs().subtract(25, "year").toDate();

export const makeFakeUnderAgeUserDOB = () =>
    dayjs().subtract(16, "year").toDate();
