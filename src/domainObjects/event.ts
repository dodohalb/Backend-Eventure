import { Adress } from "./adress";
import { ChatMassage } from "./chatMessage";
import { User } from "./user";
import {
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export abstract class  Event {
    adress: Adress;
    @IsOptional()
    picture: Buffer | null;
    @IsString()
    name: string;
    @IsString()
    description: string;
    @IsString()
    date: String;
    @IsString()
    type: string;
    @IsOptional()
    id: number;

    constructor(
        adress: Adress,
        picture: Buffer | null,
        name: string,
        description: string,
        date: String,
        type: string,
    ) {
        this.adress = adress;
        this.picture = picture;
        this.name = name;
        this.description = description;
        this.date = date;
        this.type = type;
    }
    getAdress(): Adress {
        return this.adress;
    }
   
    getPicture(): Buffer | null {
        return this.picture;
    }
    getName(): string {
        return this.name;
    }
    getDescription(): string {
        return this.description;
    }
    getDate(): String {
        return this.date;
    }
    getType(): string {

        return this.type;
    }   
    getId(): number {
        return this.id;
    }
    setAdress(adress: Adress): void {
        this.adress = adress;
    }
    setPicture(picture: Buffer | null): void {
        this.picture = picture;
    }
    setName(name: string): void {
        this.name = name;
    }
    setDescription(description: string): void {
        this.description = description;
    }
    setDate(date: String): void {
        this.date = date;
    }
    setType(type: string): void {
        this.type = type;
    }
    setId(id: number): void {
        this.id = id;
    }

}