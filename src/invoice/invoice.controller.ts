import { Body, Controller, Delete, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoiceService } from './invoice.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { DeleteInvoiceDto, UpdateInvoiceDto } from './dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}
  
  @Post("upload")
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return await this.invoiceService.handleFileUpload(file, +req.userId);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getInvoices(@Req() req: any) {
    return await this.invoiceService.getInvoices(+req.userId);
  }

  @Patch()
  @UseGuards(JwtGuard)
  @UsePipes(ValidationPipe)
  update(@Body() dto: UpdateInvoiceDto, @Req() req: any) {
    return this.invoiceService.updateInvoice(+req.userId, dto);
  }

  @Delete()
  @UseGuards(JwtGuard)
  @UsePipes(ValidationPipe)
  remove(@Body() dto: DeleteInvoiceDto, @Req() req: any) {
    return this.invoiceService.deleteInvoice(+req.userId, dto);
  }
}
