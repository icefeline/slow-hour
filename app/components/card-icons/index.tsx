import {
  FoolIcon,
  MagicianIcon,
  HighPriestessIcon,
  EmpressIcon,
  EmperorIcon,
  HierophantIcon,
  LoversIcon,
  ChariotIcon,
  StrengthIcon,
  HermitIcon,
  WheelOfFortuneIcon,
  JusticeIcon,
  HangedManIcon,
  DeathIcon,
  TemperanceIcon,
  DevilIcon,
  TowerIcon,
  StarIcon,
  MoonIcon,
  SunIcon,
  JudgementIcon,
  WorldIcon,
} from './MajorArcanaIcons';

import {
  CupsIcon,
  WandsIcon,
  SwordsIcon,
  PentaclesIcon,
} from './MinorArcanaIcons';

import {
  AceOfCupsIcon,
  TwoOfCupsIcon,
  ThreeOfCupsIcon,
  FourOfCupsIcon,
  FiveOfCupsIcon,
  SixOfCupsIcon,
  SevenOfCupsIcon,
  EightOfCupsIcon,
  NineOfCupsIcon,
  TenOfCupsIcon,
  PageOfCupsIcon,
  KnightOfCupsIcon,
  QueenOfCupsIcon,
  KingOfCupsIcon,
} from './CupsIcons';

import {
  AceOfWandsIcon,
  TwoOfWandsIcon,
  ThreeOfWandsIcon,
  FourOfWandsIcon,
  FiveOfWandsIcon,
  SixOfWandsIcon,
  SevenOfWandsIcon,
  EightOfWandsIcon,
  NineOfWandsIcon,
  TenOfWandsIcon,
  PageOfWandsIcon,
  KnightOfWandsIcon,
  QueenOfWandsIcon,
  KingOfWandsIcon,
} from './WandsIcons';

import {
  AceOfSwordsIcon,
  TwoOfSwordsIcon,
  ThreeOfSwordsIcon,
  FourOfSwordsIcon,
  FiveOfSwordsIcon,
  SixOfSwordsIcon,
  SevenOfSwordsIcon,
  EightOfSwordsIcon,
  NineOfSwordsIcon,
  TenOfSwordsIcon,
  PageOfSwordsIcon,
  KnightOfSwordsIcon,
  QueenOfSwordsIcon,
  KingOfSwordsIcon,
} from './SwordsIcons';

import {
  AceOfPentaclesIcon,
  TwoOfPentaclesIcon,
  ThreeOfPentaclesIcon,
  FourOfPentaclesIcon,
  FiveOfPentaclesIcon,
  SixOfPentaclesIcon,
  SevenOfPentaclesIcon,
  EightOfPentaclesIcon,
  NineOfPentaclesIcon,
  TenOfPentaclesIcon,
  PageOfPentaclesIcon,
  KnightOfPentaclesIcon,
  QueenOfPentaclesIcon,
  KingOfPentaclesIcon,
} from './PentaclesIcons';

export const cardIconMap: Record<string, React.ComponentType> = {
  // Major Arcana
  'major-0': FoolIcon,
  'major-1': MagicianIcon,
  'major-2': HighPriestessIcon,
  'major-3': EmpressIcon,
  'major-4': EmperorIcon,
  'major-5': HierophantIcon,
  'major-6': LoversIcon,
  'major-7': ChariotIcon,
  'major-8': StrengthIcon,
  'major-9': HermitIcon,
  'major-10': WheelOfFortuneIcon,
  'major-11': JusticeIcon,
  'major-12': HangedManIcon,
  'major-13': DeathIcon,
  'major-14': TemperanceIcon,
  'major-15': DevilIcon,
  'major-16': TowerIcon,
  'major-17': StarIcon,
  'major-18': MoonIcon,
  'major-19': SunIcon,
  'major-20': JudgementIcon,
  'major-21': WorldIcon,

  // Cups (Water)
  'cups-ace': AceOfCupsIcon,
  'cups-2': TwoOfCupsIcon,
  'cups-3': ThreeOfCupsIcon,
  'cups-4': FourOfCupsIcon,
  'cups-5': FiveOfCupsIcon,
  'cups-6': SixOfCupsIcon,
  'cups-7': SevenOfCupsIcon,
  'cups-8': EightOfCupsIcon,
  'cups-9': NineOfCupsIcon,
  'cups-10': TenOfCupsIcon,
  'cups-page': PageOfCupsIcon,
  'cups-knight': KnightOfCupsIcon,
  'cups-queen': QueenOfCupsIcon,
  'cups-king': KingOfCupsIcon,

  // Wands (Fire)
  'wands-ace': AceOfWandsIcon,
  'wands-2': TwoOfWandsIcon,
  'wands-3': ThreeOfWandsIcon,
  'wands-4': FourOfWandsIcon,
  'wands-5': FiveOfWandsIcon,
  'wands-6': SixOfWandsIcon,
  'wands-7': SevenOfWandsIcon,
  'wands-8': EightOfWandsIcon,
  'wands-9': NineOfWandsIcon,
  'wands-10': TenOfWandsIcon,
  'wands-page': PageOfWandsIcon,
  'wands-knight': KnightOfWandsIcon,
  'wands-queen': QueenOfWandsIcon,
  'wands-king': KingOfWandsIcon,

  // Swords (Air)
  'swords-ace': AceOfSwordsIcon,
  'swords-2': TwoOfSwordsIcon,
  'swords-3': ThreeOfSwordsIcon,
  'swords-4': FourOfSwordsIcon,
  'swords-5': FiveOfSwordsIcon,
  'swords-6': SixOfSwordsIcon,
  'swords-7': SevenOfSwordsIcon,
  'swords-8': EightOfSwordsIcon,
  'swords-9': NineOfSwordsIcon,
  'swords-10': TenOfSwordsIcon,
  'swords-page': PageOfSwordsIcon,
  'swords-knight': KnightOfSwordsIcon,
  'swords-queen': QueenOfSwordsIcon,
  'swords-king': KingOfSwordsIcon,

  // Pentacles (Earth)
  'pentacles-ace': AceOfPentaclesIcon,
  'pentacles-2': TwoOfPentaclesIcon,
  'pentacles-3': ThreeOfPentaclesIcon,
  'pentacles-4': FourOfPentaclesIcon,
  'pentacles-5': FiveOfPentaclesIcon,
  'pentacles-6': SixOfPentaclesIcon,
  'pentacles-7': SevenOfPentaclesIcon,
  'pentacles-8': EightOfPentaclesIcon,
  'pentacles-9': NineOfPentaclesIcon,
  'pentacles-10': TenOfPentaclesIcon,
  'pentacles-page': PageOfPentaclesIcon,
  'pentacles-knight': KnightOfPentaclesIcon,
  'pentacles-queen': QueenOfPentaclesIcon,
  'pentacles-king': KingOfPentaclesIcon,
};

export function getCardIcon(cardId: string): React.ComponentType | null {
  // Check if it's a Major Arcana card
  if (cardIconMap[cardId]) {
    return cardIconMap[cardId];
  }

  // For Minor Arcana, return the suit icon
  if (cardId.startsWith('cups-')) return CupsIcon;
  if (cardId.startsWith('wands-')) return WandsIcon;
  if (cardId.startsWith('swords-')) return SwordsIcon;
  if (cardId.startsWith('pentacles-')) return PentaclesIcon;

  return null;
}
