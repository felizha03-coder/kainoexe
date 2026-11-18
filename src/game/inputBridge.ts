import { ConsoleButton } from '../types/game';

export interface VirtualInputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  webHold: boolean;
  jumpJustPressed: boolean;
  webJustPressed: boolean;
  webJustReleased: boolean;
}

type ButtonListener = (button: ConsoleButton, pressed: boolean) => void;

class InputBridge {
  public virtual: VirtualInputState = {
    left: false,
    right: false,
    up: false,
    down: false,
    webHold: false,
    jumpJustPressed: false,
    webJustPressed: false,
    webJustReleased: false,
  };

  private listeners = new Set<ButtonListener>();

  public subscribe(listener: ButtonListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public setButtonState(button: ConsoleButton, pressed: boolean): void {
    switch (button) {
      case 'LEFT':
        this.virtual.left = pressed;
        break;
      case 'RIGHT':
        this.virtual.right = pressed;
        break;
      case 'UP':
        if (pressed && !this.virtual.up) {
          this.virtual.jumpJustPressed = true;
        }
        this.virtual.up = pressed;
        break;
      case 'DOWN':
        this.virtual.down = pressed;
        break;
      case 'A':
        if (pressed && !this.virtual.webHold) {
          this.virtual.webJustPressed = true;
        } else if (!pressed && this.virtual.webHold) {
          this.virtual.webJustReleased = true;
        }
        this.virtual.webHold = pressed;
        break;
      case 'B':
        if (pressed) {
          this.virtual.jumpJustPressed = true;
        }
        break;
      default:
        break;
    }

    this.listeners.forEach((fn) => fn(button, pressed));
  }

  public consumeFrameEdges(): {
    jumpJustPressed: boolean;
    webJustPressed: boolean;
    webJustReleased: boolean;
  } {
    const snapshot = {
      jumpJustPressed: this.virtual.jumpJustPressed,
      webJustPressed: this.virtual.webJustPressed,
      webJustReleased: this.virtual.webJustReleased,
    };
    this.virtual.jumpJustPressed = false;
    this.virtual.webJustPressed = false;
    this.virtual.webJustReleased = false;
    return snapshot;
  }

  public resetAll(): void {
    this.virtual.left = false;
    this.virtual.right = false;
    this.virtual.up = false;
    this.virtual.down = false;
    this.virtual.webHold = false;
    this.virtual.jumpJustPressed = false;
    this.virtual.webJustPressed = false;
    this.virtual.webJustReleased = false;
  }
}

export const inputBridge = new InputBridge();
