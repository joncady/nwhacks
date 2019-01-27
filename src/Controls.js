import React, { Component } from 'react';
import { Button, Input, InputGroup, Label, Modal } from 'reactstrap';
import axios from 'axios';
import CountOff from './countOff';

class Controls extends Component {

    constructor() {
        super();
        this.state = {
            songs: null,
            songChoice: null,
            tempo: 60,
            timeSignatureTop: 4,
            timeSignatureBot: 4,
            modal: false
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8000/songnames').then((response) => {
            this.setState({
                songs: response.data.files,
                songChoice: response.data.files[0]
            });
        });
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        const { songs } = this.state;
        return (
            <div>
                <div id="buttonContainer">
                    <div>
                        {songs &&
                            <Input type="select">
                                {songs.map((song) => <option key={song}>{song}</option>)}
                            </Input>}
                        <Button>Select Music</Button>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div>
                            <Button onClick={this.toggle}>
                                Set your Pace / Time Signature
                            </Button>
                            {this.renderTimeModal()}
                        </div>
                    </div>
                    <Button onClick={() => CountOff.CountOff(this.state.timeSignatureTop, this.state.tempo, this.props.startStream)}>
                        Begin Playing
                    </Button>
                </div>
            </div>
        )
    }

    renderTimeModal = ()  => {
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <InputGroup>
                <Label>BPM</Label>
                <Input type="number" onChange={(e) => this.setState({ tempo: e.target.value })} value={this.state.tempo}></Input>
            </InputGroup>
            <InputGroup>
                <Label>Beats Per Measure</Label>
                <Input className="chooser" type="number" onChange={(e) => this.setState({ timeSignatureTop: e.target.value })} value={this.state.timeSignatureTop}></Input>
                <Label>Time Signature Type</Label>
                <Input className="chooser" type="number" width="30" onChange={(e) => this.setState({ timeSignatureBot: e.target.value })} value={this.state.timeSignatureBot}></Input>
            </InputGroup>
            </Modal>
        );
    }

}

export default Controls;