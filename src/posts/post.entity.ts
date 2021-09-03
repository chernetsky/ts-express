import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable,
} from 'typeorm';
import Category from '../category/category.entity';
import User from '../users/user.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  categories: Category[]
}

export default Post;
