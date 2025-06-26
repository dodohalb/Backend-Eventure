import { IsNumber, IsString, IsOptional } from 'class-validator';


export class LoginDto {

    @IsOptional()
    id?: number;

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