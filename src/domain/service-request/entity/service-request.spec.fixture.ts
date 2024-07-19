import { v4 as uuidV4 } from "uuid";

import ServiceRequest from "./service-request";

import { makeFakeClient } from "@/domain/client/entity/client.spec.fixture";
import { makeFakeProvider } from "@/domain/provider/entity/provider.spec.fixture";

export const makeFakeServiceRequest = () =>
  new ServiceRequest(
    uuidV4(),
    makeFakeClient(),
    makeFakeProvider(),
    new Date()
  );
