import { v4 as uuidV4 } from "uuid";

import { makeFakeClient } from "@/domain/client/entity/client.spec.fixture";
import { makeFakeProvider } from "@/domain/provider/entity/provider.spec.fixture";

import ServiceRequest, { Log, StatusEnum } from "./service-request";

export const makeFakeServiceRequest = () =>
  new ServiceRequest(
    uuidV4(),
    makeFakeClient(),
    makeFakeProvider(),
    new Date()
  );

export const makeFakeServiceRequestLog = (): Log => ({
  status: StatusEnum.CREATED,
  by: makeFakeClient(),
  at: new Date(),
});
