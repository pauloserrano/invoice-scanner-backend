import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCredentialsUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsString()
  image?: string;
}