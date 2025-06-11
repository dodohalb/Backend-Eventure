import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
//import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthMySQL } from 'src/repository/authMySQL';

@Injectable()
export class AuthService {
 /*
  constructor(private DAO: AuthMySQL, private readonly jwt: JwtService) {}
  
  private logger = new Logger(AuthService.name);

  /** 1. Benutzer über Telefonnummer + Passwort prüfen 
  async validateUser(phone: number, plainPw: string) {
    const user = await this.DAO.get(phone);      // <– DB-Zugriff
    if (!user || !(await bcrypt.compare(plainPw, user.pwHash))) {
      throw new UnauthorizedException('Wrong phone or password');
    }
    return { id: user.id, phone: user.phone };                // ohne pwHash
  }

  /** 2. Token erzeugen 
  async signJwt(payload: { sub: number; phone: string }) {
    return this.jwt.signAsync(payload);                       // ⟶ "Bearer …"
  
  }
 */
}
