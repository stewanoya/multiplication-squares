export const Colors = {
  green: '#32a852',
  yellow: '#edcd1a',
  red: '#cf413c',
  blue: '#177ec2',
  purple: '#4530c9',
  pink: '#d117c2',
  none: '',
} as const;

export type SegmentOrientation = 'vert' | 'horiz';

export type GameColorKey = keyof typeof Colors;
export type GameColor = typeof Colors[GameColorKey];

