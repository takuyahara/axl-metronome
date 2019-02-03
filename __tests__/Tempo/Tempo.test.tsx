import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Tempo from 'Tempo/Tempo';

interface ISpy {
  [s: string]: {
    [s: string]: sinon.SinonSpy
  }
}

configure({ adapter: new Adapter() });

let tempo: ReactWrapper;
let tempoInstance: Tempo;
let spy: ISpy = {};

describe('from / to', () => {
  beforeEach(() => {
    // Sinon
    spy = {
      Tempo: {
        getDist: sinon.spy(Tempo.prototype, "getDist"),
        changeTempo: sinon.spy(Tempo.prototype, "changeTempo"),
        mouseDown: sinon.spy(Tempo.prototype as any, "mouseDown"),
        mouseMove: sinon.spy(Tempo.prototype as any, "mouseMove"),
        mouseUp: sinon.spy(Tempo.prototype as any, "mouseUp"),        
      },
    };
    sinon.replace(Tempo.prototype as any, 'getWidth', () => 500);

    // Enzyme
    tempo = mount(
      <Tempo 
        role="from" 
        tempo={80} 
        maxDelta={100} 
        range={{
          from: 50,
          to: 200
        }} 
        isHandlerEnabled={true}
      />);
    tempoInstance = tempo.instance() as Tempo;
    
    // Sinon - reset
    sinon.resetHistory();
  });
  afterEach(() => {
    expect(tempo).toMatchSnapshot();
    tempo.unmount();
    sinon.restore();
  });

  it('returns current tempo', () => {
    tempo.children('.from').simulate('mousedown', {});

    expect(tempoInstance.tempo).toBe(80);
  });

  it('changes tempo', () => {
    tempoInstance.changeTempo(150);
    expect(tempoInstance.tempo).toBe(150);
  });

  it('normalize tempo to min when passed value is less than than min', () => {
    tempoInstance.changeTempo(30);
    expect(tempoInstance.tempo).toBe(50);
  });

  it('normalize tempo to max when passed value is more than than max', () => {
    tempoInstance.changeTempo(300);
    expect(tempoInstance.tempo).toBe(200);
  });

  describe('MouseEvent', () => {
    it('mouseDown', () => {
      tempo.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        preventDefault: () => {},
      });
  
      expect((tempoInstance as any).distFrom).toBe(100);
      expect((tempoInstance as any).isTapped).toBe(true);
    });
  
    it('mouseDown => mouseMove', () => {
      tempo.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        preventDefault: () => {},
      });
      tempo.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        preventDefault: () => {},
      });

      expect(spy.Tempo.getDist.calledOnceWith(100, 300)).toBe(true);
      expect(spy.Tempo.getDist.returned(40)).toBe(true);
      expect(spy.Tempo.changeTempo.calledOnceWith(120)).toBe(true);
    });
  
    it('mouseDown => mouseMove => mouseUp', () => {
      tempo.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        preventDefault: () => {},
      });
      tempo.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        preventDefault: () => {},
      });
      tempo.find('.from').simulate('mouseup', {
        type: 'mouseup',
        preventDefault: () => {},
      });

      expect((tempoInstance as any).isTapped).toBe(false);
    });
  
    it('toggleHandler() => mouseDown => mouseMove => mouseUp', () => {
      tempoInstance.toggleHandler();
      tempo.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        preventDefault: () => {},
      });
      tempo.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        preventDefault: () => {},
      });
      tempo.find('.from').simulate('mouseup', {
        type: 'mouseup',
        preventDefault: () => {},
      });
      
      expect(spy.Tempo.mouseDown.notCalled).toBe(true);
      expect(spy.Tempo.mouseMove.notCalled).toBe(true);
      expect(spy.Tempo.mouseUp.notCalled).toBe(true);
      expect((tempoInstance as any).isTapped).toBe(false);
    });
  
    it('toggleHandler() * 2 => mouseDown => mouseMove => mouseUp', () => {
      tempoInstance.toggleHandler();
      tempoInstance.toggleHandler();
      tempo.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        preventDefault: () => {},
      });
      tempo.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        preventDefault: () => {},
      });
      tempo.find('.from').simulate('mouseup', {
        type: 'mouseup',
        preventDefault: () => {},
      });
      
      expect(tempoInstance.state.tempoCurr).toBe(120);
      expect((tempoInstance as any).isTapped).toBe(false);
    });
  });

  describe('TouchEvent', () => {
    it('touchStart', () => {
      tempo.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100
          }
        ],
        preventDefault: () => {}
      });
  
      expect((tempoInstance as any).distFrom).toBe(100);
      expect((tempoInstance as any).isTapped).toBe(true);
    });

    it('touchStart => touchMove', () => {
      tempo.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100
          }
        ],
        preventDefault: () => {}
      });
      tempo.find('.from').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300
          }
        ],
        preventDefault: () => {}
      });

      expect(spy.Tempo.getDist.calledOnceWith(100, 300)).toBe(true);
      expect(spy.Tempo.getDist.returned(40)).toBe(true);
      expect(spy.Tempo.changeTempo.calledOnceWith(120)).toBe(true);
    });

    it('touchStart => touchMove => touchEnd', () => {
      tempo.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100
          }
        ],
        preventDefault: () => {}
      });
      tempo.find('.from').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300
          }
        ],
        preventDefault: () => {}
      });
      tempo.find('.from').simulate('touchend', {
        type: "touchend",
        preventDefault: () => {}
      });

      expect((tempoInstance as any).isTapped).toBe(false);
    });

    it('toggleHandler() => touchStart => touchMove => touchEnd', () => {
      tempoInstance.toggleHandler();
      tempo.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100
          }
        ],
        preventDefault: () => {}
      });
      tempo.find('.from').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300
          }
        ],
        preventDefault: () => {}
      });
      tempo.find('.from').simulate('touchend', {
        type: "touchend",
        preventDefault: () => {}
      });

      expect(spy.Tempo.mouseDown.notCalled).toBe(true);
      expect(spy.Tempo.mouseMove.notCalled).toBe(true);
      expect(spy.Tempo.mouseUp.notCalled).toBe(true);
      expect((tempoInstance as any).isTapped).toBe(false);
    });

    it('toggleHandler() * 2 => touchStart => touchMove => touchEnd', () => {
      tempoInstance.toggleHandler();
      tempoInstance.toggleHandler();
      tempo.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100
          }
        ],
        preventDefault: () => {}
      });
      tempo.find('.from').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300
          }
        ],
        preventDefault: () => {}
      });
      tempo.find('.from').simulate('touchend', {
        type: "touchend",
        preventDefault: () => {}
      });

      expect(tempoInstance.state.tempoCurr).toBe(120);
      expect((tempoInstance as any).isTapped).toBe(false);
    });
  });
});
