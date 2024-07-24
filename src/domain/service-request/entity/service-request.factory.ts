import FactoryInterface from "@/domain/@shared/interface/factory";

import { ServiceRequestReadModel } from "@/infra/service-request/model";

import ClientFactory from "@/domain/client/entity/client.factory";
import ProviderFactory from "@/domain/provider/entity/provider.factory";

import ServiceRequest from "./service-request";

export default class ServiceRequestFactory
  implements FactoryInterface<ServiceRequestReadModel, ServiceRequest>
{
  fromModel(model: ServiceRequestReadModel): ServiceRequest {
    const client = new ClientFactory().fromModel(model.client);
    const provider = new ProviderFactory().fromModel(model.provider);
    return new ServiceRequest(model.id, client, provider, model.scheduled_at);
  }
}
