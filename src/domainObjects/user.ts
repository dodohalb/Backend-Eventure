import { IsNumber, IsString, ValidateNested } from "class-validator";
import { Adress } from "./adress";
import { Type } from "class-transformer";

export class User {
    

    @IsString()
    name: string;

    @IsString()
    biographie: string;

    @IsNumber()
    age: number;

    @IsNumber()
    phoneNumber: number;
    
    @ValidateNested()    
    @Type(() => Adress)
    adress: Adress;




    constructor(
        name: string,
        biographie: string,
        age: number,
        phoneNumber: number,
        adress: Adress
    ) {
        this.name = name;
        this.biographie = biographie;
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.adress = adress;
        
    }
}