import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request } from 'express';
import { UserActivityLogger } from './user-activity.logger';

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
  constructor(private readonly logger: UserActivityLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    
    const startTime = Date.now();
    const method = request.method;
    const url = request.originalUrl || request.url;
    const ip = this.getClientIp(request);
    const userAgent = request.headers['user-agent'] || '-';
    const referer = request.headers['referer'] || '-';
    
    // JWT token dan user ma'lumotlarini olish (agar mavjud bo'lsa)
    const user = (request as any).user;
    const email = user?.email || (request.body?.email || '-');
    const userId = user?._id || user?.id || '-';
    const fullName = user?.fullName || '-';
    const role = user?.role || '-';

    // Action ni URL va method dan aniqlash
    const action = this.getActionFromRequest(method, url);

    return next.handle().pipe(
      tap((data) => {
        // Muvaffaqiyatli javob
        const statusCode = response.statusCode || 200;
        let responseSize = 0;
        try {
          responseSize = data ? JSON.stringify(data).length : 0;
        } catch (e) {
          responseSize = 0;
        }

        this.logger.logUserActivity({
          ip,
          email,
          userId: userId?.toString() || '-',
          method,
          url,
          userAgent,
          referer,
          statusCode,
          responseSize,
          action,
          fullName,
          role,
        });
      }),
      catchError((error) => {
        // Xatolik holati
        const statusCode = error.status || error.statusCode || 500;

        this.logger.logUserActivity({
          ip,
          email,
          userId: userId?.toString() || '-',
          method,
          url,
          userAgent,
          referer,
          statusCode,
          responseSize: 0,
          action,
          fullName,
          role,
          error: error.message || 'Unknown error',
        });

        throw error;
      }),
    );
  }

  private getClientIp(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (request.headers['x-real-ip'] as string) ||
      request.ip ||
      request.socket.remoteAddress ||
      '-'
    );
  }

  private getActionFromRequest(method: string, url: string): string {
    // URL dan action ni aniqlash
    const urlParts = url.split('/').filter(Boolean);
    
    if (url.includes('/auth/register')) return 'REGISTER';
    if (url.includes('/auth/login')) return 'LOGIN';
    if (url.includes('/auth/logout')) return 'LOGOUT';
    if (url.includes('/auth/oneid')) return 'ONEID_AUTH';
    
    if (url.includes('/user/update') || url.includes('/user/edit')) return 'UPDATE_PROFILE';
    if (url.includes('/user/edit-password')) return 'CHANGE_PASSWORD';
    
    if (url.includes('/course/create')) return 'CREATE_COURSE';
    if (url.includes('/course/update') || url.includes('/course/edit')) return 'UPDATE_COURSE';
    if (url.includes('/course/delete')) return 'DELETE_COURSE';
    
    if (url.includes('/lesson/create')) return 'CREATE_LESSON';
    if (url.includes('/lesson/edit') || url.includes('/lesson/update')) return 'UPDATE_LESSON';
    if (url.includes('/lesson/delete')) return 'DELETE_LESSON';
    if (url.includes('/lesson/complete')) return 'COMPLETE_LESSON';
    
    if (url.includes('/books/create')) return 'CREATE_BOOK';
    if (url.includes('/books/update')) return 'UPDATE_BOOK';
    if (url.includes('/books/delete')) return 'DELETE_BOOK';
    
    if (url.includes('/admin/create-user')) return 'ADMIN_CREATE_USER';
    if (url.includes('/admin/update-user')) return 'ADMIN_UPDATE_USER';
    if (url.includes('/admin/block-user')) return 'ADMIN_BLOCK_USER';
    if (url.includes('/admin/delete-user')) return 'ADMIN_DELETE_USER';
    
    // Method ga qarab aniqlash
    if (method === 'POST') return 'CREATE';
    if (method === 'PUT' || method === 'PATCH') return 'UPDATE';
    if (method === 'DELETE') return 'DELETE';
    if (method === 'GET') return 'VIEW';
    
    return 'UNKNOWN';
  }
}

