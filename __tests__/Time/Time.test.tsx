import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Time from 'Time/Time';
import Timer from 'Time/Timer';
import { default as Ring } from 'Time/RingStepped';
import State from 'Time/Status';

interface ISpy {
  Timer: {
    timerRunner: sinon.SinonSpy;
  };
  Time: {
    onRingMouseDown: sinon.SinonSpy;
    onRingMouseMove: sinon.SinonSpy;
    onRingMouseUp: sinon.SinonSpy;
    onIndicatorCount: sinon.SinonSpy;
    onIndicatorCountStart: sinon.SinonSpy;
    onIndicatorCountStop: sinon.SinonSpy;
    onIndicatorCountPause: sinon.SinonSpy;
    onIndicatorCountResume: sinon.SinonSpy;
    onIndicatorCountComplete: sinon.SinonSpy;
  };
}

configure({ adapter: new Adapter() });

// tslint:disable:no-any
describe('Ring', () => {
  let time: ReactWrapper;
  let timeInstance: Time;
  const spy: ISpy = Object.assign({});
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    spy.Timer = {
      timerRunner: sinon.spy(Timer.prototype as any, 'timerRunner'),
    };
    spy.Time = {
      onRingMouseDown: sinon.spy(Time.prototype as any, 'onRingMouseDown'),
      onRingMouseMove: sinon.spy(Time.prototype as any, 'onRingMouseMove'),
      onRingMouseUp: sinon.spy(Time.prototype as any, 'onRingMouseUp'),
      onIndicatorCount: sinon.spy(Time.prototype as any, 'onIndicatorCount'),
      onIndicatorCountStart: sinon.spy(Time.prototype as any, 'onIndicatorCountStart'),
      onIndicatorCountStop: sinon.spy(Time.prototype as any, 'onIndicatorCountStop'),
      onIndicatorCountPause: sinon.spy(Time.prototype as any, 'onIndicatorCountPause'),
      onIndicatorCountResume: sinon.spy(Time.prototype as any, 'onIndicatorCountResume'),
      onIndicatorCountComplete: sinon.spy(Time.prototype as any, 'onIndicatorCountComplete'),
    };
    sinon.replace(Ring.prototype as any, 'getR', () => 145);
    sinon.replace(Element.prototype as any, 'getBoundingClientRect', () => ({
      x: 0, 
      y: 0, 
      width: 300, 
      height: 300, 
    }));

    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    time.update();
    expect(time).toMatchSnapshot();
    time.unmount();
    sinon.restore();
  });

  describe('without post process', () => {
    beforeEach(() => {
      time = mount(<Time
        remaining={10}
      />);
      timeInstance = time.instance() as Time;
      sinon.resetHistory();
    });

    it('set/get progress', () => {
      expect(timeInstance.getProgress()).toBe(0);
      timeInstance.setProgress(0.5);
      expect(timeInstance.getProgress()).toBe(0.5);
    });

    describe('MouseEvent', () => {
      describe('Time is not running', () => {
        it('Indicator.click 1 time', () => {
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Running);
          
          expect(spy.Time.onIndicatorCount.callCount).toBe(2);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(0);
        });

        it('Indicator.click 2 times', () => {
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          sinon.resetHistory();
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Paused);

          expect(spy.Time.onIndicatorCount.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(0);
        });

        it('Indicator.click 3 times', () => {
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          sinon.resetHistory();
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          expect(timeInstance.getProgress()).toBe(0.4);
          expect(timeInstance.getState()).toBe(State.Running);

          expect(spy.Time.onIndicatorCount.callCount).toBe(2);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(0);
        });

        it('Indicator.click and complete counting down', () => {
          time.find('.indicator').simulate('click');
          clock.tick(10 * 1000);
          clock.tick(1000); // factor of safety
          expect(timeInstance.getProgress()).toBe(0);
          expect(timeInstance.getState()).toBe(State.Stopped);
          
          expect(spy.Time.onIndicatorCount.callCount).toBe(10);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(1);
        });

        it('Ring.mousedown', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          expect(timeInstance.getProgress()).toBe(0.5);
          expect(timeInstance.getState()).toBe(State.Stopped);
          expect((timeInstance as any).isDragging).toBe(false);

          expect(spy.Time.onRingMouseDown.callCount).toBe(1);
          expect(spy.Time.onRingMouseMove.callCount).toBe(0);
          expect(spy.Time.onRingMouseUp.callCount).toBe(0);
          expect(spy.Time.onIndicatorCount.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mouseup', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.5);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spy.Time.onRingMouseDown.callCount).toBe(1);
          expect(spy.Time.onRingMouseMove.callCount).toBe(0);
          expect(spy.Time.onRingMouseUp.callCount).toBe(1);
          expect(spy.Time.onIndicatorCount.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spy.Time.onRingMouseDown.callCount).toBe(1);
          expect(spy.Time.onRingMouseMove.callCount).toBe(1);
          expect(spy.Time.onRingMouseUp.callCount).toBe(1);
          expect(spy.Time.onIndicatorCount.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click and complete counting down', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.5);
          expect(timeInstance.getState()).toBe(State.Stopped);

          time.find('.indicator').simulate('click');
          clock.tick(2000);
          expect(timeInstance.getProgress()).toBe(0.7);
          expect(timeInstance.getState()).toBe(State.Running);

          clock.tick(3000);
          clock.tick(1000); // factor of safety
          expect(timeInstance.getProgress()).toBe(0.0);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spy.Time.onRingMouseDown.callCount).toBe(1);
          expect(spy.Time.onRingMouseMove.callCount).toBe(0);
          expect(spy.Time.onRingMouseUp.callCount).toBe(1);
          expect(spy.Time.onIndicatorCount.callCount).toBe(5);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(1);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click and complete counting down', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Stopped);

          time.find('.indicator').simulate('click');
          clock.tick(2000);
          expect(timeInstance.getProgress()).toBe(0.4);
          expect(timeInstance.getState()).toBe(State.Running);

          clock.tick(6000);
          clock.tick(1000); // factor of safety
          expect(timeInstance.getProgress()).toBe(0.0);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spy.Time.onRingMouseDown.callCount).toBe(1);
          expect(spy.Time.onRingMouseMove.callCount).toBe(1);
          expect(spy.Time.onRingMouseUp.callCount).toBe(1);
          expect(spy.Time.onIndicatorCount.callCount).toBe(8);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(1);
        });
      });

      describe('Time is running', () => {
        beforeEach(() => {
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          sinon.resetHistory();
        });

        it('Ring.mousedown', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          expect(timeInstance.getProgress()).toBe(0.5);
          expect((timeInstance as any).isDragging).toBe(true);

          clock.tick(5000);
          expect(spy.Timer.timerRunner.notCalled).toBe(true);

          expect(spy.Time.onRingMouseDown.callCount).toBe(1);
          expect(spy.Time.onRingMouseMove.callCount).toBe(0);
          expect(spy.Time.onRingMouseUp.callCount).toBe(0);
          expect(spy.Time.onIndicatorCount.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mousemove', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Paused);

          clock.tick(5000);
          expect(spy.Timer.timerRunner.notCalled).toBe(true);

          expect(spy.Time.onRingMouseDown.callCount).toBe(1);
          expect(spy.Time.onRingMouseMove.callCount).toBe(1);
          expect(spy.Time.onRingMouseUp.callCount).toBe(0);
          expect(spy.Time.onIndicatorCount.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Running);

          clock.tick(5000);
          expect(spy.Timer.timerRunner.callCount).toBe(5);

          expect(spy.Time.onRingMouseDown.callCount).toBe(1);
          expect(spy.Time.onRingMouseMove.callCount).toBe(1);
          expect(spy.Time.onRingMouseUp.callCount).toBe(1);
          expect(spy.Time.onIndicatorCount.callCount).toBe(5);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mouseup and complete counting down', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.5);
          expect(timeInstance.getState()).toBe(State.Running);

          clock.tick(5000);
          clock.tick(1000); // factor of safety
          expect(timeInstance.getProgress()).toBe(0.0);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spy.Time.onRingMouseDown.callCount).toBe(1);
          expect(spy.Time.onRingMouseMove.callCount).toBe(0);
          expect(spy.Time.onRingMouseUp.callCount).toBe(1);
          expect(spy.Time.onIndicatorCount.callCount).toBe(5);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(1);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup and complete counting down', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Running);

          clock.tick(8000);
          clock.tick(1000); // factor of safety
          expect(timeInstance.getProgress()).toBe(0.0);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spy.Time.onRingMouseDown.callCount).toBe(1);
          expect(spy.Time.onRingMouseMove.callCount).toBe(1);
          expect(spy.Time.onRingMouseUp.callCount).toBe(1);
          expect(spy.Time.onIndicatorCount.callCount).toBe(8);
          expect(spy.Time.onIndicatorCountStart.callCount).toBe(0);
          expect(spy.Time.onIndicatorCountStop.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountPause.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountResume.callCount).toBe(1);
          expect(spy.Time.onIndicatorCountComplete.callCount).toBe(1);
        });
      });
    });
  });

  describe('with post process', () => {
    let spyPostProcess: {
      Ring: {
        onMouseDown: sinon.SinonSpy;
        onMouseMove: sinon.SinonSpy;
        onMouseUp: sinon.SinonSpy;
      },
      Indicator: {
        onCount: sinon.SinonSpy;
        onCountStart: sinon.SinonSpy;
        onCountStop: sinon.SinonSpy;
        onCountPause: sinon.SinonSpy;
        onCountResume: sinon.SinonSpy;
        onCountComplete: sinon.SinonSpy;
      },
    };
    beforeEach(() => {
      spyPostProcess = {
        Ring: {
          onMouseDown: sinon.spy(),
          onMouseMove: sinon.spy(),
          onMouseUp: sinon.spy(),
        },
        Indicator: {
          onCount: sinon.spy(),
          onCountStart: sinon.spy(),
          onCountStop: sinon.spy(),
          onCountPause: sinon.spy(),
          onCountResume: sinon.spy(),
          onCountComplete: sinon.spy(),
        },
      };
      time = mount(<Time
        remaining={10} 
        postProcess={spyPostProcess}
      />);
      timeInstance = time.instance() as Time;
      sinon.resetHistory();
    });

    describe('MouseEvent', () => {
      describe('Time is not running', () => {
        it('Indicator.click 1 time', () => {
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Running);
          
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(2);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(0);
        });

        it('Indicator.click 2 times', () => {
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          sinon.resetHistory();
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Paused);

          expect(spyPostProcess.Indicator.onCount.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(0);
        });

        it('Indicator.click 3 times', () => {
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          sinon.resetHistory();
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          expect(timeInstance.getProgress()).toBe(0.4);
          expect(timeInstance.getState()).toBe(State.Running);

          expect(spyPostProcess.Indicator.onCount.callCount).toBe(2);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(0);
        });

        it('Indicator.click and complete counting down', () => {
          time.find('.indicator').simulate('click');
          clock.tick(10 * 1000);
          clock.tick(1000); // factor of safety
          expect(timeInstance.getProgress()).toBe(0);
          expect(timeInstance.getState()).toBe(State.Stopped);
          
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(10);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(0);
        });

        it('Ring.mousedown', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          expect(timeInstance.getProgress()).toBe(0.5);
          expect(timeInstance.getState()).toBe(State.Stopped);
          expect((timeInstance as any).isDragging).toBe(false);

          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mouseup', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.5);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click and complete counting down', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.5);
          expect(timeInstance.getState()).toBe(State.Stopped);

          time.find('.indicator').simulate('click');
          clock.tick(2000);
          expect(timeInstance.getProgress()).toBe(0.7);
          expect(timeInstance.getState()).toBe(State.Running);

          clock.tick(3000);
          clock.tick(1000); // factor of safety
          expect(timeInstance.getProgress()).toBe(0.0);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(5);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(1);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click and complete counting down', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Stopped);

          time.find('.indicator').simulate('click');
          clock.tick(2000);
          expect(timeInstance.getProgress()).toBe(0.4);
          expect(timeInstance.getState()).toBe(State.Running);

          clock.tick(6000);
          clock.tick(1000); // factor of safety
          expect(timeInstance.getProgress()).toBe(0.0);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(8);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(1);
        });
      });

      describe('Time is running', () => {
        beforeEach(() => {
          time.find('.indicator').simulate('click');
          clock.tick(2000);
          sinon.resetHistory();
        });

        it('Ring.mousedown', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          expect(timeInstance.getProgress()).toBe(0.5);
          expect((timeInstance as any).isDragging).toBe(true);

          clock.tick(5000);
          expect(spy.Timer.timerRunner.notCalled).toBe(true);

          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mousemove', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Paused);

          clock.tick(5000);
          expect(spy.Timer.timerRunner.notCalled).toBe(true);

          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Running);

          clock.tick(5000);
          expect(spy.Timer.timerRunner.callCount).toBe(5);

          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(5);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(0);
        });

        it('Ring.mousedown => Ring.mouseup and complete counting down', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.5);
          expect(timeInstance.getState()).toBe(State.Running);

          clock.tick(5000);
          clock.tick(1000); // factor of safety
          expect(timeInstance.getProgress()).toBe(0.0);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(0);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(5);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(1);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup and complete counting down', () => {
          time.find('.ring .tapArea').simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          time.find('.ring .globalTapArea').simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          time.find('.ring .globalTapArea').simulate('mouseup');
          expect(timeInstance.getProgress()).toBe(0.2);
          expect(timeInstance.getState()).toBe(State.Running);

          clock.tick(8000);
          clock.tick(1000); // factor of safety
          expect(timeInstance.getProgress()).toBe(0.0);
          expect(timeInstance.getState()).toBe(State.Stopped);

          expect(spyPostProcess.Ring.onMouseDown.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseMove.callCount).toBe(1);
          expect(spyPostProcess.Ring.onMouseUp.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCount.callCount).toBe(8);
          expect(spyPostProcess.Indicator.onCountStart.callCount).toBe(0);
          expect(spyPostProcess.Indicator.onCountStop.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountPause.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountResume.callCount).toBe(1);
          expect(spyPostProcess.Indicator.onCountComplete.callCount).toBe(1);
        });
      });
    });
  });
});
