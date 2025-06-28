import { FindOptionsOrder, FindOptionsWhere } from "typeorm";

export interface DAO<D, E = D> {
  get(id: number): Promise<D>;
  getAll(D): Promise<D[]>;
  insert(obj: D): Promise<D>;
  update(obj: D): Promise<D>;
  delete(id: number): Promise<D>;
  
  
  findOne(where: FindOptionsWhere<E>, opts?: {
      order?: FindOptionsOrder<E>;
      relations?: string[];
    }): Promise<D | null>;
  
  
    findMany(where: FindOptionsWhere<E>, opts?: {
      order?: FindOptionsOrder<E>;
      relations?: string[];
    }): Promise<D[]>;
}
