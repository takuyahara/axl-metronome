import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import style from './Indicator.module.scss';
import Timer from './Timer';
import State from './State';

interface IProps {
  timeToCount: number;
  postProcess: IPostProcess;
}
interface IState {
  // elapsedTime: number;
  remaining: number;
}
interface IPostProcess {
  onCount: (remaining: number) => void;
  onCountStart: () => void;
  onCountStop: () => void;
  onCountComplete: (remaining: number) => void;
}
class Indicator extends Component<IProps, IState> {
  // Initialize in init()
  private timer!: Timer;

  // Post process
  private postCount: IPostProcess['onCount'];
  private postCountStart: IPostProcess['onCountStart'];
  private postCountStop: IPostProcess['onCountStop'];
  private postCountComplete: IPostProcess['onCountComplete'];
  public constructor(props: IProps) {
    super(props);
    this.state = {
      remaining: props.timeToCount,
    };

    // Binding
    this.onClick = this.onClick.bind(this);

    // Post process
    this.postCount = props.postProcess.onCount;
    this.postCountStart = props.postProcess.onCountStart;
    this.postCountStop = props.postProcess.onCountStop;
    this.postCountComplete = props.postProcess.onCountComplete;

    // Initialize
    this.init(props);
  }
  private init(props: IProps): void {
    const postProcess = {
      onCount: (remaining: number) => {
        this.setState({
          remaining,
        });
        this.postCount(remaining);
      },
      onCountStart: () => {
        this.postCountStart();
      },
      onCountStop: () => {
        this.postCountStop();
      },
      onCountComplete: (remaining: number) => {
        this.setState({
          remaining,
        });
        this.postCountComplete(remaining);
      },
    };
    this.timer = new Timer(props.timeToCount, {...postProcess});
  }
  private onClick(e: React.MouseEvent | React.TouchEvent): void {
    const isMouseEvent = e.type.substr(0, 5) === 'mouse';
    isMouseEvent && e.preventDefault();
    
    this.timer.toggle();
  }
  private formatTime(timeInSecond: number): string
  {
    const minute = Math.floor(timeInSecond / 60);
    const second = Math.floor(timeInSecond % 60);
    const minuteStr = minute < 10 ? "0" + minute : "" + minute;
    const secondStr = second < 10 ? "0" + second : "" + second;
    return minuteStr + ":" + secondStr;
  }
  public toggle(): void {
    this.timer.toggle();
  }
  public setRemaining(newRemaining: number): void {
    this.timer.setRemaining(newRemaining);
  }
  public getRemaining(): number {
    return this.timer.getRemaining();
  }
  public setProgress(newProgress: number): void {
    this.timer.setProgress(newProgress);
    this.setState({
      remaining: this.timer.getRemaining(),
    });
  }
  public getProgress(): number {
    return this.timer.getProgress();
  }
  public getState(): State {
    return this.timer.getState();
  }
  public reset(): void {
    this.timer.reset();
  }
  public drag(): void {
    this.timer.drag();
  }
  public resume(): void {
    this.timer.resume();
  }
  public componentWillUnmount(): void {
    this.timer.stop();
  }
  public componentWillMount(): void {
    // const postProcess = {
    //   countStart: this.postCountStart,
    //   count: this.postCount,
    //   countStop: this.postCountStop,
    //   countComplete: this.postCountComplete,
    // };
    // this._timer = new Timer(this.props.remaining, this.cbPassRemaining, postProcess);
  }
  public componentWillReceiveProps(newProps: IProps): void {
    if (_.isEqual(this.props, newProps)) {
      return;
    }

    this.timer.stop();

    this.init(newProps);
    this.setState({
      remaining: newProps.timeToCount,
    });
  }
  public render(): React.ReactNode {
    const formattedTime = this.formatTime(Math.round(this.state.remaining));
    return (
      <div className={style.indicator} onClick={this.onClick}>
        <div className={style.remaining}>
          {formattedTime}
        </div>
      </div>
    );
  }
}
export default Indicator;
