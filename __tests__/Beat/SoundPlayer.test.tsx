import sinon from 'sinon';
import SoundPlayer from 'Beat/SoundPlayer';

// tslint:disable:no-any
describe('SoundPlayer', () => {
  let soundPlayer: SoundPlayer;

  beforeEach(() => {
    sinon.replace(SoundPlayer.prototype as any, 'load', () => {});
    soundPlayer = SoundPlayer.getSoundPlayer();
  });
  afterEach(() => {
    sinon.restore();
  });

  it('returns SoundPlayer instance', () => {
    expect(soundPlayer.constructor.name).toBe("SoundPlayer");
  });
});
