import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'

import { UserService } from 'src/user/user.service'

import { AuthDto } from './dto/auth.dto'
import { verify } from 'argon2'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private readonly userService: UserService,
		private readonly jwt: JwtService,
	) {}

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto)
		return { user, ...this.issueToken(user.id) }
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email)
		if (oldUser) throw new BadRequestException('User already exists')
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto)

		return { user, ...this.issueToken(user.id) }
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.getById(result.id)
		const tokens = this.issueToken(user.id)

		return { user, ...tokens }
	}

	private issueToken(userId: string) {
		const data = { id: userId }
		const accessToken = this.jwt.sign(data, { expiresIn: '1h' })
		const refreshToken = this.jwt.sign(data, { expiresIn: '7d' })

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new NotFoundException('User not found')
		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: 'localhost',
			secure: true,
			expires: expiresIn,
			sameSite: 'lax',
		})
	}

	removeRefreshTokenToResponse(res: Response) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: 'localhost',
			secure: true,
			expires: new Date(0),
			sameSite: 'lax',
		})
	}
}
