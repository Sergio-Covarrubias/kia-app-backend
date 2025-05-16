import { Injectable } from '@nestjs/common';

import { GenericResourceCrud } from '@resources/generic-resource-crud';
import { SctCode } from './entities/sct-code.entity';

@Injectable()
export class SctCodesService extends GenericResourceCrud<SctCode> {
    constructor() { super(SctCode, 'code'); }
}
