import React from "react";

export class Unit extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.model == null) {
            return <div></div>;
        }
        return (
            <div>
                <img src={this.props.model.getImage(this.props.isMyTeamsTurn)} />
            </div>
        );
    }
}
