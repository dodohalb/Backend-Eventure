import { Address } from "./address";
import {
    IsOptional,
    IsString,
    IsDate,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from "./user";

export abstract class Event {

    @IsOptional()
    id?: number;

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

    creator: User;

    constructor(
        address: Address,
        picture: Buffer | null,
        name: string,
        description: string,
        date: Date,
        type: string,
        creator: User,
    ) {
        this.address = address;
        this.picture = picture;
        this.name = name;
        this.description = description;
        this.date = date;
        this.type = type;
        this.creator   = creator;
    }

    abstract getUsers():User[];
    
    getCreator(): User {
    return this.creator;
  }

}