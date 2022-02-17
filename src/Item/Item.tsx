import React, { Component } from "react";
import ItemObj from "../types/item";

class Item extends Component<ItemObj> {
  render() {
    const props = this.props;
    return (
      <div>
        <p className="Item-info">Expected Delivery Date: {props.expDelivery}</p>
        <p className="Item-info">Received Date: {props.recvdDate}</p>
        <p className="Item-info">Quantity Demanded: {props.qtyDemanded}</p>
        <p className="Item-info">Quantity Received: {props.qtyRecvd}</p>
        <p className="Item-info">Quantity Returned: {props.qtyRet}</p>
        <p
          className={`Item-info ${
            props.delivered ? "Item-delivered" : "Item-undelivered"
          }`}
        >
          {props.delivered ? "Delivered" : "Undelivered"}
        </p>
      </div>
    );
  }
}

export default Item;
