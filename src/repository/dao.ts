export interface DAO<T> {
  get(id: number): Promise<T | null>;
  insert(obj: T): Promise<void>;
  update(obj: T): Promise<void>;
  delete(id: number): Promise<void>;
}