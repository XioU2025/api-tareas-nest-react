import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Estudiar NestJS' })
  title!: string;

  @ApiPropertyOptional({ example: 'Repasar DTO y validación' })
  description?: string;

  @ApiProperty({ example: false })
  completed!: boolean;
}
