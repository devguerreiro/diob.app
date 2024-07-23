import { v4 as uuidV4 } from "uuid";

import { Work, WorkJob } from "./work";

export const makeFakeWorkJob = () => new WorkJob(uuidV4(), "Work Job");

export const makeFakeWork = () =>
  new Work(uuidV4(), "Work", [makeFakeWorkJob()]);

export const makeFakeWorkWithoutJob = () =>
  new Work(uuidV4(), "Work without job", []);
