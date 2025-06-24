export interface DAO<T> {
  get(id: number): Promise<T>;
  insert(obj: T): Promise<T>;
  update(obj: T): Promise<T>;
  delete(id: number): Promise<T>;
}
