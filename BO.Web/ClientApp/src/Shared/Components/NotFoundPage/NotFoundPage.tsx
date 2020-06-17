import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import { LinkRoutes } from "../../LinkRoutes";
import "./NotFoundPage.scss";

export const NotFoundPage = () => {
    const [sholdRedirectHome, setShouldRedirectHome] = useState(false);

    if(sholdRedirectHome) {
        return (<Redirect to={LinkRoutes.app}/>);
    }
    
    return (
        <Card className="not-found-page">
            <Card.Body>
                <Card.Title>
                    Page was not found
                </Card.Title>
                <Card.Text>
                    It seems page doesn't exist (っ˘̩╭╮˘̩)っ
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Button size="sm" onClick={() => setShouldRedirectHome(true)}>
                    Go home
                </Button>
            </Card.Footer>
        </Card>
    );
};