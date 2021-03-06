import React, { Component } from "react";
import { Card, Icon, Descriptions } from "antd";
import { connect } from "react-redux";
import { getCategoriesAsync } from "../../../redux/action-creators/category";
import { reqOneProduct } from "../../../api";

import "./index.less";

@connect(state => ({ categories: state.categories }), { getCategoriesAsync })
class ProductDetail extends Component {
  state = {
    product: {}
  };

  goBack = () => {
    this.props.history.goBack();
  };

  componentDidMount() {
    if (!this.props.categories.length) {
      this.props.getCategoriesAsync();
    }

    if (!this.props.location.state) {
      reqOneProduct(this.props.match.params.id).then(res => {
        this.setState({
          product: res
        });
      });
    }
  }

  render() {
    const {
      location: { state },
      categories
    } = this.props;

    const { name, desc, price, categoryId, status, detail } =
      state || this.state.product;

    const category = categories.find(category => category._id === categoryId);
    const categoryName = category && category.name;
    return (
      <div>
        <Card
          title={
            <div>
              <Icon
                type="arrow-left"
                className="detailIcon"
                onClick={this.goBack}
              />
              商品详情
            </div>
          }
        >
          <Descriptions bordered>
            <Descriptions.Item label="商品名称">{name}</Descriptions.Item>
            <Descriptions.Item label="商品描述">{desc}</Descriptions.Item>
            <Descriptions.Item label="商品价格">￥{price}</Descriptions.Item>
            <Descriptions.Item label="商品分类">
              {categoryName}
            </Descriptions.Item>
            <Descriptions.Item label="商品状态" span={2}>
              {status}
            </Descriptions.Item>
            <Descriptions.Item label="商品详情" span={3}>
              <div dangerouslySetInnerHTML={{ __html: detail }}></div>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    );
  }
}

export default ProductDetail;
