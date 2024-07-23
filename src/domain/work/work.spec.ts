import {
  makeFakeWork,
  makeFakeWorkJob,
  makeFakeWorkWithoutJob,
} from "./work.spec.fixture";

describe("Work Entity", () => {
  it("should not be able to create if has no job", () => {
    expect(makeFakeWorkWithoutJob).toThrow("Work must have at least one job");
  });

  it("should be able to add a new job", () => {
    const work = makeFakeWork();

    expect(work.jobs.length).toEqual(1);

    const newJob = makeFakeWorkJob();

    work.addJob(newJob);

    expect(work.jobs.length).toEqual(2);
    expect(work.jobs[1]).toBe(newJob);
  });

  it("should not be able to add same job", () => {
    const work = makeFakeWork();
    const existingJob = work.jobs[0];

    expect(() => {
      work.addJob(existingJob);
    }).toThrow("It's not possible to add the same job twice");
  });

  it("should be able to remove a work", () => {
    const work = makeFakeWork();

    expect(work.jobs.length).toEqual(1);

    const newJob = makeFakeWorkJob();

    work.addJob(newJob);

    work.removeJob(work.jobs[0]);

    expect(work.jobs.length).toEqual(1);
    expect(work.jobs[0]).toBe(newJob);
  });

  it("should not be able to remove a non-practicable job", () => {
    const work = makeFakeWork();
    const newJob = makeFakeWorkJob();

    expect(() => {
      work.removeJob(newJob);
    }).toThrow("It's not possible to remove a non-practicable job");
  });
});
