import React, { Component } from "react";
import { Card, Select, Input, Button, Icon, Table, message } from "antd";
import {
  getProducts,
  reqUpdateProductStatus,
  reqSearchProduct
} from "../../api";

import "./index.less";

export default class Product extends Component {
  state = {
    products: [],
    total: 0,
    searchType: "productName",
    searchValue: ""
  };

  columns = [
    {
      title: "商品名称",
      dataIndex: "name"
    },
    {
      title: "商品描述",
      dataIndex: "desc"
    },
    {
      title: "价格",
      dataIndex: "price"
    },
    {
      title: "状态",
      // dataIndex: "status",
      render: product => {
        const status = product.status;

        return (
          <div>
            <Button type="primary" onClick={this.updateProductStatus(product)}>
              {status === 1 ? "上架" : "下架"}
            </Button>
            {status === 1 ? "已下架" : "已上架"}
          </div>
        );
      }
    },
    {
      title: "操作",
      render: product => {
        return (
          <div>
            <Button type="link" onClick={this.productDetail(product)}>
              详情
            </Button>
            <Button type="link" onClick={this.updateCategory(product)}>
              修改
            </Button>
          </div>
        );
      }
    }
  ];

  //获取商品列表
  gProducts = async (pageNum, pageSize) => {
    const { searchType, searchValue } = this.state;
    let result = null;
    if (searchValue) {
      //搜索商品
      result = await reqSearchProduct({
        searchType,
        searchValue,
        pageNum,
        pageSize
      });
    } else {
      //全部商品
      result = await getProducts(pageNum, pageSize);
    }
    this.setState({
      products: result.list,
      total: result.total
    });
  };

  // 页码发生改变事件
  componentDidMount() {
    this.gProducts(1, 3);
  }

  //点击添加商品按钮事件
  addProduct = () => {
    this.props.history.push("/product/add");
  };

  //详情按钮事件
  productDetail = product => {
    return () => {
      this.props.history.push("/product/" + product._id, product);
    };
  };

  //修改按钮事件
  updateCategory = product => {
    return () => {
      // 地址后面加上id --> 为了在更新商品页面刷新时能够获取到商品id --> 通过id发送请求获取商品数据
      // 第二个参数传入product，组件就能通过location.state获取
      this.props.history.push("/product/update/" + product._id, product);
    };
  };

  //状态按钮事件(更新商品状态)
  updateProductStatus = product => {
    return () => {
      const productId = product._id;
      const status = 3 - product.status;
      reqUpdateProductStatus(productId, status).then(res => {
        message.success("更新商品状态成功");
        //更新前端数据
        this.setState({
          products: this.state.products.map(product => {
            if (product._id === productId) {
              return { ...product, status };
            }
            return product;
          })
        });
      });
    };
  };

  //选择按钮事件
  selectChange = value => {
    //单选得到的是value  其他得到的是event
    this.setState({
      searchType: value
    });
  };

  //搜索框事件（获取搜索框中的内容）
  inputChange = e => {
    this.setState({
      searchValue: e.target.value.trim()
    });
  };

  //搜索按钮事件
  search = () => {
    const { searchType, searchValue } = this.state;
    //在发送请求时，默认的请求一页，条数默认是3
    reqSearchProduct({ searchType, searchValue, pageNum: 1, pageSize: 3 }).then(
      result => {
        this.setState({
          //状态改变更新的是下面显示的内容
          products: result.list,
          total: result.total
        });
      }
    );
  };

  render() {
    const { products, total, searchType } = this.state;
    return (
      <Card
        title={
          <div>
            <Select value={searchType} onChange={this.selectChange}>
              <Select.Option value="productName">根据商品名称</Select.Option>
              <Select.Option value="productDesc">根据商品描述</Select.Option>
            </Select>
            <Input
              placeholder="关键字"
              className="input"
              onChange={this.inputChange}
            ></Input>
            <Button type="primary" onClick={this.search}>
              搜索
            </Button>
          </div>
        }
        extra={
          <Button type="primary" onClick={this.addProduct}>
            <Icon type="plus" />
            添加商品
          </Button>
        }
        // style={{ width: 1630 }}
      >
        <Table
          columns={this.columns}
          dataSource={products}
          bordered
          rowKey="_id"
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ["3", "6", "9", "12"],
            defaultPageSize: 3,
            total, // 总数
            onChange: this.gProducts, // 页码发生改变事件
            onShowSizeChange: this.gProducts // pageSize 变化的回调
          }}
        />
      </Card>
    );
  }
}
