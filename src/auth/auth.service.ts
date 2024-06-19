import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async login(loginUserDto:LoginUserDto){

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email}, // CONDICION DE BUSQUEDA
      select: {email: true, password: true, id: true} //SELECCIONANDO COLUMNAS A MOSTRAR
    });

    if(!user){
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    return {
      ...user,
      token: this.getJwtToken({id: user.id}) //GENERAMOS EL TOKEN JWT
    }

  }

  async checkAuthStatus(user: User){

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    }
  }

  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto;


      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      }

    }catch(error){

      this.handleDBErrors(error);
      
    }

  }

  private getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);

    return token;

  }

  private handleDBErrors(error: any):never{

    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }else{
      console.log(error);
      throw new InternalServerErrorException('Please check server logs');
    }

  }


}
