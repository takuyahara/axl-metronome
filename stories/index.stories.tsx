import React, { createRef, RefObject } from 'react';
import { storiesOf } from '@storybook/react';
import { button, number, boolean } from '@storybook/addon-knobs';

import Tempo from 'Tempo/Tempo';

const refTempo: RefObject<Tempo> = createRef<Tempo>();

storiesOf('Tempo', module)
  .add('from', () => {
      const tempo = number('Tempo', 80);
      const range = {
        from: number('Range from', 50),
        to: number('Range to', 200),
      };
      const maxDelta = number('Max delta', 100);
      const isHandlerEnabled = boolean('isHandlerEnabled', true);
      button('getCurrentTempo()', () => {
        console.log(refTempo.current!.tempo);
      });
      return (
        <Tempo 
          ref={refTempo} 
          role="from" 
          tempo={tempo} 
          range={range} 
          maxDelta={maxDelta} 
          isHandlerEnabled={isHandlerEnabled}
        />
      );
    }, {
      notes: [
        `A button to set beginning tempo.`,
        `Slide to change value.`,
      ].join("\n"),
    },
  )
  .add('to', () => {
      const tempo = number('Tempo', 150);
      const range = {
        from: number('Range from', 50),
        to: number('Range to', 200),
      };
      const maxDelta = number('Max delta', 100);
      const isHandlerEnabled = boolean('isHandlerEnabled', true);
      button('getCurrentTempo()', () => {
        console.log(refTempo.current!.tempo);
      });
      return (
        <Tempo 
          ref={refTempo} 
          role="to" 
          tempo={tempo} 
          range={range} 
          maxDelta={maxDelta} 
          isHandlerEnabled={isHandlerEnabled}
        />
      );
    }, {
      notes: [
        `A button to set beginning tempo.`,
        `Slide to change value.`,
      ].join("\n"),
    },
  );