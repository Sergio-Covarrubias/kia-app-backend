import { BadRequestException } from "@nestjs/common";
import { Model, ModelCtor } from "sequelize-typescript";

import { createError, handleError } from "@utils/handle-error";

export class GenericResourceCrud<ModelType extends Model> {
  constructor(
    private readonly model: ModelCtor<ModelType>,
    private readonly columnLookupName: string,
  ) { }

  async create(createData: any) {
    try {
      const resource = await this.model.findOne({
        where: { [this.columnLookupName]: createData[this.columnLookupName] } as any,
        attributes: ['id'],
      });

      if (resource) {
        throw createError(BadRequestException, 'existing', `A ${this.model.name} with a of ${String(this.columnLookupName)} value ${createData[this.columnLookupName]} already exists`);
      }

      const deletedResource = await this.model.findOne({
        paranoid: false,
        where: { [this.columnLookupName]: createData[this.columnLookupName] } as any,
        attributes: ['id'],
      });

      if (deletedResource) {
        deletedResource.restore();
        deletedResource.update(createData);
      } else {
        await this.model.create(createData);
      }
    } catch (error: any) {
      return handleError(error);
    }
  }

  async findAll() {
    try {
      return await this.model.findAll();
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
        throw createError(BadRequestException, 'nonExisting', `A ${this.model.name} with the ID ${id} does not exist`);
      }

      const deletedResource = await this.model.findOne({
        paranoid: false,
        where: { [this.columnLookupName]: createData[this.columnLookupName] } as any,
        attributes: ['id'],
      });

      if (deletedResource) {
        deletedResource.destroy({ force: true });
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
        throw createError(BadRequestException, 'nonExisting', `A ${this.model.name} with the ID ${id} does not exist`);
      }

      await resource.destroy();
    } catch (error: any) {
      return handleError(error);
    }
  }
}