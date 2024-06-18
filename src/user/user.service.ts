import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Account, Providers, User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCredentialsUserDto, CreateOauthUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany({});
  }

  async findById(id: User["id"]): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    return user
  }

  async findByEmail(email: Account["email"]): Promise<Account & { User: User }> {
    const account = await this.prisma.account.findFirst({ 
      where: { email },
      include: { User: true } 
    });

    return account
  }

  async createWithCredentials(dto: CreateCredentialsUserDto) {
    const account = await this.findByEmail(dto.email)

    if (account && account.provider === Providers.CREDENTIAL) {
      throw new ConflictException()
    }

    if (!account) {
      return await this.prisma.user.create({
        data: {
          name: dto.name,
          image: dto.image,
          Account: {
            create: {
              email: dto.email,
              hash: hashSync(dto.password, 10),
              provider: Providers.CREDENTIAL
            }
          }
        }
      })
    }
    
    return await this.prisma.account.create({
      data: {
        email: dto.email,
        hash: hashSync(dto.password, 10),
        provider: Providers.CREDENTIAL,
        userId: account.User.id
      }
    })
  }

  async createWithOAuth(dto: CreateOauthUserDto) {
    const account = await this.findByEmail(dto.email)

    if (account && account.provider === Providers.GOOGLE) {
      throw new ConflictException()
    }

    if (!account) {
      return await this.prisma.user.create({
        data: {
          name: dto.name,
          image: dto.image,
          Account: {
            create: {
              email: dto.email,
              provider: Providers.GOOGLE
            }
          }
        }
      })
    }
    
    return await this.prisma.account.create({
      data: {
        email: dto.email,
        provider: Providers.GOOGLE,
        userId: account.User.id
      }
    })
  }

  async update(id: User["id"], updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log(updateUserDto)
    return `This action updates a #${id} user`;
  }

  async remove(id: User["id"]) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return `This action removes a #${id} user`;
  }
}
