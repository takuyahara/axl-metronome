import React, { createRef, RefObject } from 'react';
import _ from 'lodash';
import style from './Beat.module.scss';
import Beat from './Beat';
import Status from './Status';
import Utils, { ICssSelector } from '../Utils';

interface IProps {
  tempo: ITempo;
  remaining: number;
  postProcess?: {
    onAccelerate?: () => void;
    onTick?: () => void;
    onStart?: () => void;
    onStop?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    onComplete?: () => void;
  };
  inheritedSelector?: ICssSelector;
}
interface IState {
  // empty
}
interface ITempo {
  from: number;
  to: number;
}
class BeatAxl extends React.Component<IProps, IState> {
  // Initialize in init()
  private refBeat!: RefObject<Beat>;
  private timerId!: NodeJS.Timer | number;
  private tempoDiff!: number;
  private interval!: number;
  private cntRemaining!: number;
  private postAccelerate: () => void;
  private postTick: () => void;
  private postStart: () => void;
  private postStop: () => void;
  private postPause: () => void;
  private postResume: () => void;
  private postComplete: () => void;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      // empty
    };

    // Ref
    this.refBeat = createRef<Beat>();

    // Post process
    this.postAccelerate = props.postProcess && props.postProcess.onAccelerate ? props.postProcess.onAccelerate : () => {};
    this.postTick = props.postProcess && props.postProcess.onTick ? props.postProcess.onTick : () => {};
    this.postStart = props.postProcess && props.postProcess.onStart ? props.postProcess.onStart : () => {};
    this.postStop = props.postProcess && props.postProcess.onStop ? props.postProcess.onStop : () => {};
    this.postPause = props.postProcess && props.postProcess.onPause ? props.postProcess.onPause : () => {};
    this.postResume = props.postProcess && props.postProcess.onResume ? props.postProcess.onResume : () => {};
    this.postComplete = props.postProcess && props.postProcess.onComplete ? props.postProcess.onComplete : () => {};

    // Function binding
    this.accelerate = this.accelerate.bind(this);
    this.onAccelerate = this.onAccelerate.bind(this);
    this.onTick = this.onTick.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onResume = this.onResume.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.init(props);
  }
  private init(props: IProps): void {
    this.tempoDiff = Math.abs(props.tempo.to - props.tempo.from);
    this.interval = (this.tempoDiff !== 0 ? 1 / (this.tempoDiff / props.remaining) : 1) * 1000;
    this.cntRemaining = this.tempoDiff !== 0 ? this.tempoDiff : props.remaining;
  }
  private accelerate(): void {
    const refBeat = this.refBeat.current!;

    // Get increment
    let incr = 0;
    // Assign incremented tempo
    if (this.props.tempo.to > this.props.tempo.from) {
      incr = 1;
    } else if (this.props.tempo.to < this.props.tempo.from) {
      incr = -1;
    }
    this.setTempo(refBeat.getTempo() + incr);
    this.onAccelerate();

    // Stop when tempo has reached to `this.props.tempo.to`
    if (--this.cntRemaining <= 0) {
      this.onComplete();
    }
  }
  private onAccelerate(): void {
    this.postAccelerate();
  }
  private onTick(): void {
    this.postTick();
  }
  private onStart(): void {
    this.start();
    this.postStart();
  }
  private onStop(): void {
    this.cntRemaining = this.tempoDiff;
    this.stop();
    this.postStop();
  }
  private onPause(): void {
    this.pause();
    this.postPause();
  }
  private onResume(): void {
    this.resume();
    this.postResume();
  }
  private onComplete(): void {
    const refBeat = this.refBeat.current!;
    this.stop();
    refBeat.setTempo(this.props.tempo.to);

    // Wait 1 second to show that tempo has reached to the end.
    setTimeout(() => {
      refBeat.setTempo(this.props.tempo.from);
      refBeat.stop();
      this.postComplete();
    }, 1000);
  }
  public start(): void {
    this.timerId = setInterval(this.accelerate, this.interval);
  }
  public stop(): void {
    clearInterval(this.timerId as number);
    this.cntRemaining = this.tempoDiff !== 0 ? this.tempoDiff : this.props.remaining;
  }
  public pause(): void {
    clearInterval(this.timerId as number);
  }
  public resume(): void {
    this.timerId = setInterval(this.accelerate, this.interval);
  }
  public setTempo(newTempo: number): void {
    const refBeat = this.refBeat.current!;
    refBeat.setTempo(newTempo);
  }
  public getTempo(): number {
    const refBeat = this.refBeat.current!;
    return refBeat.getTempo();
  }
  public getState(): Status {
    const refBeat = this.refBeat.current!;
    return refBeat.getState();
  }
  /* istanbul ignore next */
  public componentWillMount(): void {
    if (this.props.inheritedSelector) {
      Utils.inheritSelector(style, this.props.inheritedSelector);
    }
  }
  /* istanbul ignore next */
  public componentWillUnmount(): void {
    this.stop();
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(nextProps: IProps): void {
    if (_.isEqual(this.props, nextProps)) {
      return;
    }

    // Main
    const refBeat = this.refBeat.current!;
    refBeat.stop();
    // tslint:disable-next-line:no-any
    (refBeat as any).init(nextProps.tempo);
    refBeat.setTempo(nextProps.tempo.from);
    this.init(nextProps);
  }
  public render(): React.ReactNode {
    return (
      <Beat 
        ref={this.refBeat}
        tempo={this.props.tempo.from} 
        tempoRange={this.props.tempo} 
        postProcess={{
          onTick: this.onTick,
          onStart: this.onStart,
          onStop: this.onStop,
          onPause: this.onPause,
          onResume: this.onResume,
        }}
        inheritedSelector={style}
      />
    );
  }
}
export default BeatAxl;
