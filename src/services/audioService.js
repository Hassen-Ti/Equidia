import { Howl } from 'howler';

/**
 * Audio Service - Gestion professionnelle de l'audio
 * Utilise Howler.js pour la lecture et MediaSession API pour les contrôles système
 */
class AudioService {
  constructor() {
    this.howl = null;
    this.onTimeUpdate = null;
    this.onEnded = null;
    this.onError = null;
    this.onLoad = null;
    this.timeUpdateInterval = null;
  }

  /**
   * Charger un fichier audio
   */
  load(url, metadata = {}) {
    return new Promise((resolve, reject) => {
      // Nettoyer l'instance précédente
      if (this.howl) {
        this.howl.unload();
      }

      // Créer une nouvelle instance Howler
      this.howl = new Howl({
        src: [url],
        html5: true, // Permet le streaming et MediaSession
        preload: true,
        onload: () => {
          this.setupMediaSession(metadata);
          if (this.onLoad) this.onLoad();
          resolve(this.howl.duration());
        },
        onloaderror: (id, error) => {
          console.error('Audio load error:', error);
          if (this.onError) this.onError(error);
          reject(error);
        },
        onplayerror: (id, error) => {
          console.error('Audio play error:', error);
          if (this.onError) this.onError(error);
        },
        onend: () => {
          this.stopTimeUpdate();
          if (this.onEnded) this.onEnded();
        }
      });
    });
  }

  /**
   * Lire l'audio
   */
  play() {
    if (this.howl) {
      this.howl.play();
      this.startTimeUpdate();
      this.updateMediaSessionState('playing');
    }
  }

  /**
   * Mettre en pause
   */
  pause() {
    if (this.howl) {
      this.howl.pause();
      this.stopTimeUpdate();
      this.updateMediaSessionState('paused');
    }
  }

  /**
   * Arrêter
   */
  stop() {
    if (this.howl) {
      this.howl.stop();
      this.stopTimeUpdate();
      this.updateMediaSessionState('paused');
    }
  }

  /**
   * Chercher une position (en secondes)
   */
  seek(time) {
    if (this.howl) {
      this.howl.seek(time);
      if (this.onTimeUpdate) {
        this.onTimeUpdate(time);
      }
    }
  }

  /**
   * Obtenir la position actuelle (en secondes)
   */
  getCurrentTime() {
    return this.howl ? this.howl.seek() : 0;
  }

  /**
   * Obtenir la durée totale (en secondes)
   */
  getDuration() {
    return this.howl ? this.howl.duration() : 0;
  }

  /**
   * Régler le volume (0-1)
   */
  setVolume(volume) {
    if (this.howl) {
      this.howl.volume(Math.max(0, Math.min(1, volume)));
    }
  }

  /**
   * Régler la vitesse de lecture (0.5-2)
   */
  setPlaybackRate(rate) {
    if (this.howl) {
      this.howl.rate(Math.max(0.5, Math.min(2, rate)));
    }
  }

  /**
   * Vérifier si en cours de lecture
   */
  isPlaying() {
    return this.howl ? this.howl.playing() : false;
  }

  /**
   * Libérer les ressources
   */
  unload() {
    this.stopTimeUpdate();
    if (this.howl) {
      this.howl.unload();
      this.howl = null;
    }
  }

  /**
   * Avancer de X secondes
   */
  forward(seconds = 10) {
    const currentTime = this.getCurrentTime();
    const duration = this.getDuration();
    const newTime = Math.min(currentTime + seconds, duration);
    this.seek(newTime);
  }

  /**
   * Reculer de X secondes
   */
  backward(seconds = 10) {
    const currentTime = this.getCurrentTime();
    const newTime = Math.max(currentTime - seconds, 0);
    this.seek(newTime);
  }

  /**
   * Démarrer la mise à jour du temps
   */
  startTimeUpdate() {
    this.stopTimeUpdate();
    this.timeUpdateInterval = setInterval(() => {
      if (this.howl && this.howl.playing() && this.onTimeUpdate) {
        this.onTimeUpdate(this.getCurrentTime());
      }
    }, 100);
  }

  /**
   * Arrêter la mise à jour du temps
   */
  stopTimeUpdate() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  /**
   * Configuration MediaSession API pour contrôles système
   */
  setupMediaSession(metadata) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: metadata.title || 'EquiCoach Session',
        artist: metadata.artist || 'EquiCoach',
        album: metadata.album || metadata.discipline || 'Training',
        artwork: [
          {
            src: metadata.artwork || '/logo-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      });

      // Actions des contrôles système
      navigator.mediaSession.setActionHandler('play', () => {
        this.play();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        this.pause();
      });

      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        this.backward(details.seekOffset || 10);
      });

      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        this.forward(details.seekOffset || 10);
      });

      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime) {
          this.seek(details.seekTime);
        }
      });

      // Position
      this.updateMediaSessionPosition();
    }
  }

  /**
   * Mettre à jour l'état MediaSession
   */
  updateMediaSessionState(state) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = state;
    }
  }

  /**
   * Mettre à jour la position MediaSession
   */
  updateMediaSessionPosition() {
    if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
      try {
        navigator.mediaSession.setPositionState({
          duration: this.getDuration(),
          playbackRate: this.howl ? this.howl.rate() : 1.0,
          position: this.getCurrentTime()
        });
      } catch (error) {
        console.warn('MediaSession position update error:', error);
      }
    }
  }
}

// Instance singleton
const audioService = new AudioService();

export default audioService;
