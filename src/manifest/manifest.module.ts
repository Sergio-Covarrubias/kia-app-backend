import { Module } from '@nestjs/common';
import { ManifestService } from './manifest.service';
import { ManifestController } from './manifest.controller';

import { Providers1Service } from '@resources/providers1/providers1.service';
import { Providers2Service } from '@resources/providers2/providers2.service';
import { SctCodesService } from '@resources/sct-codes/sct-codes.service';
import { ManagersService } from '@resources/managers/managers.service';

@Module({
  controllers: [ManifestController],
  providers: [ManifestService, Providers1Service, Providers2Service, SctCodesService, ManagersService],
})
export class ManifestModule {}
