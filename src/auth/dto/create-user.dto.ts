import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{

    @ApiProperty({
        default: 'User Email',
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        default: 'User Password',
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    // @IsStrongPassword() 
    password: string;
    
    @ApiProperty({
        default: 'User Fullname',
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    fullname: string;

}