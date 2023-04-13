import { FormControl } from '@angular/forms';
import { UserConfig } from 'src/app/services/storage.service';

export type UserConfigForm = {
  [key in keyof UserConfig]: FormControl<UserConfig[key] | null>;
};
