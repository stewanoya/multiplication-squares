export const Colors: {[key: string]: string} = {
  sky: '#38bdf8',
  coral: '#fb7185',
  lime: '#84cc16',
  amber: '#f59e0b',
  green: '#32a852',
  yellow: '#edcd1a',
  red: '#cf413c',
  blue: '#177ec2',
  purple: '#4530c9',
  pink: '#d117c2',
  orange: '#f97316',
  teal: '#14b8a6',
  violet: '#8b5cf6',
  rose: '#f43f5e',
  none: '',
} as const;

export type SegmentOrientation = 'vert' | 'horiz';

export type GameColorKey = keyof typeof Colors;
export type GameColor = typeof Colors[GameColorKey];

