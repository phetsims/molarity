/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAADxrhjBAThgQEIjmVCsPAAEovAj/uAvtVJE0oOGPQCNzTXcVnhm39G4GVy03HcwQ7V/vpS+bkKYxKIvJh2wFhYABb///+hcphOb7nU7Z2BsYFZntIgCd5joi5pEdgoCGwdnaEnWuFhsi8n5RAfzARqrePE4qLw5IJzrd4CnSRe9qx7H/6kONg0h+LOS5TzGhwyB45uDDwE//syxAeACWS9UBmZAAEUE+23MNAAFA1d23LV2ZIKtZ9AwLoavFvMCJMXxKZuOAA9xCZNbugtiyJ0E/lQmEqmqnGkCPK/+79xmBP4x/93+SRLtIANzbJzAYBAXYAAAAPqOInVgqAhGCuykTPBBZamhcZnuxTIeA5lGVAQwtEQohWYQwMlBaJl/ot//4/DovplJ+x6PXv01QDBUAAASv/7MsQDAEhMmUj9yYARBRNoJcOymp/pOm6WxMNDkK88CgUAAdOpcemsymW1qfJJI8ubFIgwbKAH0MEk6ySXc9OpMePUmzM3//+pIvGwxwxC6gIAyg44dnVH16GEQKa6wZyMimFgMwAkEKAncpdiceyT3KWWWr+/epDujzfs9JEWoWaaVOYn3hQv//8zq5c0KTxbEgABIKAALMSf1ML/+zLEBQJIjJs5Lr1LgQqS5lXcnPEQAKYGhgZMQgb+hIr1ggWC+PixLTAbsBydPF6LBeYhgdQaJrRdu2aW755aL488bOqGSj///zWhKFxKoiR2SQCiYMgeYACYY3+EZck4Fax0MMhWETycVoi5nUbtZszGMD3akTLAoYUj/AGBEsNR4ax+jmamISHf//+9QCQBVQAAIcCRRBlTMAaB//swxAWCCIiZMQ5pR8EPEqZpzBzyQcTDhPKPiEY5Z0AlzDIB4M3F12sQiHozen9XIt35l/RkBBUMu3jGLG5rpAhxMWzC3aqdv/14ShVJgYBYAgAjUplC+0BQUEpmvPnOgqG2TrMui2T+xOWxWB4Ij8DW8e0te07Za2UulJwuKy1Yl5rCaeNX80i3//vg8Bn//+0AACCAjzhrKKoF//syxAUCSJyZKQ7lR4EGkyVdzBzwkIOEgdmOHzmBg8i7wZyUVmMWjC/y9UxnddFtsXLnamcWhwgTHhF8S3xCigabDQwk2JmO////xGBDEGwgYBSz7qMxSZMLhk3RjzsYdO2kMATdBlXqqMqQSvlFeTzoReRym5LiA53I5tL0HwuGtRlCsiNmKkWX///6wsD4RnoAACBCAClpoBVMYP/7MsQFgkdUlSsuZUeI6pMkhdyc8MA5CPDQnAOjmYbkCpAgfizXnccp15qTSXVmFUkg3q8BmlaK/jt66sZ////9kQCIoGljjA8zAEGxAJxjH0hgYGhnUgbYo8HTFfxZYFprLXljUZtw1ne3EIGQtVa2KsD8oZ9D/////vcWhOWqAokFackTDEfxIKGx2UdyChmolswpMWWc5njR6TP/+zLEDoJG8JkmrmYHEOoS48HcnPCLv5MwBEV5fHNALxOpAmROt9zb////18VgzRdpsq8pWBQCMCA5Mt7lEvYMGAyYAvoYYEIau2FSqPQO6zLqWvfrX5mAi2SJ05gBUdNMaUdn////+lYawCt8MNFWkhPMLJHMBwhOqFNtLt7FCIhKYy/TnX6GXS6x/aGYAwKFsMRwDNMLbT/////i//swxBmDRoCXIi7kR4DpEuNB3JT4R7M9Klgx4AQaF5jxOJtmHZ8LAZkGzmomuVUzxvouptp+bm5BH5z8iqKaRsBsEm4btS2XzfP/////woGqCFAQo1WyfdUyfRkYNnBQoCj6hAMAVD9IFCrT3RSveSTQafFyYiFEmndnMikt////s38H///tJ//2Q1QLB2FIF+ipIRwCARgoD4kM//syxCWDhySVIm48SxDUEqLF0ArSowGpIBajNPXfNYuM48EPU9etq9FFFmKTV/GrzLl36D//X/VVDsSJYp4aVBlDuYM0xvkSNMWaiGpeaxyqBubVmIs2mh78hvBAh0sTYGlDiD+z/Xq9vaJkjmf9nr0OqoAsBBg3SSpwkiREIG5Aw+AwUG18CUMJFYP9LqGnU1IGInlTAF1lYtU1Wf/7MsQyAwdQPxpg8eEQ3AmjDY48ijc03Q7/f//1f/ilnp71tRiDXTKJGbRpeOAauFCSZheY1mchYdTFQRTl/pVSSu/d591RQqQUso/1bs41Xf///1f9rarDmxi+pdbcPuSoo2pjyGeYVg/YHEBUIAm5tWiD/Mjcm5T0mN/W5hcxieyWKxgFG0////tVuXv+m+cHN2OiyTKASFQFLfL/+zLEPQPHREkQDHMEAOOIocG8FPCtCzkH3QCEDeEMRsJXSN0iqkh4tb+70b8LPzG3f/t1Cl6fr7t2/VtfvautMgIkAAhqrhTxxrohthu0MBr5U0h4E4DB5inKbDqMAQhDOF8wxndR6SPb9nuAH+u1de/dYUUBtACAnFZGF4U5YzBK1SckN4B3rhb2g1Z2bAJVtJ7uPFzb0RTfps/0//swxEeDBmxDEERp4lDMh2HNpKlSfT01e3R9In5QhMJQJAebklcDJnqaEMBA0hpEKmuHBKmAhE8fuKgqGuoK/LfuI9Yx4i/s/7flVUxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxFeCBcw7EmTowoC/hGCYzCRSVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;