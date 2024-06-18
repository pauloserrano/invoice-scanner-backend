import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Invoice, User } from '@prisma/client';
import { AwsService } from 'src/aws/aws.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInvoiceDto, DeleteInvoiceDto, UpdateInvoiceDto } from "./dto"

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

  async updateInvoice(userId: User["id"], dto: UpdateInvoiceDto) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: dto. id }})

    if (!invoice) throw new NotFoundException()

    if (invoice.userId !== userId) throw new UnauthorizedException()
    
    return await this.prisma.invoice.update({
      where: { id: dto.id },
      data: { extractedText: dto.extractedText }
    })
  }

  async deleteInvoice(userId: User["id"], dto: DeleteInvoiceDto) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: dto. id }})

    if (!invoice) throw new NotFoundException()

    if (invoice.userId !== userId) throw new UnauthorizedException()

    return await this.prisma.invoice.delete({
      where: { id: dto.id, userId }
    })
  }
}