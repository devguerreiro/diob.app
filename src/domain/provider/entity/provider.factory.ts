import FactoryInterface from "@/domain/@shared/interface/factory";

import {
  UserContact,
  UserDocument,
  UserEmail,
} from "@/domain/@shared/value-object/user";

import { ProviderReadModel } from "@/infra/provider/model";

import Provider, { ProviderWork, ProviderWorkJob } from "./provider";
import { Work, WorkJob } from "@/domain/work/work";

export default class ProviderFactory
  implements FactoryInterface<ProviderReadModel, Provider>
{
  fromModel(model: ProviderReadModel): Provider {
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
          (job) =>
            new ProviderWorkJob(
              job.id,
              job.cost,
              job.estimated_duration,
              new WorkJob(job.job.id, job.job.name)
            )
        );
        return new ProviderWork(
          work.id,
          work.min_cost,
          jobs,
          new Work(
            work.work.id,
            work.work.name,
            jobs.map((job) => job.workJob)
          )
        );
      })
    );
  }
}
