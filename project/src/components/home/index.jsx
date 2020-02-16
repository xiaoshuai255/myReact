import React, { Component } from "react";

import withCheckLogin from "../../containers/with-check-login";

import './index.less'

@withCheckLogin
class Home extends Component {
  render() {
    return <div className="home-div"><div className="div">欢迎来到硅谷后台</div></div>;
  }
}

export default Home;
