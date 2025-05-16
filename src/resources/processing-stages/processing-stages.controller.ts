import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { ProcessingStagesService } from './processing-stages.service';

import { CreateProcessingStageDto } from './dto/create-processing-stage.dto';
import { UpdateProcessingStageDto } from './dto/update-processing-stage.dto';

@Controller('api/processing-stages')
export class ProcessingStagesController {
  constructor(private readonly processingStagesService: ProcessingStagesService) {}

  @Post()
  async create(@Body() createProcessingStageDto: CreateProcessingStageDto) {
    return await this.processingStagesService.create(createProcessingStageDto);
  }

  @Get()
  async findAll() {
    return await this.processingStagesService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProcessingStageDto: UpdateProcessingStageDto) {
    return await this.processingStagesService.update(+id, updateProcessingStageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.processingStagesService.remove(+id);
  }
}
