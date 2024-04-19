import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'

import { AuthService } from './auth.service'

import { getJwtConfig } from 'src/config/jwt.config'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'

@Module({
	imports: [
		UserModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
