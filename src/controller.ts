const VOLUME_STEP = 0.1;
const SEEK_SEC_STEP = 10;
const PlAYBACK_RATE_STEP = 0.1;

type KeyBinds = KeyboardController['keyBinds'];

export class KeyboardController {
  private controlElm = this.document.body.querySelector<HTMLDivElement>('div[data-test-id="PLAYER_BAR"]')!;
  private videoElm = this.document.body.querySelector<HTMLVideoElement>('video')!;
  private playbackRateElm = (() => {
    const elm = this.document.createElement('div');
    elm.style.position = 'absolute';
    elm.style.top = 'calc(50% - 100px)';
    elm.style.width = '100%';
    elm.style.textAlign = 'center';
    elm.style.fontSize = '100px';
    elm.style.fontWeight = 'bold';
    elm.style.color = 'white';
    elm.style.textShadow = '2px 2px 2px black';
    return elm;
  })();
  private keyBinds = {
    volumeUp: 'ArrowUp',
    volumeDown: 'ArrowDown',
    seekForward: 'ArrowRight',
    seekBackward: 'ArrowLeft',
    toggleFullScreen: 'f',
    toggleControl: 'c',
    speedUp: 'k',
    speedDown: 'h',
    speedReset: 'j',
  };
  private popupID: number | null = null;

  constructor(private player: Player, private document: Document) {
    document.addEventListener('keydown', this.onKeydown.bind(this));
  }

  private get isFullscreen(): boolean {
    return !!this.document.fullscreenElement;
  }

  private get isShowingControl(): boolean {
    return this.controlElm.dataset?.testId?.includes('PLAYER_BAR_VISIBLE') || false;
  }

  private get volume(): number {
    return this.videoElm.volume;
  }

  private get playbackRate(): number {
    return this.videoElm.playbackRate || this.videoElm.defaultPlaybackRate;
  }

  private get currentTime(): number {
    return this.videoElm.currentTime;
  }

  private get commands(): { [key: string]: () => void } {
    return {
      [this.keyBinds.volumeUp]: () => {
        const vol = Math.min(this.volume + VOLUME_STEP, 1);
        this.player.volume(vol);
      },
      [this.keyBinds.volumeDown]: () => {
        const vol = Math.max(this.volume - VOLUME_STEP, 0);
        this.player.volume(vol);
      },
      [this.keyBinds.seekForward]: () => {
        this.player.seek(this.currentTime + SEEK_SEC_STEP);
      },
      [this.keyBinds.seekBackward]: () => {
        this.player.seek(this.currentTime - SEEK_SEC_STEP);
      },
      [this.keyBinds.toggleFullScreen]: () => {
        if (this.isFullscreen) {
          this.player.exitFullscreen();
          this.document.body.style.cursor = 'auto';
          return;
        }

        this.player.enterFullscreen();
        this.document.body.style.cursor = 'none';
      },
      [this.keyBinds.toggleControl]: () => {
        console.log(this.player.showControls);
        console.log(this.player.hideControls);

        if (this.isShowingControl) {
          this.player.hideControls();
          return;
        }

        this.player.showControls();
      },
      [this.keyBinds.speedUp]: () => {
        const rate = Math.min(this.playbackRate + PlAYBACK_RATE_STEP, 3);
        this.setPlaybackRate(rate);
      },
      [this.keyBinds.speedDown]: () => {
        const rate = Math.max(this.playbackRate - PlAYBACK_RATE_STEP, 0.1);
        this.setPlaybackRate(rate);
      },
      [this.keyBinds.speedReset]: () => {
        this.setPlaybackRate(1);
      },
    };
  }

  private onKeydown(e: KeyboardEvent) {
    const cmd = this.commands[e.key];
    if (cmd) {
      cmd();
    }
  }

  private setPlaybackRate(_rate: number) {
    const rate = Math.round(_rate * 10) / 10;
    this.playbackRateElm.innerText = `x${rate}`;
    this.videoElm.parentElement?.appendChild(this.playbackRateElm);

    if (this.popupID) {
      clearTimeout(this.popupID);
    }
    this.popupID = window.setTimeout(() => {
      this.videoElm.parentElement?.removeChild(this.playbackRateElm);
    }, 1000);

    this.videoElm.playbackRate = rate;
  }

  updateKeyBinds(feature: keyof KeyBinds, key: string) {
    if (!this.keyBinds[feature]) {
      throw new Error(`${feature} is not supported`);
    }

    this.keyBinds[feature] = key;
  }
}
