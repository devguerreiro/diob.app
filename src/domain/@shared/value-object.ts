export default abstract class ValueObject<T> {
    private _value: T;

    constructor(value: T) {
        this._value = value;
        this.validate(value);
    }

    get value(): T {
        return this._value;
    }

    changeValue(value: T): void {
        if (this.validate(value)) this._value = value;
    }

    abstract validate(value: T): boolean;
}
