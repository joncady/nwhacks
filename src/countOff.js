/*
sequence of commands to count off
*/

const Tone = require('tone');

exports.CountOff = function (timeS, bpm, cb) {
	Tone.Transport.timeSignature = timeS;
	Tone.Transport.bpm.value = bpm;
	var synth = new Tone.MembraneSynth().toMaster();

	var loop = new Tone.Loop(function (timeS) {
		synth.triggerAttackRelease("C1", "16n", timeS);
	}, "4n").start(0);
	Tone.Transport.start().stop('1m');
	Tone.Transport.clear();
	cb(bpm);
}