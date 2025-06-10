import { Injectable } from '@nestjs/common';

import { GenericResourceCrud } from '@resources/generic-resource-crud';
import { Provider2 } from './entities/providers2.entity';

@Injectable()
export class Providers2Service extends GenericResourceCrud<Provider2> {
    constructor() { super(Provider2, ['name', 'authorization_code']); }
}
