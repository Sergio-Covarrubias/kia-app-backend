import { Injectable } from '@nestjs/common';

import { GenericResourceCrud } from '@resources/generic-resource-crud';
import { Area } from './entities/area.entity';

@Injectable()
export class AreasService extends GenericResourceCrud<Area> {
    constructor() { super(Area, 'name'); }
}
