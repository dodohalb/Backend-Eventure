import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepo } from 'src/repository/user.repo';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepo: UserRepo) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret-key',
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.userRepo.getUserByPhone(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}