import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import * as tone from 'tone';
// const p5 = require('./p5/p5')
const rec = require('./Recorderjs-master/lib/recorder');

export default class SendAudio extends Component {

    constructor() {
        super();
        this.state = {
            url: "http://localhost:8000/audio"
        }
    }

    startStream = () => {
        const { url } = this.state;
        var constraints = { audio: true, video: false }
        var audioContext = new AudioContext;
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

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
            axios.post(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        });
    }

    render() {
        return (
            <div>
                <input id="send-audio" type="image" onClick={this.startStream} src={require('./assets/music.png')} />
                <input type="file" accept="audio/*" capture></input>
            </div>
        );
    }

}