import React, { Component } from 'react';
import { styled } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from "@material-ui/lab/Alert";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';

import './EditDialog.css'

const EditField = styled(TextField)({
    "display": "block",
    "margin-bottom": "14px",
});
const DeleteButton = styled(IconButton)({
    "left": "-10px",
});

class EditDialog extends Component {
    constructor(props) {
        super(props);

        this.handleEditId = this.handleEditId.bind(this);
        this.handleEditItemName = this.handleEditItemName.bind(this);
        this.handleEditCost = this.handleEditCost.bind(this);
    }

    state = {
        iid: this.props.item["ID"],
        iname: this.props.item["ITEM Name"],
        icost: this.props.item["COST"],
    }

    handleEditId(e) {
        this.setState({
            iid: e.target.value
        });
    }
    handleEditItemName(e) {
        this.setState({
            iname: e.target.value
        });
    }
    handleEditCost(e) {
        this.setState({
            icost: e.target.value
        });
    }

    render() {
        if (this.props.item) {
            return (
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.handleCloseDialog(this.props.method, null)} >
                    <DialogTitle>{ this.props.item["ID"] ? <span>Edit Listing ID {this.props.item["ID"]}</span> : <span>New Item Listing</span> }</DialogTitle>

                    { this.props.error ? <Alert severity="error">{this.props.errorMessage}</Alert> : null }

                    <form>
                    <DialogContent>
                        <EditField
                            id="iid"
                            label="ID"
                            value={this.state.iid}
                            onChange={this.handleEditId}
                        />
                        <EditField
                            id="iname"
                            label="ITEM Name"
                            value={this.state.iname}
                            onChange={this.handleEditItemName}
                        />
                        <EditField
                            id="icost"
                            label="COST"
                            value={this.state.icost}
                            onChange={this.handleEditCost}
                        />
                    </DialogContent>
                    <DialogActions>
                        { this.props.method === "edit" ?
                            <DeleteButton aria-label="delete" onClick={() => this.props.handleDelete(this.props.item["ID"])}>
                                <DeleteIcon />
                            </DeleteButton> : null}

                        <Button onClick={() => this.props.handleCloseDialog(this.props.method, null)} color="primary">
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={() => {
                            const editedItem = {
                                "prevID": this.props.item["ID"],
                                "ID": this.state.iid,
                                "ITEM Name": this.state.iname,
                                "COST": this.state.icost,
                            }

                            this.props.handleCloseDialog(this.props.method, editedItem);
                        }} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                    </form>
                </Dialog>
            )
        }
        else {
            return (
                <div></div>
            )
        }
    }
}

export default EditDialog;