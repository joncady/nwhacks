import React, { Component } from 'react';

export default class SendAudio extends Component {

    render() {
        return (
            <div>
                <div id="banner">
                    <div id = "logo" className={this.props.recording ? "pulseLogo" : ""}>
                        <img id="send-audio" src={require('./assets/music.png')} />
                    </div>
                        <h3 id="mainTitle">Start Here</h3>
                </div>
            </div>
        );
    }

}