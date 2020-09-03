import React from 'react';
import { CircularProgress } from "@material-ui/core";
import './PriceSearchResult.css'

function PriceSearchResult(props) {
    let searchStatus = props.searchStatus;
    let searchResult = props.searchResult;

    switch (searchStatus) {
        case 1:
            return <span>
                <CircularProgress size="1.5em" />
            </span>
        case 0:
            return <span className="result">{searchResult}</span>
        case 2:
            return <span className="result not-found">{searchResult}</span>
        default:
            return <span></span>
    }
}

export default PriceSearchResult;