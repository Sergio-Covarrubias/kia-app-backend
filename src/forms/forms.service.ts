import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';
import { col, fn, literal, Op } from 'sequelize';

import { createError, handleError } from '@utils/handle-error';

import { User } from 'src/users/entities/user.entity';
import { Form } from './entities/form.entity';
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
import parseDate from '@utils/parse-date';

@Injectable()
export class FormsService {
  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,

    @Inject('FORMS_REPOSITORY')
    private formsRepository: typeof Form
  ) { }

  async getPaginated(query: string, page: number, limit: number, startDate: string) {
    const forms = await Form.findAll({
      include: [
        {
          model: Residue,
          attributes: ['name'],
          required: true,
          where: {
            name: { [Op.iLike]: `%${query}%` },
          },
        },
        {
          model: Area,
          attributes: ['name'],
          required: true,
        },
      ],
      where: startDate ? {
        entry_date: {
          [Op.gte]: startDate,
        }
      } : undefined,
      offset: (page - 1) * limit,
      limit: limit,
      order: [['entry_date', 'ASC'], ['id', 'ASC']],
      attributes: ['id', 'residue.name', 'tons', 'area.name', 'entry_date', 'exit_date']
    });

    const formattedForms = forms.map((form) => {
      form = form.get({ plain: true });

      return {
        id: form.id,
        residue: form.residue.name,
        tons: form.tons,
        area: form.area.name,
        entryDate: parseDate(form.entry_date),
        exitDate: form.exit_date ? parseDate(form.exit_date) : null,
      };
    });

    const count = await Form.count({
      include: [{
        model: Residue,
        attributes: ['name'],
        required: true,
        where: {
          name: { [Op.iLike]: `%${query}%` },
        },
      }],
    });

    return {
      forms: formattedForms,
      totalPages: Math.ceil(count / limit),
    };
  }

  async get(formId: number) {
    try {
      const form = await Form.findByPk(formId, {
        include: [
          {
            model: Residue,
            attributes: ['name', 'materials'],
            required: true,
          },
          {
            model: Container,
            attributes: ['name'],
            required: true,
          },
          {
            model: Area,
            attributes: ['name'],
            required: true,
          },
          {
            model: ProcessingStage,
            attributes: ['name'],
            required: true,
          },
          {
            model: Provider1,
            attributes: ['name', ['semarnat_code', 'semarnatCode']],
            required: true,
          },
          {
            model: SctCode,
            attributes: ['code'],
            required: true,
          },
          {
            model: Provider2,
            attributes: ['name', ['authorization_code', 'authorizationCode']],
            required: true,
          },
          {
            model: Manager,
            attributes: ['name'],
            required: true,
          },
        ],
        attributes: ['quantity', 'tons', ['entry_date', 'entryDate'], ['exit_date', 'exitDate']],
      }).then((form) => form?.get({ plain: true }));

      if (!form) {
        throw createError(BadRequestException, 'nonExisting', `No form with ID value ${formId} exists`)
      }

      const formattedForm = {
        residue: form.residue.name,
        container: form.container.name,
        quantity: form.quantity,
        tons: form.tons,
        area: form.area.name,
        entryDate: form.entryDate,
        exitDate: form.exitDate,
        processingStage: form.processing_stage.name,
        provider1: form.provider_1.name,
        sctCode: form.sct_code.code,
        provider2: form.provider_2.name,
        manager: form.manager.name,
      };

      return formattedForm;
    } catch (error: any) {
      return handleError(error);
    }
  }

  async create(userId: number, createFormDto: FormDto) {
    try {
      const user = await User.findByPk(userId, {
        raw: true,
        attributes: ['id'],
      })
      if (!user) {
        throw createError(BadRequestException, 'user', `No user with id ${userId}`);
      }

      const residue = await Residue.findOne({
        raw: true,
        where: { name: createFormDto.residue },
        attributes: ['id'],
      });
      if (!residue) {
        throw createError(BadRequestException, 'residue', `No residue with value ${createFormDto.residue}`);
      }

      const container = await Container.findOne({
        raw: true,
        where: { name: createFormDto.container },
        attributes: ['id'],
      });
      if (!container) {
        throw createError(BadRequestException, 'container', `No container with value ${createFormDto.container}`);
      }

      const area = await Area.findOne({
        raw: true,
        where: { name: createFormDto.area },
        attributes: ['id'],
      });
      if (!area) {
        throw createError(BadRequestException, 'area', `No area with value ${createFormDto.area}`);
      }

      const processingStage = await ProcessingStage.findOne({
        raw: true,
        where: { name: createFormDto.processingStage },
        attributes: ['id'],
      });
      if (!processingStage) {
        throw createError(BadRequestException, 'processingStage', `No processing stage with value ${createFormDto.processingStage}`);
      }

      const provider1 = await Provider1.findOne({
        raw: true,
        where: { name: createFormDto.provider1 },
        attributes: ['id'],
      });
      if (!provider1) {
        throw createError(BadRequestException, 'provider1', `No provider1 with value ${createFormDto.provider1}`);
      }

      const sctCode = await SctCode.findOne({
        raw: true,
        where: { code: createFormDto.sctCode },
        attributes: ['id'],
      });
      if (!sctCode) {
        throw createError(BadRequestException, 'sctCode', `No SCT code with value ${createFormDto.sctCode}`);
      }

      const provider2 = await Provider2.findOne({
        raw: true,
        where: { name: createFormDto.provider2 },
        attributes: ['id'],
      });
      if (!provider2) {
        throw createError(BadRequestException, 'provider2', `No provider2 with value ${createFormDto.provider2}`);
      }

      const manager = await Manager.findOne({
        raw: true,
        where: { name: createFormDto.manager },
        attributes: ['id'],
      });
      if (!manager) {
        throw createError(BadRequestException, 'manager', `No manager with value ${createFormDto.manager}`);
      }

      const formToCreate = {
        user_id: userId,
        residue_id: residue.id,
        container_id: container.id,
        quantity: createFormDto.quantity,
        tons: createFormDto.tons,
        area_id: area.id,
        entry_date: createFormDto.entryDate?.toISOString().split('T')[0],
        exit_date: createFormDto.exitDate?.toISOString().split('T')[0],
        processing_stage_id: processingStage.id,
        provider_1_id: provider1.id,
        sct_code_id: sctCode.id,
        provider_2_id: provider2.id,
        manager_id: manager.id,
      };

      return await Form.create(formToCreate);
    } catch (error: any) {
      return handleError(error);
    }
  }

  async update(formId: number, createFormDto: FormDto) {
    const residue = await Residue.findOne({
      raw: true,
      where: { name: createFormDto.residue },
      attributes: ['id'],
    });
    if (!residue) {
      throw createError(BadRequestException, 'residue', `No residue with value ${createFormDto.residue}`);
    }

    const container = await Container.findOne({
      raw: true,
      where: { name: createFormDto.container },
      attributes: ['id'],
    });
    if (!container) {
      throw createError(BadRequestException, 'container', `No container with value ${createFormDto.container}`);
    }

    const area = await Area.findOne({
      raw: true,
      where: { name: createFormDto.area },
      attributes: ['id'],
    });
    if (!area) {
      throw createError(BadRequestException, 'area', `No area with value ${createFormDto.area}`);
    }

    const processingStage = await ProcessingStage.findOne({
      raw: true,
      where: { name: createFormDto.processingStage },
      attributes: ['id'],
    });
    if (!processingStage) {
      throw createError(BadRequestException, 'processingStage', `No processing stage with value ${createFormDto.processingStage}`);
    }

    const provider1 = await Provider1.findOne({
      raw: true,
      where: { name: createFormDto.provider1 },
      attributes: ['id'],
    });
    if (!provider1) {
      throw createError(BadRequestException, 'provider1', `No provider1 with value ${createFormDto.provider1}`);
    }

    const sctCode = await SctCode.findOne({
      raw: true,
      where: { code: createFormDto.sctCode },
      attributes: ['id'],
    });
    if (!sctCode) {
      throw createError(BadRequestException, 'sctCode', `No SCT code with value ${createFormDto.sctCode}`);
    }

    const provider2 = await Provider2.findOne({
      raw: true,
      where: { name: createFormDto.provider2 },
      attributes: ['id'],
    });
    if (!provider2) {
      throw createError(BadRequestException, 'provider2', `No provider2 with value ${createFormDto.provider2}`);
    }

    const manager = await Manager.findOne({
      raw: true,
      where: { name: createFormDto.manager },
      attributes: ['id'],
    });
    if (!manager) {
      throw createError(BadRequestException, 'manager', `No manager with value ${createFormDto.manager}`);
    }

    const formToUpdate = {
      residue_id: residue.id,
      container_id: container.id,
      quantity: createFormDto.quantity,
      tons: createFormDto.tons,
      area_id: area.id,
      entry_date: createFormDto.entryDate?.toISOString().split('T')[0],
      exit_date: createFormDto.exitDate?.toISOString().split('T')[0],
      processing_stage_id: processingStage.id,
      provider_1_id: provider1.id,
      sct_code_id: sctCode.id,
      provider_2_id: provider2.id,
      manager_id: manager.id,
    };

    await Form.update(formToUpdate, {
      where: { id: formId }
    });
  }

  async remove(formId: number) {
    try {
      const form = await Form.findByPk(formId, {
        attributes: ['id']
      });

      if (!form) {
        throw createError(BadRequestException, 'nonExisting', `No form with the ID ${formId} exists`);
      }

      await form.destroy();
    } catch (error: any) {
      return handleError(error);
    }
  }

  async getFormOptions() {
    try {
      const getValuesTemplate = async <T extends Model>(Model: ModelCtor<T>, columnName: string) => {
        return await Model.findAll({
          raw: true,
          attributes: [columnName],
          order: [[columnName, 'ASC']]
        }).then((elements: T[]) => elements.map((element: T) => element[columnName]));
      };

      const residues = await getValuesTemplate(Residue, 'name');
      const containers = await getValuesTemplate(Container, 'name');
      const areas = await getValuesTemplate(Area, 'name');
      const processingStages = await getValuesTemplate(ProcessingStage, 'name');
      const providers1 = await getValuesTemplate(Provider1, 'name');
      const sctCodes = await getValuesTemplate(SctCode, 'code');
      const providers2 = await getValuesTemplate(Provider2, 'name');
      const managers = await getValuesTemplate(Manager, 'name');

      return {
        residues,
        containers,
        areas,
        processingStages,
        providers1,
        sctCodes,
        providers2,
        managers,
      };
    } catch (error: any) {
      return handleError(error);
    }
  }

  private static readonly DATE_COLUMN = 'entry_date';

  private getDayDates(startDateStr: string, timeframe: 'day' | 'month' | 'year') {
    let startDate: Date;
    let endDate: Date;

    switch (timeframe) {
      case 'day':
        startDate = new Date(startDateStr);
        endDate = new Date(startDateStr);
        endDate.setDate(endDate.getDate() + 1);
        break;
      case 'month':
        startDate = new Date(startDateStr + '-01');
        endDate = new Date(startDateStr + '-01');
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'year':
        startDate = new Date(startDateStr + '-01-01');
        endDate = new Date(startDateStr + '-01-01');
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        throw createError(BadRequestException, 'timeframe', `Invalid timeframe value ${timeframe}`);
    }

    if (!startDate) {
      throw createError(BadRequestException, 'startDate', `Invalid startDate format ${startDate}`);
    } else if (!endDate) {
      throw createError(InternalServerErrorException, 'endDate', 'Internal server error');
    }

    // Date object --> '2025-01-01'
    return [
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ];
  }

  private async validateTargetedRows(startDate: string, endDate: string, dateColumn: string) {
    const targetedRowsCount = await Form.count({
      where: {
        [dateColumn]: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });

    if (targetedRowsCount === 0) {
      throw createError(BadRequestException, 'empty', `No registered forms are found in the period ${startDate} - ${endDate}`);
    }
  }

  async retrieveDashboardData(dashboardDataDto: DashboardDataDTO) {
    try {
      const [startDate, endDate] = this.getDayDates(dashboardDataDto.startDate, dashboardDataDto.timeframe);

      await this.validateTargetedRows(startDate, endDate, FormsService.DATE_COLUMN);

      const getColumnCount = async <T extends Model>(model: ModelCtor<T>, columnName: string, startDate: string, endDate: string) => {
        return await Form.findAll({
          attributes: [
            [fn('COUNT', '*'), 'value'],
            [col(columnName), 'name'],
          ],
          include: [
            {
              model: model,
              attributes: [],
              required: true,
              paranoid: true,
            },
          ],
          where: {
            [FormsService.DATE_COLUMN]: {
              [Op.gte]: startDate,
              [Op.lt]: endDate,
            },
          },
          group: [columnName],
          order: [[col(columnName), 'ASC']],
          raw: true,
        });
      };

      const getColumnSum = async <T extends Model>(model: ModelCtor<T>, columnName: string, columnToSum: string, startDate: string, endDate: string) => {
        return await Form.findAll({
          attributes: [
            [literal(`ROUND(SUM(CAST("${columnToSum}" AS NUMERIC)), 2)`), 'value'],
            [col(columnName), 'name'],
          ],
          include: [
            {
              model: model,
              attributes: [],
              required: true,
              paranoid: true,
            },
          ],
          where: {
            [FormsService.DATE_COLUMN]: {
              [Op.gte]: startDate,
              [Op.lt]: endDate,
            },
          },
          group: [columnName],
          order: [[col(columnName), 'ASC']],
          raw: true,
        });
      };

      const totalTons = await Form.sum('tons', {
        where: {
          [FormsService.DATE_COLUMN]: {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          },
        },
      }).then((totalTons: number) => totalTons.toFixed(2));

      const residueCount = await getColumnCount(Residue, 'residue.name', startDate, endDate);
      const containerCount = await getColumnCount(Container, 'container.name', startDate, endDate);
      const areaCount = await getColumnCount(Area, 'area.name', startDate, endDate);
      const processingStageCount = await getColumnCount(ProcessingStage, 'processing_stage.name', startDate, endDate);
      const provider1Count = await getColumnCount(Provider1, 'provider_1.name', startDate, endDate);
      const provider2Count = await getColumnCount(Provider2, 'provider_2.name', startDate, endDate);

      const residueTons = await getColumnSum(Residue, 'residue.name', 'tons', startDate, endDate);
      const containerTons = await getColumnSum(Container, 'container.name', 'tons', startDate, endDate);
      const areaTons = await getColumnSum(Area, 'area.name', 'tons', startDate, endDate);
      const processingStageTons = await getColumnSum(ProcessingStage, 'processing_stage.name', 'tons', startDate, endDate);
      const provider1Tons = await getColumnSum(Provider1, 'provider_1.name', 'tons', startDate, endDate);

      return {
        totalTons,
        residueCount,
        containerCount,
        areaCount,
        processingStageCount,
        provider1Count,
        provider2Count,
        residueTons,
        containerTons,
        areaTons,
        processingStageTons,
        provider1Tons,
      };
    } catch (error: any) {
      return handleError(error);
    }
  }

  async retrieveBinnacleData(binnacleDataDto: BinnacleDataDTO): Promise<[Form[], Residue[]]> {
    try {
      const [startDate, endDate] = this.getDayDates(binnacleDataDto.startDate, binnacleDataDto.timeframe);

      await this.validateTargetedRows(startDate, endDate, FormsService.DATE_COLUMN);

      const formsEntries = await Form.findAll({
        raw: true,
        attributes: ['tons', 'entry_date', 'exit_date'],
        include: [
          {
            model: Residue,
            attributes: ['name', 'translated_name', 'materials'],
            required: true,
            paranoid: true,
          },
          {
            model: Container,
            attributes: ['name'],
            required: true,
            paranoid: true,
          },
          {
            model: Area,
            attributes: ['name'],
            required: true,
            paranoid: true,
          },
          {
            model: ProcessingStage,
            attributes: ['name'],
            required: true,
            paranoid: true,
          },
          {
            model: Provider1,
            attributes: ['name', 'semarnat_code'],
            required: true,
            paranoid: true,
          },
          {
            model: SctCode,
            attributes: ['code'],
            required: true,
            paranoid: true,
          },
          {
            model: Provider2,
            attributes: ['name', 'authorization_code'],
            required: true,
            paranoid: true,
          },
          {
            model: Manager,
            attributes: ['name'],
            required: true,
            paranoid: true,
          },
        ],
        where: {
          [FormsService.DATE_COLUMN]: {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          },
        },
        order: [['entry_date', 'ASC']],
      });

      const residueNames = await Residue.findAll({
        raw: true,
        attributes: ['name', 'translated_name'],
        order: [['name', 'ASC']],
      });

      return [formsEntries, residueNames];
    } catch (error: any) {
      return handleError(error);
    }
  }

  async pcreate(userId: number, createFormDto: FormDto) {
    try {
      await this.sequelize.query(`
        CALL create_form(
          :user,
          :residue,
          :container,
          :quantity,
          :tons,
          :area,
          :entryDate,
          :exitDate,
          :processingStage,
          :provider1,
          :sctCode,
          :provider2,
          :manager
        )`,
        {
          replacements: {
            user: userId,
            residue: createFormDto.residue,
            container: createFormDto.container,
            quantity: createFormDto.quantity,
            tons: createFormDto.tons,
            area: createFormDto.area,
            entryDate: createFormDto.entryDate,
            exitDate: createFormDto.exitDate,
            processingStage: createFormDto.processingStage,
            provider1: createFormDto.provider1,
            sctCode: createFormDto.sctCode,
            provider2: createFormDto.provider2,
            manager: createFormDto.manager,
          },
        },
      );
    } catch (error: any) {
      const parsed = JSON.parse(error.message);
      return handleError(createError(BadRequestException, parsed.type, parsed.message));
    }
  }

  async pdelete(formId: number) {
    try {
      await this.sequelize.query(`
        CALL delete_form(
          :formId
        )`,
        {
          replacements: {
            formId: formId,
          },
        },
      );
      ;
    } catch (error: any) {
      const parsed = JSON.parse(error.message);
      return handleError(createError(BadRequestException, parsed.type, parsed.message));
    }
  }
}
