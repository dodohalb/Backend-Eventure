import { IsNumber, IsString, ValidateNested } from "class-validator";
import { Address } from "./address";
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
    @Type(() => Address)
    adress: Address;




    constructor(
        name: string,
        biographie: string,
        age: number,
        phoneNumber: number,
        adress: Address
    ) {
        this.name = name;
        this.biographie = biographie;
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.adress = adress;
        
    }
}