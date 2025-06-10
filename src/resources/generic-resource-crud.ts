import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Model, ModelCtor } from "sequelize-typescript";
import { Op, Sequelize } from "sequelize";

import { createError, handleError } from "@utils/handle-error";

@Injectable()
export class GenericResourceCrud<ModelType extends Model> {
  constructor(
    // @Inject('SEQUELIZE')
    // private readonly sequelize: Sequelize,

    private readonly model: ModelCtor<ModelType>,
    private readonly uniqueColums: string[],
  ) { }

  async create(createData: any) {
    //const transaction = await this.sequelize.transaction();
    
    try {
      const uniqueAttributes = this.uniqueColums.map((column: string) => {
        return { [column]: createData[column] };
      });

      const identicalDeletedResource = await this.model.findOne({
        paranoid: false,
        where: {
          [Op.not]: { deleted_at: null },
          [Op.and]: uniqueAttributes,
        } as any,
        attributes: ['id'],
      });

      if (identicalDeletedResource) {
        identicalDeletedResource.restore();
        identicalDeletedResource.update(createData);
        //await transaction.commit();
        return;
      }      

      for (let i = 0; i < this.uniqueColums.length; i++) {
        const column = this.uniqueColums[i];

        const resource = await this.model.findOne({
          paranoid: false,
          where: { [column]: createData[column] } as any,
          attributes: ['id'],
        });

        if (!resource) {
          continue;
        }

        if (!resource.deletedAt) {
          throw createError(BadRequestException, column, `${this.model.name} with a ${column} of value ${createData[column]} already exists`);
        }

        await resource.destroy({ force: true });
      }

      //await transaction.commit();
      await this.model.create(createData);
    } catch (error: any) {
      //await transaction.rollback();
      return handleError(error);
    }
  }

  async findAll() {
    try {
      return await this.model.findAll({
        raw: true,
        attributes: { exclude: ['deleted_at'] },
        order: [[this.uniqueColums[0], 'ASC']],
      });
    } catch (error: any) {
      return handleError(error);
    }
  }

  async update(id: number, createData: any) {
    try {
      const resource = await this.model.findByPk(id, {
        attributes: ['id']
      });

      if (!resource) {
        throw createError(BadRequestException, 'nonExisting', `${this.model.name} with the ID ${id} does not exist`);
      }

      for (let i = 0; i < this.uniqueColums.length; i++) {
        const column = this.uniqueColums[i];

        const existingResource = await this.model.findOne({
          paranoid: false,
          where: {
            id: { [Op.not]: id },
            [column]: createData[column],
          } as any,
          attributes: ['id', ['deleted_at', 'deletedAt']],
        });


        if (!existingResource) {
          continue;
        }

        if (!existingResource.dataValues.deletedAt) {
          throw createError(BadRequestException, column, `Another ${this.model.name} with ${column} of value ${createData[column]} already exists`);
        }

        await existingResource.destroy({ force: true });
      }

      await this.model.update(createData, {
        where: { id: id } as any
      });
    } catch (error: any) {
      return handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const resource = await this.model.findByPk(id, {
        attributes: ['id']
      });

      if (!resource) {
        throw createError(BadRequestException, 'nonExisting', `${this.model.name} with the ID ${id} does not exist`);
      }

      await resource.destroy();
    } catch (error: any) {
      return handleError(error);
    }
  }
}