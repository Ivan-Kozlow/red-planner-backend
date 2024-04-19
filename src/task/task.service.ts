import { PrismaService } from 'prisma/prisma.service'
import { Injectable } from '@nestjs/common'

import { TaskDto } from './dto/task.dto'

@Injectable()
export class TaskService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll(userId: string) {
		return this.prisma.task.findMany({ where: { userId } })
	}

	async create(dto: TaskDto, userId: string) {
		return this.prisma.task.create({ data: { ...dto, user: { connect: { id: userId } } } })
	}

	async update(dto: Partial<TaskDto>, taskId: string, userId: string) {
		return this.prisma.task.update({ where: { userId, id: taskId }, data: dto })
	}

	async delete(taskId: string, userId: string) {
		return this.prisma.task.delete({ where: { userId, id: taskId } })
	}
}
