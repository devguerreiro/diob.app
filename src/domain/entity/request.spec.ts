import { makeFakeJobRequest } from "./request.spec.fixture";

describe("Request Entity", () => {
    it("should initiate the default log", () => {
        const newRequest = makeFakeJobRequest();

        expect(newRequest.lastLog.status).toEqual("PENDING");
        expect(newRequest.lastLog.changedBy).toBe(newRequest.client);
    });

    it("should calculate the total amount of the job request", () => {
        const newRequest = makeFakeJobRequest();
        const totalExpected = newRequest.provider.jobs.reduce(
            (total, job) => total + job.totalCost,
            0
        );

        const totalCalculated = newRequest.totalCost;

        expect(totalCalculated).toEqual(totalExpected);
    });

    it("should only allow to accept the request if PENDING", () => {
        const newRequest = makeFakeJobRequest();

        expect(newRequest.lastLog.status).toEqual("PENDING");
        expect(newRequest.lastLog.changedBy).toBe(newRequest.client);

        newRequest.accept(newRequest.provider);

        expect(newRequest.lastLog.status).toEqual("ACCEPTED");
        expect(newRequest.lastLog.changedBy).toEqual(newRequest.provider);

        expect(() => {
            newRequest.accept(newRequest.provider);
        }).toThrow("It's not possible to ACCEPT a non-pending job request");
    });

    it("should only allow to reject the request if PENDING", () => {
        const newRequest = makeFakeJobRequest();

        expect(newRequest.lastLog.status).toEqual("PENDING");
        expect(newRequest.lastLog.changedBy).toBe(newRequest.client);

        newRequest.reject(newRequest.provider);

        expect(newRequest.lastLog.status).toEqual("REJECTED");
        expect(newRequest.lastLog.changedBy).toEqual(newRequest.provider);

        expect(() => {
            newRequest.reject(newRequest.provider);
        }).toThrow("It's not possible to REJECT a non-pending job request");
    });

    it("should only allow to cancel the request if PENDING", () => {
        const newRequest = makeFakeJobRequest();

        expect(newRequest.lastLog.status).toEqual("PENDING");
        expect(newRequest.lastLog.changedBy).toBe(newRequest.client);

        newRequest.cancel(newRequest.client);

        expect(newRequest.lastLog.status).toEqual("CANCELLED");
        expect(newRequest.lastLog.changedBy).toEqual(newRequest.client);

        expect(() => {
            newRequest.cancel(newRequest.client);
        }).toThrow("It's not possible to CANCEL a non-pending job request");
    });

    it("should only allow to done the request if ACCEPTED or not DONE by itself", () => {
        const newRequest = makeFakeJobRequest();

        expect(newRequest.lastLog.status).toEqual("PENDING");
        expect(newRequest.lastLog.changedBy).toBe(newRequest.client);

        newRequest.accept(newRequest.provider);

        expect(newRequest.lastLog.status).toEqual("ACCEPTED");
        expect(newRequest.lastLog.changedBy).toEqual(newRequest.provider);

        newRequest.done(newRequest.client);

        expect(newRequest.lastLog.status).toEqual("DONE");
        expect(newRequest.lastLog.changedBy).toEqual(newRequest.client);

        newRequest.done(newRequest.provider);

        expect(newRequest.lastLog.status).toEqual("DONE");
        expect(newRequest.lastLog.changedBy).toEqual(newRequest.provider);

        expect(() => {
            newRequest.done(newRequest.provider);
        }).toThrow(
            "It's not possible to DONE a non-accepted job request or if you already DONE"
        );
    });
});
