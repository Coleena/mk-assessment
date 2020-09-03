import React, { Component } from 'react';
import { styled } from '@material-ui/core/styles';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Edit from "@material-ui/icons/Edit";

import EditDialog from "../EditDialog/EditDialog";
import ExpandButton from "../ExpandButton/ExpandButton";

const TableHeadCell = styled(TableCell)({
    "font-weight": "600",
    "background-color": "#232323",
    "color": "white",
});
const TableButton = styled(IconButton)({
    "padding": "4px"
});
const DetailCell = styled(TableCell)({
    "line-height": "0.8",
    "background-color": "#efefef",
});

class PriceTable extends Component {
    constructor(props) {
        super(props);

        this.handleEdit = this.handleEdit.bind(this);
        this.handleNew = this.handleNew.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEditDialogClose = this.handleEditDialogClose.bind(this);
        this.handleExpand = this.handleExpand.bind(this);

        this.state = {
            editItem: {},
            editing: false,
            error: false,
            errorMessage: "",
            method: "",
        }
    }

    handleEdit(iid, iname, icost) {
        this.setState({
            editItem: {
                "ID": iid,
                "ITEM Name": iname,
                "COST": icost
            },
            editing: true,
            method: "edit",
        })
    }

    handleNew() {
        this.setState({
            editItem: {
                "ID": '',
                "ITEM Name": '',
                "COST": ''
            },
            editing: true,
            method: "new",
        })
    }

    handleDelete(id) {
        let confirmDelete = window.confirm(`Are you sure you want to delete listing ${id}?`);

        if (confirmDelete) {
            const requestOptions = {
                method: 'DELETE'
            };
            fetch(`https://mk-assessment.herokuapp.com/edit/${id}`, requestOptions)
                .then((result) => {
                    if (result.ok) {
                        this.props.handleDataChange("delete", id);

                        this.setState({
                            editItem: {},
                            editing: false,
                            error: false,
                        })
                    }
                    else {
                        result.json().then((res) =>
                            this.setState({
                                errorMessage: res["message"],
                                error: true,
                            })
                        );
                    }
                })
                .catch((e) => {
                    console.error(e);
                });

            this.setState({
                editItem: {
                    "ID": '',
                    "ITEM Name": '',
                    "COST": ''
                },
                editing: false,
            })
        }
    }

    handleEditDialogClose(type, data) {
        if (data) {
            let methodType = "";
            let reqUrl = "";

            if (type === "new") {
                methodType = "POST";
                reqUrl = "https://mk-assessment.herokuapp.com/edit";
            }
            else if (type === "edit") {
                methodType = "PATCH";
                reqUrl = `https://mk-assessment.herokuapp.com/edit/${data["prevID"]}`;
            }

            const requestOptions = {
                method: methodType,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            };

            fetch(reqUrl, requestOptions)
                .then((result) => {
                    if (result.ok) {
                        this.props.handleDataChange(type, data);

                        this.setState({
                            editItem: {},
                            editing: false,
                            error: false,
                        })
                    }
                    else {
                        result.json().then((res) =>
                            this.setState({
                                errorMessage: res["message"],
                                error: true,
                            })
                        );
                    }
                })
                .catch((e) => {
                    console.error(e);
                });
        }
        else {
            this.setState({
                editItem: {},
                editing: false,
                error: false,
            })
        }
    }

    handleExpand(expanded, itemName) {
        if (expanded) {
            this.props.handleDataChange("unexpand", itemName);
        }
        else {
            fetch(`https://mk-assessment.herokuapp.com/price/${itemName}`)
                .then(res => res.json())
                .then((result) => {
                    this.props.handleDataChange("expand", result);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    }

    render() {
        if (this.props.viewState === "all") {
            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>ID</TableHeadCell>
                            <TableHeadCell>ITEM Name</TableHeadCell>
                            <TableHeadCell>COST</TableHeadCell>
                            <TableHeadCell align="right">
                                <TableButton aria-label="new-item" onClick={this.handleNew} style={{ color: "white" }}>
                                    <AddCircleOutlineIcon />
                                </TableButton>
                            </TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.items.map((item) => (
                            <TableRow key={item["ID"]}>
                                <TableCell>{item["ID"]}</TableCell>
                                <TableCell>{item["ITEM Name"]}</TableCell>
                                <TableCell>{item["COST"]}</TableCell>
                                <TableCell align="right">
                                    <TableButton aria-label="edit" onClick={() => {
                                        this.handleEdit(item["ID"], item["ITEM Name"], item["COST"]);
                                    }}>
                                        <Edit />
                                    </TableButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    <EditDialog
                        open={this.state.editing}
                        item={this.state.editItem}
                        key={this.state.editItem["ID"]}
                        method={this.state.method}
                        handleCloseDialog={this.handleEditDialogClose}
                        handleDelete={this.handleDelete}
                        error={this.state.error}
                        errorMessage={this.state.errorMessage} />
                </Table>
            )
        }
        else if (this.props.viewState === "max") {
            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Item Name</TableHeadCell>
                            <TableHeadCell>Maximum Price</TableHeadCell>
                            <TableHeadCell align="right">Listings</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.items.map((item) => (
                            Array.isArray(item) ?
                                item.map((detailItem) => (
                                    <TableRow key={detailItem["ID"]}>
                                        <DetailCell>ITEM Name: {detailItem["ITEM Name"]}</DetailCell>
                                        <DetailCell>COST: {detailItem["COST"]}</DetailCell>
                                        <DetailCell>ID: {detailItem["ID"]}</DetailCell>
                                    </TableRow>
                                )) :
                                <TableRow key={item["ITEM Name"]}>
                                    <TableCell>{item["ITEM Name"]}</TableCell>
                                    <TableCell>{item["max"]}</TableCell>
                                    <TableCell align="right">
                                        <ExpandButton handleExpand={(expanded) => this.handleExpand(expanded, item["ITEM Name"])} />
                                    </TableCell>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )
        }
    }
}

export default PriceTable;