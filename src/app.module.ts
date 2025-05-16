import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FormsModule } from './forms/forms.module';
import { ResiduesModule } from './resources/residues/residues.module';
import { ContainersModule } from './resources/containers/containers.module';
import { AreasModule } from './resources/areas/areas.module';
import { ProcessingStagesModule } from './resources/processing-stages/processing-stages.module';
import { Providers1Module } from './resources/providers1/providers1.module';
import { SctCodesModule } from './resources/sct-codes/sct-codes.module';
import { Providers2Module } from './resources/providers2/providers2.module';
import { ManagersModule } from './resources/managers/managers.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, FormsModule, ResiduesModule, ContainersModule, AreasModule, ProcessingStagesModule, Providers1Module, SctCodesModule, Providers2Module, ManagersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
