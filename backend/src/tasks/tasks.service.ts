import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Preparar presentación',
      description: 'Revisar las diapositivas del proyecto',
      completed: false,
    },
    {
      id: 2,
      title: 'Practicar API',
      description: 'Probar los endpoints desde Swagger',
      completed: true,
    },
  ];

  private nextId = 3;

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) {
      throw new NotFoundException(`No existe la tarea con id ${id}`);
    }
    return task;
  }

  create(dto: CreateTaskDto): Task {
    const duplicated = this.tasks.some(
      (task) => task.title.toLowerCase() === dto.title.toLowerCase(),
    );

    if (duplicated) {
      throw new ConflictException('Ya existe una tarea con ese título');
    }

    const task: Task = {
      id: this.nextId++,
      title: dto.title,
      description: dto.description,
      completed: dto.completed ?? false,
    };

    this.tasks.push(task);
    return task;
  }

  update(id: number, dto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    if (
      dto.title &&
      this.tasks.some(
        (item) =>
          item.id !== id &&
          item.title.toLowerCase() === dto.title!.toLowerCase(),
      )
    ) {
      throw new ConflictException('Ya existe otra tarea con ese título');
    }

    Object.assign(task, dto);
    return task;
  }

  remove(id: number): void {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new NotFoundException(`No existe la tarea con id ${id}`);
    }

    this.tasks.splice(index, 1);
  }
}
