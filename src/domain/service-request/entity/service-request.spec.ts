import dayjs from "dayjs";

import ServiceRequest, { StatusEnum } from "./service-request";
import { makeFakeServiceRequest } from "./service-request.spec.fixture";

const makeServiceRequestReadyToBegin = () => {
  const now = new Date();
  jest.spyOn(ServiceRequest.prototype, "when", "get").mockReturnValue(now);
  jest.useFakeTimers().setSystemTime(now);
};

describe("ServiceRequest Entity", () => {
  it("should initialize the scheduled request on creation", () => {
    const newServiceRequest = makeFakeServiceRequest();

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.CREATED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client);
    expect(newServiceRequest.currentLog.at).toBeDefined();
  });

  // it("should calculate the total amount of the scheduled request", () => {
  //   const newServiceRequest = makeFakeServiceRequest();

  //   expect(newServiceRequest.totalCost).toEqual(
  //     newServiceRequest.work.totalCost
  //   );
  // });

  // SCHEDULING

  it("should be able to the client schedule the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    expect(newServiceRequest.logs.length).toEqual(2);
    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.SCHEDULED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client);
    expect(newServiceRequest.currentLog.at).toBeDefined();
  });

  it("should not be able to schedule the request if not the client", () => {
    const newServiceRequest = makeFakeServiceRequest();

    expect(() => {
      newServiceRequest.schedule(newServiceRequest.provider);
    }).toThrow("Only the client can schedule the request");
  });

  it("should not be able to schedule the request if not on CREATED stage", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    expect(() => {
      newServiceRequest.schedule(newServiceRequest.client);
    }).toThrow("The request can only be scheduled on CREATED stage");
  });

  // RESCHEDULING

  it("should be able to the client reschedule the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.reschedule(newServiceRequest.client);

    newServiceRequest.reschedule(newServiceRequest.client);

    expect(newServiceRequest.logs.length).toEqual(4);
    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.RESCHEDULED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client);
    expect(newServiceRequest.currentLog.at).toBeDefined();
  });

  it("should not be able to reschedule the request if not the client", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    expect(() => {
      newServiceRequest.reschedule(newServiceRequest.provider);
    }).toThrow("Only the client can reschedule the request");
  });

  it("should not be able to reschedule the request if not on SCHEDULED or RESCHEDULED stages", () => {
    const newServiceRequest = makeFakeServiceRequest();

    expect(() => {
      newServiceRequest.reschedule(newServiceRequest.client);
    }).toThrow(
      "The request can only be rescheduled on SCHEDULED/RESCHEDULED stages"
    );
  });

  // CANCELLING

  it("should be able to the client cancel the request before the provider starts", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.cancel(newServiceRequest.client, "foo");

    expect(newServiceRequest.logs.length).toEqual(3);
    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.CANCELLED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client);
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toEqual("foo");
  });

  it("should be able to the client cancel the request before the provider starts and after rescheduled", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.reschedule(newServiceRequest.client);

    newServiceRequest.cancel(newServiceRequest.client, "foo");

    expect(newServiceRequest.logs.length).toEqual(4);
    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.CANCELLED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client);
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toEqual("foo");
  });

  it("should be able to the client cancel the request before the provider starts and after confirmed", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.reschedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    newServiceRequest.cancel(newServiceRequest.client, "foo");

    expect(newServiceRequest.logs.length).toEqual(5);
    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.CANCELLED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client);
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toEqual("foo");
  });

  it("should not be able to the client cancel the request after started", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    makeServiceRequestReadyToBegin();

    newServiceRequest.start(newServiceRequest.provider);

    expect(() => {
      newServiceRequest.cancel(newServiceRequest.client, "foo");
    }).toThrow(
      "The request can only be canceled on SCHEDULED/RESCHEDULED/CONFIRMED stages"
    );
  });

  it("should not be able to the provider cancel the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    expect(() => {
      newServiceRequest.cancel(newServiceRequest.provider, "foo");
    }).toThrow("Only the client can cancel the request");
  });

  // BEGINNING

  it("should be able to the provider start the request if on CONFIRMED stage", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    makeServiceRequestReadyToBegin();

    newServiceRequest.start(newServiceRequest.provider);

    expect(newServiceRequest.logs.length).toEqual(4);
    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.STARTED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.provider);
    expect(newServiceRequest.currentLog.at).toBeDefined();
  });

  it("should not be able to the provider starts the request if not on CONFIRMED stage", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.reschedule(newServiceRequest.client);

    makeServiceRequestReadyToBegin();

    expect(() => {
      newServiceRequest.start(newServiceRequest.provider);
    }).toThrow("The request can only be started on CONFIRMED stage");
  });

  it("should not be able to start the request if are not the provider", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    expect(() => {
      newServiceRequest.start(newServiceRequest.client);
    }).toThrow("Only the provider can start the request");
  });

  it("should not be able to the provider start the request before the scheduled date and time", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    const now = new Date();
    const now1SecondAgo = dayjs(now).subtract(1, "second").toDate();

    jest.spyOn(ServiceRequest.prototype, "when", "get").mockReturnValue(now);
    jest.useFakeTimers().setSystemTime(now1SecondAgo);

    expect(() => {
      newServiceRequest.start(newServiceRequest.provider);
    }).toThrow(
      "The request can only be started after the scheduled date and time"
    );
  });

  // FINISHING

  it("should be able to the provider finish the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    makeServiceRequestReadyToBegin();

    newServiceRequest.start(newServiceRequest.provider);

    newServiceRequest.finish(newServiceRequest.provider);

    expect(newServiceRequest.logs.length).toEqual(5);
    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.FINISHED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.provider);
    expect(newServiceRequest.currentLog.at).toBeDefined();
  });

  it("should be able to the client finish the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    makeServiceRequestReadyToBegin();

    newServiceRequest.start(newServiceRequest.provider);

    newServiceRequest.finish(newServiceRequest.client);

    expect(newServiceRequest.logs.length).toEqual(5);
    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.FINISHED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client);
    expect(newServiceRequest.currentLog.at).toBeDefined();
  });

  it("should not be able to the client finish the request before starting", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    expect(() => {
      newServiceRequest.finish(newServiceRequest.client);
    }).toThrow("The request can only be finished on STARTED/FINISHED stages");
  });

  it("should not be able to the client finish the request more than once", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    newServiceRequest.start(newServiceRequest.provider);

    newServiceRequest.finish(newServiceRequest.client);

    expect(() => {
      newServiceRequest.finish(newServiceRequest.client);
    }).toThrow("The request can only be finished once");
  });

  it("should not be able to the provider finish the request before starting", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    expect(() => {
      newServiceRequest.finish(newServiceRequest.provider);
    }).toThrow("The request can only be finished on STARTED/FINISHED stages");
  });

  it("should not be able to the provider finish the request more than once", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    newServiceRequest.start(newServiceRequest.provider);

    newServiceRequest.finish(newServiceRequest.provider);

    expect(() => {
      newServiceRequest.finish(newServiceRequest.provider);
    }).toThrow("The request can only be finished once");
  });

  // RATING

  it("should be able to the client rate the request provider", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    makeServiceRequestReadyToBegin();

    newServiceRequest.confirm(newServiceRequest.provider);

    newServiceRequest.start(newServiceRequest.provider);

    newServiceRequest.finish(newServiceRequest.client);

    const spiedMethod = jest.spyOn(newServiceRequest.client, "rate");

    newServiceRequest.rate(
      newServiceRequest.client,
      newServiceRequest.provider,
      5
    );

    expect(newServiceRequest.logs.length).toEqual(6);
    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.RATED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client);
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(spiedMethod).toHaveBeenCalledWith(newServiceRequest.provider, 5);
  });

  it("should be able to the provider rate the request client", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    makeServiceRequestReadyToBegin();

    newServiceRequest.confirm(newServiceRequest.provider);

    newServiceRequest.start(newServiceRequest.provider);

    newServiceRequest.finish(newServiceRequest.provider);

    const spiedMethod = jest.spyOn(newServiceRequest.provider, "rate");

    newServiceRequest.rate(
      newServiceRequest.provider,
      newServiceRequest.client,
      5
    );

    expect(newServiceRequest.logs.length).toEqual(6);
    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.RATED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.provider);
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(spiedMethod).toHaveBeenCalledWith(newServiceRequest.client, 5);
  });

  it("should not be able to the client rate the request provider before finishing", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    makeServiceRequestReadyToBegin();

    newServiceRequest.start(newServiceRequest.provider);

    expect(() => {
      newServiceRequest.rate(
        newServiceRequest.client,
        newServiceRequest.provider,
        5
      );
    }).toThrow("The request can only be rated on FINISHED/RATED stages");
  });

  it("should not be able to the client rate more than once", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    makeServiceRequestReadyToBegin();

    newServiceRequest.start(newServiceRequest.provider);

    newServiceRequest.finish(newServiceRequest.client);

    newServiceRequest.rate(
      newServiceRequest.client,
      newServiceRequest.provider,
      5
    );

    expect(() => {
      newServiceRequest.rate(
        newServiceRequest.client,
        newServiceRequest.provider,
        5
      );
    }).toThrow("The request can only be rated once");
  });

  it("should not be able to the provider rate the request client before finishing", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    makeServiceRequestReadyToBegin();

    newServiceRequest.start(newServiceRequest.provider);

    expect(() => {
      newServiceRequest.rate(
        newServiceRequest.provider,
        newServiceRequest.client,
        5
      );
    }).toThrow("The request can only be rated on FINISHED/RATED stages");
  });

  it("should not be able to the provider rate more than once", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client);

    newServiceRequest.confirm(newServiceRequest.provider);

    makeServiceRequestReadyToBegin();

    newServiceRequest.start(newServiceRequest.provider);

    newServiceRequest.finish(newServiceRequest.provider);

    newServiceRequest.rate(
      newServiceRequest.provider,
      newServiceRequest.client,
      5
    );

    expect(() => {
      newServiceRequest.rate(
        newServiceRequest.provider,
        newServiceRequest.client,
        5
      );
    }).toThrow("The request can only be rated once");
  });
});
