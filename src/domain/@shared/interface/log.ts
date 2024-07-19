import User from "@/domain/@shared/entity/user";

export default interface LogInterface<T> {
  status: T;
  by: User;
  at: Date;
  reason?: string;
}
