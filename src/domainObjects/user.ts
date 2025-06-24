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

    @IsString()
    phoneNumber: string;
    
    @ValidateNested()    
    @Type(() => Address)
    address: Address;




    constructor(
        name: string,
        biographie: string,
        age: number,
        phoneNumber: string,
        address: Address
    ) {
        this.name = name;
        this.biographie = biographie;
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.address = address;
        
    }
}