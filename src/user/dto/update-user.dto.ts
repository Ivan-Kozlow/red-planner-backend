import { IsOptional, IsString, MinLength } from 'class-validator'
import { PomodoroSettingsDto } from './pomodoro-settings.dto'

export class UserUpdateDto extends PomodoroSettingsDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 characters long!' })
	password?: string

	@IsOptional()
	@IsString()
	email?: string
}
