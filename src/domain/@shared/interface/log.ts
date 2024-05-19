import User from "../entity/user";

export default interface LogInterface<T> {
    status: T;
    changedBy: User;
    changedAt: Date;
    reason?: string;
}
