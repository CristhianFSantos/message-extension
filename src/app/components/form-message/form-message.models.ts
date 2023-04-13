import { FormControl } from '@angular/forms';

export enum CommitType {
  Feat = 'Feat',
  Fix = 'Fix',
  Docs = 'Docs',
  Style = 'Style',
  Refactor = 'Refactor',
  Perf = 'Perf',
  Chore = 'Chore',
  Test = 'Test',
  Build = 'Build',
  Ci = 'Ci',
  Revert = 'Revert',
}

export interface OptionsType {
  label: string;
  value: string;
}

export interface FormMessage {
  identifier: FormControl<number | null>;
  type: FormControl<CommitType | null>;
  scope: FormControl<string | null>;
  subject: FormControl<string | null>;
  customPattern: FormControl<boolean | null>;
}

export interface Message {
  identifier: string;
  type: string;
  scope: string;
  subject: string;
}

export enum EnumMessage {
  Identifier = 'identifier',
  Type = 'type',
  Scope = 'scope',
  Subject = 'subject',
}
