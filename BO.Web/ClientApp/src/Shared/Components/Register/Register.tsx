import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, Redirect } from "react-router-dom";
import { LinkRoutes } from "../../LinkRoutes";
import { RegistrationModel } from "../../Models";
import { ApiService } from "../../Services";
import { getAppService } from "../../Utils";
import "./Register.scss";

export const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [sholdRedirectHome, setShouldRedirectHome] = useState(false);
    const [sholdRedirectLogin, setShouldRedirectLogin] = useState(false);

    const apiService: ApiService = getAppService(ApiService);

    if (sholdRedirectHome) {
        return (<Redirect to={LinkRoutes.shows} />);
    }

    if (sholdRedirectLogin) {
        return (<Redirect to={LinkRoutes.login} />);
    }

    return (
        <Card className="register-form">
            <Card.Header>
                Register in the application
            </Card.Header>
            <Card.Body>
                <InputGroup className="mb-3" size="sm">
                    <FormControl
                        placeholder="First name"
                        aria-describedby="basic-addon1"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </InputGroup>

                <InputGroup className="mb-3" size="sm">
                    <FormControl
                        placeholder="Last name"
                        aria-describedby="basic-addon1"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </InputGroup>

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

                <InputGroup className="mb-3" size="sm">
                    <FormControl
                        placeholder="Confirm password"
                        aria-label="Password"
                        aria-describedby="basic-addon1"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </InputGroup>
            </Card.Body>

            <Card.Footer className="form-actions">
                <Link to={LinkRoutes.login}>Already in the system? Go to login.</Link>
                <Button size="sm" onClick={() => {
                    const authModel = new RegistrationModel(
                        firstName,
                        lastName,
                        userName,
                        password,
                        confirmPassword
                    );

                    apiService.fetch("user", {
                        method: "POST",
                        body: JSON.stringify(authModel)
                    }).then((response) => {
                        if (response.ok) {
                            setShouldRedirectLogin(true);
                        }
                    });
                }}>
                    Register
                </Button>
                <Button size="sm" variant="danger" onClick={() => setShouldRedirectHome(true)}>
                    Cancel
                </Button>
            </Card.Footer>
        </Card>
    );
}