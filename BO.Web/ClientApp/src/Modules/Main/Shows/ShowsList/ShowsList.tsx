import { action, computed, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from "react-bootstrap/Pagination";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import { DatePicker } from "../../../../Shared/Components";
import { SessionListItemModel, ShowListModel, ShowListRequestModel, ShowListResponseModel } from "../../../../Shared/Models";
import { ApiService, UserService } from "../../../../Shared/Services";
import { dateTimeToShortString, getAppService, objectToQueryString } from "../../../../Shared/Utils";
import "./ShowsList.scss";

@observer
export class ShowsList extends React.Component {
    private _apiService: ApiService = getAppService(ApiService);
    private _userService: UserService = getAppService(UserService);

    @observable private _isTicketOrderModalShow: boolean = false;

    @observable private _shows: ShowListModel[] = [];

    @observable private _filterShowName: string = "";
    @observable private _filterFromDate: Date | undefined;
    @observable private _filterToDate: Date | undefined;

    @observable private _page: number = 1;
    @observable private _totalShowItems: number = 0;
    private _pageSize: number = 7;

    constructor(props: any) {
        super(props);

        this.loadShows();
    }

    render() {

        const paginationItems = [];

        for (let number = 1; number <= this.availablePagesCount; number++) {
            paginationItems.push(
                <Pagination.Item key={number} active={number === this._page} onClick={() => this.changePage(number)}>
                    {number}
                </Pagination.Item>,
            );
        }

        return (
            <>
                <Modal show={this._isTicketOrderModalShow}>
                    <Modal.Header>
                        <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, your ticket was ordered!</Modal.Body>
                    <Modal.Footer>
                        <Button size="sm" onClick={() => runInAction(() => this._isTicketOrderModalShow = false)}>
                            Got it!
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Card>
                    <Card.Header>
                        <h5>Available shows</h5>
                        <div className="filters-holder">
                            <InputGroup className="filter-item" size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder="Type smth..."
                                    aria-describedby="basic-addon1"
                                    value={this._filterShowName}
                                    onChange={(e) => this.setFilterShowName(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup className="filter-item" size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">From</InputGroup.Text>
                                </InputGroup.Prepend>
                                <DatePicker value={this._filterFromDate} onChange={(newDate) => this.setFilterFromDate(new Date(newDate as string))} />
                            </InputGroup>
                            <InputGroup className="filter-item" size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">To</InputGroup.Text>
                                </InputGroup.Prepend>
                                <DatePicker value={this._filterToDate} onChange={(newDate) => this.setFilterToDate(new Date(newDate as string))} />
                            </InputGroup>

                            <InputGroup className="filter-actions" size="sm">
                                <Button size="sm" onClick={() => this.loadShows()}>Find</Button>
                                <Button size="sm" variant="danger" onClick={() => {
                                    // reset filters
                                    this.setFilterShowName("");
                                    this.setFilterFromDate(undefined);
                                    this.setFilterToDate(undefined);
                                    this.loadShows();
                                }}>Clear</Button>
                            </InputGroup>

                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Accordion defaultActiveKey="0">
                            {
                                this._shows.map((s, index) => (
                                    <Card key={index}>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey={`${index}`}>
                                                {s.name}
                                            </Accordion.Toggle>
                                        </Card.Header>

                                        <Accordion.Collapse eventKey={`${index}`}>
                                            <Card.Body>
                                                <div>
                                                    Sessions:
                                                </div>
                                                <ListGroup>
                                                    {
                                                        s.sessions?.map((session, sessionIndex) => (
                                                            <ListGroup.Item key={sessionIndex}>
                                                                <div>
                                                                    <div>
                                                                        <Badge variant="info">When:</Badge> {dateTimeToShortString(session.from)} - {dateTimeToShortString(session.to)}
                                                                    </div>
                                                                    <div>
                                                                        <Badge variant="info">Free seats:</Badge> {session.freeSeats}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <Button size="sm" disabled={!this._userService.isAuthorized || !session.freeSeats} onClick={() => {
                                                                        if (this._userService.isAuthorized && !!session.freeSeats) {
                                                                            this.orderTicket(session.id!)
                                                                        }
                                                                    }}>
                                                                        Order ticket {" "}
                                                                        {
                                                                            !this._userService.isAuthorized
                                                                            && <Badge variant="secondary">Authorize to be able order ticket</Badge>
                                                                        }
                                                                        {
                                                                            !session.freeSeats
                                                                            && <Badge variant="secondary">No free seats!</Badge>
                                                                        }
                                                                    </Button>
                                                                </div>
                                                            </ListGroup.Item>
                                                        ))
                                                    }
                                                </ListGroup>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                ))
                            }
                        </Accordion>
                    </Card.Body>
                    <Card.Footer>
                        <Pagination size="sm">
                            {paginationItems}
                        </Pagination>
                    </Card.Footer>
                </Card>
            </>
        );
    }

    @action private setFilterShowName(newName: string) {
        this._filterShowName = newName;
    }

    @action private setFilterFromDate(newDate: Date | undefined) {
        this._filterFromDate = newDate;
    }

    @action private setFilterToDate(newDate: Date | undefined) {
        this._filterToDate = newDate;
    }

    @action.bound private async loadShows(): Promise<void> {
        const requestModel = new ShowListRequestModel();
        requestModel.name = this._filterShowName;
        requestModel.from = this._filterFromDate?.toISOString();
        requestModel.to = this._filterToDate?.toISOString();

        const requestModelQuery = objectToQueryString(requestModel);

        const response = await this._apiService.fetch(`show?${requestModelQuery}&page=${this._page}&pageSize=${this._pageSize}`);

        if (response.ok) {
            const showsResponse: ShowListResponseModel = await response.json();

            this._shows = showsResponse.items
                ? showsResponse.items.map(i => {

                    const showModel = new ShowListModel();
                    showModel.name = i.name;
                    showModel.sessions = i.sessions?.map(s => {

                        const sessionModel = new SessionListItemModel();
                        sessionModel.from = s.from;
                        sessionModel.to = s.to;
                        sessionModel.id = s.id;
                        sessionModel.freeSeats = s.freeSeats;

                        return sessionModel;
                    }) || [];

                    return showModel;
                })
                : [];

            this._totalShowItems = showsResponse?.totalItems || 0;
        }
    }

    @action.bound async orderTicket(sessionId: string): Promise<void> {
        try {
            const orderResponse = await this._apiService.secureFetch(`ticket/order/${sessionId}`, this._userService.currentUser!.token!, {
                method: "POST"
            });

            if (orderResponse.ok) {
                this._isTicketOrderModalShow = true;
            }
        } catch  {
            // ignore
        }

        // TODO: update only requested show with requested session.
        this.loadShows();
    }

    @action changePage(nextPage: number) {
        this._page = nextPage;
        this.loadShows();
    }

    @computed private get availablePagesCount(): number {
        if (this._totalShowItems === 0) {
            return 1;
        }
        return Math.ceil(this._totalShowItems / this._pageSize);
    }
}