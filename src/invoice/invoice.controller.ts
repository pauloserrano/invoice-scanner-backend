import { Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoiceService } from './invoice.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

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
}
