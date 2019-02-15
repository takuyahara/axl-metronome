import React, { createRef, RefObject } from 'react';
import { storiesOf } from '@storybook/react';
import { button, number } from '@storybook/addon-knobs';

import CounterTimeRingStepped from 'Ring/RingStepped';
import CounterTimeRing from 'Ring/Ring';

const refCounterTimeRingStepped: RefObject<CounterTimeRingStepped> = createRef<CounterTimeRingStepped>();
const refCounterTimeRing: RefObject<CounterTimeRing> = createRef<CounterTimeRing>();

storiesOf('Ring', module)
  .add('Stepped', () => {
    const step = number('Step', 10, {
      range: true,
      min: 1,
      max: 100,
      step: 1,
    });
    button('getProgress()', () => {
      console.log(refCounterTimeRingStepped.current!.getProgress());
    });
    button('reset()', () => {
      refCounterTimeRingStepped.current!.reset();
    });
    button('setProgress(0.375)', () => {
      refCounterTimeRingStepped.current!.setProgress(0.375);
    });
    button('setProgress(0.5)', () => {
      refCounterTimeRingStepped.current!.setProgress(0.5);
    });
    return (
      <CounterTimeRingStepped 
        ref={refCounterTimeRingStepped} 
        step={step}
      />
    );
  }, {
    notes: [
      `Ring to set and to indicate remaining time.`,
      `Click and drag is available.`,
    ].join("\n"),
  })
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
    ].join("\n"),
  });