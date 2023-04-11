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
  identifier: number;
  type: string;
  scope: string;
  subject: string;
  customPattern: boolean;
}
