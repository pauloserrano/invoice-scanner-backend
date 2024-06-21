import { IsNotEmpty, IsString } from "class-validator";

export class UpdateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  extractedText: string
}