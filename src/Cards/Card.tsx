import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardObj from "../types/card";

class Card extends Component<CardObj> {
  render() {
    const props = this.props;
    return (
      <div className="Card">
        <FontAwesomeIcon
          icon={props.iconClass}
          className="Card-icon"
          id={props.id}
        />
        <div className="Card-text">
          <p>{props.text}</p>
          <h2>{props.value}</h2>
        </div>
      </div>
    );
  }
}

export default Card;
