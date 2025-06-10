import { Injectable } from '@nestjs/common';

import { GenericResourceCrud } from '@resources/generic-resource-crud';
import { Provider1 } from './entities/providers1.entity';

@Injectable()
export class Providers1Service extends GenericResourceCrud<Provider1> {
    constructor() { super(Provider1, ['name', 'semarnat_code']); }
}