import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { CreateCredentialsUserDto, CreateOauthUserDto } from 'src/user/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() dto: CreateCredentialsUserDto) {
    return await this.authService.signUp(dto)
  }

  @Post('signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() dto: SignInDto) {
    return this.authService.signIn(dto)
  }

  @Post("oauth")
  @UsePipes(ValidationPipe)
  async oauth(@Body() body: CreateOauthUserDto) {
    return this.authService.oauth(body)
  }

  @UseGuards(RefreshJwtGuard)
  @Post("refresh")
  async refreshToken(@Req() req: any) {
    return this.authService.refreshToken(req.user)
  }
}
