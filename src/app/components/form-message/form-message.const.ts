import { CommitType, OptionsType } from './form-message.models';

export const OPTIONS_TYPE: OptionsType[] = [
  { label: 'description.msg002', value: CommitType.Feat },
  { label: 'description.msg003', value: CommitType.Fix },
  { label: 'description.msg004', value: CommitType.Docs },
  { label: 'description.msg005', value: CommitType.Style },
  { label: 'description.msg006', value: CommitType.Refactor },
  { label: 'description.msg007', value: CommitType.Perf },
  { label: 'description.msg008', value: CommitType.Chore },
  { label: 'description.msg009', value: CommitType.Test },
  { label: 'description.msg010', value: CommitType.Build },
  { label: 'description.msg011', value: CommitType.Ci },
  { label: 'description.msg012', value: CommitType.Revert },
  { label: 'description.msg018', value: CommitType.Merge },
];

export const GET_LABEL_BY_VALUE = (type: CommitType): string => {
  return OPTIONS_TYPE.find((option) => option.value === type)?.label as string;
};
