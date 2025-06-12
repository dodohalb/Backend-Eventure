import { Address } from "./address";
import {
  IsOptional,
  IsString,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export abstract class  Event {

    @ValidateNested()            
    @Type(() => Address)
    address: Address | null;

    @IsOptional()
    picture: Buffer | null;

    @IsString()
    name: string;

    @IsString()
    description: string;

    @Type(() => Date)
    @IsDate()
    date: Date;

    @IsString()
    type: string;

    @IsOptional()
    id: number;

    constructor(
        adress: Address,
        picture: Buffer | null,
        name: string,
        description: string,
        date: Date,
        type: string,
    ) {
        this.address = adress;
        this.picture = picture;
        this.name = name;
        this.description = description;
        this.date = date;
        this.type = type;
    }

}