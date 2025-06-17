import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FilterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column("int", { array: true })
  contacts: number[];

  @Column()
  date: Date;

  @Column()
  city: string;
}