import { PrismaService } from 'prisma/prisma.service'
import { Task } from '@prisma/client'
import { Injectable } from '@nestjs/common'

import { AuthDto } from 'src/auth/dto/auth.dto'
import { hash } from 'argon2'
import { UserUpdateDto } from './dto/update-user.dto'
import { startOfDay, subDays } from 'date-fns'

// TODO заменить обращение к бд (через призму) вызовом сервиса из определённого service (не забыть занести в exports своего модуля его и добавить в imports in module.ts)
@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	private getCountTasksBy(userId: string, args: Partial<Record<keyof Task, boolean | { [key: string]: unknown }>>) {
		const whereCondition = { userId }
		for (const key in args) {
			if (args[key]) {
				if (typeof args[key] !== 'object') whereCondition[key] = true
				else whereCondition[key] = args[key]
			}
		}

		return this.prisma.task.count({ where: whereCondition })
	}

	async getUserCharacteristics(userId: string) {
		const totalTasks = (await this.getById(userId)).tasks.length
		const completedTasks = await this.getCountTasksBy(userId, { isCompleted: true })

		const todayStart = startOfDay(new Date())
		const weekStart = startOfDay(subDays(todayStart, 7))

		const todayTasks = await this.getCountTasksBy(userId, {
			createdAt: {
				gte: todayStart.toISOString(),
			},
		})

		const weekTasks = await this.getCountTasksBy(userId, {
			createdAt: {
				gte: weekStart.toISOString(),
			},
		})

		return [
			{ label: 'Total tasks', value: totalTasks },
			{ label: 'Completed tasks', value: completedTasks },
			{ label: 'Today tasks', value: todayTasks },
			{ label: 'Week tasks', value: weekTasks },
		]
	}

	async getById(id: string) {
		return this.prisma.user.findUnique({ where: { id }, include: { tasks: true } })
	}

	getByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } })
	}

	async getProfile(id: string) {
		const profile = await this.getById(id)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...rest } = profile

		return {
			user: rest,
			statistics: await this.getUserCharacteristics(id),
		}
	}

	async create(dto: AuthDto) {
		const user = { email: dto.email, name: '', password: await hash(dto.password) }
		return this.prisma.user.create({ data: user })
	}

	async update(id: string, dto: UserUpdateDto) {
		let data = dto

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) }
		} else delete data.password

		return this.prisma.user.update({ where: { id }, data, select: { email: true, name: true } })
	}
}
