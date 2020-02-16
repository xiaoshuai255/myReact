import React, { Component } from "react";
import { Button, Icon, Modal } from "antd";
import screenfull from "screenfull";
import { connect } from "react-redux";
import { removeItem } from "../../../utils/storage";
import { removeUserSuccess } from "../../../redux/action-creators/user";
import { withRouter } from "react-router-dom";
import menus from "../../../config/menus";
//日期库
import dayjs from 'dayjs'

import "./index.less";

@withRouter
//connect高阶组件里面含有两个回调函数，第一个将状态数据里面的内容传到HeaderMain里面，第二个回调函数是将action-creators里面的函数传进HeaderMain
@connect(state => ({ username: state.user.user.username }), {
  removeUserSuccess
})
class HeaderMain extends Component {
  //日期
  formatDate = date => {
    date = new Date(date);
    const year = date.getFullYear();
    const month = this.addZero(date.getMonth() + 1);
    const day = this.addZero(date.getDate());
    const hours = this.addZero(date.getHours());
    const minutes = this.addZero(date.getMinutes());
    const seconds = this.addZero(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  //日期后面补0
  addZero = number => {
    if (number < 10) return "0" + number;
    return number;
  };

  state = {
    isScreenfull: false,
    title: "",
    pathname: "",
		// date: this.formatDate(Date.now()),
		date: dayjs().format('YYYY-MM-DD HH:mm:ss')  //使用日期库来设置日期
  };

  change = () => {
    this.setState({
      isScreenfull: !this.state.isScreenfull
    });
  };

  toScreen = () => {
    //切换全屏
    screenfull.toggle();
  };

  componentDidMount() {
    //切换图表显示
    screenfull.on("change", this.change);

    //设置时间定时器
    this.timer = setInterval(() => {
      this.setState({
				// date: this.formatDate(Date.now())  //自定义方法实现
				date:dayjs().format('YYYY-MM-DD HH:mm:ss')  //使用日期库来设置日期
      });
    }, 1000);
  }

  componentWillUnmount() {
    //解绑事件-解绑事件的回调函数和绑定事件的回调函数必须一致
    screenfull.off("change", this.change);

    clearInterval(this.timer);
  }

  //头部标题
  //生命周期函数：根据属性来生成状态
  static getDerivedStateFromProps(nextProps, prevState) {
    const { pathname } = nextProps.location;

    if (pathname === prevState.pathname) {
      //说明地址没有更新 --> this.setState
      return prevState;
    }

    let title = "";

    //调用一个方法来找menus
    for (let index = 0; index < menus.length; index++) {
      const menu = menus[index];
      if (menu.children) {
        const cMenu = menu.children.find(cMenu => pathname.startsWith(cMenu.path));
        if (cMenu) {
          title = cMenu.title;
          break;
        }
      } else {
        if (menu.path === pathname) {
          title = menu.title;
          break;
        }
      }
    }
    return {
      pathname,
      title: "layout.leftNav." + title
    };
  }

  //退出登录
  logout = () => {
    Modal.confirm({
      title: "你确认要退出登录吗？",
      onOk: () => {
        //退出登录
        //清空本地数据（localstorage、redux）
        removeItem("user");
        this.props.removeUserSuccess(); //清空redux
        //跳转到/login页面
        this.props.history.replace("/ogin");
      },
      onCancel() {}
    });
  };

  render() {
    const { isScreenfull, title, date } = this.state;
    const { username } = this.props;
    return (
      <div className="header-main">
        <div className="header-top">
          <Button size="small" onClick={this.toScreen}>
            <Icon type={isScreenfull ? "fullscreen-exit" : "fullscreen"} />
          </Button>
          <Button size="small" className="English-btn">
            English
          </Button>
          <span>hello,{username}</span>
          <Button
            size="small"
            className="exit-btn"
            type="link"
            onClick={this.logout}
          >
            退出
          </Button>
        </div>
        <div className="header-bottom">
          <h3>{title}</h3>
          <span className="time">{date}</span>
        </div>
      </div>
    );
  }
}

export default HeaderMain;
