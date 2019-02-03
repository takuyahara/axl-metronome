import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Indicator from 'Indicator/Indicator';
import Timer from 'Indicator/Timer';
import State from 'Indicator/State';

configure({ adapter: new Adapter() });

describe('Indicator', () => {
  let indicator: ReactWrapper;
  let indicatorInstance: Indicator;
  let spy: {
    onClick: sinon.SinonSpy,
    toggle: sinon.SinonSpy,
  };
  let clock: sinon.SinonFakeTimers;
  const postProcess = {
    onCount: (remaining: number) => {},
    onCountStart: () => {},
    onCountStop: () => {},
    onCountComplete: (remaining: number) => {},
  };
  
  beforeEach(() => {
    spy = Object.assign({
      onClick: sinon.spy((Indicator as any).prototype, 'onClick'),
      toggle: sinon.spy(Timer.prototype, 'toggle'),
    });
    clock = sinon.useFakeTimers();
    indicator = mount(<Indicator 
      timeToCount={900} 
      postProcess={{...postProcess}} 
    />);
    indicatorInstance = indicator.instance() as Indicator;
  })
  afterEach(() => {
    sinon.restore();
  });

  describe('public functions', () => {
    it('changes remaining time', () => {
      indicatorInstance.setProgress(0.25);
      expect(indicatorInstance.getProgress()).toBe(0.25);
      expect(indicatorInstance.getRemaining()).toBe(675);
    });

    it('calls reset when not running', () => {
      expect(indicatorInstance.getState()).toBe(State.Stopped);
      expect(indicatorInstance.getRemaining()).toBe(900);
      (indicatorInstance as any).timer.reset();
      expect(indicatorInstance.getState()).toBe(State.Stopped);
      expect(indicatorInstance.getRemaining()).toBe(900);
    });

    it('calls reset when running', () => {
      indicator.find('.remaining').simulate('click', {
        clientX: 70,
        clientY: 70,
      });
      clock.tick(2000);

      expect(indicatorInstance.getState()).toBe(State.Running);
      expect(indicatorInstance.getRemaining()).toBe(898);

      indicatorInstance.reset();
      clock.tick(2000);
      expect(indicatorInstance.getState()).toBe(State.Stopped);
      expect(indicatorInstance.getRemaining()).toBe(900);
    });
  });

  describe('private functions', () => {
    it('formats number', () => {
      expect((indicatorInstance as any).formatTime(0)).toBe('00:00');
      expect((indicatorInstance as any).formatTime(9)).toBe('00:09');
      expect((indicatorInstance as any).formatTime(10)).toBe('00:10');
      expect((indicatorInstance as any).formatTime(59)).toBe('00:59');
      expect((indicatorInstance as any).formatTime(60)).toBe('01:00');
      expect((indicatorInstance as any).formatTime(69)).toBe('01:09');
      expect((indicatorInstance as any).formatTime(70)).toBe('01:10');
      expect((indicatorInstance as any).formatTime(600)).toBe('10:00');
      expect((indicatorInstance as any).formatTime(3599)).toBe('59:59');
    });
  });

  describe('MouseEvents', () => {
    afterEach(() => {
      indicator.update();
      expect(indicator).toMatchSnapshot();
    });
    it('clicks 1 time', () => {
      indicator.find('.remaining').simulate('click', {
        clientX: 70,
        clientY: 70,
      });
      expect(spy.onClick.calledOnce).toBe(true);
      expect(spy.toggle.calledOnce).toBe(true);
      clock.tick(2000);

      expect(indicatorInstance.getState()).toBe(State.Running);
      expect(indicatorInstance.getRemaining()).toBe(898);
    });

    it('clicks 2 times', () => {
      // First click
      indicator.find('.remaining').simulate('click', {
        clientX: 70,
        clientY: 70,
      });
      expect(spy.onClick.calledOnce).toBe(true);
      expect(spy.toggle.calledOnce).toBe(true);

      // First wait
      clock.tick(2000);
      expect(indicatorInstance.getState()).toBe(State.Running);
      expect(indicatorInstance.getRemaining()).toBe(898);

      // Second click
      spy.onClick.resetHistory();
      spy.toggle.resetHistory();
      indicator.find('.remaining').simulate('click', {
        clientX: 70,
        clientY: 70,
      });
      expect(spy.onClick.calledOnce).toBe(true);
      expect(spy.toggle.calledOnce).toBe(true);

      // Second wait
      clock.tick(2000);
      expect(indicatorInstance.getState()).toBe(State.Paused);
      expect(indicatorInstance.getRemaining()).toBe(898);

      // Done
    });

    it('clicks 3 times', () => {
      // First click
      indicator.find('.remaining').simulate('click', {
        clientX: 70,
        clientY: 70,
      });
      expect(spy.onClick.calledOnce).toBe(true);
      expect(spy.toggle.calledOnce).toBe(true);

      // First wait
      clock.tick(2000);
      expect(indicatorInstance.getState()).toBe(State.Running);
      expect(indicatorInstance.getRemaining()).toBe(898);

      // Second click
      spy.onClick.resetHistory();
      spy.toggle.resetHistory();
      indicator.find('.remaining').simulate('click', {
        clientX: 70,
        clientY: 70,
      });
      expect(spy.onClick.calledOnce).toBe(true);
      expect(spy.toggle.calledOnce).toBe(true);

      // Second wait
      clock.tick(2000);
      expect(indicatorInstance.getState()).toBe(State.Paused);
      expect(indicatorInstance.getRemaining()).toBe(898);

      // Third click
      spy.onClick.resetHistory();
      spy.toggle.resetHistory();
      indicator.find('.remaining').simulate('click', {
        clientX: 70,
        clientY: 70,
      });
      expect(spy.onClick.calledOnce).toBe(true);
      expect(spy.toggle.calledOnce).toBe(true);

      // Third wait
      clock.tick(2000);
      expect(indicatorInstance.getState()).toBe(State.Running);
      expect(indicatorInstance.getRemaining()).toBe(896);
    });
  });
});
