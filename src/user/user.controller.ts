import { Body, Controller, Get, HttpCode, Put, UsePipes, ValidationPipe } from '@nestjs/common'

import { UserService } from './user.service'

import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserUpdateDto } from './dto/update-user.dto'

@Controller('user/profile')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@Auth()
	async profile(@CurrentUser('id') id: string) {
		return this.userService.getProfile(id)
	}

	@Put()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserUpdateDto) {
		return this.userService.update(id, dto)
	}
}
