import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOauthUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsString()
  image?: string;
}