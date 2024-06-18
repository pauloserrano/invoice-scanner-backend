import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateInvoiceDto {
  @IsNotEmpty()
  @IsInt()
  id: number

  @IsNotEmpty()
  @IsString()
  extractedText: string
}