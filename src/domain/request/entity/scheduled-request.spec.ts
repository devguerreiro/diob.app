import dayjs from "dayjs";
import { RequestStatus } from "./request";
import ScheduledRequest, { ScheduledRequestStatus } from "./scheduled-request";
import { makeFakeScheduledRequest } from "./scheduled-request.spec.fixture";

const makeScheduledRequestReadyToBegin = () => {
    const now = new Date();
    jest.spyOn(ScheduledRequest.prototype, "when", "get").mockReturnValue(now);
    jest.useFakeTimers().setSystemTime(now);
};

describe("ScheduledRequest Entity", () => {
    it("should initialize the scheduled request on creation", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CREATED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should calculate the total amount of the scheduled request", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        expect(newScheduledRequest.totalCost).toEqual(
            newScheduledRequest.work.totalCost
        );
    });

    // SCHEDULING

    it("should be able to the client schedule the request", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(2);
        expect(newScheduledRequest.currentLog.status).toBe(
            ScheduledRequestStatus.SCHEDULED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should not be able to schedule the request if are not the client", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        expect(() => {
            newScheduledRequest.schedule(newScheduledRequest.provider);
        }).toThrow("Only the client should schedule the request");
    });

    it("should not be able to schedule the request if not on CREATED stage", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        expect(() => {
            newScheduledRequest.schedule(newScheduledRequest.client);
        }).toThrow(
            "It's not possible to schedule the request if not on CREATED stage"
        );
    });

    // RESCHEDULING

    it("should be able to the client reschedule the request", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        newScheduledRequest.reschedule(newScheduledRequest.client);

        newScheduledRequest.reschedule(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            ScheduledRequestStatus.RESCHEDULED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should not be able to reschedule the request if are not the client", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        expect(() => {
            newScheduledRequest.reschedule(newScheduledRequest.provider);
        }).toThrow("Only the client should reschedule the request");
    });

    it("should not be able to reschedule the request if not on SCHEDULED or RESCHEDULED stage", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        expect(() => {
            newScheduledRequest.reschedule(newScheduledRequest.client);
        }).toThrow(
            "It's not possible to reschedule the request if not on SCHEDULED or RESCHEDULED stage"
        );
    });

    // CANCELLING

    it("should be able to the client cancel the request before the provider beginning", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        newScheduledRequest.cancel(newScheduledRequest.client, "foo");

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CANCELLED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
        expect(newScheduledRequest.currentLog.reason).toEqual("foo");
    });

    it("should be able to the client cancel the request before the provider beginning and after rescheduled", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        newScheduledRequest.reschedule(newScheduledRequest.client);

        newScheduledRequest.cancel(newScheduledRequest.client, "foo");

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CANCELLED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
        expect(newScheduledRequest.currentLog.reason).toEqual("foo");
    });

    it("should be able to the client cancel the request after beginning", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.cancel(newScheduledRequest.client, "foo");

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CANCELLED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
        expect(newScheduledRequest.currentLog.reason).toEqual("foo");
    });

    it("should be able to the provider cancel the request after beginning", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.cancel(newScheduledRequest.provider, "foo");

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CANCELLED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
        expect(newScheduledRequest.currentLog.reason).toEqual("foo");
    });

    it("should not be able to the provider cancel the request before beginning", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        expect(() => {
            newScheduledRequest.cancel(newScheduledRequest.provider, "foo");
        }).toThrow("It's not possible to cancel the request before beginning");
    });

    it("should not be able to the client cancel the request before scheduling", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        expect(() => {
            newScheduledRequest.cancel(newScheduledRequest.client, "foo");
        }).toThrow("It's not possible to cancel the request before scheduling");
    });

    it("should not be able to the client cancel the request after finished", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.finish(newScheduledRequest.provider);

        expect(() => {
            newScheduledRequest.cancel(newScheduledRequest.client, "foo");
        }).toThrow("It's not possible to cancel the request after finished");
    });

    it("should not be able to the client cancel the request more than once", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        newScheduledRequest.cancel(newScheduledRequest.client, "foo");

        expect(() => {
            newScheduledRequest.cancel(newScheduledRequest.client, "foo");
        }).toThrow("It's not possible to cancel the request more than once");
    });

    it("should not be able to the provider cancel the request after finished", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.finish(newScheduledRequest.provider);

        expect(() => {
            newScheduledRequest.cancel(newScheduledRequest.provider, "foo");
        }).toThrow("It's not possible to cancel the request after finished");
    });

    it("should not be able to the provider cancel the request more than once", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.cancel(newScheduledRequest.provider, "foo");

        expect(() => {
            newScheduledRequest.cancel(newScheduledRequest.provider, "foo");
        }).toThrow("It's not possible to cancel the request more than once");
    });

    // BEGINNING

    it("should be able to the provider begin the request if on SCHEDULED stage", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should be able to the provider begin the request if on RESCHEDULED stage", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        newScheduledRequest.reschedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should not be able to begin the request if are not the provider", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        expect(() => {
            newScheduledRequest.begin(newScheduledRequest.client);
        }).toThrow("Only the provider should begin the request");
    });

    it("should not be able to the provider begin the request if not on SCHEDULED or RESCHEDULED stage", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        makeScheduledRequestReadyToBegin();

        expect(() => {
            newScheduledRequest.begin(newScheduledRequest.provider);
        }).toThrow(
            "It's not possible to begin the request if not on SCHEDULED or RESCHEDULED stage"
        );
    });

    it("should not be able to the provider begin the request before the scheduled date and time comes", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        const now = new Date();
        const now1SecondAgo = dayjs(now).subtract(1, "second").toDate();

        jest.spyOn(ScheduledRequest.prototype, "when", "get").mockReturnValue(
            now1SecondAgo
        );
        jest.useFakeTimers().setSystemTime(now);

        expect(() => {
            newScheduledRequest.begin(newScheduledRequest.provider);
        }).toThrow(
            "It's not possible to begin the request before the scheduled date and time comes"
        );
    });

    // FINISHING

    it("should be able to the provider finish the request", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.finish(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.FINISHED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should be able to the client finish the request", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.finish(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.FINISHED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should not be able to the client finish the request before beginning", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        expect(() => {
            newScheduledRequest.finish(newScheduledRequest.client);
        }).toThrow("It's not possible to finish the request before beginning");
    });

    it("should not be able to the client finish the request after cancelled", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.cancel(newScheduledRequest.client, "foo");

        expect(() => {
            newScheduledRequest.finish(newScheduledRequest.client);
        }).toThrow("It's not possible to finish the request after cancelled");
    });

    it("should not be able to the client finish the request more than once", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.finish(newScheduledRequest.client);

        expect(() => {
            newScheduledRequest.finish(newScheduledRequest.client);
        }).toThrow("It's not possible to finish the request more than once");
    });

    it("should not be able to the provider finish the request before beginning", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        expect(() => {
            newScheduledRequest.finish(newScheduledRequest.provider);
        }).toThrow("It's not possible to finish the request before beginning");
    });

    it("should not be able to the provider finish the request after cancelled", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.cancel(newScheduledRequest.client, "foo");

        expect(() => {
            newScheduledRequest.finish(newScheduledRequest.provider);
        }).toThrow("It's not possible to finish the request after cancelled");
    });

    it("should not be able to the provider finish the request more than once", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.finish(newScheduledRequest.provider);

        expect(() => {
            newScheduledRequest.finish(newScheduledRequest.provider);
        }).toThrow("It's not possible to finish the request more than once");
    });

    // RATING

    it("should be able to the client rate the request provider", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.finish(newScheduledRequest.client);

        const spiedMethod = jest.spyOn(newScheduledRequest.provider, "rate");

        newScheduledRequest.rate(
            newScheduledRequest.client,
            newScheduledRequest.provider,
            5
        );

        expect(newScheduledRequest.logs.length).toEqual(5);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.RATED);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
        expect(spiedMethod).toHaveBeenCalledWith(5);
    });

    it("should be able to the provider rate the request client", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.finish(newScheduledRequest.provider);

        const spiedMethod = jest.spyOn(newScheduledRequest.client, "rate");

        newScheduledRequest.rate(
            newScheduledRequest.provider,
            newScheduledRequest.client,
            5
        );

        expect(newScheduledRequest.logs.length).toEqual(5);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.RATED);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
        expect(spiedMethod).toHaveBeenCalledWith(5);
    });

    it("should not be able to the client rate the request provider before finishing", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(() => {
            newScheduledRequest.rate(
                newScheduledRequest.client,
                newScheduledRequest.provider,
                5
            );
        }).toThrow("It's not possible to rate the request before finishing");
    });

    it("should not be able to the client rate more than once", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.finish(newScheduledRequest.client);

        newScheduledRequest.rate(
            newScheduledRequest.client,
            newScheduledRequest.provider,
            5
        );

        expect(() => {
            newScheduledRequest.rate(
                newScheduledRequest.client,
                newScheduledRequest.provider,
                5
            );
        }).toThrow("It's not possible to rate the request more than once");
    });

    it("should not be able to the provider rate the request client before finishing", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(() => {
            newScheduledRequest.rate(
                newScheduledRequest.provider,
                newScheduledRequest.client,
                5
            );
        }).toThrow("It's not possible to rate the request before finishing");
    });

    it("should not be able to the provider rate more than once", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        newScheduledRequest.schedule(newScheduledRequest.client);

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        newScheduledRequest.finish(newScheduledRequest.provider);

        newScheduledRequest.rate(
            newScheduledRequest.provider,
            newScheduledRequest.client,
            5
        );

        expect(() => {
            newScheduledRequest.rate(
                newScheduledRequest.provider,
                newScheduledRequest.client,
                5
            );
        }).toThrow("It's not possible to rate the request more than once");
    });
});
