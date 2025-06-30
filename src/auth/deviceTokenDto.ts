// src/dto/save-push-token.dto.ts
import { IsString, IsIn, IsOptional } from 'class-validator';

export class DeviceTokenDto {
  
  
  
  @IsOptional()
  id?: number; 

  @IsOptional()
  userId: number; 

  @IsString()
  token: string;

  @IsIn(['ios', 'android'])
  platform: 'ios' | 'android';
}