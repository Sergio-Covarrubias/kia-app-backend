import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { SctCodesService } from './sct-codes.service';

import { CreateSctCodeDto } from './dto/create-sct-code.dto';
import { UpdateSctCodeDto } from './dto/update-sct-code.dto';

@Controller('api/sct-codes')
export class SctCodesController {
  constructor(private readonly sctCodesService: SctCodesService) {}

  @Post()
  async create(@Body() createSctCodeDto: CreateSctCodeDto) {
    return await this.sctCodesService.create(createSctCodeDto);
  }

  @Get()
  async findAll() {
    return await this.sctCodesService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSctCodeDto: UpdateSctCodeDto) {
    return await this.sctCodesService.update(+id, updateSctCodeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.sctCodesService.remove(+id);
  }
}
