import { Injectable } from '@nestjs/common';

import { GenericResourceCrud } from '@resources/generic-resource-crud';
import { Manager } from './entities/manager.entity';

@Injectable()
export class ManagersService extends GenericResourceCrud<Manager> {
    constructor() { super(Manager, ['name']); }
}
