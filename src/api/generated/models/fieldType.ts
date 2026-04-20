
export type FieldType = typeof FieldType[keyof typeof FieldType];


export const FieldType = {
  string: 'string',
  int: 'int',
  bool: 'bool',
  'string[]': 'string[]',
} as const;
