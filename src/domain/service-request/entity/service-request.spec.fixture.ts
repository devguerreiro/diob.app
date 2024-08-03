import { v4 as uuidV4 } from "uuid";

import { makeFakeClient } from "@/domain/client/entity/client.spec.fixture";
import { makeFakeProvider } from "@/domain/provider/entity/provider.spec.fixture";
import { makeFakeUser } from "@/domain/user/entity/user.spec.fixture";

import ServiceRequest, { Log, StatusEnum } from "./service-request";

export const makeFakeServiceRequest = () =>
  new ServiceRequest(
    makeFakeClient(),
    makeFakeProvider(),
    new Date(),
    uuidV4()
  );

export const makeFakeServiceRequestLog = (
  status: StatusEnum = StatusEnum.SCHEDULED
): Log => ({
  status,
  by: makeFakeUser(),
  at: new Date(),
});
