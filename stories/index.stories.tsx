import React, { createRef, RefObject } from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { button, number, boolean } from '@storybook/addon-knobs';

import TempoSelector from 'Tempo/TempoSelector';
import Tempo from 'Tempo/Tempo';

const refTempoSelector: RefObject<TempoSelector> = createRef<TempoSelector>();
const refTempo: RefObject<Tempo> = createRef<Tempo>();

const stories = {
  tempo: storiesOf('Tempo', module),
};

stories.tempo
  .add('selector', () => {
      const defaultTempo = {
        from: number('Default tempo from', 90),
        to: number('Default tempo to', 120)
      };
      const range = {
        from: number('Range from', 50),
        to: number('Range to', 200)
      };
      const maxDelta = number('Max delta', 100);
      const isHandlerEnabled = boolean('isHandlerEnabled', true);
      const isDescEnabled = boolean('isDescEnabled', false);
      button('getChildrenTempo()', () => {
        console.log(refTempoSelector.current!.getChildrenTempo());
      });
      return (
        <TempoSelector 
          ref={refTempoSelector} 
          defaultTempo={defaultTempo} 
          range={range} 
          maxDelta={maxDelta} 
          isHandlerEnabled={isHandlerEnabled} 
          isDescEnabled={isDescEnabled} 
        />
      );
    }, {
      notes: `Buttons to set beginning/final tempo.`
    }
  )
  .add('from', () => {
      const tempo = number('Tempo', 80);
      const range = {
        from: number('Range from', 50),
        to: number('Range to', 200)
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
        `Slide to change value.`
      ].join("\n")
    }
  )
  .add('to', () => {
      const tempo = number('Tempo', 150);
      const range = {
        from: number('Range from', 50),
        to: number('Range to', 200)
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
        `Slide to change value.`
      ].join("\n")
    }
  );