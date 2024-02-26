import { el } from '@elemaudio/core';
import sequencer from './sequencer';
import { bpmToHz } from '../utils';

export default function drumSequencer() {
  const bpm = 120;
  let bpmAsHz = el.const({ key: 'bpm:hz', value: bpmToHz(bpm, 1) });

  const kick = el.sample({ path: 'kick' }, el.train(el.mul(bpmAsHz, 4)), 1);

  const snare = el.sample({ path: 'snare' }, el.train(el.mul(bpmAsHz, 2)), 1);

  const sounds = el.add(kick, snare);

  return sequencer(sounds);
}
