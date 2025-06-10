import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Providers2Service } from './providers2.service';
import { CreateProviders2Dto } from './dto/create-providers2.dto';
import { UpdateProviders2Dto } from './dto/update-providers2.dto';

@Controller('api/providers2')
export class Providers2Controller {
  constructor(private readonly providers2Service: Providers2Service) { }

  @Post()
  async create(@Body() createProviders2Dto: CreateProviders2Dto) {
    return await this.providers2Service.create({
      name: createProviders2Dto.name,
      authorization_code: createProviders2Dto.authorizationCode,
      address: createProviders2Dto.address,
    });
  }

  @Get()
  async findAll() {
    const data = await this.providers2Service.findAll();

    const formattedData = data.map((providers2) => {
      return {
        id: providers2.id,
        name: providers2.name,
        authorizationCode: providers2.authorization_code,
        address: providers2.address,
      };
    });

    return formattedData;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProviders2Dto: UpdateProviders2Dto) {
    return await this.providers2Service.update(+id, {
      name: updateProviders2Dto.name,
      authorization_code: updateProviders2Dto.authorizationCode,
      address: updateProviders2Dto.address,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.providers2Service.remove(+id);
  }
}
