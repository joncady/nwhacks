import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Controls extends Component {

    render() {
        return (
            <div>
                <div id="buttonContainer">
                    <Button>
                        Select Music  
                    </Button>
                    <Button>
                        Play Along
                    </Button>
                    <Button>
                        Set your Pace
                    </Button>
                </div>
            </div>
        )
    }

}

export default Controls;