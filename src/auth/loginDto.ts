import { IsNumber, IsString } from 'class-validator';

export class LoginDto {


    @IsString()
    phoneNumber: string;
    @IsString()
    password: string;


    constructor(
        phoneNumber: string,
        password: string
    ) {
        this.phoneNumber = phoneNumber;
        this.password = password;
    }
}