import _ from 'lodash';
import Ring, { IProps as IPropsRing, IState as IStateRing } from './Ring';

interface IProps extends IPropsRing {
  step: number;
}
interface IState extends IStateRing {
  // nothing to extend
}
class RingStepped extends Ring<IProps, IState> {
  // Initialize in init()
  private step!: number;

  public constructor(props: IProps) {
    super(props);
    this.init(props);
  }
  protected init(props: IProps): void {
    this.step = props.step;
    super.init(props);
  }
  public setProgress(progress: number): void {
    super.setProgress(Math.floor((progress * this.step)) / this.step); // FIXME: Rounding Error
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(newProps: IProps): void {
    if (_.isEqual(this.props, newProps)) {
      return;
    }

    this.init(newProps);
    this.reset();
  }
}
export default RingStepped;