import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AwsService } from 'src/aws/aws.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
    private readonly authService: AuthService,
  ) {}

  async handleFileUpload(file: Express.Multer.File) {
    //const text = await this.awsService.imageToText(file);
    const text = await this.awsService.imageToTextMock(file);
    return { text }
  }

  async testing(userId: number) {
    console.log(userId)
    return
  }
}