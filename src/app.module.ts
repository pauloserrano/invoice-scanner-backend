import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InvoiceModule } from './invoice/invoice.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, InvoiceModule, AwsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
