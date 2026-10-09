import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Estudiar NestJS', minLength: 3, maxLength: 80 })
  @IsString()
  @Length(3, 80)
  title!: string;

  @ApiPropertyOptional({ example: 'Repasar controladores y DTO' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
