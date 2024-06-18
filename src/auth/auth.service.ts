import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignInDto, JwtPayload } from './dto';
import { CreateCredentialsUserDto, CreateOauthUserDto } from 'src/user/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(dto: SignInDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException()
    }

    const isPasswordValid = compareSync(dto.password, user.hash)
    if(!isPasswordValid) {
      throw new UnauthorizedException()
    }

    delete user.hash

    return user
  }

  async signUp(dto: CreateCredentialsUserDto) {
    return await this.userService.createWithCredentials(dto)
  }

  async signIn(dto: SignInDto) {
    const user = await this.validateUser(dto)
    
    const payload: JwtPayload = { sub: user.id }

    return {
      user,
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

  async oauth(dto: CreateOauthUserDto) {
    return await this.userService.createWithOAuth(dto)
  }

  async refreshToken(payload: JwtPayload) {
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
