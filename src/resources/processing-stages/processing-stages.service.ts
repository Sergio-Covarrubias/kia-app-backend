import { Injectable } from '@nestjs/common';

import { GenericResourceCrud } from '@resources/generic-resource-crud';
import { ProcessingStage } from './entities/processing-stage.entity';

@Injectable()
export class ProcessingStagesService extends GenericResourceCrud<ProcessingStage> {
    constructor() { super(ProcessingStage, 'name'); }
}
