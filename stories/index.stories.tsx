import React, { createRef, RefObject } from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { button, number, boolean } from '@storybook/addon-knobs';

import CounterTimeRing from 'Ring/Ring';

const refCounterTimeRing: RefObject<CounterTimeRing> = createRef<CounterTimeRing>();

storiesOf('Ring', module)
  .add('Non-stepped', () => {
    button('getProgress()', () => {
      console.log(refCounterTimeRing.current!.getProgress());
    });
    button('reset()', () => {
      refCounterTimeRing.current!.reset();
    });
    button('setProgress(0.375)', () => {
      refCounterTimeRing.current!.setProgress(0.375);
    });
    button('setProgress(0.5)', () => {
      refCounterTimeRing.current!.setProgress(0.5);
    });
    return (
      <CounterTimeRing 
        ref={refCounterTimeRing} 
      />
    );
  }, {
    notes: [
      `Ring to set and to indicate remaining time.`,
      `Click and drag is available.`,
    ].join("\n")
  });