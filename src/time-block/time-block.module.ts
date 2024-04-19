import { PrismaService } from 'prisma/prisma.service'
import { Module } from '@nestjs/common'

import { TimeBlockService } from './time-block.service'

import { TimeBlockController } from './time-block.controller'

@Module({
	controllers: [TimeBlockController],
	providers: [TimeBlockService, PrismaService],
})
export class TimeBlockModule {}
