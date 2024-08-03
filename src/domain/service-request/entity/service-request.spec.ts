import dayjs from "dayjs";

import ServiceRequest, { StatusEnum } from "./service-request";
import { makeFakeServiceRequest } from "./service-request.spec.fixture";

const makeServiceRequestReadyToStart = () => {
  const now = new Date();
  jest.spyOn(ServiceRequest.prototype, "when", "get").mockReturnValue(now);
  jest.useFakeTimers().setSystemTime(now);
};

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("ServiceRequest Entity", () => {
  // SCHEDULING

  it("should be able to the client schedule the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    expect(newServiceRequest.logs.length).toEqual(1);

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.SCHEDULED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client.user);
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toBeUndefined();
  });

  it("should not be able to schedule the request if not the client", () => {
    const newServiceRequest = makeFakeServiceRequest();

    expect(() => {
      newServiceRequest.schedule(newServiceRequest.provider.user);
    }).toThrow("Only the client can schedule the request");
  });

  it.each([
    StatusEnum.SCHEDULED,
    StatusEnum.RESCHEDULED,
    StatusEnum.CANCELLED,
    StatusEnum.CONFIRMED,
    StatusEnum.REFUSED,
    StatusEnum.STARTED,
    StatusEnum.FINISHED,
    StatusEnum.RATED,
  ])(
    "should not be able to client schedule the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest.spyOn(ServiceRequest.prototype, "logs", "get").mockReturnValue([
        {
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        },
      ]);

      expect(() => {
        newServiceRequest.schedule(newServiceRequest.client.user);
      }).toThrow("The request cannot be scheduled on current stage");
    }
  );

  // RESCHEDULING

  it("should be able to the client reschedule the request", () => {
    const newServiceRequest = makeFakeServiceRequest();
    const when = new Date();

    newServiceRequest.schedule(newServiceRequest.client.user);

    newServiceRequest.reschedule(newServiceRequest.client.user, when);

    expect(newServiceRequest.when).toEqual(when);

    expect(newServiceRequest.logs.length).toEqual(2);

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.RESCHEDULED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client.user);
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toBeUndefined();
  });

  it("should not be able to reschedule the request if not the client", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    expect(() => {
      newServiceRequest.reschedule(newServiceRequest.provider.user, new Date());
    }).toThrow("Only the client can reschedule the request");
  });

  it.each([StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED])(
    "should be able to client reschedule the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();
      const when = new Date();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      newServiceRequest.reschedule(newServiceRequest.client.user, when);

      jest.restoreAllMocks();

      expect(newServiceRequest.when).toEqual(when);

      expect(newServiceRequest.logs.length).toEqual(1);

      expect(newServiceRequest.currentLog.status).toBe(StatusEnum.RESCHEDULED);
      expect(newServiceRequest.currentLog.by).toBe(
        newServiceRequest.client.user
      );
      expect(newServiceRequest.currentLog.at).toBeDefined();
      expect(newServiceRequest.currentLog.reason).toBeUndefined();
    }
  );

  it.each([
    StatusEnum.CANCELLED,
    StatusEnum.CONFIRMED,
    StatusEnum.REFUSED,
    StatusEnum.STARTED,
    StatusEnum.FINISHED,
    StatusEnum.RATED,
  ])(
    "should not be able to client reschedule the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      expect(() => {
        newServiceRequest.reschedule(newServiceRequest.client.user, new Date());
      }).toThrow("The request cannot be rescheduled on current stage");
    }
  );

  // CANCELLING

  it("should be able to the client cancel the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    newServiceRequest.cancel(newServiceRequest.client.user, "foo");

    expect(newServiceRequest.logs.length).toEqual(2);

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.CANCELLED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client.user);
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toEqual("foo");
  });

  it("should not be able to cancel the request if not the client", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    expect(() => {
      newServiceRequest.cancel(newServiceRequest.provider.user, "foo");
    }).toThrow("Only the client can cancel the request");
  });

  it.each([StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED, StatusEnum.CONFIRMED])(
    "should be able to client cancel the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      newServiceRequest.cancel(newServiceRequest.client.user, "foo");

      jest.restoreAllMocks();

      expect(newServiceRequest.logs.length).toEqual(1);

      expect(newServiceRequest.currentLog.status).toBe(StatusEnum.CANCELLED);
      expect(newServiceRequest.currentLog.by).toBe(
        newServiceRequest.client.user
      );
      expect(newServiceRequest.currentLog.at).toBeDefined();
      expect(newServiceRequest.currentLog.reason).toEqual("foo");
    }
  );

  it.each([
    StatusEnum.REFUSED,
    StatusEnum.STARTED,
    StatusEnum.FINISHED,
    StatusEnum.RATED,
  ])(
    "should not be able to client cancel the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      expect(() => {
        newServiceRequest.cancel(newServiceRequest.client.user, "foo");
      }).toThrow("The request cannot be canceled on current stage");
    }
  );

  it("should not be able to the client cancel the request twice", () => {
    const newServiceRequest = makeFakeServiceRequest();

    jest.spyOn(ServiceRequest.prototype, "logs", "get").mockReturnValue([
      {
        status: StatusEnum.CANCELLED,
        by: newServiceRequest.client.user,
        at: new Date(),
      },
    ]);

    expect(() => {
      newServiceRequest.cancel(newServiceRequest.client.user, "foo");
    }).toThrow("The request can only be canceled once");
  });

  // CONFIRMING

  it("should be able to the provider confirm the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    newServiceRequest.confirm(newServiceRequest.provider.user);

    expect(newServiceRequest.logs.length).toEqual(2);

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.CONFIRMED);
    expect(newServiceRequest.currentLog.by).toBe(
      newServiceRequest.provider.user
    );
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toBeUndefined();
  });

  it("should not be able to client confirm the request if not the provider", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    expect(() => {
      newServiceRequest.confirm(newServiceRequest.client.user);
    }).toThrow("Only the provider can confirm the request");
  });

  it.each([StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED])(
    "should be able to provider confirm the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      newServiceRequest.confirm(newServiceRequest.provider.user);

      jest.restoreAllMocks();

      expect(newServiceRequest.logs.length).toEqual(1);

      expect(newServiceRequest.currentLog.status).toBe(StatusEnum.CONFIRMED);
      expect(newServiceRequest.currentLog.by).toBe(
        newServiceRequest.provider.user
      );
      expect(newServiceRequest.currentLog.at).toBeDefined();
      expect(newServiceRequest.currentLog.reason).toBeUndefined();
    }
  );

  it.each([
    StatusEnum.CANCELLED,
    StatusEnum.CONFIRMED,
    StatusEnum.REFUSED,
    StatusEnum.STARTED,
    StatusEnum.FINISHED,
    StatusEnum.RATED,
  ])(
    "should not be able to provider confirm the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      expect(() => {
        newServiceRequest.confirm(newServiceRequest.provider.user);
      }).toThrow("The request cannot be confirmed on current stage");
    }
  );

  // REFUSING

  it("should be able to the provider refuse the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    newServiceRequest.refuse(newServiceRequest.provider.user);

    expect(newServiceRequest.logs.length).toEqual(2);

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.REFUSED);
    expect(newServiceRequest.currentLog.by).toBe(
      newServiceRequest.provider.user
    );
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toBeUndefined();
  });

  it("should not be able to client refuse the request if not the provider", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    expect(() => {
      newServiceRequest.refuse(newServiceRequest.client.user);
    }).toThrow("Only the provider can refuse the request");
  });

  it.each([StatusEnum.SCHEDULED, StatusEnum.RESCHEDULED])(
    "should be able to provider refuse the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      newServiceRequest.refuse(newServiceRequest.provider.user);

      jest.restoreAllMocks();

      expect(newServiceRequest.logs.length).toEqual(1);

      expect(newServiceRequest.currentLog.status).toBe(StatusEnum.REFUSED);
      expect(newServiceRequest.currentLog.by).toBe(
        newServiceRequest.provider.user
      );
      expect(newServiceRequest.currentLog.at).toBeDefined();
      expect(newServiceRequest.currentLog.reason).toBeUndefined();
    }
  );

  it.each([
    StatusEnum.CANCELLED,
    StatusEnum.CONFIRMED,
    StatusEnum.REFUSED,
    StatusEnum.STARTED,
    StatusEnum.FINISHED,
    StatusEnum.RATED,
  ])(
    "should not be able to provider refuse the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      expect(() => {
        newServiceRequest.refuse(newServiceRequest.provider.user);
      }).toThrow("The request cannot be refused on current stage");
    }
  );

  // STARTING

  it("should be able to the provider start the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    newServiceRequest.confirm(newServiceRequest.provider.user);

    makeServiceRequestReadyToStart();

    newServiceRequest.start(newServiceRequest.provider.user);

    expect(newServiceRequest.logs.length).toEqual(3);

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.STARTED);
    expect(newServiceRequest.currentLog.by).toBe(
      newServiceRequest.provider.user
    );
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toBeUndefined();
  });

  it("should not be able to start the request if not the provider", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    expect(() => {
      newServiceRequest.start(newServiceRequest.client.user);
    }).toThrow("Only the provider can start the request");
  });

  it.each([StatusEnum.CONFIRMED])(
    "should be able to provider start the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      newServiceRequest.start(newServiceRequest.provider.user);

      jest.restoreAllMocks();

      expect(newServiceRequest.logs.length).toEqual(1);

      expect(newServiceRequest.currentLog.status).toBe(StatusEnum.STARTED);
      expect(newServiceRequest.currentLog.by).toBe(
        newServiceRequest.provider.user
      );
      expect(newServiceRequest.currentLog.at).toBeDefined();
      expect(newServiceRequest.currentLog.reason).toBeUndefined();
    }
  );

  it.each([
    StatusEnum.SCHEDULED,
    StatusEnum.RESCHEDULED,
    StatusEnum.CANCELLED,
    StatusEnum.REFUSED,
    StatusEnum.STARTED,
    StatusEnum.FINISHED,
    StatusEnum.RATED,
  ])(
    "should not be able to provider start the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      expect(() => {
        newServiceRequest.start(newServiceRequest.provider.user);
      }).toThrow("The request cannot be started on current stage");
    }
  );

  it("should not be able to the provider start the request before the scheduled date and time", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    newServiceRequest.confirm(newServiceRequest.provider.user);

    const now = new Date();
    const now1SecondAgo = dayjs(now).subtract(1, "second").toDate();

    jest.spyOn(ServiceRequest.prototype, "when", "get").mockReturnValue(now);
    jest.useFakeTimers().setSystemTime(now1SecondAgo);

    expect(() => {
      newServiceRequest.start(newServiceRequest.provider.user);
    }).toThrow(
      "The request can only be started after the scheduled date and time"
    );
  });

  // FINISHING

  it("should be able to the provider finish the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    newServiceRequest.confirm(newServiceRequest.provider.user);

    makeServiceRequestReadyToStart();

    newServiceRequest.start(newServiceRequest.provider.user);

    newServiceRequest.finish(newServiceRequest.provider.user);

    expect(newServiceRequest.logs.length).toEqual(4);

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.FINISHED);
    expect(newServiceRequest.currentLog.by).toBe(
      newServiceRequest.provider.user
    );
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toBeUndefined();
  });

  it("should be able to the client finish the request", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    newServiceRequest.confirm(newServiceRequest.provider.user);

    makeServiceRequestReadyToStart();

    newServiceRequest.start(newServiceRequest.provider.user);

    newServiceRequest.finish(newServiceRequest.client.user);

    expect(newServiceRequest.logs.length).toEqual(4);

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.FINISHED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client.user);
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toBeUndefined();
  });

  it.each([StatusEnum.STARTED, StatusEnum.FINISHED])(
    "should be able to client finish the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      newServiceRequest.finish(newServiceRequest.client.user);

      jest.restoreAllMocks();

      expect(newServiceRequest.logs.length).toEqual(1);

      expect(newServiceRequest.currentLog.status).toBe(StatusEnum.FINISHED);
      expect(newServiceRequest.currentLog.by).toBe(
        newServiceRequest.client.user
      );
      expect(newServiceRequest.currentLog.at).toBeDefined();
      expect(newServiceRequest.currentLog.reason).toBeUndefined();
    }
  );

  it.each([StatusEnum.STARTED, StatusEnum.FINISHED])(
    "should be able to provider finish the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      newServiceRequest.finish(newServiceRequest.provider.user);

      jest.restoreAllMocks();

      expect(newServiceRequest.logs.length).toEqual(1);

      expect(newServiceRequest.currentLog.status).toBe(StatusEnum.FINISHED);
      expect(newServiceRequest.currentLog.by).toBe(
        newServiceRequest.provider.user
      );
      expect(newServiceRequest.currentLog.at).toBeDefined();
      expect(newServiceRequest.currentLog.reason).toBeUndefined();
    }
  );

  it.each([
    StatusEnum.SCHEDULED,
    StatusEnum.RESCHEDULED,
    StatusEnum.CANCELLED,
    StatusEnum.CONFIRMED,
    StatusEnum.REFUSED,
    StatusEnum.RATED,
  ])(
    "should not be able to client finish the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      expect(() => {
        newServiceRequest.finish(newServiceRequest.client.user);
      }).toThrow("The request cannot be finished on current stage");
    }
  );

  it.each([
    StatusEnum.SCHEDULED,
    StatusEnum.RESCHEDULED,
    StatusEnum.CANCELLED,
    StatusEnum.CONFIRMED,
    StatusEnum.REFUSED,
    StatusEnum.RATED,
  ])(
    "should not be able to provider finish the request on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      expect(() => {
        newServiceRequest.finish(newServiceRequest.provider.user);
      }).toThrow("The request cannot be finished on current stage");
    }
  );

  it("should not be able to the client finish the request twice", () => {
    const newServiceRequest = makeFakeServiceRequest();

    jest.spyOn(ServiceRequest.prototype, "logs", "get").mockReturnValue([
      {
        status: StatusEnum.FINISHED,
        by: newServiceRequest.client.user,
        at: new Date(),
      },
    ]);

    expect(() => {
      newServiceRequest.finish(newServiceRequest.client.user);
    }).toThrow("The request can only be finished once");
  });

  it("should not be able to the provider finish the request twice", () => {
    const newServiceRequest = makeFakeServiceRequest();

    jest.spyOn(ServiceRequest.prototype, "logs", "get").mockReturnValue([
      {
        status: StatusEnum.FINISHED,
        by: newServiceRequest.provider.user,
        at: new Date(),
      },
    ]);

    expect(() => {
      newServiceRequest.finish(newServiceRequest.provider.user);
    }).toThrow("The request can only be finished once");
  });

  // RATING

  it("should be able to the client rate the request provider", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    makeServiceRequestReadyToStart();

    newServiceRequest.confirm(newServiceRequest.provider.user);

    newServiceRequest.start(newServiceRequest.provider.user);

    newServiceRequest.finish(newServiceRequest.client.user);

    newServiceRequest.rate(newServiceRequest.client.user);

    expect(newServiceRequest.logs.length).toEqual(5);

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.RATED);
    expect(newServiceRequest.currentLog.by).toBe(newServiceRequest.client.user);
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toBeUndefined();
  });

  it("should be able to the provider rate the request client", () => {
    const newServiceRequest = makeFakeServiceRequest();

    newServiceRequest.schedule(newServiceRequest.client.user);

    newServiceRequest.confirm(newServiceRequest.provider.user);

    makeServiceRequestReadyToStart();

    newServiceRequest.start(newServiceRequest.provider.user);

    newServiceRequest.finish(newServiceRequest.provider.user);

    newServiceRequest.rate(newServiceRequest.provider.user);

    expect(newServiceRequest.logs.length).toEqual(5);

    expect(newServiceRequest.currentLog.status).toBe(StatusEnum.RATED);
    expect(newServiceRequest.currentLog.by).toBe(
      newServiceRequest.provider.user
    );
    expect(newServiceRequest.currentLog.at).toBeDefined();
    expect(newServiceRequest.currentLog.reason).toBeUndefined();
  });

  it.each([StatusEnum.FINISHED, StatusEnum.RATED])(
    "should be able to client rate the request provider on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      newServiceRequest.rate(newServiceRequest.client.user);

      jest.restoreAllMocks();

      expect(newServiceRequest.logs.length).toEqual(1);

      expect(newServiceRequest.currentLog.status).toBe(StatusEnum.RATED);
      expect(newServiceRequest.currentLog.by).toBe(
        newServiceRequest.client.user
      );
      expect(newServiceRequest.currentLog.at).toBeDefined();
      expect(newServiceRequest.currentLog.reason).toBeUndefined();
    }
  );

  it.each([StatusEnum.FINISHED, StatusEnum.RATED])(
    "should be able to provider rate the request client on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      newServiceRequest.rate(newServiceRequest.provider.user);

      jest.restoreAllMocks();

      expect(newServiceRequest.logs.length).toEqual(1);

      expect(newServiceRequest.currentLog.status).toBe(StatusEnum.RATED);
      expect(newServiceRequest.currentLog.by).toBe(
        newServiceRequest.provider.user
      );
      expect(newServiceRequest.currentLog.at).toBeDefined();
      expect(newServiceRequest.currentLog.reason).toBeUndefined();
    }
  );

  it.each([
    StatusEnum.SCHEDULED,
    StatusEnum.RESCHEDULED,
    StatusEnum.CANCELLED,
    StatusEnum.CONFIRMED,
    StatusEnum.REFUSED,
    StatusEnum.STARTED,
  ])(
    "should not be able to client rate the request provider on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      expect(() => {
        newServiceRequest.rate(newServiceRequest.client.user);
      }).toThrow("The request cannot be rated on current stage");
    }
  );

  it.each([
    StatusEnum.SCHEDULED,
    StatusEnum.RESCHEDULED,
    StatusEnum.CANCELLED,
    StatusEnum.CONFIRMED,
    StatusEnum.REFUSED,
    StatusEnum.STARTED,
  ])(
    "should not be able to provider rate the request client on stages",
    (status: StatusEnum) => {
      const newServiceRequest = makeFakeServiceRequest();

      jest
        .spyOn(ServiceRequest.prototype, "currentLog", "get")
        .mockReturnValue({
          status,
          by: newServiceRequest.client.user,
          at: new Date(),
        });

      expect(() => {
        newServiceRequest.rate(newServiceRequest.provider.user);
      }).toThrow("The request cannot be rated on current stage");
    }
  );

  it("should not be able to the client rate twice", () => {
    const newServiceRequest = makeFakeServiceRequest();

    jest.spyOn(ServiceRequest.prototype, "logs", "get").mockReturnValue([
      {
        status: StatusEnum.RATED,
        by: newServiceRequest.client.user,
        at: new Date(),
      },
    ]);

    expect(() => {
      newServiceRequest.rate(newServiceRequest.client.user);
    }).toThrow("The request can only be rated once");
  });

  it("should not be able to the provider rate twice", () => {
    const newServiceRequest = makeFakeServiceRequest();

    jest.spyOn(ServiceRequest.prototype, "logs", "get").mockReturnValue([
      {
        status: StatusEnum.RATED,
        by: newServiceRequest.provider.user,
        at: new Date(),
      },
    ]);

    expect(() => {
      newServiceRequest.rate(newServiceRequest.provider.user);
    }).toThrow("The request can only be rated once");
  });
});
