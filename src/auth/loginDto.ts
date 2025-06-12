import { IsNumber, IsString } from 'class-validator';

export class LoginDto {


    @IsNumber()
    phoneNumber: number;
    @IsString()
    password: string;


    constructor(
        phoneNumber: number,
        password: string
    ) {
        this.phoneNumber = phoneNumber;
        this.password = password;
        
    }
}