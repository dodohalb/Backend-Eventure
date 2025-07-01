import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  biographie: string;

  @Column()
  age: number;

  @Column({ type: 'varchar', unique: true })    // ← hier UNIQUE hinzu
  phoneNumber: string;

  @OneToOne(() => AddressEntity, {
    cascade: true,       // speichert die Adresse bei userRepo.save()
    eager: true,         // lädt Adresse automatisch mit
    onDelete: 'CASCADE', // löscht Adresse, wenn User gelöscht wird
  })
  @JoinColumn({ name: 'addressId' })
  address: AddressEntity;
}