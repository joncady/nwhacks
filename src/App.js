import React, { Component } from 'react';
import Controls from './Controls';
import SendAudio from './SendAudio';
import Nav from './Nav';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Nav></Nav>
				<main id="background">
					<div className="backgroundOverlay">
						<SendAudio></SendAudio>
						<Controls></Controls>
					</div>
				</main>
			</div>
		);
	}
}

export default App;
