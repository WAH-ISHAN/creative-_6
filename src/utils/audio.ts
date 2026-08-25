/**
 * Sound effects engine - Web sound effects have been disabled per user request.
 * All methods remain as lightweight no-ops to maintain interface compatibility.
 */
class SoundEngine {
  private muted: boolean = true;

  public toggleMute(): boolean {
    return true;
  }

  public isMuted(): boolean {
    return true;
  }

  public playClick(): void {
    // Sound disabled
  }

  public playPixelClick(_pitchMultiplier: number = 1): void {
    // Sound disabled
  }

  public playOpen(): void {
    // Sound disabled
  }

  public playSwoosh(): void {
    // Sound disabled
  }

  public playSuccess(): void {
    // Sound disabled
  }
}

export const soundEngine = new SoundEngine();
