import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import { default as Ring } from 'AxlMetronome/Counter/Time/RingStepped';

configure({ adapter: new Adapter() });
const sel = (id: string) => `[data-testid="${id}"]`;

// tslint:disable:no-any
describe('RingStepped', () => {
  let ring: ReactWrapper;
  let ringInstance: Ring;
  let spy: { [s: string]: sinon.SinonSpy };

  beforeEach(() => {
    // Sets handlers before mounting.
    spy = {
      setProgress: sinon.spy(Ring.prototype, 'setProgress'),
      updateStrokeDasharray: sinon.spy(Ring.prototype as any, 'updateStrokeDasharray'),
    };
    sinon.replace(Ring.prototype as any, 'getR', () => 145);
    sinon.replace(Element.prototype as any, 'getBoundingClientRect', () => ({
      left: 0, 
      top: 0, 
      width: 300, 
      height: 300, 
    }));

    // Mounts VDOM and makes instance.
    ring = mount(<Ring
      step={5}
    />);
    ringInstance = ring.instance() as Ring;

    sinon.resetHistory();
  });
  afterEach(() => {
    ring.unmount();
    sinon.restore();
  });

  describe('inherited functons', () => {
    it('returns progress', () => {
      expect(ringInstance.getProgress()).toBe(0.0);
    });
  
    it('changes progress', () => {
      ringInstance.setProgress(0.5);
      expect(spy.updateStrokeDasharray.calledOnce).toBe(true);
      expect(ringInstance.getProgress()).toBe(0.5);
    });
  
    it('resets progress', () => {
      ringInstance.setProgress(0.875);
      expect(spy.updateStrokeDasharray.calledOnce).toBe(true);
  
      ringInstance.reset();
      expect(spy.updateStrokeDasharray.calledTwice).toBe(true);
      expect(ringInstance.getProgress()).toBe(0.0);
  
    });
  
    it('gets ratio', () => {
      expect((ringInstance as any).getRatio(150, 0)).toBe(0.25);
      expect((ringInstance as any).getRatio(300, 150)).toBe(0.5);
      expect((ringInstance as any).getRatio(150, 300)).toBe(0.75);
    });
  });

  describe('change value by MouseEvent', () => {
    afterEach(() => {
      ring.update();
      expect(ring).toMatchSnapshot();
    });

    it('mouseMove', () => {
      ring.find(sel('ring-global-taparea')).simulate('mousemove', {
        clientX: 300,
        clientY: 150,
      });

      expect(spy.setProgress.notCalled).toBe(true);
      expect(ringInstance.getProgress()).toBe(0.0);
    });

    it('mouseDown', () => {
      ring.find(sel('ring-taparea')).simulate('mousedown', {
        clientX: 300,
        clientY: 150,
      });

      expect(spy.setProgress.calledOnce).toBe(true);
      expect(ringInstance.getProgress()).toBe(0.4);
    });

    it('mouseDown => mouseMove', () => {
      ring.find(sel('ring-taparea')).simulate('mousedown', {
        clientX: 300,
        clientY: 150,
      });

      ring.find(sel('ring-global-taparea')).simulate('mousemove', {
        clientX: 150,
        clientY: 0,
      });

      expect(spy.setProgress.calledTwice).toBe(true);
      expect(ringInstance.getProgress()).toBe(0.2);
    });

    it('mouseDown => mouseMove => mouseUp', () => {
      ring.find(sel('ring-taparea')).simulate('mousedown', {
        clientX: 300,
        clientY: 150,
      });

      ring.find(sel('ring-global-taparea')).simulate('mousemove', {
        clientX: 150,
        clientY: 0,
      });

      ring.find(sel('ring-global-taparea')).simulate('mouseup');

      expect(spy.setProgress.calledTwice).toBe(true);
      expect(ringInstance.getProgress()).toBe(0.2);
    });
  });

  describe('change value by TouchEvent', () => {
    it('touchmove', () => {
      ring.find(sel('ring-global-taparea')).simulate('touchmove', {
        changedTouches: [{
          clientX: 300,
          clientY: 150,
        }],
      });

      expect(spy.setProgress.notCalled).toBe(true);
      expect(ringInstance.getProgress()).toBe(0.0);
    });

    it('touchstart', () => {
      ring.find(sel('ring-taparea')).simulate('touchstart', {
        changedTouches: [{
          clientX: 300,
          clientY: 150,
        }],
      });

      expect(spy.setProgress.calledOnce).toBe(true);
      expect(ringInstance.getProgress()).toBe(0.4);
    });

    it('touchstart => touchmove', () => {
      ring.find(sel('ring-taparea')).simulate('touchstart', {
        changedTouches: [{
          clientX: 300,
          clientY: 150,
        }],
      });

      ring.find(sel('ring-taparea')).simulate('touchmove', {
        changedTouches: [{
          clientX: 150,
          clientY: 0,
        }],
      });

      expect(spy.setProgress.calledTwice).toBe(true);
      expect(ringInstance.getProgress()).toBe(0.2);
    });

    it('touchstart => touchmove => touchend', () => {
      ring.find(sel('ring-taparea')).simulate('touchstart', {
        changedTouches: [{
          clientX: 300,
          clientY: 150,
        }],
      });

      ring.find(sel('ring-taparea')).simulate('touchmove', {
        changedTouches: [{
          clientX: 150,
          clientY: 0,
        }],
      });

      ring.find(sel('ring-taparea')).simulate('touchend');

      expect(spy.setProgress.calledTwice).toBe(true);
      expect(ringInstance.getProgress()).toBe(0.2);
    });
  });
});
