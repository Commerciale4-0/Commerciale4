import React, { useState, useEffect } from "react";
import { Table, Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import Pagination from "react-js-pagination";
import { requestAPI } from "../../utils/api";
import SpinnerView from "../../components/SpinnerView";
import { stringWithUnitFromNumber } from "../../utils";

function Verified() {
    const [modalShow, setModalShow] = useState(false);

    const [activatedUsers, setActivatedUsers] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pageRangeDisplayed, setPageRangeDisplayed] = useState(5);
    const [itemsToShow, setItemsToShow] = useState([]);
    const [isProcessing, setProcessing] = useState(false);

    const [selectedUser, setSelectedUser] = useState({});

    useEffect(() => {
        getActivatedUsers();
    }, []);

    const getActivatedUsers = async () => {
        setProcessing(true);
        await requestAPI("/user/all", "POST")
            .then((res) => {
                if (res.status === 1) {
                    setActivatedUsers(res.data);
                    setItemsToShow(res.data.slice(0, itemsPerPage));
                } else {
                    console.log(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        setProcessing(false);
    };
    const handlePageChange = (pageNumber) => {
        let startIndex = (pageNumber - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        setItemsToShow(activatedUsers.slice(startIndex, endIndex));
        setActivePage(pageNumber);
    };
    const handleClickReject = async (e) => {
        setProcessing(true);
        await requestAPI("/admin/users/reject", "POST", { id: e.currentTarget.name })
            .then((res) => {
                if (res.status === 1) {
                    console.log(res.data);
                } else {
                    console.log(res.data);
                    return;
                }
            })
            .catch((err) => {
                console.log(err);
            });
        getActivatedUsers();
        setProcessing(false);
    };

    const showModal = (user) => {
        setModalShow(true);
        setSelectedUser(user);
    };

    const handleClickDelete = async (e) => {
        if (window.confirm("Are you really delete?")) {
            setProcessing(true);
            await requestAPI("/admin/users/pending/delete", "POST", { id: e.currentTarget.name })
                .then((res) => {
                    if (res.status === 1) {
                        console.log(res.data);
                    } else {
                        console.log(res.data);
                        return;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            getActivatedUsers();
            setProcessing(false);
        }
    };

    return (
        <div className="table-form">
            <div>
                <div className="des-table">
                    <div style={{ fontSize: 18 }}>Verified User List</div>
                    <div style={{ fontSize: 22 }}>Total : {activatedUsers.length} </div>
                </div>
                <div className="body-table">
                    {/* <InputGroup className="search-input">
                    <FormControl aria-describedby="basic-addon1" />
                </InputGroup> */}
                    <div className="pagination-container">
                        <Pagination
                            prevPageText="prev"
                            nextPageText="next"
                            firstPageText={<i className="fa fa-long-arrow-left"></i>}
                            lastPageText={<i className="fa fa-long-arrow-right"></i>}
                            activePage={activePage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={activatedUsers.length}
                            pageRangeDisplayed={pageRangeDisplayed}
                            onChange={handlePageChange}
                            activeLinkClass="active-color"
                        />
                    </div>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Official name</th>
                                <th>Email</th>
                                <th>City</th>
                                <th>Vat number</th>
                                <th>ATECO</th>
                                {/* <th style={{ width: "80px" }}>View</th>
                            <th style={{ width: "80px" }}>Reject</th> */}
                                <th>Employees</th>
                                <th>Revenues</th>
                                <th style={{ width: 80 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!itemsToShow || !itemsToShow.length ? (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        No verified users
                                    </td>
                                </tr>
                            ) : (
                                itemsToShow.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{itemsPerPage * (activePage - 1) + index + 1}</td>
                                        <td>{user.officialName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.city}</td>
                                        <td>{user.vat}</td>
                                        <td>{user.ateco}</td>
                                        <td>{stringWithUnitFromNumber(user.employees)}</td>
                                        <td>{stringWithUnitFromNumber(user.revenues)}</td>
                                        <td>
                                            <button type="button" className="btn btn-outline-danger btn-sm btn-size" name={user.id} onClick={handleClickDelete}>
                                                Delete
                                            </button>
                                        </td>
                                        {/* <td>
                                    <button
                                        type="button"
                                        className="btn btn-outline-info btn-sm btn-size"
                                        onClick={() => showModal(user)}
                                    >
                                        View
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm btn-size"
                                        name={user.id}
                                        onClick={handleClickReject}
                                    >
                                        Reject
                                    </button>
                                </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                    {/* <ViewInfoModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    user={selectedUser}
                />
                ; */}
                </div>
                {isProcessing && <SpinnerView />}
            </div>
        </div>
    );
}
function ViewInfoModal(props) {
    // console.log(props.user);
    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">User Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.user.id}</p>
                <p>{props.user.email}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Verified;
