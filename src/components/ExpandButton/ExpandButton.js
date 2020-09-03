import React, { Component } from 'react';
import { styled } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const TableButton = styled(IconButton)({
    "padding": "4px"
})

class ExpandButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
        }
    }

    render() {
        return (
            <TableButton aria-label="expand" onClick={() => {
                this.setState({
                    expanded: !this.state.expanded,
                });
                this.props.handleExpand(this.state.expanded);
            }}>
                { this.state.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
            </TableButton>
        );
    }
}

export default ExpandButton;