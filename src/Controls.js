import React, { Component } from 'react';
import { Button, Input, Label, Modal } from 'reactstrap';
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
            modal: false,
            songModal: false,
            file: null
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

    toggle = (type) => {
        if (type === 'song') {
            this.setState({
                songModal: !this.state.songModal
            });
        } else if (type === 'submit') {
            this.setState({
                submitModal: !this.state.submitModal
            });
        } else {
            this.setState({
                modal: !this.state.modal
            });
        }
    }

    uploadSong = () => {
        let file = this.state.file;
        if (file) {
            let form = new FormData();
            form.append("song", file);
            axios.post('https://duetwithme.herokuapp.com/upload', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                this.setState({
                    songs: res.data.files
                })
            });
        }
    }

    render() {
        return (
            <div>
                <div id="buttonContainer">
                    <div>
                        <Button onClick={() => this.toggle('song')}>Select Music</Button>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div>
                            <Button onClick={this.toggle}>
                                Set your Pace
                            </Button>
                            {this.renderTimeModal()}
                            {this.renderSongModal()}
                        </div>
                    </div>
                    <Button onClick={() => {
                        if (this.state.songChoice) {
                            CountOff.CountOff(this.state.timeSignatureTop, this.state.tempo, this.props.startStream);
                        } else {
                            this.props.setError();
                        }
                    }}>
                        Begin Playing
                    </Button>
                </div>
            </div>
        )
    }

    renderTimeModal = () => {
        return (
            <Modal isOpen={this.state.modal} className="modal-standards" toggle={this.toggle}>
                <div className="modal-standards">
                    <h4>Your Pace</h4>
                    <Label>BPM</Label>
                    <Input type="number" onChange={(e) => this.setState({ tempo: e.target.value })} value={this.state.tempo}></Input>
                    <Label>Beats Per Measure</Label>
                    <Input className="chooser" type="number" onChange={(e) => this.setState({ timeSignatureTop: e.target.value })} value={this.state.timeSignatureTop}></Input>
                    <Label>Time Signature Type</Label>
                    <Input className="chooser" type="number" width="30" onChange={(e) => this.setState({ timeSignatureBot: e.target.value })} value={this.state.timeSignatureBot}></Input>
                </div>
                <Button onClick={() => this.setState({ modal: false })}>Confirm</Button>
            </Modal>
        );
    }

    renderSongModal = () => {
        const { songs } = this.state;
        return (
            <Modal isOpen={this.state.songModal} toggle={() => this.toggle('song')}>
                <div className="modal-standards">
                    <h4>Song</h4>
                    {songs &&
                        <Input type="select" onChange={(e) => {
                            this.setState({ songChoice: e.target.value });
                            this.props.setSong(e.target.value);
                        }}>
                            {songs.map((song) => <option key={song}>{song}</option>)}
                        </Input>}
                    <Button onClick={() => {
                        this.props.setSong(this.state.songChoice);
                        this.setState({
                            songModal: false
                        })
                    }
                    }>Choose</Button>
                    <h4>Upload a Song</h4>
                    <Input type="file" accept="audio/*" onChange={(e) => this.setState({ file: e.target.files[0] })}></Input>
                    <Button onClick={this.uploadSong}>Upload Song</Button>
                </div>
            </Modal>
        );
    }

}

export default Controls;