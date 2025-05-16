import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { ManagersService } from './managers.service';

import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';

@Controller('api/managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  async create(@Body() createManagerDto: CreateManagerDto) {
    return await this.managersService.create(createManagerDto);
  }

  @Get()
  async findAll() {
    return await this.managersService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return await this.managersService.update(+id, updateManagerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.managersService.remove(+id);
  }
}
