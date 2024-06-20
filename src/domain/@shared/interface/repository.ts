export default interface RepositoryInterface<T> {
  create: (...args: Array<never>) => Promise<T>;
  all: () => Promise<Array<T>>;
  getByID: (id: string) => Promise<T | null>;
  update: (id: string, ...args: Array<never>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}
