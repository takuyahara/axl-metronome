import React, { createRef, RefObject } from 'react';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs';

import BeatAxl from 'Beat/BeatAxl';
import Beat from 'Beat/Beat';

const refBeatAxl: RefObject<BeatAxl> = createRef<BeatAxl>();
const refBeat: RefObject<Beat> = createRef<Beat>();

storiesOf('Beat', module)
  .add('BeatAxl', () => {
    const remaining = number('Remaining time', 30);
    const tempo = {
      from: number('Tempo from', 90),
      to: number('Tempo to', 150),
    };
    // button('toggle()', () => {
    //   refCounterBeatAxl.toggle();
    // });
    // button('startBeat()', () => {
    //   this.ct.startBeat();
    // });
    // button('stopBeat()', () => {
    //   this.ct.stopBeat();
    // });
    return (
      <BeatAxl
        ref={refBeatAxl}
        tempo={tempo} 
        remaining={remaining}
      />
    );
  }, {
    notes: `Indicates current tempo and increases/decreases beat.`,
  })
  .add('Beat', () => {
    const tempo = number('Tempo', 90);
    // button('toggle()', () => {
    //   refCounterBeat.toggle();
    // });
    return (
      <Beat 
        ref={refBeat}
        tempo={tempo} 
        tempoRange={{
          from: 1,
          to: 999,
        }}
      />
    );
  }, {
    notes: `Indicates current tempo and beats in consistent tempo.`,
  });