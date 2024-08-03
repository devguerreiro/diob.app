import Client from "./client";

import {
  makeFakeUserContact,
  makeFakeUserEmail,
} from "@/domain/user/entity/user.spec.fixture";

import {
  makeFakeClient,
  makeFakeClientAddress,
  makeFakeUnderageClient,
} from "./client.spec.fixture";
import { makeFakeProvider } from "@/domain/provider/entity/provider.spec.fixture";
import ServiceRequest, {
  StatusEnum,
} from "@/domain/service-request/entity/service-request";
import {
  makeFakeServiceRequest,
  makeFakeServiceRequestLog,
} from "@/domain/service-request/entity/service-request.spec.fixture";

describe("Client Entity", () => {
  it("should not be underage", () => {
    expect(makeFakeUnderageClient).toThrow("User must not be underage");
  });

  it("should be able to create if legal age", () => {
    expect(makeFakeClient()).toBeInstanceOf(Client);
  });

  it("should be able to change its name", () => {
    const client = makeFakeClient();

    client.user.changeName("New Name");

    expect(client.user.name).toBe("New Name");
  });

  it("should be able to change its email", () => {
    const client = makeFakeClient();

    const newEmail = makeFakeUserEmail();
    client.user.changeEmail(newEmail);

    expect(client.user.email).toBe(newEmail);
  });

  it("should be able to change its contact", () => {
    const client = makeFakeClient();

    const newContact = makeFakeUserContact();
    client.user.changeContact(newContact);

    expect(client.user.contact).toBe(newContact);
  });

  it("should be able to change its address", () => {
    const client = makeFakeClient();

    const newAddress = makeFakeClientAddress();
    client.changeAddress(newAddress);

    expect(client.address).toBe(newAddress);
  });

  it("should be able to schedule a service request", () => {
    const client = makeFakeClient();
    const provider = makeFakeProvider();
    const when = new Date();

    const scheduledRequest = client.scheduleRequest(provider, when);

    expect(scheduledRequest.id).toBeNull();
    expect(scheduledRequest.client).toBe(client);
    expect(scheduledRequest.provider).toBe(provider);
    expect(scheduledRequest.when).toBe(when);
    expect(scheduledRequest.logs.length).toEqual(1);
    expect(scheduledRequest.logs[0].status).toEqual(StatusEnum.SCHEDULED);
    expect(scheduledRequest.logs[0].by).toEqual(client.user);
  });

  it("should be able to reschedule a service request", () => {
    const serviceRequest = makeFakeServiceRequest();
    const when = new Date();

    jest
      .spyOn(ServiceRequest.prototype, "logs", "get")
      .mockReturnValue([makeFakeServiceRequestLog()]);

    serviceRequest.client.rescheduleRequest(serviceRequest, when);

    jest.restoreAllMocks();

    expect(serviceRequest.when).toBe(when);
    expect(serviceRequest.logs.length).toEqual(1);
    expect(serviceRequest.logs[0].status).toEqual(StatusEnum.RESCHEDULED);
    expect(serviceRequest.logs[0].by).toEqual(serviceRequest.client.user);
  });

  it("should be able to cancel a service request", () => {
    const serviceRequest = makeFakeServiceRequest();
    const reason = "Changed my mind";

    jest
      .spyOn(ServiceRequest.prototype, "logs", "get")
      .mockReturnValue([makeFakeServiceRequestLog()]);

    serviceRequest.client.cancelRequest(serviceRequest, reason);

    jest.restoreAllMocks();

    expect(serviceRequest.logs.length).toEqual(1);
    expect(serviceRequest.logs[0].status).toEqual(StatusEnum.CANCELLED);
    expect(serviceRequest.logs[0].by).toEqual(serviceRequest.client.user);
    expect(serviceRequest.logs[0].reason).toEqual(reason);
  });

  it("should be able to finish a service request", () => {
    const serviceRequest = makeFakeServiceRequest();

    jest
      .spyOn(ServiceRequest.prototype, "logs", "get")
      .mockReturnValue([makeFakeServiceRequestLog(StatusEnum.STARTED)]);

    serviceRequest.client.finishRequest(serviceRequest);

    jest.restoreAllMocks();

    expect(serviceRequest.logs.length).toEqual(1);
    expect(serviceRequest.logs[0].status).toEqual(StatusEnum.FINISHED);
    expect(serviceRequest.logs[0].by).toEqual(serviceRequest.client.user);
  });

  it.each([1, 2, 3, 4, 5, 1.23])(
    "should be able to rate the service request provider",
    (rating) => {
      const serviceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "logs", "get")
        .mockReturnValue([makeFakeServiceRequestLog(StatusEnum.FINISHED)]);

      serviceRequest.client.rateRequestProvider(serviceRequest, rating);

      jest.restoreAllMocks();

      expect(serviceRequest.logs.length).toEqual(1);
      expect(serviceRequest.logs[0].status).toEqual(StatusEnum.RATED);
      expect(serviceRequest.logs[0].by).toEqual(serviceRequest.client.user);

      expect(serviceRequest.provider.user.rating).toEqual(rating);
    }
  );

  it.each([0, 6, 0.99, 5.01])(
    "should not be able to rate the service request provider",
    (rating) => {
      const serviceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "logs", "get")
        .mockReturnValue([makeFakeServiceRequestLog(StatusEnum.FINISHED)]);

      expect(() => {
        serviceRequest.client.rateRequestProvider(serviceRequest, rating);
      }).toThrow("Rating must be between 1 and 5");
    }
  );
});
