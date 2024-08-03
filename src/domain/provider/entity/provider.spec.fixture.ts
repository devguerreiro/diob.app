import { v4 as uuidV4 } from "uuid";

import { UserDocument } from "@/domain/user/value-object/user";

import Provider, { ProviderWork, ProviderWorkJob } from "./provider";

import {
  makeFakeLegalAgeUserDOB,
  makeFakeUnderAgeUserDOB,
  makeFakeUserContact,
  makeFakeUserEmail,
} from "@/domain/user/entity/user.spec.fixture";
import { makeFakeWorkJob, makeFakeWork } from "@/domain/work/work.spec.fixture";
import User from "@/domain/user/entity/user";

export const makeFakeProviderWorkJob = () =>
  new ProviderWorkJob(uuidV4(), 50, 60, makeFakeWorkJob());

export const makeFakeProviderWork = () => {
  const fakeWork = makeFakeWork();
  const fakeWorkJobs = fakeWork.jobs.map(
    (job) => new ProviderWorkJob(uuidV4(), 50, 60, job)
  );
  return new ProviderWork(uuidV4(), 100, fakeWorkJobs, fakeWork);
};

export const makeFakeProvider = () =>
  new Provider(
    uuidV4(),
    new User(
      uuidV4(),
      "Provider",
      new UserDocument("881.971.600-31"),
      makeFakeUserEmail(),
      makeFakeUserContact(),
      makeFakeLegalAgeUserDOB()
    ),
    [makeFakeProviderWork()]
  );

export const makeFakeUnderageProvider = () =>
  new Provider(
    uuidV4(),
    new User(
      uuidV4(),
      "Underage Provider",
      new UserDocument("881.971.600-31"),
      makeFakeUserEmail(),
      makeFakeUserContact(),
      makeFakeUnderAgeUserDOB()
    ),
    [makeFakeProviderWork()]
  );

export const makeFakeProviderWithoutWork = () =>
  new Provider(
    uuidV4(),
    new User(
      uuidV4(),
      "Provider Without Work",
      new UserDocument("881.971.600-31"),
      makeFakeUserEmail(),
      makeFakeUserContact(),
      makeFakeLegalAgeUserDOB()
    ),
    []
  );

export const makeFakeProviderWorkWithoutJob = () =>
  new ProviderWork(uuidV4(), 100, [], makeFakeWork());
