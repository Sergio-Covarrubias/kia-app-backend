import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { ResiduesService } from './residues.service';

import { CreateResidueDto } from './dto/create-residue.dto';
import { UpdateResidueDto } from './dto/update-residue.dto';

@Controller('api/residues')
export class ResiduesController {
  constructor(private readonly residuesService: ResiduesService) { }

  @Post()
  async create(@Body() createResidueDto: CreateResidueDto) {
    return await this.residuesService.create(createResidueDto);
  }

  @Get()
  async findAll() {
    return await this.residuesService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateResidueDto: UpdateResidueDto) {
    return await this.residuesService.update(+id, updateResidueDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.residuesService.remove(+id);
  }
}
