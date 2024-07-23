export class Work {
  constructor(
    private _id: string,
    private _name: string,
    private _jobs: Array<WorkJob>
  ) {
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get jobs(): Array<WorkJob> {
    return this._jobs;
  }

  validate(): void {
    if (this._jobs.length === 0)
      throw new Error("Work must have at least one job");
  }

  addJob(job: WorkJob): void {
    const jobIndex = this._jobs.findIndex((s) => s.id === job.id);

    if (jobIndex !== -1)
      throw new Error("It's not possible to add the same job twice");

    this._jobs.push(job);
  }

  removeJob(job: WorkJob): void {
    const jobIndex = this._jobs.findIndex((j) => j.id === job.id);

    if (jobIndex === -1)
      throw new Error("It's not possible to remove a non-practicable job");

    this._jobs.splice(jobIndex, 1);
  }
}

export class WorkJob {
  constructor(private _id: string, private _name: string) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
