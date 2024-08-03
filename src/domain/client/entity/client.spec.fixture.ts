import { v4 as uuidV4 } from "uuid";

import { UserDocument } from "@/domain/user/value-object/user";
import { ClientAddress } from "@/domain/client/value-object/client";

import Client from "./client";

import {
  makeFakeLegalAgeUserDOB,
  makeFakeUnderAgeUserDOB,
  makeFakeUserContact,
  makeFakeUserEmail,
} from "@/domain/user/entity/user.spec.fixture";
import User from "@/domain/user/entity/user";

export const makeFakeClientAddress = () => new ClientAddress("12345-678", 123);

export const makeFakeClient = () =>
  new Client(
    uuidV4(),
    new User(
      uuidV4(),
      "Client",
      new UserDocument("881.971.600-31"),
      makeFakeUserEmail(),
      makeFakeUserContact(),
      makeFakeLegalAgeUserDOB()
    ),
    makeFakeClientAddress()
  );

export const makeFakeUnderageClient = () =>
  new Client(
    uuidV4(),
    new User(
      uuidV4(),
      "Underage Client",
      new UserDocument("881.971.600-31"),
      makeFakeUserEmail(),
      makeFakeUserContact(),
      makeFakeUnderAgeUserDOB()
    ),
    makeFakeClientAddress()
  );
