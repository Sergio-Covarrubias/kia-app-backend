import { Controller, Get, Post, Body, BadRequestException, InternalServerErrorException, Res } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

import { createError, handleError } from '@utils/handle-error';

import { ManifestService } from './manifest.service';
import { Providers1Service } from '@resources/providers1/providers1.service';
import { Providers2Service } from '@resources/providers2/providers2.service';
import { SctCodesService } from '@resources/sct-codes/sct-codes.service';
import { ManagersService } from '@resources/managers/managers.service';

import { GenerateManifestDto } from './dto/generate.dto';

import { Form } from '@forms/entities/form.entity';
import { Residue } from '@resources/residues/entities/residue.entity';
import { Container } from '@resources/containers/entities/container.entity';
import { Provider1 } from '@resources/providers1/entities/providers1.entity';
import { Provider2 } from '@resources/providers2/entities/providers2.entity';
import { SctCode } from '@resources/sct-codes/entities/sct-code.entity';

// export const mergeCellsIfNeeded = (
//   worksheet: ExcelJS.Worksheet,
//   range: string
// ) => {
//   const [startCell, endCell] = range.split(":");
//   const startRow = worksheet.getCell(startCell).row;
//   const endRow = worksheet.getCell(endCell).row;
//   const startCol = worksheet.getCell(startCell).col;
//   const endCol = worksheet.getCell(endCell).col;

//   let alreadyMerged = false;

//   for (let row = parseInt(startRow); row <= parseInt(endRow); row++) {
//     for (let col = parseInt(startCol); col <= parseInt(endCol); col++) {
//       const cell = worksheet.getCell(row, col);
//       if (cell.isMerged) {
//         alreadyMerged = true;
//         break;
//       }
//     }
//     if (alreadyMerged) break;
//   }

//   if (!alreadyMerged) {
//     worksheet.mergeCells(range);
//   }
//   // mergeCellsIfNeeded(worksheet, `B${templateRowNumber}:O${templateRowNumber}`);
//   // worksheet.mergeCells(`B${templateRowNumber}:O${templateRowNumber}`);
//   // worksheet.mergeCells(`P${templateRowNumber}:R${templateRowNumber}`);
//   // worksheet.mergeCells(`S${templateRowNumber}:U${templateRowNumber}`);
//   // worksheet.mergeCells(`V${templateRowNumber}:W${templateRowNumber}`);
//   // worksheet.mergeCells(`Y${templateRowNumber}:AA${templateRowNumber}`);

//   // mergeCellsIfNeeded(worksheet, `B${templateRowNumber + 1}:O${templateRowNumber + 1}`);
//   // worksheet.mergeCells(`B${templateRowNumber + 1}:O${templateRowNumber + 1}`);
//   // worksheet.mergeCells(`P${templateRowNumber + 1}:R${templateRowNumber + 1}`);
//   // worksheet.mergeCells(`S${templateRowNumber + 1}:U${templateRowNumber + 1}`);
//   // worksheet.mergeCells(`V${templateRowNumber + 1}:W${templateRowNumber + 1}`);
//   // worksheet.mergeCells(`Y${templateRowNumber + 1}:AA${templateRowNumber + 1}`);
// };

@Controller('api/manifest')
export class ManifestController {
  constructor(
    private readonly manifestService: ManifestService,
    private readonly providers1Service : Providers1Service,
    private readonly providers2Service : Providers2Service,
    private readonly sctCodesService : SctCodesService,
    private readonly managersService : ManagersService
  ) { }

  @Get()
  async getOptions() {
    try {
      const providers1 = await this.providers1Service.findAll().then((providers1) => providers1.map((provider1) => provider1.name));
      const providers2 = await this.providers2Service.findAll().then((providers2) => providers2.map((provider2) => provider2.name));
      const sctCodes = await this.sctCodesService.findAll().then((sctCodes) => sctCodes.map((sctCode) => sctCode.code));
      const managers = await this.managersService.findAll().then((managers) => managers.map((manager) => manager.name));

      return {
        providers1,
        providers2,
        sctCodes,
        managers,
      };
    } catch (error: any) {
      return handleError(error);
    }
  }

