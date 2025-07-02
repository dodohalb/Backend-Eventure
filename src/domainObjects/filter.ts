import { IsArray, IsDate, IsNumber, IsString, IsOptional } from "class-validator";

export class Filter {

    @IsString()
    type: string;

    @IsArray()
    @IsNumber({}, { each: true })
    contacts: number[];

    @IsDate()
    date: Date;

    @IsString()
    city: string;


    constructor(
        type: string,
        contacts: number[],
        date: Date,
        city: string
    ) {
        this.type = type;
        this.contacts = contacts;
        this.date = date;
        this.city = city;

    }
}