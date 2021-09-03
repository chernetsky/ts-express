import {
  Column, Entity, PrimaryGeneratedColumn, OneToOne,
} from 'typeorm';
import User from '../users/user.entity';

@Entity()
class Address {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public country: string;

  @Column()
  public city: string;

  @Column()
  public street: string;

  @OneToOne(() => User, (user: User) => user.address)
  public user: User;
}

export default Address;
