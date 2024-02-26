'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import WebRenderer from '@elemaudio/web-renderer';

export function useRenderer(): {
  core: WebRenderer | undefined;
  startAudioContext: () => void;
  isStarted: Boolean;
} {
  const [isLoading, setLoading] = useState(true);
  const rendererRef = useRef<WebRenderer>();
  const [ctx, setAudioContext] = useState<AudioContext>();

  useEffect(() => {
    if (typeof window === 'undefined' || !ctx) {
      return;
    }

    console.log('starting renderer');

    const core = new WebRenderer();
    rendererRef.current = core;

    core.on('load', function () {
      setLoading(false);
    });

    const initCore = async () => {
      await ctx.resume(); // Ensure the context is started
      const node = await core.initialize(ctx, {
        numberOfInputs: 0,
        numberOfOutputs: 2,
        outputChannelCount: [1, 2],
      });

      node.connect(ctx.destination);
    };

    initCore();

    // // Cleanup function to disconnect and close the AudioContext
    return () => {
      ctx.close();
    };
  }, [ctx]);

  const startAudioContext = () => {
    setAudioContext(new AudioContext());
  };

  useEffect(() => {
    const loadSamples = async () => {
      const core = rendererRef.current;

      if (!core || !ctx) {
        return;
      }

      const sounds = [
        {
          name: 'snare',
          url: 'https://midicircuit-dev.fra1.cdn.digitaloceanspaces.com/dev/assets/sounds/shy_kit/SNS_TD_snare_boom_bap_C2.wav',
        },
        {
          name: 'kick',
          url: 'https://midicircuit-dev.fra1.cdn.digitaloceanspaces.com/dev/assets/sounds/shy_kit/SNS_TD_kick_layered_B0.wav',
        },
      ];

      let results = await Promise.all(sounds.map((s) => fetch(s.url)));

      results.forEach(async (r, i) => {
        let sampleBuffer = await ctx.decodeAudioData(await r.arrayBuffer());

        core.updateVirtualFileSystem({
          [sounds[i].name]: sampleBuffer.getChannelData(0),
        });
      });
    };

    if (!isLoading) {
      loadSamples();
    }
  }, [isLoading, ctx]);

  return {
    core: rendererRef.current,
    startAudioContext: startAudioContext,
    isStarted: !ctx || !isLoading,
  };
}
