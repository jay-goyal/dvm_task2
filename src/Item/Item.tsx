import React, { Component, MouseEvent } from "react";
import ItemObj from "../types/item";
import "./Item.scss";

type itemProp = {
  curItem: ItemObj;
  editFn: (item: ItemObj) => void;
  deleteFn: (id: string) => void;
};

class Item extends Component<itemProp> {
  handleEdit = () => {
    if (!this.props.curItem.delivered) {
      this.props.editFn(this.props.curItem);
    } else {
      alert("Can't edit delivered items");
    }
  };

  handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    this.props.deleteFn(this.props.curItem.id);
  };

  render() {
    const props = this.props;
    const curItem = props.curItem;
    return (
      <div
        onClick={(event) => {
          event.stopPropagation();
          this.handleEdit();
        }}
        className="Item"
      >
        <div className="Item-info-cont">
          <p className="Item-info start">
            Expected Delivery Date: {curItem.expDelivery}
          </p>
          <p className="Item-info center">
            Received Date:{" "}
            {curItem.recvdDate === "" ? "N/A" : curItem.recvdDate}
          </p>
          <p className="Item-info end">
            Quantity Demanded: {curItem.qtyDemanded}
          </p>
          <p className="Item-info start">
            Quantity Received: {curItem.qtyRecvd}
          </p>
          <p className="Item-info center">
            Quantity Returned: {curItem.qtyRet}
          </p>
          <p
            className={`Item-info end ${
              curItem.delivered ? "Item-delivered" : "Item-undelivered"
            }`}
          >
            {curItem.delivered ? "Delivered" : "Undelivered"}
          </p>
        </div>
        <div className="Item-btns">
          <button className="btn" onClick={this.handleDelete}>
            Remove
          </button>
        </div>
      </div>
    );
  }
}

export default Item;
