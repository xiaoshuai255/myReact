import React, { Component } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

@Form.create()
class UpdateCategoryForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired
  };

	//自定义校验规则
  validator = (rule, value, callback) => {
    if (!value) {
      callback("请输入分类名称");
    } else if (value === this.props.categoryName) {
      callback("请修改分类名称，不能与之前一致");
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { categoryName } = this.props;
    return (
      <Form>
        <Form.Item label="品类名称">
          {getFieldDecorator("categoryName", {
            //categoryName是用于表单校验的key
            rules: [
              { required: true, message: "请输入分类名称" },//可以显示*号
              { validator: this.validator } //自定义校验规则
            ], //表单校验
            initialValue: categoryName //Item框中显示初始值
          })(<Input placeholder="请输入分类名称" />)}
        </Form.Item>
      </Form>
    );
  }
}

export default UpdateCategoryForm;
