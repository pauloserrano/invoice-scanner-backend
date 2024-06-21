import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { CreateCredentialsUserDto, CreateOauthUserDto } from 'src/user/dto';
import { SignInDto, JwtPayload } from './dto';
import { Providers, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async getSafeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      provider: user.provider
    }
  }

  async validateUser(dto: SignInDto): Promise<User> {    
    const user = await this.userService.findByEmail(dto.email, this.getProvider(dto.provider));
    if (!user) {
      throw new UnauthorizedException()
    }

    const isAccessValid = (user.provider === Providers.GOOGLE || compareSync(dto.password, user.hash))
    if(!isAccessValid) {
      throw new UnauthorizedException()
    }

    return user
  }

  async signIn(dto: SignInDto) {
    const user = await this.validateUser(dto)
    
    const payload = this.getPayload(user.id)
    const tokens = await this.getTokens(payload)

    return {
      user: await this.getSafeUser(user),
      ...tokens
    }
  }

  async signUp(dto: CreateCredentialsUserDto) {
    return await this.userService.createWithCredentials(dto)
  }

  async oauth(dto: CreateOauthUserDto) {
    let user = await this.userService.findByEmail(dto.email, this.getProvider(dto.provider))

    if (!user) {
      user = await this.userService.createWithOAuth(dto)
    }

    return this.signIn({ email: dto.email, provider: dto.provider })
  }

  getProvider(provider: string): Providers {
    switch (provider) {
      case "google":
        return Providers.GOOGLE
      
      case "credentials":
        return Providers.CREDENTIAL
    
      default:
        throw new BadRequestException("Invalid provider")
    }
  }

  getPayload(userId: User["id"]): JwtPayload {
    return { sub: userId }
  }

  async getTokens(payload: JwtPayload) {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
        secret: process.env.JWT_REFRESH_SECRET
      })
    }
  }
}
