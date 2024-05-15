import { cpf } from "cpf-cnpj-validator";
import * as EmailValidator from "email-validator";

import ValueObject from ".";

export class UserDocument extends ValueObject<string> {
    validate(value: string): boolean {
        if (!cpf.isValid(value)) {
            throw new Error("The provided document must be a valid CPF");
        }
        return true;
    }
}

export class UserEmail extends ValueObject<string> {
    validate(value: string): boolean {
        if (!EmailValidator.validate(value)) {
            throw new Error("The provided email must be valid");
        }
        return true;
    }
}

export class UserContact extends ValueObject<string> {
    validate(value: string): boolean {
        const pattern = /^\(\d{2}\) \d{4,5}-\d{4}$/g;
        const regex = new RegExp(pattern);

        if (!regex.test(value)) {
            throw new Error(
                "The provided contact must follow the format: (XX) XXXX-XXXX or (XX) 9XXXX-XXXX"
            );
        }
        return true;
    }
}
