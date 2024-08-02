import User from "@/domain/@shared/entity/user";

import {
  UserContact,
  UserDocument,
  UserEmail,
} from "@/domain/@shared/value-object/user";

import { ClientAddress } from "@/domain/client/value-object/client";
import Provider from "@/domain/provider/entity/provider";
import ServiceRequest from "@/domain/service-request/entity/service-request";

export default class Client extends User {
  constructor(
    id: string,
    name: string,
    document: UserDocument,
    email: UserEmail,
    contact: UserContact,
    dob: Date,
    private _address: ClientAddress
  ) {
    super(id, name, document, email, contact, dob);

    this.validate();
  }

  get address(): ClientAddress {
    return this._address;
  }

  changeAddress(address: ClientAddress): void {
    this._address = address;
  }

  scheduleRequest(provider: Provider, when: Date): ServiceRequest {
    const serviceRequest = new ServiceRequest(this, provider, when);
    serviceRequest.schedule(this);
    return serviceRequest;
  }

  rescheduleRequest(serviceRequest: ServiceRequest, when: Date): void {
    serviceRequest.reschedule(this, when);
  }

  cancelRequest(serviceRequest: ServiceRequest, reason: string): void {
    serviceRequest.cancel(this, reason);
  }

  finishRequest(serviceRequest: ServiceRequest): void {
    serviceRequest.finish(this);
  }

  rateRequestProvider(serviceRequest: ServiceRequest, rating: number): void {
    this.rate(serviceRequest.provider, rating);
    serviceRequest.rate(this);
  }
}
