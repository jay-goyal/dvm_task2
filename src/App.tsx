import React, { Component } from "react";
import ItemObj from "./types/item";
import EntryForm from "./EntryForm/EntryForm";
import Item from "./Item/Item";
import CardsCont from "./Cards/CardsCont";
import CardObj from "./types/card";
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import UserObj from "./types/user";
import Auth from "./Auth/Auth";

type appState = {
  items: ItemObj[];
  cards: CardObj[];
  curItem: ItemObj;
  user: UserObj;
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
    cards: [
      {
        iconClass: faCircleCheck,
        value: 0,
        text: "Total quantity Delivered",
        id: "delivered",
      },
      {
        iconClass: faCircleXmark,
        value: 0,
        text: "Total quantity returned",
        id: "returned",
      },
      {
        iconClass: faCircleExclamation,
        value: 0,
        text: "Total quantity pending",
        id: "pending",
      },
    ],
    user: {
      name: "",
      id: "",
      phone: "",
      password: "",
    },
  };

  setUser = (user: UserObj) => {
    this.setState((curState) => {
      return {
        ...curState,
        user: user,
      };
    });
  };

  getDelivered = (item: ItemObj): number => {
    const state = this.state;
    let curDel = state.items.reduce((total: number, item: ItemObj): number => {
      if (item.delivered) {
        return total + item.qtyRecvd;
      }
      return total;
    }, 0);
    return curDel + (item.delivered ? item.qtyRecvd : 0);
  };

  getPending = (item: ItemObj): number => {
    const state = this.state;
    let curPending = state.items.reduce(
      (total: number, item: ItemObj): number => {
        if (!item.delivered) {
          return total + item.qtyDemanded;
        }
        return total;
      },
      0
    );
    return curPending + (item.delivered ? 0 : item.qtyDemanded);
  };

  getReturned = (item: ItemObj): number => {
    const state = this.state;
    let curRet = state.items.reduce((total: number, item: ItemObj): number => {
      if (item.delivered) {
        return total + item.qtyRet;
      }
      return total;
    }, 0);
    return curRet + (item.delivered ? item.qtyRecvd : 0);
  };

  addItem = (item: ItemObj) => {
    this.setState((curState) => {
      return {
        items: [...curState.items, item],
        curItem: this.resetCurItem(),
        cards: [
          { ...curState.cards[0], value: this.getDelivered(item) },
          { ...curState.cards[1], value: this.getReturned(item) },
          { ...curState.cards[2], value: this.getPending(item) },
        ],
      };
    });
  };

  resetCurItem = (): ItemObj => {
    return {
      expDelivery: "",
      recvdDate: "",
      qtyDemanded: 0,
      qtyRecvd: 0,
      qtyRet: 0,
      delivered: false,
      id: "",
    };
  };

  editItem = (item: ItemObj) => {
    let newState = this.state.items.filter((filItem) => filItem.id !== item.id);
    this.setState({
      items: newState,
      curItem: item,
    });
  };

  deleteItem = (id: string) => {
    let newState = this.state.items.filter((item) => item.id !== id);
    this.setState({ curItem: this.resetCurItem(), items: newState });
  };

  render() {
    const state = this.state;
    if (state.user.id === "") {
      return (
        <div>
          <Auth setUser={this.setUser} />
        </div>
      );
    } else {
      return (
        <div>
          <div className="App-header">
            <EntryForm submitFn={this.addItem} item={state.curItem} />
            <CardsCont cards={state.cards} />
          </div>
          {state.items.map((item, idx) => {
            let oddEven = idx % 2 === 0 ? "even" : "odd";
            return (
              <div className={`Item-${oddEven}`} key={item.id}>
                <Item
                  curItem={item}
                  editFn={this.editItem}
                  deleteFn={this.deleteItem}
                />
              </div>
            );
          })}
        </div>
      );
    }
  }
}

export default App;
