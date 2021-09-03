import {
  Column, Entity, PrimaryGeneratedColumn, ManyToMany,
} from 'typeorm';
import Post from '../posts/post.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id?: string

  @Column({
    unique: true,
  })
  public name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  public posts: Post[]
}

export default Category;
