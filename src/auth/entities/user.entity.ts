import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;
    
    @Column({
        type: 'text',
        select: false //NO MOSTRAR CONTRASEÑA CUANDO SE HAGA RELACIONES O MUESTRA DE INFORMACION
    })
    password: string;

    @Column('text')
    fullname: string;

    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user,
    )
    product: Product;

    @BeforeInsert()
    checkFieldBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.checkFieldBeforeInsert();
    }

}
