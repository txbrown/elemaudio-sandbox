'use client';
import { useEffect, useState } from 'react';
import { useRenderer } from './audio/renderer';
import sequencer from './audio/sequencer';
import drumSequencer from './audio/drum-sequencer';
import { ElemNode } from '@elemaudio/core';

export default function Home() {
  const { core, isStarted, startAudioContext } = useRenderer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [instrument, setInstrument] = useState<ElemNode>(drumSequencer);

  useEffect(() => {
    if (!isStarted || !core) return;

    if (isPlaying) {
      core.render(instrument);
    } else {
      core.render();
    }
  }, [instrument, isPlaying, core, isStarted]);

  if (!core || !isStarted) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-between p-24'>
        <button
          className='btn btn-primary'
          onClick={() => {
            startAudioContext();
          }}
        >
          Start Audio Context
        </button>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='container w-full'>
        <button
          className='btn btn-primary'
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying && 'Stop'}
          {!isPlaying && 'Play'}
        </button>
      </div>
    </main>
  );
}
