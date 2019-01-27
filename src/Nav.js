import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';

export default class Nav extends Component {

    render() {
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">Duet With Me</NavbarBrand>
            </Navbar>
        );
    }

}

