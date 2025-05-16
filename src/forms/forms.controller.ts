import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

import { handleError } from '@utils/handle-error';

import { FormsService } from './forms.service';

import { Residue } from '@resources/residues/entities/residue.entity';
import { Container } from '@resources/containers/entities/container.entity';
import { Area } from '@resources/areas/entities/area.entity';
import { ProcessingStage } from '@resources/processing-stages/entities/processing-stage.entity';
import { Provider1 } from '@resources/providers1/entities/providers1.entity';
import { SctCode } from '@resources/sct-codes/entities/sct-code.entity';
import { Provider2 } from '@resources/providers2/entities/providers2.entity';
import { Manager } from '@resources/managers/entities/manager.entity';

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

@Controller('api/form')
export class FormsController {
    constructor(private readonly formService: FormsService) { }

    @Get('values') // <-- TODO: Change to ''
    async getFormOptions() {
        return await this.formService.getFormOptions();
    }

    @Post()
    async create(@Req() req: any, @Body() createFormDto: FormDto) {
        return await this.formService.create(req.user.id, createFormDto);
    }

    @Post('dashboard-data')
    async retrieveDashboardData(@Body() dashboardDataDto: DashboardDataDTO) {
        return await this.formService.retrieveDashboardData(dashboardDataDto);
    }

    @Post('binnacle')
    async generateBinnacle(@Body() binnacleDataDto: BinnacleDataDTO, @Res() res: any) {
        try {
            const binnnacleData = await this.formService.retrieveBinnacleData(binnacleDataDto);

            // Format binnacle data
            const parseMaterials = (materials: string) => Array(...materials).map((material: string) => material === 'X' ? 'X' : '');
            const formattedData = binnnacleData.map((entry, index) => {
                return [
                    index + 1,
                    entry['residue.name'],
                    entry['container.name'],
                    entry.tons,
                    ...parseMaterials(entry['residue.materials']),
                    entry['area.name'],
                    entry.entry_date,
                    entry.exit_date,
                    entry['processing_stage.name'],
                    entry['provider_1.name'],
                    entry['provider_1.semarnat_code'],
                    entry['sct_code.code'],
                    entry['provider_2.name'],
                    entry['provider_2.authorization_code'],
                    entry['manager.name']
                ];
            });

            const workbook = new ExcelJS.Workbook();

            // ~~~ First Page ~~~ //

            {
                const worksheet1 = workbook.addWorksheet('2024');

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
                titleRow.height = 60;
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
                headerRow.height = 40;
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
                    };
                });

                // Add search filters
                worksheet1.autoFilter = {
                    from: 'A2',
                    to: String.fromCharCode(65 + WORKSHEETS[0].headers.length - 1) + '2',
                };
            }

            // ~~~ Second Page ~~~ //

            {
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
                worksheet2.addRows([]);
            }

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="Bitácora RPS.xlsx"');

            await workbook.xlsx.write(res);
            res.end();
        } catch (error: any) {
            console.log(error);
            return handleError(error);
        }
    }

    @Get('admin/residues')
    async getAdminResidues() {
        return this.formService.getAdminValue(Residue);
    }

    @Post('admin/residues')

    @Get('admin/containers')
    async getAdminContainers() {
        return this.formService.getAdminValue(Container);
    }

    @Get('admin/areas')
    async getAdminAreas() {
        return this.formService.getAdminValue(Area);
    }

    @Get('admin/processing-stages')
    async getAdminProcessingStages() {
        return this.formService.getAdminValue(ProcessingStage);
    }

    @Get('admin/providers1')
    async getAdminProviders1() {
        return this.formService.getAdminValue(Provider1);
    }

    @Get('admin/sct-codes')
    async getAdminSctCodes() {
        return this.formService.getAdminValue(SctCode);
    }

    @Get('admin/providers2')
    async getAdminProviders2() {
        return this.formService.getAdminValue(Provider2);
    }

    @Get('admin/managers')
    async getAdminManagers() {
        return this.formService.getAdminValue(Manager);
    }
}

//   @Post('test')
//   async create_stored_procedure(@Req() req: any, @Body() createFormDto: FormDto) {
//     return await this.formService.create_stored_procedure(req.user.id, createFormDto);
//   }