import { Woolf } from 'woolf';

export interface BaseSample {
  title: string;
  getWoolf: () => Promise<Woolf>;
}
