import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import style from './App.module.scss';
import TempoSelector from './Tempo/TempoSelector';
import * as configcat from 'configcat-node';
const configCatClient = configcat.createClient(process.env.CC_API!);
const myUser = { 
  identifier: process.env.CC_ID!,
};

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
  public componentWillMount(): void {
    configCatClient.getValue("isdescenabled", this.isDescEnabled, (value: boolean) => {
      this.isDescEnabled = value;
      this.forceUpdate();
    }, myUser);
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
