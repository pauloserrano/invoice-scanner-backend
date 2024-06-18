import { Injectable } from '@nestjs/common';
import { Invoice, User } from '@prisma/client';
import { AwsService } from 'src/aws/aws.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInvoiceDto } from "./dto"

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
  ) {}

  async handleFileUpload(file: Express.Multer.File, userId: number) {
    const data = await this.awsService.imageToText(file)
    const textBlocks = data.filter(b => b.BlockType === "LINE").map(b => b.Text)

    return this.createInvoice({ userId, extractedText: textBlocks.join("\n") })
  }

  async createInvoice({ userId, extractedText }: CreateInvoiceDto) {
    return await this.prisma.invoice.create({
      data: {
        userId,
        extractedText
      }
    })
  }

  async getInvoices(userId: User["id"]): Promise<Invoice[]> {
    return await this.prisma.invoice.findMany({ where: { userId } })
  }
}