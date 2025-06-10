import { Injectable } from '@nestjs/common';

import { GenericResourceCrud } from '@resources/generic-resource-crud';
import { Residue } from './entities/residue.entity';

@Injectable()
export class ResiduesService extends GenericResourceCrud<Residue> {
  constructor() { super(Residue, ['name']); }
}

// @Injectable()
// export class ResiduesService {
//   async create(createResidueDto: CreateResidueDto) {
//     try {
//       const residue = await Residue.findOne({
//         where: { name: createResidueDto.name },
//         attributes: ['id'],
//       });

//       if (residue) {
//         throw createError(BadRequestException, 'existing', `A residue with the name ${createResidueDto.name} already exists`);
//       }

//       const deletedResidue = await Residue.findOne({
//         paranoid: false,
//         where: { name: createResidueDto.name },
//         attributes: ['id'],
//       });

//       const residueToCreate = {
//         name: createResidueDto.name,
//         materials: createResidueDto.materials,
//       };

//       if (deletedResidue) {
//         deletedResidue.restore();
//         deletedResidue.update(residueToCreate);
//       } else {
//         await Residue.create(residueToCreate);
//       }
//     } catch (error: any) {
//       return handleError(error);
//     }
//   }

//   async findAll() {
//     try {
//       return await Residue.findAll();
//     } catch (error: any) {
//       return handleError(error);
//     }
//   }

//   async update(id: number, updateResidueDto: UpdateResidueDto) {
//     try {
//       const residue = await Residue.findByPk(id, {
//         attributes: ['id']
//       });

//       if (!residue) {
//         throw createError(BadRequestException, 'nonExisting', `A residue with the ID ${id} does not exist`);
//       }

//       const deletedResidue = await Residue.findOne({
//         paranoid: false,
//         where: { name: updateResidueDto.name },
//         attributes: ['id'],
//       });

//       if (deletedResidue) {
//         await deletedResidue.destroy({ force: true });
//       }

//       await Residue.update({
//         name: updateResidueDto.name,
//         materials: updateResidueDto.materials,
//       }, {
//         where: { id: id }
//       });
//     } catch (error: any) {
//       return handleError(error);
//     }
//   }

//   async remove(id: number) {
//     try {
//       const residue = await Residue.findByPk(id, {
//         attributes: ['id']
//       });

//       if (!residue) {
//         throw createError(BadRequestException, 'nonExisting', `A residue with the ID ${id} does not exist`);
//       }

//       await residue.destroy();
//     } catch (error: any) {
//       return handleError(error);
//     }
//   }
// }
