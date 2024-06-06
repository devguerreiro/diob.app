export interface Repository<T, K> {
  create: (data: K) => Promise<T>;
}
