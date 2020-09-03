import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import PriceSearchResult from "../PriceSearchResult/PriceSearchResult";

const SearchField = styled(TextField)({
    "margin-left": "10px",
    "margin-right": "10px",
    "margin-bottom": "16px",
    "vertical-align": "middle",
})

class PriceSearch extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            timeout: 0,
            searchStatus: -1,
            searchResult: "",
        }
    }

    handleChange(e) {
        let itemName = e.target.value;

        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
        }
        this.setState({
            timeout: setTimeout(() => {
            this.searchMaximumPrice(itemName);
        }, 400),
            searchStatus: 1
        });
    }

    searchMaximumPrice(itemName) {
        fetch(`https://mk-assessment.herokuapp.com/maxprice/${itemName}`)
            .then(res => res.json())
            .then((result) => {
                if (result) {
                    this.setState({
                        searchStatus: 0,
                        searchResult: result
                    })
                }
                else {
                    this.setState({
                        searchStatus: 2,
                        searchResult: `Item not found.`
                    })
                }
            })
            .catch((e) => {
                console.error(e);
                this.setState({
                    searchStatus: 2,
                    searchResult: `Database connection failed.`
                })
            })
    }

    render() {
        return <div>
            <label>
                Find maximum price: <SearchField label="Item name" onChange={this.handleChange} />
            </label>

            <PriceSearchResult searchStatus={this.state.searchStatus} searchResult={this.state.searchResult} />
        </div>
    }
}

export default PriceSearch;