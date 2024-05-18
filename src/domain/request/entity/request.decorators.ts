import User from "@/domain/@shared/entity/user";

import Request, { TRequestStatus } from "./request";

export function requireStage<T>(status: TRequestStatus<T>, message: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            if ((this as Request<T>).currentLog.status !== status)
                throw new Error(message);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export function requireStages<T>(
    status: Array<TRequestStatus<T>>,
    message: string
) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            if (!status.includes((this as Request<T>).currentLog.status))
                throw new Error(message);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export function requireStatus<T>(status: TRequestStatus<T>, message: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const exist = (this as Request<T>).logs.some(
                (log) => log.status === status
            );

            if (!exist) throw new Error(message);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export function requireStatusByUser<T>(
    status: TRequestStatus<T>,
    message: string
) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const user = args[0] as User;

            const exist = (this as Request<T>).logs.some(
                (log) => log.status === status && log.changedBy === user
            );

            if (!exist) throw new Error(message);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export function requireStatusByUserAndProvider<T>(
    status: TRequestStatus<T>,
    message: string
) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const user = args[0] as User;

            const exist = (this as Request<T>).logs.some(
                (log) => log.status === status && log.changedBy === user
            );

            if (user === (this as Request<T>).provider && !exist)
                throw new Error(message);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export function statusExists<T>(status: TRequestStatus<T>, message: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const exist = (this as Request<T>).logs.some(
                (log) => log.status === status
            );

            if (exist) throw new Error(message);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export function statusExistsByUser<T>(
    status: TRequestStatus<T>,
    message: string
) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const user = args[0] as User;

            const exist = (this as Request<T>).logs.some(
                (log) => log.status === status && log.changedBy === user
            );

            if (exist) throw new Error(message);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export function onlyProvider<T>(message: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const user = args[0] as User;

            if (user !== (this as Request<T>).provider)
                throw new Error(message);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export function onlyClient<T>(message: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const user = args[0] as User;

            if (user !== (this as Request<T>).client) throw new Error(message);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
