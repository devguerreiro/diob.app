import User from "@/domain/user/entity/user";

import ServiceRequest from "@/domain/service-request/entity/service-request";

import { Work, WorkJob } from "@/domain/work/work";

export default class Provider {
  constructor(
    private _id: string,
    private _user: User,
    private _works: Array<ProviderWork>
  ) {
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get works(): Array<ProviderWork> {
    return this._works;
  }

  get user(): User {
    return this._user;
  }

  validate(): void {
    this._user.validate();

    if (this._works.length === 0)
      throw new Error("Provider must have at least one work");
  }

  addWork(work: ProviderWork): void {
    const workIndex = this._works.findIndex((j) => j.id === work.id);

    if (workIndex !== -1)
      throw new Error("It's not possible to add the same work twice");

    this._works.push(work);
  }

  updateWork(workId: string, minCost: number): void {
    const work = this._works.find((work) => work.id === workId);

    if (!work)
      throw new Error("It's not possible to update a non-practicable work");

    work.changeMinCost(minCost);
  }

  removeWork(work: ProviderWork): void {
    const workIndex = this._works.findIndex((j) => j.id === work.id);

    if (workIndex === -1)
      throw new Error("It's not possible to remove a non-practicable work");

    this._works.splice(workIndex, 1);
  }

  confirmRequest(serviceRequest: ServiceRequest): void {
    serviceRequest.confirm(this._user);
  }

  refuseRequest(serviceRequest: ServiceRequest): void {
    serviceRequest.refuse(this._user);
  }

  startRequest(serviceRequest: ServiceRequest): void {
    serviceRequest.start(this._user);
  }

  finishRequest(serviceRequest: ServiceRequest): void {
    serviceRequest.finish(this._user);
  }

  rateRequestClient(serviceRequest: ServiceRequest, rating: number): void {
    this._user.rate(serviceRequest.client.user, rating);
    serviceRequest.rate(this._user);
  }
}

export class ProviderWork {
  constructor(
    private _id: string,
    private _minCost: number,
    private _jobs: Array<ProviderWorkJob>,
    private _work: Work
  ) {
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.work.name;
  }

  get minCost(): number {
    return this._minCost;
  }

  get totalCost(): number {
    const jobsTotal = this._jobs.reduce((total, job) => total + job.cost, 0);
    return Math.max(jobsTotal, this._minCost);
  }

  get jobs(): Array<ProviderWorkJob> {
    return this._jobs;
  }

  get work(): Work {
    return this._work;
  }

  validate(): void {
    if (this._jobs.length === 0)
      throw new Error("Provider work must have at least one job");
  }

  changeMinCost(minCost: number): void {
    this._minCost = minCost;
  }

  addJob(job: ProviderWorkJob): void {
    const jobIndex = this._jobs.findIndex((s) => s.id === job.id);

    if (jobIndex !== -1)
      throw new Error("It's not possible to add the same job twice");

    this._jobs.push(job);
  }

  updateJob(jobId: string, cost: number, estimatedDuration: number): void {
    const job = this._jobs.find((job) => job.id === jobId);

    if (!job)
      throw new Error("It's not possible to update a non-practicable job");

    job.changeCost(cost);
    job.changeEstimatedDuration(estimatedDuration);
  }

  removeJob(job: ProviderWorkJob): void {
    const jobIndex = this._jobs.findIndex((j) => j.id === job.id);

    if (jobIndex === -1)
      throw new Error("It's not possible to remove a non-practicable job");

    this._jobs.splice(jobIndex, 1);
  }
}

export class ProviderWorkJob {
  constructor(
    private _id: string,
    private _cost: number,
    private _estimatedDuration: number,
    private _workJob: WorkJob
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.workJob.name;
  }

  get cost(): number {
    return this._cost;
  }

  get estimatedDuration(): number {
    return this._estimatedDuration;
  }

  get workJob(): WorkJob {
    return this._workJob;
  }

  changeCost(cost: number): void {
    this._cost = cost;
  }

  changeEstimatedDuration(estimatedDuration: number): void {
    this._estimatedDuration = estimatedDuration;
  }
}
