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
  state = {
    curItem: this.props.item,
    qtyError: "",
    expDeliveryErr: "",
    recvdDateErr: "",
  };

  componentDidUpdate(prevState: Readonly<formProp>) {
    if (prevState.item !== this.props.item) {
      this.setState((curState) => {
        return {
          ...curState,
          curItem: this.props.item,
        };
      });
    }
  }

  validateForm = (): boolean => {
    const state = this.state;
    const curItem = state.curItem;
    let qtyError = "";
    let expDeliveryError = "";
    let recvdDateError = "";
    if (
      curItem.expDelivery !== "" &&
      curItem.qtyDemanded !== 0 &&
      curItem.recvdDate === "" &&
      curItem.qtyRecvd === 0 &&
      curItem.qtyRet === 0
    ) {
      this.setState((curState) => {
        return {
          ...curState,
          expDeliveryErr: expDeliveryError,
          recvdDateErr: recvdDateError,
          qtyError: "",
          curItem: {
            ...curState.curItem,
            delivered: false,
          },
        };
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
            expDeliveryErr: expDeliveryError,
            recvdDateErr: recvdDateError,
            curItem: {
              ...curState.curItem,
              delivered: true,
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
          (curItem.qtyRecvd !== 0 || curItem.qtyRet !== 0)
        ) {
          recvdDateError = "The received delivery date can't be empty";
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
        qtyError: "",
        expDeliveryErr: "",
      };
    }, this.validateForm);
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
        curItem: this.props.item,
        qtyError: "",
        expDeliveryErr: "",
        recvdDateErr: "",
      };
    });
  };

  render() {
    const state = this.state;
    const curItem = state.curItem;
    return (
      <form onSubmit={this.handleSubmit} className="EntryForm">
        <div>
          <div>
            <div className="EntryForm-field">
              <input
                type="text"
                onFocus={(event) => {
                  event.target.type = "date";
                }}
                onBlur={(event) => {
                  event.target.type = "text";
                }}
                value={curItem.expDelivery}
                onChange={(e) => {
                  this.handleChange("expDelivery", e.target.value);
                }}
                placeholder=" "
              />
              <label htmlFor="expDelivery">Expected Delivery Date</label>
            </div>
            <div className="EntryForm-err">{state.expDeliveryErr}</div>
          </div>
        </div>
        <div>
          <div className="EntryForm-field">
            <input
              type="text"
              onFocus={(event) => {
                event.target.type = "date";
              }}
              onBlur={(event) => {
                event.target.type = "text";
              }}
              name="recvdDate"
              value={curItem.recvdDate}
              onChange={(e) => {
                this.handleChange("recvdDate", e.target.value);
              }}
              placeholder=" "
            />
            <label htmlFor="recvdDate">Received Date</label>
          </div>
          <div className="EntryForm-err">{state.recvdDateErr}</div>
        </div>
        <div>
          <div className="EntryForm-field">
            <input
              type="number"
              name="qtyDemanded"
              value={curItem.qtyDemanded !== 0 ? curItem.qtyDemanded : ""}
              onChange={(e) => {
                this.handleChange("qtyDemanded", parseInt(e.target.value));
              }}
              placeholder=" "
            />
            <label htmlFor="qtyDemanded">Quantity Demanded</label>
          </div>
          <div className="EntryForm-err">{state.qtyError}</div>
        </div>
        <div>
          <div className="EntryForm-field">
            <input
              type="number"
              name="qtyRecvd"
              value={curItem.qtyRecvd !== 0 ? curItem.qtyRecvd : ""}
              onChange={(e) => {
                this.handleChange("qtyRecvd", parseInt(e.target.value));
              }}
              placeholder=" "
            />
            <label htmlFor="qtyRecvd">Quantity Received</label>
          </div>
          <div className="EntryForm-err">{state.qtyError}</div>
        </div>
        <div>
          <div className="EntryForm-field">
            <input
              type="number"
              name="qtyRet"
              value={curItem.qtyRet !== 0 ? curItem.qtyRet : ""}
              onChange={(e) => {
                this.handleChange("qtyRet", parseInt(e.target.value));
              }}
              placeholder=" "
            />
            <label htmlFor="qtyRet">Quantity Returned</label>
          </div>
          <div className="EntryForm-err">{state.qtyError}</div>
        </div>
        <div className="EntryForm-btns">
          <input type="submit" value="Submit" className="btn" />
          <input
            type="button"
            value="Reset"
            className="btn"
            onClick={this.resetForm}
          />
        </div>
      </form>
    );
  }
}

export default EntryForm;
