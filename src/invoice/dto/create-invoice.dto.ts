import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsInt()
  userId: number

  @IsNotEmpty()
  @IsString()
  extractedText: string
}