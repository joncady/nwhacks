import React, { Component } from 'react';
import { Navbar, NavbarBrand, Button } from 'reactstrap';

export default class Nav extends Component {

    render() {
        return (
            <Navbar light expand="md" id="titleFont">
                <NavbarBrand style={{ color: 'white', fontSize: "40px" }} href="/">Duet With Me</NavbarBrand>
                {/* <div id="button-div">
                    <Button className="topButton">Some Button</Button>
                </div> */}
            </Navbar>
        );
    }

}

