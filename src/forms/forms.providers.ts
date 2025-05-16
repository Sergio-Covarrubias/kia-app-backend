
import { Form } from './entities/form.entity';

export const formsProviders = [
  {
    provide: 'FORMS_REPOSITORY',
    useValue: Form,
  },
];
