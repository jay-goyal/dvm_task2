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
import "./App.scss";

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

  initItems = (user: UserObj): ItemObj[] => {
    return JSON.parse(localStorage.getItem(user.id) || "[]") as ItemObj[];
  };

  login = (user: UserObj) => {
    let items = this.initItems(user);
    this.setState((curState) => {
      return {
        ...curState,
        items: items,
        user: user,
        cards: [
          {
            ...curState.cards[0],
            value: this.getDelivered([...items]),
          },
          {
            ...curState.cards[1],
            value: this.getReturned([...items]),
          },
          {
            ...curState.cards[2],
            value: this.getPending([...items]),
          },
        ],
      };
    });
  };

  logout = () => {
    this.setState((curState) => {
      return {
        ...curState,
        user: {
          name: "",
          id: "",
          phone: "",
          password: "",
        },
      };
    });
  };

  getDelivered = (item: ItemObj[]): number => {
    return item.reduce((total: number, item: ItemObj): number => {
      if (item.delivered) {
        return total + item.qtyRecvd;
      }
      return total;
    }, 0);
  };

  getPending = (item: ItemObj[]): number => {
    return item.reduce((total: number, item: ItemObj): number => {
      if (!item.delivered) {
        return total + item.qtyDemanded;
      }
      return total;
    }, 0);
  };

  getReturned = (item: ItemObj[]): number => {
    return item.reduce((total: number, item: ItemObj): number => {
      if (item.delivered) {
        return total + item.qtyRet;
      }
      return total;
    }, 0);
  };

  addItem = (item: ItemObj) => {
    this.setState(
      (curState) => {
        return {
          items: [item, ...curState.items],
          curItem: this.resetCurItem(),
          cards: [
            {
              ...curState.cards[0],
              value: this.getDelivered([...curState.items, item]),
            },
            {
              ...curState.cards[1],
              value: this.getReturned([...curState.items, item]),
            },
            {
              ...curState.cards[2],
              value: this.getPending([...curState.items, item]),
            },
          ],
        };
      },
      () =>
        localStorage.setItem(
          this.state.user.id,
          JSON.stringify(this.state.items)
        )
    );
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
    this.setState((curState) => {
      return {
        ...curState,
        items: newState,
        curItem: item,
        cards: [
          {
            ...curState.cards[0],
            value: this.getDelivered([...newState]),
          },
          {
            ...curState.cards[1],
            value: this.getReturned([...newState]),
          },
          {
            ...curState.cards[2],
            value: this.getPending([...newState]),
          },
        ],
      };
    });
  };

  deleteItem = (id: string) => {
    let newState = this.state.items.filter((item) => item.id !== id);
    this.setState(
      (curState) => {
        return {
          ...curState,
          curItem: this.resetCurItem(),
          items: newState,
        };
      },
      () =>
        localStorage.setItem(
          this.state.user.id,
          JSON.stringify(this.state.items)
        )
    );
  };

  render() {
    const state = this.state;
    if (state.user.id === "") {
      return (
        <div>
          <Auth setUser={this.login} />
        </div>
      );
    } else {
      return (
        <div>
          <div className="App-title">
            <h3>Hello, {state.user.name}</h3>
            <h1>Vendor List</h1>
            <div className="App-title-btn">
              <button onClick={this.logout} className="btn">
                Logout
              </button>
            </div>
          </div>
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
