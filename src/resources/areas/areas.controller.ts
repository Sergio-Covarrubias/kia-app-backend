import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { AreasService } from './areas.service';

import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Controller('api/areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  async create(@Body() createAreaDto: CreateAreaDto) {
    return await this.areasService.create(createAreaDto);
  }

  @Get()
  async findAll() {
    return await this.areasService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return await this.areasService.update(+id, updateAreaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.areasService.remove(+id);
  }
}
