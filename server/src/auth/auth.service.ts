import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signinLocal(authDto: AuthDto) {
    // retrieve user
    const user = await this.usersService.findOneByEmail(authDto.email);
    if (!user) throw new UnauthorizedException('Credentials incorrect');

    const isMatch = await bcrypt.compare(authDto.password, user.passwordHash);

    if (!isMatch) throw new UnauthorizedException('Credentials incorrect');

    const token =  this.signUser(user._id, user.email, 'user');
    return { token, username: user.userName, isAdmin: user.isAdmin};
  }

  signUser(userId: string, email: string, type: string) {
    return this.jwtService.sign({
      userId,
      email,
      type: type,
    });
  }
}
