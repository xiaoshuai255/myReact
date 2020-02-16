import React, { Component } from "react";
import logo from "../../assets/logo.png";
import { Form, Input, Icon, Button } from "antd";
import { connect } from "react-redux";
import { setItem } from "../../utils/storage";
import { getUserAsync } from "../../redux/action-creators/user";
import withCheckLogin from '../with-check-login'

import "./index.less";

const { Item } = Form;

//修饰器语法
@withCheckLogin
@connect(null, { getUserAsync })
@Form.create()
class Login extends Component {
  //表单校验函数，并能收集数据
  validator = (rule, value, callback) => {
    /*
      rule 用来获取当前校验的是哪个表单/Input
      value 当前表单项的值
      callback 不管校验成功还是失败 必须调用的函数
      callback() 代表校验成功
			callback('xxx') 代表校验失败
			rule.filed表示的是getFieldDecorator的第一个参数，(在这里是username或password)
    */
    const name = rule.filed === "username" ? "用户名" : "密码";

    if (!value) {
      callback(`请输入${name}`);
    } else if (value.length < 4) {
      callback(`${name}长度不能少于4位`);
    } else if (value.length > 13) {
      callback(`${name}长度不能大于13位`);
    } else if (!/\w/.test(value)) {
      callback(`${name}可以是数字、字母、下划线`);
    } else {
      callback();
    }
  };

  //登录
  handleSubmit = e => {
    //阻止表单的默认行为
    e.preventDefault();

    //values 收集的表单数据
    this.props.form.validateFields((err, values) => {
      // console.log(values)
      if (!err) {
        //校验成功，请求登录
        const { username, password } = values;
        this.props
          .getUserAsync(username, password)
          .then(response => {
            //将token保存在redux中
            console.log(response); //这里可以打印出token的值
            //持久化存储用户数据
            setItem("user", response);
            //登录成功，跳转页面
            //在函数中要用history.push()方法跳转网址
            this.props.history.push("/");
          })
          .catch(err => {
            //错误提示在拦截器中封装好了
            //清空密码框
            this.props.form.resetFields(["password"]);
          });
      }
    });
  };

  render() {
    //getFieldDecorator是高阶组件用法
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" className="login-img" />
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-section">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit}>
            <Item>
              {getFieldDecorator("username", {
                rules: [
                  //#region
                  /* {
										required: true,
										message:'必须输入用户名'
									},
                  {
										min:4,
										message: "用户名长度不能少于4位",
									},
									{
										max:13,
										message: "用户名长度不能超过13位",
									},{
										pattern:'/\w/',
										message:'用户名可以是数字、字母、下划线'
									} */
                  //#endregion
                  {
                    validator: this.validator
                  }
                ]
              })(
                <Input
                  placeholder="用户名"
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                />
              )}
            </Item>
            <Item>
              {getFieldDecorator("password", {
                rules: [
                  //#region
                  /*   {
                    required: true,
                    message: "必须输入密码"
                  },
                  {
                    min: 4,
                    message: "密码长度不能少于4位"
                  },
                  {
                    max: 13,
                    message: "密码长度不能超过13位"
                  },
                  {
                    pattern: "/w/",
                    message: "密码可以是数字、字母、下划线"
									} */
                  //#endregion
                  {
                    validator: this.validator
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Item>
            <Item>
              <Button type="primary" className="login-btn" htmlType="submit">
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    );
  }
}

// Form.create方法是一个高阶组件用法。 作用：给Login组件传递form属性（可以服用form）
// export default Form.create()(Login);

//修饰器语法
export default Login;
