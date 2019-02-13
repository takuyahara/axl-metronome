import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import style from './App.module.scss';
import Tempo from './Tempo/Tempo';

interface IProps {
  // empty
}
interface IState {
  // empty
}

class App extends Component<IProps, IState> {
  // Initialize in init()
  // empty

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
    // empty
  }
  public componentDidMount(): void {
    const root = document.getElementById('root')!;
    root.addEventListener('touchstart', e => {
      e.preventDefault();
    });
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
        <Tempo 
          role="from" 
          tempo={80} 
          range={{
            from: 50,
            to: 200,
          }} 
          maxDelta={100} 
        />
      </div>
    );
  }
}

export default App;
