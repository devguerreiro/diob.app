import { UserDocument, UserEmail, UserContact } from "./user";

describe("User Value Object", () => {
  it("should throw an error when passing an invalid CPF", () => {
    expect(() => {
      // eslint-disable-next-line
      const _ = new UserDocument("12345678901");
    }).toThrow("The provided document must be a valid CPF");
  });

  it("should be able to create a valid CPF document", () => {
    // from https://www.4devs.com.br/gerador_de_cpf
    const document = new UserDocument("881.971.600-31");

    expect(document.value).toBe("881.971.600-31");
  });

  it.each(["invalid.email", "..@email.com", "invalid@e.c", "a@a.a"])(
    "should throw an error when passing an invalid email",
    (scenario) => {
      expect(() => {
        // eslint-disable-next-line
        const _ = new UserEmail(scenario);
      }).toThrow("The provided email must be valid");
    }
  );

  it.each(["valid@email.com.br", "valid@email.com", "valid@e.com"])(
    "should be able to create a valid email",
    (scenario) => {
      const email = new UserEmail(scenario);

      expect(email.value).toBe(scenario);
    }
  );

  it.each([
    "(47) 988776655",
    "47 98877-6655",
    "47 988776655",
    "(47)98877-6655",
    "(47) 877-6655",
    "(47) 98877-665x",
  ])("should throw an error when passing an invalid contact", (scenario) => {
    expect(() => {
      // eslint-disable-next-line
      const _ = new UserContact(scenario);
    }).toThrow(
      "The provided contact must follow the format: (XX) XXXX-XXXX or (XX) 9XXXX-XXXX"
    );
  });

  it.each(["(47) 98877-6655", "(47) 8877-6655"])(
    "should be able to create a valid contact",
    (scenario) => {
      const contact = new UserContact(scenario);

      expect(contact.value).toBe(scenario);
    }
  );
});
