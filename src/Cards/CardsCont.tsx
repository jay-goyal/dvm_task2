import React, { Component } from "react";
import CardObj from "../types/card";
import Card from "./Card";
import "./Card.scss";

type cardProps = {
  cards: CardObj[];
};

class CardsCont extends Component<cardProps> {
  render() {
    const props = this.props;
    const style = {
      display: "grid",
      gridTemplateRows: `repeat(${props.cards.length}, 1fr)`,
      gridGap: "20px",
      padding: "30px 0",
    };
    return (
      <div className="Card-cont" style={style}>
        {props.cards.map((card) => {
          return <Card {...card} key={card.id} />;
        })}
      </div>
    );
  }
}

export default CardsCont;
