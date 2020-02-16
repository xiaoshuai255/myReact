import React, { Component } from "react";
import {
  Card,
  Icon,
  Input,
  Form,
  Button,
  Select,
  InputNumber,
  message
} from "antd";
import { connect } from "react-redux";
import { getCategoriesAsync } from "../../../redux/action-creators/category";
import { reqAddProduct, reqUpdateProduct } from "../../../api";
// 引入编辑器组件
import BraftEditor from "braft-editor";
// 引入编辑器样式
import "braft-editor/dist/index.css";

import "./index.less";

@Form.create()
@connect(state => ({ categories: state.categories }), { getCategoriesAsync })
class ProductForm extends Component {
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null)
  };

  componentDidMount() {
    if (!this.props.categories.length) {
      this.props.getCategoriesAsync();
    }
  }

  //更新组件的方法
  handleEditorChange = editorState => {
    this.setState({ editorState });
  };

  //商品详情的校验规则
  validator = (_, value, callback) => {
    if (!value || value.isEmpty()) {
      callback("请输入商品详情");
    } else {
      callback();
    }
  };

  //form表单事件
  addproduct = e => {
    //禁止表单默认事件
    e.preventDefault();
    //校验表单
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        //values拿到的是所有的值
        const { name, desc, price, categoryId, editorState } = values;
        const detail = editorState.toHTML(); //将editorState得到的值转换为纯文本
        //调用api中传进来的reqAddProduct方法

        let content = "添加";
        const { pathname, state } = this.props.location;

        //判断是添加/更新商品
        if (pathname.startsWith("/product/update")) {
          // 因为productId可能来自state（由点击修改按钮传递过来的）也可能来自于发送请求请求来的product
          const productId = state ? state._id : this.state.product._id;
          await reqUpdateProduct({
            name,
            desc,
            price,
            categoryId,
            detail,
            productId
          });
          content = "更新";
        } else {
          //发送请求添加商品
          await reqAddProduct({ name, desc, price, categoryId, detail });
          //跳转到商品列表页面，提示添加成功
          message.success(content + "商品成功");
          this.props.history.push("/product");
        }
      }
    });
  };

  //回退
  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      categories,
      form: { getFieldDecorator }, //引入getFieldDecorator是为了做表单校验
      location: { pathname, state }
    } = this.props;

    // 初始化为null保证添加商品时不会初始化数据
    // 更新商品product的值就不为空了
    let product = null;
    // 判断添加商品还是修改商品
    if (pathname.startsWith("/product/update")) {
      // 是更新商品
      // 因为productId可能来自state（由点击修改按钮传递过来的）也可能来自于发送请求请求来的product
      product = state || this.state.product;
    }

    return (
      <Card
        title={
          <div>
            <Icon type="arrow-left" className="go-back" onClick={this.goBack} />
            添加商品
          </div>
        }
      >
        <Form
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
          onSubmit={this.addproduct}
        >
          <Form.Item label="商品名称">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入商品名称" }],
              initialValue: product ? product.name : "" //默认值
            })(<Input placeholder="请输入商品名称" />)}
          </Form.Item>

          <Form.Item label="商品描述">
            {getFieldDecorator("desc", {
              rules: [{ required: true, message: "请输入商品描述" }],
              initialValue: product ? product.desc : "" //默认值
            })(<Input placeholder="请输入商品描述" />)}
          </Form.Item>

          <Form.Item label="商品分类">
            {getFieldDecorator("categoryId", {
              rules: [{ required: true, message: "请输入商品分类" }],
              initialValue: product ? product.categoryId : "" //默认值
            })(
              <Select placeholder="请输入商品分类">
                {categories.map(category => {
                  return (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="商品价格">
            {getFieldDecorator("price", {
              rules: [{ required: true, message: "请输入商品价格" }],
              initialValue: product ? product.price : "" //默认值
            })(
              <InputNumber
                style={{ width: 150 }}
                formatter={value =>
                  `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={value => value.replace(/￥\s?|(,*)/g, "")}
              />
            )}
          </Form.Item>

          <Form.Item label="商品详情" wrapperCol={{ span: 22 }}>
            {getFieldDecorator("editorState", {
              validateTrigger: "onBlur", //校验子节点的时机（失去焦点进行表单校验）
              rules: [
                {
                  required: true,
                  validator: this.validator
                }
              ],
              initialValue: product
                ? BraftEditor.createEditorState(product.detail)
                : "" //默认值
            })(
              <BraftEditor
                // value={editorState}
                // onChange={this.handleEditorChange}
                // onSave={this.submitContent}
                className="useEditor"
                placeholder="请输入商品详情"
              />
            )}
          </Form.Item>

          <Form.Item>
            <Button className="productBtn" type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default ProductForm;
