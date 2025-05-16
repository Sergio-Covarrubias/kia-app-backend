import { Sequelize } from 'sequelize-typescript';

import { User } from './users/entities/user.entity';
import { Form } from './forms/entities/form.entity';
import { Residue } from '@resources/residues/entities/residue.entity';
import { Container } from '@resources/containers/entities/container.entity';
import { Area } from '@resources/areas/entities/area.entity';
import { ProcessingStage } from '@resources/processing-stages/entities/processing-stage.entity';
import { Provider1 } from '@resources/providers1/entities/providers1.entity';
import { SctCode } from '@resources/sct-codes/entities/sct-code.entity';
import { Provider2 } from '@resources/providers2/entities/providers2.entity';
import { Manager } from '@resources/managers/entities/manager.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT!),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      });

      sequelize.addModels([
        User, 
        Form, 
        Residue, Container, Area, ProcessingStage, Provider1, SctCode, Provider2, Manager
      ]);
      await sequelize.sync({ alter: false });
      return sequelize;
    },
  },
];
