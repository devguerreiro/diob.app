import User from "@/domain/user/entity/user";
import Provider from "@/domain/provider/entity/provider";
import ServiceRequest from "@/domain/service-request/entity/service-request";

import { ClientAddress } from "@/domain/client/value-object/client";

export default class Client {
  constructor(
    private _id: string,
    private _user: User,
    private _address: ClientAddress
  ) {
    this._user.validate();
  }

  get id(): string {
    return this._id;
  }

  get address(): ClientAddress {
    return this._address;
  }

  get user(): User {
    return this._user;
  }

  changeAddress(address: ClientAddress): void {
    this._address = address;
  }

  scheduleRequest(provider: Provider, when: Date): ServiceRequest {
    const serviceRequest = new ServiceRequest(this, provider, when);
    serviceRequest.schedule(this._user);
    return serviceRequest;
  }

  rescheduleRequest(serviceRequest: ServiceRequest, when: Date): void {
    serviceRequest.reschedule(this._user, when);
  }

  cancelRequest(serviceRequest: ServiceRequest, reason: string): void {
    serviceRequest.cancel(this._user, reason);
  }

  finishRequest(serviceRequest: ServiceRequest): void {
    serviceRequest.finish(this._user);
  }

  rateRequestProvider(serviceRequest: ServiceRequest, rating: number): void {
    this._user.rate(serviceRequest.provider.user, rating);
    serviceRequest.rate(this._user);
  }
}
