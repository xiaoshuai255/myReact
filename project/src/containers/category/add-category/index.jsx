import React, { Component } from "react";
import { Form, Input } from "antd";

@Form.create()
class AddCategoryFrom extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Form.Item label="品类名称">
          {getFieldDecorator("categoryName", { //categoryName是用于表单校验的key
            rules: [
              {
                required: true,
                message: "请输入分类名称"
              }
            ]
          })(<Input placeholder="请输入分类名称" />)}
        </Form.Item>
      </Form>
    );
  }
}

export default AddCategoryFrom;
