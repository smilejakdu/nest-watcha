import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersEntity } from '../database/entities/UsersEntity';
import { AuthService } from '../database/service/auth.service';
import { LocalSerializer } from '../shared/auth/local.serializer';
import { LocalStrategy } from '../shared/auth/strategy/local.strategy';

@Module({
	imports: [PassportModule.register({ session: true }), TypeOrmModule.forFeature([UsersEntity])],
	providers: [AuthService, LocalStrategy, LocalSerializer],
})
export class AuthModule {}
