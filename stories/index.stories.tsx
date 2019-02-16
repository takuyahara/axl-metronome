import React, { createRef, RefObject } from 'react';
import { storiesOf } from '@storybook/react';
import { button, number } from '@storybook/addon-knobs';

import Time from 'Time/Time';
import Indicator from 'Time/Indicator';
import RingStepped from 'Time/RingStepped';
import Ring from 'Time/Ring';

const refTime: RefObject<Time> = createRef<Time>();
const refIndicator: RefObject<Indicator> = createRef<Indicator>();
const refRingStepped: RefObject<RingStepped> = createRef<RingStepped>();
const refRing: RefObject<Ring> = createRef<Ring>();

storiesOf('Time', module)
  .add('Time', () => {
    const remaining = number('Remaining time in seconds', 10);
    return (
      <Time 
        ref={refTime}
        remaining={remaining} 
      />
    );
  }, {
    notes: [
      `Combination of Indicator and Ring.`,
      `Click Indicator to start/stop counting time. Ring also indicates remaining time.`,
      `Click and drag Ring to change time to count. Indicator stops counting and value will be reflected immediately.current!.`,
    ].join("\n"),
  })
  .add('Indicator', () => {
    const remaining = number('Remaining time in seconds', 900);
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
  .add('Ring Stepped', () => {
    const step = number('Step', 10, {
      range: true,
      min: 1,
      max: 100,
      step: 1,
    });
    button('getProgress()', () => {
      console.log(refRingStepped.current!.getProgress());
    });
    button('reset()', () => {
      refRingStepped.current!.reset();
    });
    button('setProgress(0.375)', () => {
      refRingStepped.current!.setProgress(0.375);
    });
    button('setProgress(0.5)', () => {
      refRingStepped.current!.setProgress(0.5);
    });
    return (
      <RingStepped 
        ref={refRingStepped} 
        step={step}
      />
    );
  }, {
    notes: [
      `Ring to set and to indicate remaining time.`,
      `Click and drag is available.`,
    ].join("\n"),
  })
  .add('Ring Non-stepped', () => {
    button('getProgress()', () => {
      console.log(refRing.current!.getProgress());
    });
    button('reset()', () => {
      refRing.current!.reset();
    });
    button('setProgress(0.375)', () => {
      refRing.current!.setProgress(0.375);
    });
    button('setProgress(0.5)', () => {
      refRing.current!.setProgress(0.5);
    });
    return (
      <Ring 
        ref={refRing} 
      />
    );
  }, {
    notes: [
      `Ring to set and to indicate remaining time.`,
      `Click and drag is available.`,
    ].join("\n"),
  });