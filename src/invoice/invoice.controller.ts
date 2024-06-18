import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoiceService } from './invoice.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}
  
  @Post("upload")
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.invoiceService.handleFileUpload(file);
  }

  @Post()
  @UseGuards(JwtGuard)
  test(@Req() req: any) {
    return this.invoiceService.testing(req.userId)
  }
}
