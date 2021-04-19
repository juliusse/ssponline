import React from "react";
import './Unit.sass';
import {UnitModel} from "../model/UnitModel";

type UnitProps = {
    model: UnitModel | null;
    onClick: Function | null;
    isActive: boolean;
}

type UnitState = {

}

export class Unit extends React.Component<UnitProps, UnitState> {
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
            <div className={this.props.isActive ? 'Unit active' : 'Unit'}
                 onClick={this.handleClick}>
                <img alt={this.props.model.getName()}
                     src={this.props.model.getImage()}
                />
            </div>
        );
    }
}
