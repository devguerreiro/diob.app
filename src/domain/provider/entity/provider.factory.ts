import FactoryInterface from "@/domain/@shared/interface/factory";

import {
  UserContact,
  UserDocument,
  UserEmail,
} from "@/domain/@shared/value-object/user";

import { ProviderWithWorksModel } from "@/infra/provider/model";

import Provider, { ProviderWork, ProviderWorkJob } from "./provider";

export default class ProviderFactory
  implements FactoryInterface<ProviderWithWorksModel, Provider>
{
  fromModel(model: ProviderWithWorksModel): Provider {
    const _document = new UserDocument(model.document);
    const _contact = new UserContact(model.contact);
    const _email = new UserEmail(model.email);
    return new Provider(
      model.id,
      model.name,
      _document,
      _email,
      _contact,
      model.dob,
      model.works.map((work) => {
        const jobs = work.jobs.map(
          (job) => new ProviderWorkJob(job.id, job.name, job.cost)
        );
        return new ProviderWork(work.id, work.name, work.min_cost, jobs);
      })
    );
  }
}
