import React, { Component } from 'react';
import Controls from './Controls';
import SendAudio from './SendAudio';
import Nav from './Nav';
import { Modal } from 'reactstrap';
import axios from 'axios';
import * as Tone from 'tone';
const rec = require('./Recorderjs-master/lib/recorder');

class App extends Component {

	constructor() {
		super();
		this.state = {
			url: "http://localhost:8000/audio",
			bar: '',
			errorMessage: null,
			player: null,
			selectedSong: null,
			modal: false,
			recording: false
		}
	}

	toggle = () => {
		this.setState({
			modal: !this.state.modal
		})
	}

	componentDidMount() {
		document.body.addEventListener('keyup', (e) => {
			if (e.key === " ") {
				if (this.state.selectedSong) {
					if (this.state.playing) {
						this.state.player.stop();
						this.setState({
							playing: false
						})
					} else {
						this.startStream();
					}
				} else {
					this.setState({
						errorMessage: "Please confirm your song!",
						modal: true
					});
				}
			}
		});
	}

	startStream = () => {
		const { url } = this.state;
		var constraints = { audio: true, video: false }
		var audioContext = new AudioContext();
		if (!this.state.player) {
			let player = new Tone.Player({ url: `http://localhost:8000/song?name=${this.state.selectedSong}` }).toMaster();
			this.setState({
				player: player,
				playing: true
			});
		}
		navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
			console.log("getUserMedia success, strem created, initializing Recorder.js ...");

			/* use the stream */
			let input = audioContext.createMediaStreamSource(stream);

			/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
			*/
			let mic = new rec.Recorder(input, { numChannels: 1 })
			mic.record();
			this.setState({
				recording: true
			});
			setTimeout(() => {
				this.sendAudio(mic, url);
			}, 3000);
		});
	}

	setSong = (song) => {
		this.setState({
			selectedSong: song
		});
	}

	sendAudio(mic, url) {
		mic.exportWAV((file) => {
			let form = new FormData();
			form.append("data", file);
			this.setState({
				errorMessage: null,
				recording: false
			});
			axios.post(url, form, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}).then((res) => {
				let dataObject = res.data;
				console.log(dataObject.bar);
				if (dataObject.type === "location") {
					this.setState({
						bar: dataObject.bar
					});
					this.state.player.start(0, (dataObject.bar - 1) * 4);
				} else if (dataObject.type === "stop") {
					this.state.player.stop();
				} else {
					this.setState({
						errorMessage: "No command heard."
					});
				}
			})
		});
	}

	setError = () => {
		this.setState({
			modal: true,
			errorMessage: "Please confirm your song!"
		});
	}

	renderErrorModal() {
		return (
			<Modal isOpen={this.state.modal} toggle={this.toggle}>
				<div className="modal-standards">{this.state.errorMessage}</div>
			</Modal>
		);
	}

	render() {
		return (
			<div className="App">
				<Nav></Nav>
				<main id="background">
					<div className="backgroundOverlay">
						<SendAudio recording={this.state.recording}></SendAudio>
						<Controls startStream={this.startStream} setSong={this.setSong} setError={this.setError}></Controls>
					</div>
					{this.renderErrorModal()}
				</main>
			</div>
		);
	}
}

export default App;