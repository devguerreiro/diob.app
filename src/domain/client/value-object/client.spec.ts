import { ClientAddress } from "./client";

describe("Client Value Object", () => {
    it.each(["12345678", "12345-67x", "abcde-fgh"])(
        "should throw an error when passing an invalid address",
        (scenario) => {
            expect(() => {
                const _ = new ClientAddress(scenario, 123);
            }).toThrow("The provided CEP must follow the format: XXXXX-XXX");
        }
    );

    it("should be able to create a valid address ", () => {
        const address = new ClientAddress("12345-678", 123, "comp");

        expect(address.value.cep).toEqual("12345-678");
        expect(address.value.number).toEqual(123);
        expect(address.value.complement).toEqual("comp");
    });
});
