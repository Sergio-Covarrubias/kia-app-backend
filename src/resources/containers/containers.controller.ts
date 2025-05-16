import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { ContainersService } from './containers.service';

import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';

@Controller('api/containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post()
  async create(@Body() createContainerDto: CreateContainerDto) {
    return await this.containersService.create(createContainerDto);
  }

  @Get()
  async findAll() {
    return await this.containersService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateContainerDto: UpdateContainerDto) {
    return await this.containersService.update(+id, updateContainerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.containersService.remove(+id);
  }
}
