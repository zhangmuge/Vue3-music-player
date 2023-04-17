<template>
    <div class="player" @click="toggleLyrics">
        <div
                class="progress-bar"
                :class="{
        nyancat: settings.nyancatStyle,
        'nyancat-stop': settings.nyancatStyle && !player.playing,
      }"
                @click.stop
        >
            <vue-slider
                    v-model="player.progress"
                    :min="0"
                    :max="player.currentTrackDuration"
                    :interval="1"
                    :drag-on-click="true"
                    :duration="0"
                    :dot-size="12"
                    :height="2"
                    :tooltip-formatter="formatTrackTime"
                    :lazy="true"
                    :silent="true"
            ></vue-slider>
        </div>
        <div class="controls">
            <div class="playing">
                <div class="container" @click.stop>
                    <img
                            :src="currentTrack.al && currentTrack.al.picUrl | resizeImage(224)"
                            loading="lazy"
                            @click="goToAlbum"
                    />
                    <div class="track-info" :title="audioSource">
                        <div
                                :class="['name', { 'has-list': hasList() }]"
                                @click="hasList() && goToList()"
                        >
                            {{ currentTrack.name }}
                        </div>
                        <div class="artist">
              <span
                      v-for="(ar, index) in currentTrack.ar"
                      :key="ar.id"
                      @click="ar.id && goToArtist(ar.id)"
              >
                <span :class="{ ar: ar.id }"> {{ ar.name }} </span
                ><span v-if="index !== currentTrack.ar.length - 1">, </span>
              </span>
                        </div>
                    </div>
                    <div class="like-button">
                        <button-icon
                                :title="
                player.isCurrentTrackLiked
                  ? $t('player.unlike')
                  : $t('player.like')
              "
                                @click.native="likeATrack(player.currentTrack.id)"
                        >
                            <svg-icon
                                    v-show="!player.isCurrentTrackLiked"
                                    icon-class="heart"
                            ></svg-icon>
                            <svg-icon
                                    v-show="player.isCurrentTrackLiked"
                                    icon-class="heart-solid"
                            ></svg-icon>
                        </button-icon>
                    </div>
                </div>
                <div class="blank"></div>
            </div>
            <div class="middle-control-buttons">
                <div class="blank"></div>
                <div class="container" @click.stop>
                    <button-icon
                            v-show="!player.isPersonalFM"
                            :title="$t('player.previous')"
                            @click.native="playPrevTrack"
                    >
                        <svg-icon icon-class="previous"
                        />
                    </button-icon>
                    <button-icon
                            v-show="player.isPersonalFM"
                            title="不喜欢"
                            @click.native="moveToFMTrash"
                    >
                        <svg-icon icon-class="thumbs-down"
                        />
                    </button-icon>
                    <button-icon
                            class="play"
                            :title="$t(player.playing ? 'player.pause' : 'player.play')"
                            @click.native="playOrPause"
                    >
                        <svg-icon :icon-class="player.playing ? 'pause' : 'play'"
                        />
                    </button-icon>
                    <button-icon :title="$t('player.next')" @click.native="playNextTrack"
                    >
                        <svg-icon icon-class="next"
                        />
                    </button-icon>
                </div>
                <div class="blank"></div>
            </div>
            <div class="right-control-buttons">
                <div class="blank"></div>
                <div class="container" @click.stop>
                    <button-icon
                            :title="$t('player.nextUp')"
                            :class="{
              active: $route.name === 'next',
              disabled: player.isPersonalFM,
            }"
                            @click.native="goToNextTracksPage"
                    >
                        <svg-icon icon-class="list"
                        />
                    </button-icon>
                    <button-icon
                            :class="{
              active: player.repeatMode !== 'off',
              disabled: player.isPersonalFM,
            }"
                            :title="
              player.repeatMode === 'one'
                ? $t('player.repeatTrack')
                : $t('player.repeat')
            "
                            @click.native="switchRepeatMode"
                    >
                        <svg-icon
                                v-show="player.repeatMode !== 'one'"
                                icon-class="repeat"
                        />
                        <svg-icon
                                v-show="player.repeatMode === 'one'"
                                icon-class="repeat-1"
                        />
                    </button-icon>
                    <button-icon
                            :class="{ active: player.shuffle, disabled: player.isPersonalFM }"
                            :title="$t('player.shuffle')"
                            @click.native="switchShuffle"
                    >
                        <svg-icon icon-class="shuffle"
                        />
                    </button-icon>
                    <button-icon
                            v-if="settings.enableReversedMode"
                            :class="{ active: player.reversed, disabled: player.isPersonalFM }"
                            :title="$t('player.reversed')"
                            @click.native="switchReversed"
                    >
                        <svg-icon icon-class="sort-up"
                        />
                    </button-icon>
                    <div class="volume-control">
                        <button-icon :title="$t('player.mute')" @click.native="mute">
                            <svg-icon v-show="volume > 0.5" icon-class="volume"/>
                            <svg-icon v-show="volume === 0" icon-class="volume-mute"/>
                            <svg-icon
                                    v-show="volume <= 0.5 && volume !== 0"
                                    icon-class="volume-half"
                            />
                        </button-icon>
                        <div class="volume-bar">
                            <vue-slider
                                    v-model="volume"
                                    :min="0"
                                    :max="1"
                                    :interval="0.01"
                                    :drag-on-click="true"
                                    :duration="0"
                                    tooltip="none"
                                    :dot-size="12"
                            ></vue-slider>
                        </div>
                    </div>

                    <button-icon
                            class="lyrics-button"
                            title="歌词"
                            style="margin-left: 12px"
                            @click="toggleLyrics"
                    >
                        <svg-icon icon-class="arrow-up"
                        />
                    </button-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Player"
}
</script>

<style scoped>

</style>
