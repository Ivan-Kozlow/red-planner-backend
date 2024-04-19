import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'

import { TimeBlockService } from './time-block.service'

import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { TimeBlockDto } from './dto/time-block.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Controller('user/time-blocks')
export class TimeBlockController {
	constructor(private readonly timeBlockService: TimeBlockService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') id: string) {
		return this.timeBlockService.getAll(id)
	}

	@Post()
	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async create(@Body() dto: TimeBlockDto, @CurrentUser('id') userId: string) {
		return this.timeBlockService.create(dto, userId)
	}

	@Put('update-order')
	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async updateOrder(@Body() updateDto: UpdateOrderDto) {
		return this.timeBlockService.updateOrder(updateDto.ids)
	}

	@Put(':timeBlockId')
	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async update(
		@Body() updateDto: TimeBlockDto,
		@CurrentUser('id') userId: string,
		@Param('timeBlockId') timeBlockId: string,
	) {
		return this.timeBlockService.update(updateDto, timeBlockId, userId)
	}

	@Delete(':timeBlockId')
	@Auth()
	@HttpCode(200)
	async delete(@Param('timeBlockId') timeBlockId: string, @CurrentUser('id') userId: string) {
		return this.timeBlockService.delete(timeBlockId, userId)
	}
}
