export default {
  template: `
    <div class="master_play">
        <div class="wave" id="wave">
            <div class="wave1"></div>
            <div class="wave1"></div>
            <div class="wave1"></div>

        </div>
        <img v-if="currentTrack" :src="imageurl(currentTrack.trackimage)" alt="" id="poster_master_play">
        <img v-else  alt="" id="poster_master_play">
        <div v-if="currentTrack" class="name">

            <h5 id="master_title">{{currentTrack.name}}</h5>
            <div class="subtitle" id="master_singer">{{currentTrack.singer}}</div>
        </div>
        <div v-else class="name">

            <h5 id="master_title">Track</h5>
            <div class="subtitle" id="master_singer">Singer</div>
        </div>
        <div class="icon">
            <i class="bi shuffle bi-music-note-beamed">next</i>
            <i @click="prevTrack" class="bi bi-skip-start-fill" id="prev"></i>
            <i v-if="this.isPlaying" @click="togglePlay" class="bi bi-pause-fill" id="masterPlay" style="font-size: 40px;"></i>
            <i v-else @click="togglePlay" class="bi bi-play-fill" id="masterPlay" style="font-size: 40px;"></i>
            
            <i @click="nextTrack" class="bi bi-skip-end-fill" id="next"></i>
        </div>
        <span id="currentStart" >{{timeformat(currentTime)}}</span>
        <div class="bar">
            <input type="range"  id="seek" min="0" max="duration" v-model="currentTime" @input="seek">
            <div class="bar2":style="{ width: progress }" ></div>
            <div class="dot" :style="{ left: progress }"></div>
        </div>
        <span id="currentEnd">{{timeformat(duration)}}</span>
        <div class="vol">
            <i class="bi bi-volume-up-fill" id="vol_icon" ></i>
            <input type="range" min="0" max="1" step="0.01" v-model="vol" @input="volumeChange">
            <div class="vol_bar" :style="{ width: this.vol*100 + '%' }"></div>
            <div class="dot" :style="{ left: this.vol*100 + '%' }" ></div>
        </div> 
</div>
    `,

  props: {
    currentTrack: {
      type: Object,
      default: null,
    },
    tracks: {
      type: Array,
      default: () => [],
    },
    activeIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      audioElement: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentIndex: -1,

      vol: 0.5,
    };
  },
  mounted() {
    // this.audioElement = this.$refs.audioPlayer;
    this.audioElement = new Audio();
    console.log("mounted ", this.currentTrack);

    // this.audioElement= new Audio()
    this.audioElement.addEventListener("timeupdate", this.updateProgress);
    this.audioElement.addEventListener("loadedmetadata", this.setDuration);
  },
  watch: {
    currentTrack(newTrack) {
      this.currentIndex = this.tracks.findIndex((track) => track === newTrack);
      console.log("in the watcher", this.currentTrack.mp3file);

      this.audioElement.src =
        "/static/uploads/tracks/" + this.currentTrack.mp3file;
    },
  },
  methods: {
    imageurl(imgurl) {
      return `/static/uploads/images/${imgurl}`;
    },
    audiosrc() {
      const audiosrc = "/static/uploads/tracks/" + currentTrack.mp3file;
      console.log(audiosrc);
      return audiosrc;
    },
    togglePlay() {
      if (this.currentTrack) {
        if (this.isPlaying) {
          this.audioElement.pause();
        } else {
          this.audioElement.play();
        }
        this.isPlaying = !this.isPlaying;
      }
    },
    updateProgress() {
      this.currentTime = this.audioElement.currentTime;
    },
    setDuration() {
      this.duration = this.audioElement.duration;
    },
    seek() {
      this.audioElement.currentTime = (this.currentTime * this.duration) / 100;
    },
    prevTrack() {
      if (this.currentIndex > 0) {
        if (this.isPlaying) {
          this.isPlaying = !this.isPlaying;
        }
        this.$emit("prev-track");
      }
    },
    nextTrack() {
      if (this.currentIndex < this.tracks.length - 1) {
        if (this.isPlaying) {
          this.isPlaying = !this.isPlaying;
        }
        this.$emit("next-track");
      }
    },
    PlayPauseclass() {
      return {
        "bi-play-fill": this.isPlaying,
        "bi-pause-fill": !this.isPlaying,
      };
    },

    volumeChange() {
      this.audioElement.volume = this.vol;
    },

    timeformat(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    },
  },
  computed: {
    progress() {
      return (this.currentTime / this.duration) * 100 + "%";
    },
  },
};
