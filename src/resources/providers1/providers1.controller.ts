import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { Providers1Service } from './providers1.service';

import { CreateProviders1Dto } from './dto/create-providers1.dto';
import { UpdateProviders1Dto } from './dto/update-providers1.dto';

@Controller('api/providers1')
export class Providers1Controller {
  constructor(private readonly providers1Service: Providers1Service) {}

  @Post()
  async create(@Body() createProviders1Dto: CreateProviders1Dto) {
    return await this.providers1Service.create({
        name: createProviders1Dto.name,
        semarnat_code: createProviders1Dto.semarnatCode,
    });
  }

  @Get()
  async findAll() {
    return await this.providers1Service.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProviders1Dto: UpdateProviders1Dto) {
    return await this.providers1Service.update(+id, {
        name: updateProviders1Dto.name,
        semarnat_code: updateProviders1Dto.semarnatCode,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.providers1Service.remove(+id);
  }
}