  @Post()
  async generate(@Body() generateManifestDto: GenerateManifestDto, @Res() res: any) {
    const INPUT_FILEPATH = 'manifiesto.xlsx';
    const OUTPUT_FILEPATH = 'res.xlsx';

    const DATA_ROW = 20;
    const CELLS = {
      MANIFEST_CODE: 'U12',
      MANAGER: 'P26',
      SCT_CODE: 'Y29',
      DRIVER: 'E31',
      EXIT_DATE: 'W32',
      PLATE_CODE: 'V35',
      QUANTITY_SUM: 'V21',
      TONS_SUM: 'Y21'
    };

    const formatDate = (date: string) => {
      const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

      const [year, month, day] = date.split('-');

      return `${day} de ${MONTHS[parseInt(month) - 1]} de ${year}`
    };

    const insertStyledBlankRows = (worksheet: ExcelJS.Worksheet, templateRowNumber: number, data: {
      residue: string;
      capacity: number;
      container: string;
      quantity: number;
      tons: number;
    }[]) => {
      const template = worksheet.getRow(templateRowNumber);
      const count = data.length - 1;

      const insertValues = (worksheet: ExcelJS.Worksheet, rowNum: number, data: {
        residue: string;
        capacity: number;
        container: string;
        quantity: number;
        tons: number;
      }) => {
        worksheet.getCell(`B${rowNum}`).value = data.residue;
        worksheet.getCell(`P${rowNum}`).value = data.capacity;
        worksheet.getCell(`S${rowNum}`).value = data.container;
        worksheet.getCell(`V${rowNum}`).value = data.quantity;
        worksheet.getCell(`Y${rowNum}`).value = data.tons * 1000;
      }

      console.log(count);
      worksheet.spliceRows(templateRowNumber + 1, 0, ...Array(count).fill([]));

      insertValues(worksheet, templateRowNumber, data[0]);

      for (let i = 1; i < data.length; i++) {
        const rowNum = templateRowNumber + i;
        const target = worksheet.getRow(rowNum);

        target.height = template.height;

        template.eachCell({ includeEmpty: true }, (sourceCell, col) => {
          const destCell = target.getCell(col);
          destCell.style = { ...sourceCell.style };
        });

        insertValues(worksheet, rowNum, data[i]);
      }

      worksheet.mergeCells(`A11:A${26 + count - 1}`);
    }

    try {
      const provider1 = await Provider1.findOne({
        where: { name: generateManifestDto.provider1 },
        attributes: ['id'],
      });

      if (!provider1) {
        throw createError(BadRequestException, 'provider1', `No provider1 with name ${generateManifestDto.provider1}`);
      }

      const provider2 = await Provider2.findOne({
        where: { name: generateManifestDto.provider2 },
        attributes: ['id'],
      });

      if (!provider2) {
        throw createError(BadRequestException, 'provider2', `No provider2 with name ${generateManifestDto.provider2}`);
      }

      const sctCode = await SctCode.findOne({
        where: { code: generateManifestDto.sctCode },
        attributes: ['id'],
      });

      if (!sctCode) {
        throw createError(BadRequestException, 'sctCode', `No sctCode with code ${generateManifestDto.sctCode}`);
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile('manifiesto.xlsx');
      const worksheet = workbook.getWorksheet('GENERADOR ORIGINAL');

      if (!worksheet) {
        return createError(InternalServerErrorException, 'invalidTemplatePath', `The path to the manifest's template is invalid ${INPUT_FILEPATH}`);
      }

      const forms = await Form.findAll({
        include: [
          {
            model: Residue,
            attributes: ['name'],
            required: true,
          },
          {
            model: Container,
            attributes: ['name', 'capacity'],
            required: true,
          },
        ],
        where: {
          exit_date: generateManifestDto.exitDate,
          provider_1_id: provider1.id,
          provider_2_id: provider2.id,
          sct_code_id: sctCode.id,
        },
        attributes: ['quantity', 'tons'],
      }).then((forms) => forms.map((form) => form.get({ plain: true })));

      if (forms.length === 0) {
        throw createError(BadRequestException, 'empty', 'No entries exist with the input given');
      }

      worksheet.getCell(CELLS.MANIFEST_CODE).value = generateManifestDto.manifestCode;
      worksheet.getCell(CELLS.MANAGER).value = generateManifestDto.manager;
      worksheet.getCell(CELLS.SCT_CODE).value = generateManifestDto.sctCode;
      worksheet.getCell(CELLS.DRIVER).value = generateManifestDto.driver;
      worksheet.getCell(CELLS.PLATE_CODE).value = generateManifestDto.plateCode;
      worksheet.getCell(CELLS.SCT_CODE).value = generateManifestDto.sctCode;
      worksheet.getCell(CELLS.EXIT_DATE).value = formatDate(generateManifestDto.exitDate);
      worksheet.getCell(CELLS.QUANTITY_SUM).value = forms.reduce((accumulator, form) => accumulator + form.quantity, 0);
      worksheet.getCell(CELLS.TONS_SUM).value = forms.reduce((accumulator, form) => accumulator + form.tons * 1000, 0);

      insertStyledBlankRows(worksheet, DATA_ROW, forms.map((form) => {
        return {
          residue: form.residue.name,
          capacity: form.container.capacity,
          container: form.container.name,
          quantity: form.quantity,
          tons: form.tons,
        };
      }));

      //await workbook.xlsx.writeFile(OUTPUT_FILEPATH);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="Bitácora RPS.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error: any) {
      console.error(error);
      return handleError(error);
    }
  }
}
