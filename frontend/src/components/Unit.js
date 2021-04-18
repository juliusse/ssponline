import React from "react";

export class Unit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if(!this.props.onClick) {
            return;
        }
        this.props.onClick(this.props.model.type);
    }

    render() {
        if(this.props.model == null) {
            return <div></div>;
        }
        return (
            <div onClick={this.handleClick}>
                <img alt={this.props.model.getName()}
                     src={this.props.model.getImage(this.props.isMyTeamsTurn)}
                />
            </div>
        );
    }
}
