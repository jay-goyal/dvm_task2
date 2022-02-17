import React, { Component } from "react";
import ItemObj from "./types/item";
import EntryForm from "./EntryForm/EntryForm";
import Item from "./Item/Item";

type appState = {
  items: ItemObj[];
  curItem: ItemObj;
};

class App extends Component<{}, appState> {
  state: appState = {
    items: [],
    curItem: {
      expDelivery: "",
      recvdDate: "",
      qtyDemanded: 0,
      qtyRecvd: 0,
      qtyRet: 0,
      delivered: false,
      id: "",
    },
  };

  addItem = (item: ItemObj) => {
    this.setState((curState) => {
      return { items: [...curState.items, item] };
    });
  };

  render() {
    const state = this.state;
    return (
      <div>
        <EntryForm submitFn={this.addItem} item={state.curItem} />
        {state.items.map((item) => {
          return <Item {...item} key={item.id} />;
        })}
      </div>
    );
  }
}

export default App;
