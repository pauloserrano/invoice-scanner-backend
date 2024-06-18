import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Providers, User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCredentialsUserDto, CreateOauthUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: User["id"]): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException();

    return user
  }

  async findByEmail(email: string, provider?: Providers): Promise<User> {
    return await this.prisma.user.findFirst({ 
      where: { 
        email,
        provider: provider || undefined
      }
    });
  }

  async createWithCredentials(dto: CreateCredentialsUserDto): Promise<User> {
    const user = await this.findByEmail(dto.email, Providers.CREDENTIAL)

    if (user) throw new ConflictException()

    return await this.prisma.user.create({
      data: {
        email: dto.email,
        provider: Providers.CREDENTIAL,
        hash: hashSync(dto.password, 10),
        name: dto.name,
        image: dto.image
      }
    })
  }

  async createWithOAuth(dto: CreateOauthUserDto): Promise<User> {
    const user = await this.findByEmail(dto.email, Providers.GOOGLE)

    if (user) throw new ConflictException()

    return await this.prisma.user.create({
      data: {
        email: dto.email,
        provider: Providers.GOOGLE,
        name: dto.name,
        image: dto.image
      }
    })
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
