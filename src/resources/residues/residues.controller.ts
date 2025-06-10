import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { ResiduesService } from './residues.service';

import { CreateResidueDto } from './dto/create-residue.dto';
import { UpdateResidueDto } from './dto/update-residue.dto';

@Controller('api/residues')
export class ResiduesController {
  constructor(private readonly residuesService: ResiduesService) { }

  @Post()
  async create(@Body() createResidueDto: CreateResidueDto) {
    return await this.residuesService.create({
      name: createResidueDto.name,
      translated_name: createResidueDto.translatedName,
      materials: createResidueDto.materials,
    });
  }

  @Get()
  async findAll() {
    const data = await this.residuesService.findAll();

    const formattedData = data.map((resiude) => {
      return {
        id: resiude.id,
        name: resiude.name,
        translatedName: resiude.translated_name,
        materials: resiude.materials,
      };
    });

    return formattedData;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateResidueDto: UpdateResidueDto) {
    return await this.residuesService.update(+id, {
      name: updateResidueDto.name,
      translated_name: updateResidueDto.translatedName,
      materials: updateResidueDto.materials,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.residuesService.remove(+id);
  }
}
