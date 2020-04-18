import React, { useState, useEffect, useRef } from "react";
import { Table, InputGroup, FormControl } from "react-bootstrap";
import Pagination from "react-js-pagination";
import { requestAPI } from "../../utils/api";
import SpinnerView from "../../components/SpinnerView";

function Pending() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pageRangeDisplayed, setPageRangeDisplayed] = useState(5);
    const [itemsToShow, setItemsToShow] = useState([]);
    const [isProcessing, setProcessing] = useState(false);

    useEffect(() => {
        getPendingUser();
    }, []);
    const getPendingUser = async () => {
        setProcessing(true);
        await requestAPI("/admin/users/pending", "POST")
            .then((res) => {
                if (res.status === 1) {
                    setPendingUsers(res.data);
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
        setItemsToShow(pendingUsers.slice(startIndex, endIndex));
        setActivePage(pageNumber);
    };

    const handleClickAccept = async (e) => {
        setProcessing(true);
        await requestAPI("/admin/users/pending/active", "POST", { id: e.currentTarget.name })
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
        getPendingUser();
        setProcessing(false);
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
            getPendingUser();
            setProcessing(false);
        }
    };

    return (
        <div className="table-form">
            <div className="des-table">
                <div style={{ fontSize: 18 }}>Pending User List</div>
                <div style={{ fontSize: 22 }}>Total : {pendingUsers.length} </div>
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
                        totalItemsCount={pendingUsers.length}
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
                            <th>City</th>
                            <th>Vat number</th>
                            <th>ATECO</th>
                            <th>PEC</th>
                            <th>Email</th>
                            <th style={{ width: 180 }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!itemsToShow || !itemsToShow.length ? (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    No pending users
                                </td>
                            </tr>
                        ) : (
                            itemsToShow.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{itemsPerPage * (activePage - 1) + index + 1}</td>
                                    {/* <td>{user.officialName.substr(0, 5) + "..."}</td> */}
                                    <td>{user.officialName}</td>
                                    <td>{user.city}</td>
                                    <td>{user.vat}</td>
                                    <td>{user.ateco}</td>
                                    <td>{user.pec}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button type="button" className="btn btn-outline-success btn-sm btn-size mr-2" name={user.id} onClick={handleClickAccept}>
                                            Accept
                                        </button>
                                        <button type="button" className="btn btn-outline-danger btn-sm btn-size" name={user.id} onClick={handleClickDelete}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>
            {isProcessing && <SpinnerView />}
        </div>
    );
}

export default Pending;
