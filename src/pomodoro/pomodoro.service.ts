import { PrismaService } from 'prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'

import { PomodoroRoundDto, PomodoroSessionDto } from './dto/pomodoro.dto'

@Injectable()
export class PomodoroService {
	constructor(private readonly prisma: PrismaService) {}

	async getTodaySession(userId: string) {
		const today = new Date().toISOString().split('T')[0]

		// FIXME при готовом front попробовать заменить orderBy на isCompleted: 'asc', вместо id: 'asc'
		return this.prisma.pomodoroSession.findFirst({
			where: { userId, createdAt: { gte: new Date(today) } },
			include: { rounds: { orderBy: { id: 'asc' } } },
		})
	}

	async create(userId: string) {
		const todaySession = await this.getTodaySession(userId)
		if (todaySession) return todaySession

		// TODO брать данный метод из userService
		const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { intervalsCount: true } })
		if (!user) throw new NotFoundException('User not found')

		return this.prisma.pomodoroSession.create({
			data: {
				rounds: {
					createMany: { data: Array.from({ length: user.intervalsCount }, () => ({ totalSeconds: 0 })) },
				},
				user: { connect: { id: userId } },
			},
			include: { rounds: true },
		})
	}

	async update(dto: Partial<PomodoroSessionDto>, userId: string, pomodoroId: string) {
		return this.prisma.pomodoroSession.update({
			where: { userId, id: pomodoroId },
			data: dto,
		})
	}

	async updateRound(dto: Partial<PomodoroRoundDto>, roundId: string) {
		return this.prisma.pomodoroRound.update({
			where: { id: roundId },
			data: dto,
		})
	}

	async deleteSession(sessionId: string, userId: string) {
		return this.prisma.pomodoroSession.delete({ where: { userId, id: sessionId } })
	}
}
