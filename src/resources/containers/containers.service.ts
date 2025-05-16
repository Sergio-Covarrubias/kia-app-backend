import { Injectable } from '@nestjs/common';

import { GenericResourceCrud } from '@resources/generic-resource-crud';
import { Container } from './entities/container.entity';

@Injectable()
export class ContainersService extends GenericResourceCrud<Container> {
    constructor() { super(Container, 'name'); }
}
