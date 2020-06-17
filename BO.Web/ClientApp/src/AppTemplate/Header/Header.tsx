import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./header.scss";
import { Link } from "../../Shared/Components";
import { LinkRoutes } from "./../../Shared";
import { UserService } from "../../Shared/Services";
import { getAppService } from "../../Shared/Utils";
import { observer } from "mobx-react";

@observer
export class Header extends React.Component {
    private _userService: UserService = getAppService(UserService);

    render() {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href={LinkRoutes.app}>Box office</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Link className="app-link-header" to={LinkRoutes.shows}>Shows</Link>
                    </Nav>
                    <Nav className="ml-auto">
                        {
                            this._userService.currentUser
                            && <Link className="app-link-header" to={LinkRoutes.tickets}>My Tickets</Link>
                        }
                        {
                            this._userService.currentUser?.isAdmin
                            && <Link className="app-link-header" to={LinkRoutes.admin}>Admin</Link>
                        }
                        {
                            !this._userService.currentUser
                            && <Link className="app-link-header" to={LinkRoutes.login}>Login</Link>
                        }
                        {
                            this._userService.currentUser
                            && <Link className="app-link-header" to="#">
                                <span>{this._userService.currentUser?.firstName} {this._userService.currentUser?.lastName}</span>
                            </Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}