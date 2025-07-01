import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/domainObjects/user';
import { DAO } from 'src/repository/dao';
import { UserRepo } from 'src/repository/user.repo';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserRepo) private readonly userRepo: DAO<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret-key',
    });
  }

  async validate(payload: { sub: number }) {
    const user = await this.userRepo.get(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user.id;
  }
}