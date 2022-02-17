import React, { Component, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import ItemObj from "../types/item";
import "./EntryForm.scss";

type formProp = {
  item: ItemObj;
  submitFn: (item: ItemObj) => void;
};

type formState = {
  curItem: ItemObj;
  qtyError: string;
  expDeliveryErr: string;
  recvdDateErr: string;
};

class EntryForm extends Component<formProp, formState> {
  static defaultProps: formProp = {
    item: {
      expDelivery: "",
      recvdDate: "",
      qtyDemanded: 0,
      qtyRecvd: 0,
      qtyRet: 0,
      delivered: false,
      id: "",
    },
    submitFn: (item) => {},
  };

  state: formState = {
    curItem: this.props.item,
    qtyError: "",
    expDeliveryErr: "",
    recvdDateErr: "",
  };

  validateForm = (): boolean => {
    const state = this.state;
    const curItem = state.curItem;
    let qtyError = "";
    let expDeliveryError = "";
    let recvdDateError = "";
    if (
      curItem.recvdDate === "" &&
      curItem.qtyRecvd === 0 &&
      curItem.qtyRet === 0
    ) {
      this.setState((curState) => {
        return { ...curState, qtyError: "" };
      });
      return true;
    } else {
      if (
        curItem.qtyRecvd + curItem.qtyRet === curItem.qtyDemanded &&
        curItem.expDelivery !== "" &&
        curItem.recvdDate !== ""
      ) {
        this.setState((curState) => {
          return {
            ...curState,
            qtyError: "",
            curItem: {
              ...curState.curItem,
              delivered: !curState.curItem.delivered,
            },
          };
        });
        return true;
      } else {
        if (curItem.qtyRecvd + curItem.qtyRet !== curItem.qtyDemanded) {
          qtyError =
            "The total returned and received quantity should be equal to demanded quantity";
        }
        if (curItem.expDelivery === "") {
          expDeliveryError = "The expected delivery date can't be empty";
        }
        if (
          curItem.recvdDate === "" &&
          curItem.qtyRecvd === 0 &&
          curItem.qtyRet === 0
        ) {
          recvdDateError = "The expected delivery date can't be empty";
        }
        this.setState((curState) => {
          return {
            ...curState,
            qtyError: qtyError,
            expDeliveryErr: expDeliveryError,
            recvdDateErr: recvdDateError,
          };
        });
        return false;
      }
    }
  };

  handleChange = <P extends keyof formState["curItem"]>(
    name: P,
    value: formState["curItem"][P]
  ) => {
    this.setState((curState) => {
      return {
        ...curState,
        curItem: { ...curState["curItem"], [name]: value },
      };
    });
  };

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.validateForm()) {
      this.setState((curState) => {
        return {
          ...curState,
          curItem: { ...curState["curItem"], id: uuidv4() },
        };
      }, this.submitCallbk);
    }
  };

  submitCallbk = () => {
    this.props.submitFn(this.state.curItem);
    this.resetForm();
  };

  resetForm = () => {
    this.setState(() => {
      return {
        curItem: {
          expDelivery: "",
          recvdDate: "",
          qtyDemanded: 0,
          qtyRecvd: 0,
          qtyRet: 0,
          delivered: false,
          id: "",
        },
        qtyError: "",
        expDeliveryErr: "",
        recvdDateErr: "",
      };
    });
  };

  render() {
    const state = this.state;
    return (
      <div className="EntryForm">
        <form onSubmit={this.handleSubmit}>
          <div className="EntryForm-cont">
            <input
              type="date"
              name="expDelivery"
              value={state.curItem.expDelivery}
              onChange={(e) => this.handleChange("expDelivery", e.target.value)}
            />
            <label htmlFor="expDelivery">Expected Delivery Date</label>
            <div className="EntryForm-err">{state.expDeliveryErr}</div>
          </div>
          <div className="EntryForm-cont">
            <input
              type="date"
              name="recvdDate"
              value={state.curItem.recvdDate}
              onChange={(e) => this.handleChange("recvdDate", e.target.value)}
            />
            <label htmlFor="recvdDate">Received Date</label>
            <div className="EntryForm-err">{state.recvdDateErr}</div>
          </div>
          <div className="EntryForm-cont">
            <input
              type="number"
              name="qtyDemanded"
              value={
                state.curItem.qtyDemanded === 0 ? "" : state.curItem.qtyDemanded
              }
              onChange={(e) =>
                this.handleChange("qtyDemanded", parseInt(e.target.value))
              }
            />
            <label htmlFor="qtyDemanded">Quantity Demanded</label>
            <div className="EntryForm-err">{state.qtyError}</div>
          </div>
          <div className="EntryForm-cont">
            <input
              type="number"
              name="qtyRecvd"
              value={state.curItem.qtyRecvd === 0 ? "" : state.curItem.qtyRecvd}
              onChange={(e) =>
                this.handleChange("qtyRecvd", parseInt(e.target.value))
              }
            />
            <label htmlFor="qtyRecvd">Quantity Received</label>
            <div className="EntryForm-err">{state.qtyError}</div>
          </div>
          <div className="EntryForm-cont">
            <input
              type="number"
              name="qtyRet"
              value={state.curItem.qtyRet === 0 ? "" : state.curItem.qtyRet}
              onChange={(e) =>
                this.handleChange("qtyRet", parseInt(e.target.value))
              }
            />
            <label htmlFor="">Quantity Returned</label>
            <div className="EntryForm-err">{state.qtyError}</div>
          </div>
          <div className="EntryForm-cont">
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}

export default EntryForm;
