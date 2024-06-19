import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService:ProductsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async runSeed(){

    await this.deleteTables();

    const adminUser = await this.insertUsers();

    this.insertNewProducts(adminUser);

    return 'SEED EXECUTED';

  }

  private async deleteTables(){

    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
      .delete()
      .where({})
      .execute()


  }

  private async insertUsers(){

    const seedUser = initialData.users;

    const users: User[] = [];

    seedUser.forEach(({password, ...rest}) => {
      users.push(this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password, 10)
      }))
    })

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];

  }

  private async insertNewProducts(user:User){

    this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      //ESPERANDO A QUE TODAS LAS PROMIESES DEL CREATE SE RESUELVAN
      insertPromises.push(this.productsService.create(product, user));
    })

    await Promise.all(insertPromises);

    return true;

  }

}
