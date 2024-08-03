import { v4 as uuidV4 } from "uuid";

import dayjs from "dayjs";

import {
  UserContact,
  UserDocument,
  UserEmail,
} from "@/domain/user/value-object/user";

import User from "./user";

export const makeFakeUserEmail = () => new UserEmail("example@example.com");

export const makeFakeUserContact = () => new UserContact("(47) 98877-6655");

export const makeFakeLegalAgeUserDOB = () =>
  dayjs().subtract(25, "year").toDate();

export const makeFakeUnderAgeUserDOB = () =>
  dayjs().subtract(16, "year").toDate();

export const makeFakeUser = () =>
  new User(
    uuidV4(),
    "User",
    new UserDocument("881.971.600-31"),
    makeFakeUserEmail(),
    makeFakeUserContact(),
    makeFakeLegalAgeUserDOB()
  );
