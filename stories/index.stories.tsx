import React, { createRef, RefObject } from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { button, number, boolean } from '@storybook/addon-knobs';

import CounterTimeIndicator from 'Indicator/Indicator';

const refCounterTimeIndicator: RefObject<CounterTimeIndicator> = createRef<CounterTimeIndicator>();

storiesOf('Counter', module)
  .add('Indicator', () => {
    const remaining = number('Remaining time in seconds', 900);
    const postProcess = {
      onCount: (remaining: number) => {},
      onCountStart: () => {},
      onCountStop: () => {},
      onCountComplete: (remaining: number) => {},
    };
    return (
      <CounterTimeIndicator 
        ref={refCounterTimeIndicator} 
        timeToCount={remaining} 
        postProcess={{...postProcess}}
      />
    );
  }, {
    notes: [
      `Button to start/stop counting time and to indicate remaining time.`,
      `Click to start/stop counting. When counting completed value turns back to original one.`,
    ].join("\n")
  });