import React, { createRef, RefObject } from 'react';
import { storiesOf } from '@storybook/react';
import { button, number } from '@storybook/addon-knobs';

import Indicator from 'Indicator/Indicator';
import Remaining from 'Indicator/Remaining';

const refIndicator: RefObject<Indicator> = createRef<Indicator>();
const refRemaining: RefObject<Remaining> = createRef<Remaining>();

storiesOf('Indicator', module)
  .add('Indicator', () => {
    const remaining = number('Remaining time in seconds', 3);
    button('setProgress(0.25)', () => {
      refIndicator.current!.setProgress(0.25);
    });
    return (
      <Indicator 
        ref={refIndicator} 
        timeToCount={remaining} 
      />
    );
  }, {
    notes: [
      `Button to start/stop counting time and to indicate remaining time.`,
      `Click to start/stop counting. When counting completed value turns back to original one.`,
    ].join("\n"),
  })
  .add('Remaining', () => {
    const remaining = number('Remaining time in seconds', 900);
    button('setRemaining(225)', () => {
      refRemaining.current!.setRemaining(225);
    });
    return (
      <Remaining 
        ref={refRemaining} 
        timeToCount={remaining} 
      />
    );
  }, {
    notes: [
      `Just show time`,
    ].join("\n"),
  });