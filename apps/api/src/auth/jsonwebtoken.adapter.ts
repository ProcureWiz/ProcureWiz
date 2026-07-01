import { Injectable } from '@nestjs/common';
import jwt, { type SignOptions } from 'jsonwebtoken';
import {
  type JwtAdapterContract,
  type JwtSignInput,
  type JwtVerifyInput,
} from './jwt-adapter.contract.js';
import { type JwtPayload } from './jwt.service.contract.js';

@Injectable()
export class JsonwebtokenAdapter implements JwtAdapterContract {
  sign(input: JwtSignInput): string {
    const options: SignOptions = {
      issuer: input.issuer,
      audience: input.audience,
      expiresIn: input.expiresInSeconds,
    };

    return jwt.sign(input.payload, input.secret, options);
  }

  verify(input: JwtVerifyInput): JwtPayload {
    return jwt.verify(input.token, input.secret, {
      issuer: input.issuer,
      audience: input.audience,
    }) as JwtPayload;
  }
}
