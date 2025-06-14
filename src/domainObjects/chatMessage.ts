import { IsDate, IsOptional, IsString, ValidateNested } from "class-validator";
import { User } from "./user";
import { Type } from "class-transformer";


export class ChatMessage {

    @IsOptional()
    messageId: number;

    @ValidateNested()
    @Type(() => User)
    user: User;

    @IsString()
    content: string;

    @Type(() => Date)
    @IsDate()
    timestamp: Date;

    
    constructor(){}
}