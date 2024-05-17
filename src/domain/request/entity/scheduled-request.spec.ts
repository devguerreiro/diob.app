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
        }).toThrow("Only the client can schedule the request");
    });

    it("should be able to the client reschedule the request", () => {
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

        newScheduledRequest.reschedule(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(3);
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

        expect(newScheduledRequest.logs.length).toEqual(2);
        expect(newScheduledRequest.currentLog.status).toBe(
            ScheduledRequestStatus.SCHEDULED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        expect(() => {
            newScheduledRequest.reschedule(newScheduledRequest.provider);
        }).toThrow("Only the client can reschedule the request");
    });

    it("should not be able to reschedule the request if current status is not SCHEDULED", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        expect(() => {
            newScheduledRequest.reschedule(newScheduledRequest.client);
        }).toThrow(
            "It's not possible to RESCHEDULE a not yet scheduled request"
        );
    });

    it("should be able to the client cancel the request before the provider begin", () => {
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

        newScheduledRequest.cancel(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CANCELLED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should be able to the client cancel the request before the provider begin (rescheduled)", () => {
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

        newScheduledRequest.reschedule(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(
            ScheduledRequestStatus.RESCHEDULED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.cancel(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CANCELLED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should be able to the client cancel the request after began", () => {
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

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.cancel(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CANCELLED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should be able to the provider cancel the request after began", () => {
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

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.cancel(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CANCELLED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should be able to the client cancel the request after began (rescheduled)", () => {
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

        newScheduledRequest.reschedule(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(
            ScheduledRequestStatus.RESCHEDULED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.cancel(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(5);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CANCELLED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should be able to the provider cancel the request after began (rescheduled)", () => {
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

        newScheduledRequest.reschedule(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(
            ScheduledRequestStatus.RESCHEDULED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.cancel(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(5);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.CANCELLED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should not be able to the client cancel the request if it already finished", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(2);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.finish(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.FINISHED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        expect(() => {
            newScheduledRequest.cancel(newScheduledRequest.client);
        }).toThrow(
            "It's not possible to cancel the request if it already finished"
        );
    });

    it("should not be able to the provider cancel the request if it already finished", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(2);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.finish(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.FINISHED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        expect(() => {
            newScheduledRequest.cancel(newScheduledRequest.provider);
        }).toThrow(
            "It's not possible to cancel the request if it already finished"
        );
    });

    it("should be able to the provider begin the request", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(2);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should not be able to begin the request if are not the provider", () => {
        const newScheduledRequest = makeFakeScheduledRequest();

        expect(() => {
            newScheduledRequest.begin(newScheduledRequest.client);
        }).toThrow("Only the provider can begin the request");
    });

    it("should not be able to the provider begin the request before the scheduled date and time comes", () => {
        const newScheduledRequest = makeFakeScheduledRequest();
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

    it("should be able to the client finish the request", () => {
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

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.finish(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.FINISHED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.finish(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(5);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.FINISHED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should be able to the provider finish the request", () => {
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

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

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

    it("should not be able to the client finish the request before begin it", () => {
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

        expect(() => {
            newScheduledRequest.finish(newScheduledRequest.client);
        }).toThrow("It's not possible to finish the request before begin it");
    });

    it("should not be able to the provider finish the request before begin it", () => {
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

        expect(() => {
            newScheduledRequest.finish(newScheduledRequest.client);
        }).toThrow("It's not possible to finish the request before begin it");
    });

    it("should be able to the client rate the request provider", () => {
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

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.finish(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.FINISHED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.finish(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(5);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.FINISHED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.rate(newScheduledRequest.client);

        expect(newScheduledRequest.logs.length).toEqual(6);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.RATED);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.client
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should be able to the provider rate the request client", () => {
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

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.finish(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(4);
        expect(newScheduledRequest.currentLog.status).toBe(
            RequestStatus.FINISHED
        );
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        newScheduledRequest.rate(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(5);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.RATED);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();
    });

    it("should not be able to the client rate the request provider before finishing it", () => {
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

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        expect(() => {
            newScheduledRequest.rate(newScheduledRequest.client);
        }).toThrow(
            "It's not possible to rate the request provider before finishing it"
        );
    });

    it("should not be able to the provider rate the request client before finishing it", () => {
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

        makeScheduledRequestReadyToBegin();

        newScheduledRequest.begin(newScheduledRequest.provider);

        expect(newScheduledRequest.logs.length).toEqual(3);
        expect(newScheduledRequest.currentLog.status).toBe(RequestStatus.BEGAN);
        expect(newScheduledRequest.currentLog.changedBy).toBe(
            newScheduledRequest.provider
        );
        expect(newScheduledRequest.currentLog.changedAt).toBeDefined();

        expect(() => {
            newScheduledRequest.rate(newScheduledRequest.provider);
        }).toThrow(
            "It's not possible to rate the request client before finishing it"
        );
    });
});
