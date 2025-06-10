import { Controller, Get, Post, Put, Delete, Body, Req, Res, Query, BadRequestException, Param } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

import { createError, handleError } from '@utils/handle-error';
import parseDate from '@utils/parse-date';

import { FormsService } from './forms.service';

import { FormDto } from './dto/create-form.dto';
import { DashboardDataDTO } from './dto/dashboard-data.dto';
import { BinnacleDataDTO } from './dto/binnacle-data.dto';

const WORKSHEETS = [
  {
    headers: [
      'Item', 'Nombre del residuo', 'Tipo de contenedor', 'Cantidad generada Ton.',
      'C', 'R', 'E', 'T', 'Te', 'Th', 'Tt', 'I', 'B', 'M',
      'Area o proceso de generacion', 'Fecha de ingreso', 'Fecha de salida',
      'Art. 71 fracción I inciso (e)', 'Nombre, denominación o razón social',
      'Número de autorización SEMARNAT', 'Número de autorización SCT',
      'Nombre, denominación o razón social', 'Número de autorización',
      'Nombre, Responsable Técnico'
    ],
    headersWidth: [
      10, 76, 22, 26,
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      30, 20, 20,
      28, 37,
      35, 30,
      38, 27,
      31
    ]
  },
  {
    headers: ['', 'Hazardous Waste_name', 'Translate'],
    headersWidth: [6, 120, 120]
  },
];

@Controller('api/forms')
export class FormsController {
  constructor(private readonly formService: FormsService) { }

  @Get()
  async getPaginated(@Query('query') queryQ: string, @Query('page') pageQ: string, @Query('limit') limitQ: string, @Query('startDate') startDateQ: string) {
    try {
      const page = +pageQ;
      if (isNaN(page) || page <= 0) {
        throw createError(BadRequestException, 'page', 'Page number must be greater than 0');
      }

      const limit = +limitQ;
      if (isNaN(limit) || limit <= 0) {
        throw createError(BadRequestException, 'limit', 'Limit number must be greater than 0');
      }

      const query = queryQ || '';
      const startDate = startDateQ || '';
      return await this.formService.getPaginated(query, page, limit, startDate);
    } catch (error: any) {
      return handleError(error);
    }
  }

  @Get('options')
  async getFormOptions() {
    return await this.formService.getFormOptions();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    try {
      if (isNaN(+id)) {
        throw createError(BadRequestException, 'invalidId', 'Id must be a number');
      }

      return await this.formService.get(+id);
    } catch (error: any) {
      return handleError(error);
    }
  }

  @Post()
  async create(@Req() req: any, @Body() createFormDto: FormDto) {
    return await this.formService.pcreate(req.user.id, createFormDto);
    //return await this.formService.create(req.user.id, createFormDto);
  }

  @Put(':id')
  async put(@Param('id') id: string, @Body() createFormDto: FormDto) {
    try {
      if (isNaN(+id)) {
        throw createError(BadRequestException, 'invalidId', 'Id must be a number');
      }

      return await this.formService.update(+id, createFormDto);
    } catch (error: any) {
      return handleError(error);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      if (isNaN(+id)) {
        throw createError(BadRequestException, 'invalidId', 'Id must be a number');
      }

      return await this.formService.pdelete(+id);
      //return await this.formService.remove(+id);
    } catch (error: any) {
      return handleError(error);
    }
  }

  @Post('dashboard-data')
  async retrieveDashboardData(@Body() dashboardDataDto: DashboardDataDTO) {
    return await this.formService.retrieveDashboardData(dashboardDataDto);
  }

