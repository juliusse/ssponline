import React from "react";

export class Unit extends React.Component {
    render() {
        if(this.props.model == null) {
            return <div></div>;
        }
        return (
            <div>
                <img alt={this.props.model.getName()}
                     src={this.props.model.getImage(this.props.isMyTeamsTurn)}
                />
            </div>
        );
    }
}
