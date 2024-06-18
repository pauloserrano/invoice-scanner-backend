import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { CreateCredentialsUserDto, CreateOauthUserDto } from 'src/user/dto';
import { SignInDto, JwtPayload } from './dto';
import { Account, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async getSafeAccount(account: Account & { User: User }) {
    return {
      id: account.id,
      name: account.User.name,
      email: account.email,
      image: account.User.image
    }
  }

  async validateAccount(dto: SignInDto) {
    const account = await this.userService.findByEmail(dto.email, dto.provider);
    if (!account) {
      throw new UnauthorizedException()
    }

    if (account.provider !== "CREDENTIAL"){
      return this.getSafeAccount(account)
    }

    const isPasswordValid = compareSync(dto.password, account.hash)
    if(!isPasswordValid && dto.provider === "credentials") {
      throw new UnauthorizedException()
    }

    return this.getSafeAccount(account)
  }

  async signUp(dto: CreateCredentialsUserDto) {
    return await this.userService.createWithCredentials(dto)
  }

  async signIn(dto: SignInDto) {
    const user = await this.validateAccount(dto)
    
    const payload: JwtPayload = { sub: user.id }
    const tokens = await this.getTokens(payload)

    return {
      user,
      ...tokens
    }
  }

  async oauth(dto: CreateOauthUserDto) {
    let account = await this.userService.findByEmail(dto.email, dto.provider)

    if (!account || account?.provider !== "GOOGLE") {
      account = await this.userService.createWithOAuth(dto)
    }
    
    const payload: JwtPayload = { sub: account.User.id }
    const tokens = await this.getTokens(payload)

    return {
      user: await this.getSafeAccount(account),
      ...tokens
    }
  }

  async getTokens(payload: JwtPayload) {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
        secret: process.env.JWT_REFRESH_SECRET
      })
    }
  }
}
