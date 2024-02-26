'use client';
import { el, ElemNode } from '@elemaudio/core';
import { bpmToHz } from '../utils';

type Note = {
  start: number; // Start time in beats
  duration: number; // Duration in beats
};

const defaultNotesSequence: Note[] = [
  { start: 0, duration: 0.5 },
  { start: 1, duration: 0.5 },
  { start: 2, duration: 0.5 },
  { start: 3, duration: 0.5 },
];



export default function sequencer(
  instrument?: ElemNode,
  notes: Note[] = defaultNotesSequence
) {
  if (!instrument) {
    instrument = el.cycle(440);
  }

  const bpm = 120;
  let bpmAsHz = el.const({ key: 'bpm:hz', value: bpmToHz(bpm, 1) });

  let noteSeq: { time: number; value: number }[] = [];

  notes.forEach((note) => {
    let noteStartTimeInSeconds = note.start;
    let noteEndTimeInSeconds = (note.start + note.duration);

    noteSeq.push({ time: noteStartTimeInSeconds, value: 1 });
    noteSeq.push({ time: noteEndTimeInSeconds, value: 0 });
  });

  const seq = el.sparseq2(
    {
      seq: noteSeq,
    },
    // elementary audio 120 bpm time is
    el.train(el.mul(bpmAsHz, 16))
  );

  const tone = el.mul(seq, instrument);

  return tone;
}
