import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas' })
  @ApiOkResponse({ type: [Task] })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiOkResponse({ type: Task })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una tarea' })
  @ApiCreatedResponse({ type: Task })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiConflictResponse({ description: 'Título duplicado' })
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea parcialmente' })
  @ApiOkResponse({ type: Task })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  @ApiConflictResponse({ description: 'Título duplicado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiNoContentResponse({ description: 'Tarea eliminada correctamente' })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    this.tasksService.remove(id);
  }
}
