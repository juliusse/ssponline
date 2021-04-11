import React from "react";

export class Unit extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <img src={this.props.type.src(this.props.team.imgColor)} />
            </div>
        );
    }
}
