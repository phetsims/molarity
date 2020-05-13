/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../chipper/js/grunt/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../chipper/js/grunt/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tSxLqACiDPK6Rh9gE3GaPUPDKKVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+1LEoYPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBuffer = decodedAudio;
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBuffer = phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate );
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;