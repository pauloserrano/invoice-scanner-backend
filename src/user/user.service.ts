import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Account, Providers, User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCredentialsUserDto, CreateOauthUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: User["id"]): Promise<User & { Account: Account[] }> {
    const user = await this.prisma.user.findUnique({ 
      where: { id }, 
      include: { Account: true } 
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user
  }

  async findByEmail(email: string, provider?: string): Promise<Account & { User: User }> {
    const account = await this.prisma.account.findFirst({ 
      where: { email, provider: provider === "google" ? Providers.GOOGLE : Providers.CREDENTIAL },
      include: { User: true } 
    });
    
    return account
  }

  async createWithCredentials(dto: CreateCredentialsUserDto): Promise<Account & { User: User }> {
    const account = await this.findByEmail(dto.email, "credentials")

    if (account && account.provider === Providers.CREDENTIAL) {
      throw new ConflictException()
    }

    if (!account) {
      const { Account, ...user } = await this.prisma.user.create({
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
        },
        include: { Account: true }
      })
      
      return {
        ...Account[0],
        User: { ...user }
      }
    }

    const { User, ...accountDetails } = await this.prisma.account.create({
      data: {
        email: dto.email,
        hash: hashSync(dto.password, 10),
        provider: Providers.CREDENTIAL,
        userId: account.User.id
      },
      include: { User: true }
    })

    return {
      User,
      ...accountDetails
    }
  }

  async createWithOAuth(dto: CreateOauthUserDto): Promise<Account & { User: User }> {
    const account = await this.findByEmail(dto.email, "google")

    if (account && account.provider === Providers.GOOGLE) {
      throw new ConflictException()
    }

    if (!account) {
      const { Account, ...user } = await this.prisma.user.create({
        data: {
          name: dto.name,
          image: dto.image,
          Account: {
            create: {
              email: dto.email,
              provider: Providers.GOOGLE
            }
          }
        },
        include: { Account: true }
      })

      return {
        ...Account[0],
        User: { ...user }
      }
    }
    
    const { User, ...accountDetails } = await this.prisma.account.create({
      data: {
        email: dto.email,
        provider: Providers.GOOGLE,
        userId: account.User.id
      },
      include: { User: true }
    })

    return {
      User,
      ...accountDetails
    }
  }

  // TODO: Implement update method
  async update(id: User["id"], updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log(updateUserDto)
    return `This action updates a #${id} user`;
  }

  // TODO : Implement remove method
  async remove(id: User["id"]) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return `This action removes a #${id} user`;
  }
}
