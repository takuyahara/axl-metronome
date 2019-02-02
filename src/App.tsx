import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import style from './App.module.scss';
import TempoSelector from './Tempo/TempoSelector';

interface IProps {
  // empty
}
interface IState {
  // empty
}

class App extends Component<IProps, IState> {
  // Initialize in init()
  private isDescEnabled!: boolean;

  // Ref
  // empty

  public constructor(props: IProps) {
    super(props);
    this.state = {
      // empty
    };
    this.init(props);

    // Ref
    // empty
}
  private init(props: IProps): void {
    this.isDescEnabled = true;
  }
  public componentWillReceiveProps(newProps: IProps): void {
    if (_.isEqual(this.props, newProps)) {
      return;
    }

    this.init(newProps);
  }
  public render(): React.ReactNode {
    return (
      <div className={style.App}>
        <TempoSelector 
          defaultTempo={{
            from: 90,
            to: 160,
          }} 
          range={{
            from: 60,
            to: 780,
          }} 
          maxDelta={100}
          isDescEnabled={this.isDescEnabled} 
        />
      </div>
    );
  }
}

export default App;
