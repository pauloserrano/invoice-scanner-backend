import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsString()
  provider: "credentials" | "google";
}
