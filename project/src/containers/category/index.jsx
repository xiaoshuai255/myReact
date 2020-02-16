import React, { Component } from "react";
import { Card, Button, Table, Icon, Modal } from "antd";
import { connect } from "react-redux";
import {
  getCategoriesAsync,
  addCategoryAsync,
  
} from "../../redux/action-creators/category";
import {updateCategoryAsync} from '../../redux/action-creators/category'
import AddCategoryForm from "./add-category";
import UpdateCategoryForm from "./update-category";

@connect(state => ({ categories: state.categories }), {
  getCategoriesAsync,
  addCategoryAsync,
  updateCategoryAsync
})
class Category extends Component {
  componentDidMount() {
    this.props.getCategoriesAsync();
  }

  //设置默认开始状态
  state = {
    addCategoryVisible: false, //addCategoryVisible：可见性 刚开始的状态为不可见
    updateCategoryVisible: false,
    category: {} //点击选中的某个分类数据
  };

  //显示添加分类列表弹框
  showModal = () => {
    this.setState({
      addCategoryVisible: true
    });
  };

  //显示修改分类弹框
  showUpdate = category => {
    return () => {
      console.log(category); //这里是子组件要接收父组件的属性，用到了闭包
      this.setState({
        updateCategoryVisible: true,
        category //放在这是为了传到子组件中
      });
    };
  };

  //添加分类
  handleAddOk = () => {
    // console.log(this.addCategoryFrom);
    //先对它进行表单校验
    this.addCategoryForm.props.form.validateFields(async (err, values) => {
      //将AddCategoryFrom子组件中的form中的属性拿出来，再调用validateFields这个方法
      if (!err) {
        // console.log(values)
        const { categoryName } = values;
        //发送请求（更新后台数据），更新redux数据
        await this.props.addCategoryAsync(categoryName); //addCategoryAsync这个方法在action-category中，所以它在这里的返回值就要看action-category里面函数（dispath）的返回值

        /* //添加分类完成，才隐藏对话框
        this.setState({
          addCategoryVisible: false
        });
        //清空表单数据  清空的是挂载有form属性的addCategoryFrom
        setTimeout(() => {
          this.addCategoryFrom.props.form.resetFields();
				}, 500);  */
        this.hidden("addCategory")();
      }
    });
  };

  //修改数据
  updateCategory = () => {
    this.updateCategoryForm.props.form.validateFields(async (err, values) => {
      if (!err) {
        //传入要更新的categoryName
				const { categoryName } = values;
				const categoryId = this.state.category._id
        await this.props.updateCategoryAsync(categoryName,categoryId);
        //隐藏
        this.hidden("updateCategory")();
      }
    });
  };

  //取消按钮事件
  hidden = name => {
    return () => {
      //清空表单数据  清空的是挂载有form属性的addCategoryFrom
      setTimeout(() => {
        this[name + "Form"].props.form.resetFields();
      }, 500);
      //隐藏弹框
      this.setState({
        [name + "Visible"]: false
      });
    };
  };

  //form表单
  columns = [
    {
      title: "品类名称", //表头
      dataIndex: "name" //找data里面的key取value值
      // render: text => <a>{text}</a> //指定表中数据如何渲染
    },
    {
      title: "操作",
      // className: "column-money", //给列添加类名
      // dataIndex: "money",
      render: category => {
        return (
          <div>
            <Button type="link" onClick={this.showUpdate(category)}>
              修改分类
            </Button>
            <Button type="link">删除分类</Button>
          </div>
        );
      }
    }
  ];

  render() {
    const { categories } = this.props;
    const { addCategoryVisible, updateCategoryVisible, category } = this.state;
    return (
      <div>
        <Card
          title="分类列表"
          extra={
            <Button type="primary" onClick={this.showModal}>
              <Icon type="plus" /> 分类列表
            </Button>
          }
        >
          {/* rowKey表示要找的数据列表中的标识 */}
          <Table
            columns={this.columns}
            dataSource={categories}
            bordered /* 加边框 */
            rowKey="_id" /* 需要一个key属性，这里的key就是_id */
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ["3", "6", "9", "12"],
              defaultPageSize: 3
            }}
          />
        </Card>

        <Modal
          title="添加分类"
          visible={addCategoryVisible}
          onOk={this.handleAddOk}
          onCancel={this.hidden("addCategory")}
          width={350}
        >
          <AddCategoryForm
            wrappedComponentRef={form => (this.addCategoryForm = form)}
          />
          {/* wrappedComponentRef是用来获取AddCategoryFrom内部的form属性,然后将属性挂载到addCategoryFrom上 */}
        </Modal>

        <Modal
          title="修改分类"
          visible={updateCategoryVisible}
          onOk={this.updateCategory}
          onCancel={this.hidden("updateCategory")}
          width={350}
        >
          <UpdateCategoryForm
            categoryName={category.name} //将接收到父组件中的name渲染到UpdateCategoryForm组件上
            wrappedComponentRef={form => (this.updateCategoryForm = form)}
          />
          {/* wrappedComponentRef是用来获取UpdateCategoryFrom内部的form属性,然后将属性挂载到updateCategoryFrom上 */}
        </Modal>
      </div>
    );
  }
}

export default Category;
