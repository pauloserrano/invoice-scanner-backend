import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteInvoiceDto {
  @IsNotEmpty()
  @IsInt()
  id: number
}