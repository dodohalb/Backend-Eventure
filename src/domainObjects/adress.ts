import { IsNumber, IsString } from "class-validator";

export class Adress {
    
    @IsString()
    street: string;

    @IsString()
    number: string;

    @IsNumber()
    postalCode: number;

    @IsString() 
    city: string;
    
    constructor(
        street: string,
        number: string,
        postalCode: number,
        city: string
    ) {
        this.street = street;
        this.number = number;
        this.postalCode = postalCode;
        this.city = city;
        
    }
}