
export type Operator = typeof Operator[keyof typeof Operator];


export const Operator = {
  EQ: 'EQ',
  NEQ: 'NEQ',
  GT: 'GT',
  LT: 'LT',
  IN: 'IN',
  NOT_IN: 'NOT_IN',
  MATCHES: 'MATCHES',
  CONTAINS: 'CONTAINS',
  CONTAINS_ALL: 'CONTAINS_ALL',
  CONTAINS_MATCH: 'CONTAINS_MATCH',
  LENGTH_EQ: 'LENGTH_EQ',
  LENGTH_GT: 'LENGTH_GT',
  LENGTH_LT: 'LENGTH_LT',
  DOES_NOT_MATCH: 'DOES_NOT_MATCH',
} as const;
