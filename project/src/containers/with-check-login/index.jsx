import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const withCheckLogin = WrappedComponent => {
  //返回一个高阶组件
  return connect(
    //拿到token
    state => ({ token: state.user.token }),
    null
  )(
    class extends Component {
      static displayName = `CheckLogin(${WrappedComponent.displayName ||
        WrappedComponent.name ||
        "Component"})`;
      render() {
        /*
          1. 如果用户在/login  this.props.location.pathname
            如果用户登录过，去 /   redux中user中token
            如果用户没有登录过，不动
          
          2. 如果用户在非 /login
             如果用户登录过，不动
             如果用户没有登录过，/login

            location/history/match是路由组件的三大属性，其他组件默认没有
            路由组件指通过Route加载的组件
        */

				//...rest ：路由除了location之外的没有被解构赋值的参数
        const { token, location, ...rest } = this.props;

        if (location.pathname === "/login") {
          if (token) {
            return <Redirect to="/" />;
          }
        } else {
          if (!token) {
            return <Redirect to="/login" />;
          }
				}
				//{...rest} location={location}：将三大属性给Login
        return <WrappedComponent {...rest} location={location} />;
      }
    }
  );
};

export default withCheckLogin;
