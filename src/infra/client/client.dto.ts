import { Prisma } from "@prisma/client";

export type ClientCreateDTO = Prisma.ClientModelGetPayload<{
  select: {
    name: true;
    document: true;
    email: true;
    contact: true;
    dob: true;
    address_cep: true;
    address_number: true;
    address_complement?: true;
  };
}>;

export type ClientUpdateDTO = Prisma.ClientModelGetPayload<{
  select: {
    name: true;
    email: true;
    contact: true;
    address_cep: true;
    address_number: true;
    address_complement?: true;
  };
}>;

export type SummarizedClientDTO = Prisma.ClientModelGetPayload<{
  select: {
    id: true;
    name: true;
    document: true;
    email: true;
    contact: true;
  };
}>;

export type EnlargedClientDTO = Prisma.ClientModelGetPayload<{
  select: {
    id: true;
    name: true;
    document: true;
    email: true;
    contact: true;
    dob: true;
    address_cep: true;
    address_number: true;
    address_complement?: true;
  };
}>;
