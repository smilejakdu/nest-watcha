import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersEntity } from '../entities/UsersEntity';
import { AuthService } from '../service/auth.service';
import { LocalSerializer } from '../shared/auth/local.serializer';
import { LocalStrategy } from '../shared/auth/local.strategy';

@Module({
	imports: [PassportModule.register({ session: true }), TypeOrmModule.forFeature([UsersEntity])],
	providers: [AuthService, LocalStrategy, LocalSerializer],
})
export class AuthModule {}
