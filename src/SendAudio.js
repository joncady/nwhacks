import React, { Component } from 'react';
import { Button, Alert } from 'reactstrap';
import axios from 'axios';
import * as Tone from 'tone';
const rec = require('./Recorderjs-master/lib/recorder');

export default class SendAudio extends Component {

    constructor() {
        super();
        this.state = {
            url: "http://localhost:8000/audio",
            bar: '',
            errorMessage: null,
            player: null
        }
    }

    startStream = () => {
        const { url } = this.state;
        var constraints = { audio: true, video: false }
        var audioContext = new AudioContext;
        if (!this.state.player) {
            let player = new Tone.Player('http://localhost:8000/song?name=bach.mp3').toMaster();
            this.setState({
                player: player
            });
            player.autostart = true;
        }
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            console.log("getUserMedia() success, strem created, initializing Recorder.js ...");

            /* assign to gumStream for later use */
            // gumStream = stream;

            /* use the stream */
            let input = audioContext.createMediaStreamSource(stream);

            /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
            */
            let mic = new rec.Recorder(input, { numChannels: 1 })
            mic.record();
            // setInterval(() => {
            setTimeout(() => {
                this.sendAudio(mic, url);
            }, 2000);
            // }, 3000);
        })

    }

    sendAudio(mic, url) {
        mic.exportWAV((file) => {
            let form = new FormData();
            form.append("data", file);
            this.setState({
                errorMessage: null
            });
            axios.post(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                let dataObject = res.data;
                if (dataObject.type == "location") {
                    this.setState({
                        bar: dataObject.bar
                    });
                    this.state.player.seek(dataObject.bar * 4);
                } else if (dataObject.type == "stop") {
                    console.log("Playback");
                } else {
                    this.setState({
                        errorMessage: "No command heard."
                    })
                }
            })
        });
    }

    render() {
        return (
            <div>
                {/* onClick={this.startStream} */}
                <div id="banner">
                    <div id = "logo">
                        <input id="send-audio" type="image" onClick={this.startStream} src={require('./assets/music.png')} />
                    </div>
                    <h3 id="mainTitle">Start Here</h3>
                </div>
                <p>{this.state.bar}</p>
                {this.state.errorMessage &&
                    <Alert color="danger">
                        {this.state.errorMessage}
                    </Alert>}
            </div>
        );
    }

}