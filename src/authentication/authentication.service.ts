import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { getRepository } from 'typeorm';
import UserWithEmailAlreadyExistsException from '../exceptions/UserWithEmailAlreadyExistsException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import TokenData from '../interfaces/tokenData.interface';
import CreateUserDto from '../user/user.dto';
import User from '../user/user.entity';
import { Response } from 'express';

class AuthenticationService {
  private userRepository = getRepository(User);

  public async register(userData: CreateUserDto) {
    if (await this.userRepository.findOne({ email: userData.email })) {
      throw new UserWithEmailAlreadyExistsException(userData.email);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    user.password = undefined;
    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);
    return {
      cookie,
      user,
    };
  }

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  public createToken(user: User /*, isSecondFactorAuthenticated = false*/): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      // isSecondFactorAuthenticated,
      _id: user.id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public getTwoFactorAuthenticationCode() {
    const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
    });
    return {
      otpauthUrl: secretCode.otpauth_url,
      base32: secretCode.base32,
    };
  }

  public respondWithQRCode(data: string, response: Response) {
    QRCode.toFileStream(response, data);
  }

  // public verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode: string, user: User) {
  //   return speakeasy.totp.verify({
  //     secret: user.twoFactorAuthenticationCode,
  //     encoding: base32,
  //     token: twoFactorAuthenticationCode,
  //   });
  // }
}

export default AuthenticationService;
