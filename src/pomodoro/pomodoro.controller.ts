import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'

import { PomodoroService } from './pomodoro.service'

import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { PomodoroRoundDto, PomodoroSessionDto } from './dto/pomodoro.dto'

@Controller('user/timer')
export class PomodoroController {
	constructor(private readonly pomodoroService: PomodoroService) {}

	@Get('today')
	@Auth()
	async getTodaySession(@CurrentUser('id') userId: string) {
		return this.pomodoroService.getTodaySession(userId)
	}

	@Post()
	@Auth()
	@HttpCode(200)
	async create(@CurrentUser('id') userId: string) {
		return this.pomodoroService.create(userId)
	}

	@Put('round/:id')
	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async updateRound(@Param('id') id: string, @Body() dto: PomodoroRoundDto) {
		return this.pomodoroService.updateRound(dto, id)
	}

	@Put(':id')
	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async update(@Param('id') id: string, @Body() dto: PomodoroSessionDto, @CurrentUser('id') userId: string) {
		return this.pomodoroService.update(dto, userId, id)
	}

	@Delete(':id')
	@Auth()
	@HttpCode(200)
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.pomodoroService.deleteSession(id, userId)
	}
}
