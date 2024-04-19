import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'

import { TaskService } from './task.service'

import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { TaskDto } from './dto/task.dto'

@Controller('user/tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.taskService.getAll(userId)
	}

	@Post()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	async create(@Body() dto: TaskDto, @CurrentUser('id') userId: string) {
		return this.taskService.create(dto, userId)
	}

	@Put(':taskId')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	async update(@Body() dto: TaskDto, @CurrentUser('id') userId: string, @Param('taskId') taskId: string) {
		return this.taskService.update(dto, taskId, userId)
	}

	@Delete(':taskId')
	@Auth()
	async delete(@Param('taskId') taskId: string, @CurrentUser('id') userId: string) {
		return this.taskService.delete(taskId, userId)
	}
}
