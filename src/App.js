import React, {Component} from 'react';
import 'antd-mobile/dist/antd-mobile.css';  // or 'antd-mobile/dist/antd-mobile.less'
import HomePage from './Home/HomePage';
import './copy.css'
import './index.css';
class App extends Component {
  constructor(props,context) {
    super(props,context),
    this.state = {
        
    }
}
  render() {
    return (
      <div className="index-bg">
          <HomePage />
      </div>
    )
  }

}

export default App;