  @Post('binnacle')
  async generateBinnacle(@Body() binnacleDataDto: BinnacleDataDTO, @Res() res: any) {
    try {
      const [binnacleData, residueNames] = await this.formService.retrieveBinnacleData(binnacleDataDto);

      const workbook = new ExcelJS.Workbook();

      // ~~~ First Page ~~~ //

      {
        // Format binnacle data
        const parseMaterials = (materials: string) => Array(...materials).map((material: string) => material === 'X' ? 'X' : '');

        const formattedData = binnacleData.map((entry, index) => {
          return [
            index + 1,
            entry['residue.name'],
            entry['container.name'],
            entry.tons,
            ...parseMaterials(entry['residue.materials']),
            entry['area.name'],
            parseDate(entry.entry_date),
            entry.exit_date ? parseDate(entry.exit_date) : '',
            entry['processing_stage.name'],
            entry['provider_1.name'],
            entry['provider_1.semarnat_code'],
            entry['sct_code.code'],
            entry['provider_2.name'],
            entry['provider_2.authorization_code'] || '',
            entry['manager.name']
          ];
        });

        const worksheet1 = workbook.addWorksheet(binnacleDataDto.startDate);

        // Columns' width
        const columns = WORKSHEETS[0].headersWidth.map((width) => {
          return {
            width: width,
          };
        })
        worksheet1.columns = columns;

        // Title row data
        let titleRowData: string[] = [];
        for (let i = 0; i < Math.floor(WORKSHEETS[0].headers.length / 2); i++) {
          titleRowData.push('');
        }
        titleRowData.push('BITACORA DE RESIDUOS PELIGROSOS');
        worksheet1.addRow(titleRowData);

        // Title row style
        const titleRow = worksheet1.getRow(1);
        titleRow.height = 70;
        titleRow.eachCell((cell) => {
          cell.font = {
            bold: true,
          };
          cell.alignment = {
            vertical: 'middle',
          };
        });

        // Kia logo in the title row
        const imageId = workbook.addImage({
          buffer: fs.readFileSync('src/assets/kia-logo.png'),
          extension: 'png',
        });
        worksheet1.addImage(imageId, {
          tl: { col: 1, row: 0.1 },
          ext: { width: 150, height: 50 },
        });

        // Insert data
        worksheet1.addRow(WORKSHEETS[0].headers)
        worksheet1.addRows(formattedData);

        // Header styling
        const headerRow = worksheet1.getRow(2);
        headerRow.height = 50;
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '000000' },
          };
          cell.font = {
            bold: true,
            color: { argb: 'FFFFFF' },
          };
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        });

        // Format data cells
        const dataStartRow = 3;
        for (let i = 0; i < formattedData.length; i++) {
          const row = worksheet1.getRow(dataStartRow + i);
          row.height = 40;

          row.eachCell((cell, colNumber) => {
            // Center vertically and horizontally
            cell.alignment = {
              vertical: 'middle',
              horizontal: colNumber !== 2 ? 'center' : 'left',
              wrapText: true,
            };

            // Add a grid
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }

        // Add search filters
        worksheet1.autoFilter = {
          from: 'A2',
          to: String.fromCharCode(65 + WORKSHEETS[0].headers.length - 1) + '2',
        };
      }

      // ~~~ Second Page ~~~ //

      {
        const formattedData = residueNames.map((residue, index: number) => {
          return [
            index + 1,
            residue.name,
            residue.translated_name,
          ];
        });

        const worksheet2 = workbook.addWorksheet('Nombres de Residuos Peligrosos');

        // Columns' width
        const columns = WORKSHEETS[1].headersWidth.map((width) => {
          return {
            width: width,
          };
        })
        worksheet2.columns = columns;

        // Header data
        worksheet2.addRow(WORKSHEETS[1].headers);

        // Style header
        const headerRow = worksheet2.getRow(1);
        headerRow.height = 35;
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '000000' },
          };
          cell.font = {
            bold: true,
            color: { argb: 'FFFFFF' },
          };
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        });

        // Table data
        worksheet2.addRows(formattedData);

        // Format data cells
        const dataStartRow = 2;
        for (let i = 0; i < formattedData.length; i++) {
          const row = worksheet2.getRow(dataStartRow + i);
          row.height = 40;

          row.eachCell((cell, colNumber) => {
            // Center vertically and horizontally
            cell.alignment = {
              vertical: 'middle',
              horizontal: colNumber !== 1 ? 'left' : 'center',
              wrapText: true,
            };

            // Add a grid
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="Bitácora RPS.xlsx"');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error: any) {
      return handleError(error);
    }
  }
}
