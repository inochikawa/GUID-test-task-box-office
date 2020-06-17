import React, { useState } from "react"
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import "./Login.scss";
import Card from "react-bootstrap/Card";
import FormControl from "react-bootstrap/FormControl";
import { Redirect, Link } from "react-router-dom";
import { LinkRoutes } from "../../LinkRoutes";
import { getAppService } from "../../Utils";
import { UserService } from "../../Services";
import { AuthorizationModel } from "../../Models";

export const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [sholdRedirectHome, setShouldRedirectHome] = useState(false);

    const userService: UserService = getAppService(UserService);

    if(sholdRedirectHome) {
        return (<Redirect to={LinkRoutes.shows}/>);
    }

    return (
        <Card className="login-form">
            <Card.Header>
                Login to the application
            </Card.Header>
            <Card.Body>
                <InputGroup className="mb-3" size="sm">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </InputGroup>
    
                <InputGroup className="mb-3" size="sm">
                    <FormControl
                        placeholder="Password"
                        aria-label="Password"
                        aria-describedby="basic-addon1"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputGroup>
            </Card.Body>
    
            <Card.Footer className="form-actions">
                <Link to={LinkRoutes.register}>Register</Link>
                <Button size="sm" onClick={() => {
                    const authModel = new AuthorizationModel(userName, password);

                    userService.authorize(authModel).then((result) => {
                        if(!result.errors) {
                            setShouldRedirectHome(true);
                        }
                    });
                }}>
                    Login
                </Button>
                <Button size="sm" variant="danger" onClick={() => setShouldRedirectHome(true)}>
                    Cancel
                </Button>
            </Card.Footer>
        </Card>
    );
}