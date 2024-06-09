export default interface FactoryInterface<T, K> {
  fromModel: (model: T) => K;
}
