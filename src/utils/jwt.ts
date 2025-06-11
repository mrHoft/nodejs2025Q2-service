import * as crypto from 'crypto';

export interface JwtPayload {
  userId: string;
  login: string;
  iat?: number;
  exp?: number;
}

export class JwtUtils {
  private static base64UrlEncode(str: Buffer): string {
    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  private static base64UrlDecode(str: string): Buffer {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return Buffer.from(str, 'base64');
  }

  static sign(payload: JwtPayload, secret: string, expiresIn: string): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    payload.iat = now;

    // Parse expiresIn (e.g., '1h', '24h')
    const timeValue = parseInt(expiresIn);
    const timeUnit = expiresIn.replace(timeValue.toString(), '');

    let seconds = timeValue;
    if (timeUnit === 'h') seconds *= 3600;
    else if (timeUnit === 'm') seconds *= 60;
    else if (timeUnit === 'd') seconds *= 86400;

    payload.exp = now + seconds;

    const encodedHeader = this.base64UrlEncode(Buffer.from(JSON.stringify(header)));
    const encodedPayload = this.base64UrlEncode(Buffer.from(JSON.stringify(payload)));

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest();

    const encodedSignature = this.base64UrlEncode(signature);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  static verify(token: string, secret: string): JwtPayload {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      throw new Error('Invalid token format');
    }

    const signature = this.base64UrlDecode(encodedSignature);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest();

    if (!crypto.timingSafeEqual(signature, expectedSignature)) {
      throw new Error('Invalid token signature');
    }

    const payload: JwtPayload = JSON.parse(
      this.base64UrlDecode(encodedPayload).toString(),
    );

    if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return payload;
  }
}
