import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public-metadata.decorator';
import { IJWTPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as Request & {
        user: { id: string; email: string };
      };

      // Check if there is public metadata true for the API being called
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      // If API route is public then we should not check ahead and return result
      if (isPublic) {
        return true;
      }

      // Fetch JWT token from api authorization header
      const jwtToken: string = request?.headers?.authorization;
      if (!jwtToken?.length) {
        return false;
      }

      const jwtPayload = this.jwtService.decode(jwtToken, {
        json: true,
      }) as IJWTPayload;

      // Basic check if the payload is defined or not
      if (!jwtPayload?.email || !jwtPayload.userId) {
        return false;
      }

      request.user = {
        id: jwtPayload.userId,
        email: jwtPayload.email,
      };
      return true;
    } catch (error) {
      Logger.error(`${error}`);
      return false;
    }
  }
}
