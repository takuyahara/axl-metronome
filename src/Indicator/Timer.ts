import State from './State';

const DECIMAL = 5;

interface IPostProcess {
  onCount: (remaining: number) => void;
  onCountStart: () => void;
  onCountStop: () => void;
  onCountComplete: (remaining: number) => void;
}
class Timer {
  // Post process
  private postCount!: IPostProcess['onCount'];
  private postCountStart!: IPostProcess['onCountStart'];
  private postCountStop!: IPostProcess['onCountStop'];
  private postCountComplete!: IPostProcess['onCountComplete'];

  // Initialize in init()
  private state!: State;
  private timeToCount!: number;
  private timerId!: NodeJS.Timer | number;
  private remaining!: number;

  public constructor(timeToCount: number, postProcess: IPostProcess) {
    this.init(timeToCount, postProcess);
    this.timerRunner = this.timerRunner.bind(this);
    // this.postCount = this.postCount.bind(this);
    // this.postCountStart = this.postCountStart.bind(this);
    // this.postCountStop = this.postCountStop.bind(this);
    // this.postCountComplete = this.postCountComplete.bind(this);
  }
  private init(timeToCount: number, postProcess: IPostProcess): void {
    this.postCount = postProcess.onCount;
    this.postCountStart = postProcess.onCountStart;
    this.postCountStop = postProcess.onCountStop;
    this.postCountComplete = postProcess.onCountComplete;
    this.state = State.Stopped;
    this.timeToCount = timeToCount;
    this.remaining = timeToCount;
  }
  private isTimerCompleted(): boolean {
    return this.remaining < 0;
  }
  private fixProgress(progressRaw: number): number {
    // progressRaw can be 0.19999999999999996
    // fix to 0.2 (0.20000 when DECIMAL = 5)
    return Math.round(progressRaw * Math.pow(10, DECIMAL)) / Math.pow(10, DECIMAL);
  }
  private timerRunner(): void {
    this.postCount(--this.remaining);
    if (this.isTimerCompleted()) {
      this.reset();
      this.postCountComplete(this.remaining);
    }
  }
  private start(): void {
    this.timerId = setInterval(this.timerRunner, 1000);
    this.postCountStart();
    this.state = State.Running;
  }
  public stop(): void {
    clearInterval(this.timerId as NodeJS.Timer);
    this.remaining = this.timeToCount;
    this.postCountStop();
    this.state = State.Stopped;
  }
  public pause(): void {
    clearInterval(this.timerId as NodeJS.Timer);
    this.state = State.Paused;
  }
  public resume(): void {
    this.start();
  }
  public drag(): void {
    this.pause();
    this.state = State.Dragging;
  }
  public reset(): void {
    this.stop();
  }
  public getState(): State {
    return this.state;
  }
  public setRemaining(remaining: number): void {
    this.remaining = remaining;
  }
  public getRemaining(): number {
    return this.remaining;
  }
  public setTimeToCount(timeToCount: number): void {
    this.timeToCount = timeToCount;
    this.remaining = timeToCount;
  }
  public getTimeToCount(): number {
    return this.timeToCount;
  }
  public setProgress(progress: number): void {
    this.remaining = this.timeToCount * (1 - progress);
  }
  public getProgress(): number {
    const progressRaw = 1 - (this.remaining / this.timeToCount); // can be 0.19999999999999996
    const progressFixed = Math.round(progressRaw * Math.pow(10, DECIMAL)) / Math.pow(10, DECIMAL); // fix to 0.2 (0.20000 when DECIMAL = 5)
    return progressFixed;
  }
  public toggle(): void {
    switch (this.state) {
        case State.Running:
        this.pause();
        break;
      case State.Paused:
        this.resume();
        break;
      case State.Stopped:
        this.start();
        break;
    }
  }
}
export default Timer;
