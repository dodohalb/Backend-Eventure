export interface DAO<T> {
  get(id: number): Promise<T | null>;
  insert(obj: T): Promise<T | null>;
  update(obj: T): Promise<T | null>;
  delete(id: number): Promise<T | null>;
}