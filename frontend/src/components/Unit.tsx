import React from "react";
import "./Unit.sass";
import { UnitModel } from "@/model/UnitModel";
import { UnitType } from "@/constants/Constants";

type UnitProps = {
  model: UnitModel | null;
  onClick: (unitType: UnitType) => void | null;
  isActive: boolean;
}


export class Unit extends React.Component<UnitProps> {
  constructor(props: UnitProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (!this.props.onClick || !this.props.model) {
      return;
    }
    this.props.onClick(this.props.model.type);
  }

  render() {
    if (this.props.model == null) {
      return <div></div>;
    }
    return (
      <div className={this.props.isActive ? "Unit active" : "Unit"}
           onClick={this.handleClick}>
        <img alt={this.props.model.getName()}
             src={this.props.model.getImage()}
        />
      </div>
    );
  }
}
