import ValueObject from "../@shared/value-object";

type Value = {
    cep: string;
    number: number;
    complement?: string;
};

export class ClientAddress extends ValueObject<Value> {
    constructor(cep: string, number: number, complement?: string) {
        super({
            cep,
            number,
            complement,
        });
    }

    validate(value: Value): boolean {
        const cepPattern = /^\d{5}-\d{3}$/g;
        const cepRegex = new RegExp(cepPattern);

        if (!cepRegex.test(value.cep)) {
            throw new Error(
                "The provided CEP must follow the format: XXXXX-XXX"
            );
        }
        return true;
    }
}
