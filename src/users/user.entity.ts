import {
  Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany,
} from 'typeorm';
import Post from '../posts/post.entity';
import Address from '../address/address.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @OneToOne(() => Address, (address: Address) => address.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post;
}

export default User;
