import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { TaskModule } from './task/task.module';
import { TimeBlockModule } from './time-block/time-block.module';
import { PomodoroModule } from './pomodoro/pomodoro.module';

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, UserModule, TaskModule, TimeBlockModule, PomodoroModule],
})
export class AppModule {}
