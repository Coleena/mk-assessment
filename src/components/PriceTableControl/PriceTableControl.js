import React, { Component } from 'react';
import { styled } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import PriceTable from "../PriceTable/PriceTable";

import './PriceTableControl.css'

const Tab = styled(ToggleButton)({
    "border-radius": "0px",
    "border-bottom": "none",
})

class PriceTableControl extends Component {
    constructor(props) {
        super(props);

        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);

        this.state = {
            viewState: "all",
            items: [],
        };
    }

    componentDidMount() {
        fetch(`https://mk-assessment.herokuapp.com/price`)
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    items: result
                })
            });
    }

    handleViewChange(e, view) {
        let url = "";

        if (view === "all") {
            url = "https://mk-assessment.herokuapp.com/price"
        }
        else if (view === "max") {
            url = "https://mk-assessment.herokuapp.com/maxprice"
        }

        fetch(url)
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    items: result,
                    viewState: view
                })
            })
            .catch(e => {
                console.error(e);
            });
    }

    handleDataChange(type, data) {
        if (type === "edit") {
            const itemIndex = this.state.items.findIndex(item => item["ID"] === data["prevID"]);

            let newItems = this.state.items.slice();
            newItems[itemIndex] = {
                "ID": data["ID"],
                "ITEM Name": data["ITEM Name"],
                "COST": data["COST"],
            }

            this.setState({
                items: newItems,
            });
        }
        else if (type === "delete") {
            const itemIndex = this.state.items.findIndex(item => item["ID"] === data);

            let newItems = this.state.items;
            newItems.splice(itemIndex, 1);

            this.setState({
                items: newItems,
            });
        }
        else if (type === "new") {
            let newItems = this.state.items;
            newItems.push(data);

            this.setState({
                items: newItems,
            });
        }
        else if (type === "expand") {
            const itemIndex = this.state.items.findIndex(item => item["ITEM Name"] === data[0]["ITEM Name"]);

            let newItems = this.state.items;
            newItems.splice(itemIndex + 1, 0, data);

            this.setState({
                items: newItems,
            });
        }
        else if (type === "unexpand") {
            const itemIndex = this.state.items.findIndex(item => item["ITEM Name"] === data);

            let newItems = this.state.items;
            newItems.splice(itemIndex + 1, 1);

            this.setState({
                items: newItems,
            });
        }
    }

    render() {
        return (
            <div>
                <ToggleButtonGroup
                    value={this.state.viewState}
                    exclusive
                    onChange={this.handleViewChange}
                >
                    <Tab value="all">
                        All Items
                    </Tab>
                    <Tab value="max">
                        Max Prices
                    </Tab>
                </ToggleButtonGroup>

                <PriceTable items={this.state.items} viewState={this.state.viewState} handleDataChange={this.handleDataChange} />
            </div>
        )
    }
}

export default PriceTableControl;