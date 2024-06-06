export interface Repository<T, K> {
  create: (data: K) => Promise<T>;
  all: () => Promise<Array<T>>;
  getByID: (id: string) => Promise<T | null>;
  update: (id: string, data: K) => Promise<T>;
  delete: (id: string) => Promise<void>;
}
