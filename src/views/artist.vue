<template>
    <div v-show="show" class="artist-page">
        <div class="artist-info">
            <div class="head">
                <img :src="artist.img1v1Url | resizeImage(1024)" loading="lazy" />
            </div>
            <div>
                <div class="name">{{ artist.name }}</div>
                <div class="artist">{{ $t('artist.artist') }}</div>
                <div class="statistics">
                    <a @click="scrollTo('popularTracks')"
                    >{{ artist.musicSize }} {{ $t('common.songs') }}</a
                    >
                    ·
                    <a @click="scrollTo('seeMore', 'start')"
                    >{{ artist.albumSize }} {{ $t('artist.withAlbums') }}</a
                    >
                    ·
                    <a @click="scrollTo('mvs')"
                    >{{ artist.mvSize }} {{ $t('artist.videos') }}</a
                    >
                </div>
                <div class="description" @click="toggleFullDescription">
                    {{ artist.briefDesc }}
                </div>
                <div class="buttons">
                    <ButtonTwoTone icon-class="play" @click="playPopularSongs()">
                        {{ $t('common.play') }}
                    </ButtonTwoTone>
                    <ButtonTwoTone color="grey" @click="followArtist">
                        <span v-if="artist.followed">{{ $t('artist.following') }}</span>
                        <span v-else>{{ $t('artist.follow') }}</span>
                    </ButtonTwoTone>
                    <ButtonTwoTone
                            icon-class="more"
                            :icon-button="true"
                            :horizontal-padding="0"
                            color="grey"
                    >
                    </ButtonTwoTone>
                </div>
            </div>
        </div>
        <div v-if="latestRelease !== undefined" class="latest-release">
            <div class="section-title">{{ $t('artist.latestRelease') }}</div>
            <div class="release">
                <div class="container">
                    <Cover
                            :id="latestRelease.id"
                            :image-url="latestRelease.picUrl | resizeImage"
                            type="album"
                            :fixed-size="128"
                            :play-button-size="30"
                    />
                    <div class="info">
                        <div class="name">
                            <router-link :to="`/album/${latestRelease.id}`">{{
                                latestRelease.name
                                }}</router-link>
                        </div>
                        <div class="date">
                            {{ latestRelease.publishTime | formatDate }}
                        </div>
                        <div class="type">
                            {{ latestRelease.type | formatAlbumType(latestRelease) }} ·
                            {{ latestRelease.size }} {{ $t('common.songs') }}
                        </div>
                    </div>
                </div>
                <div v-show="latestMV.id" class="container latest-mv">
                    <div
                            class="cover"
                            @mouseover="mvHover = true"
                            @mouseleave="mvHover = false"
                            @click="goToMv(latestMV.id)"
                    >
                        <img :src="latestMV.coverUrl" loading="lazy" />
                        <transition name="fade">
                            <div
                                    v-show="mvHover"
                                    class="shadow"
                                    :style="{
                  background: 'url(' + latestMV.coverUrl + ')',
                }"
                            ></div>
                        </transition>
                    </div>
                    <div class="info">
                        <div class="name">
                            <router-link :to="'/mv/' + latestMV.id">{{
                                latestMV.name
                                }}</router-link>
                        </div>
                        <div class="date">
                            {{ latestMV.publishTime | formatDate }}
                        </div>
                        <div class="type">{{ $t('artist.latestMV') }}</div>
                    </div>
                </div>
                <div v-show="!latestMV.id"></div>
            </div>
        </div>
        <div id="popularTracks" class="popular-tracks">
            <div class="section-title">{{ $t('artist.popularSongs') }}</div>
            <TrackList
                    :tracks="popularTracks.slice(0, showMorePopTracks ? 24 : 12)"
                    :type="'tracklist'"
            />

            <div id="seeMore" class="show-more">
                <button @click="showMorePopTracks = !showMorePopTracks">
                    <span v-show="!showMorePopTracks">{{ $t('artist.showMore') }}</span>
                    <span v-show="showMorePopTracks">{{ $t('artist.showLess') }}</span>
                </button>
            </div>
        </div>
        <div v-if="albums.length !== 0" id="albums" class="albums">
            <div class="section-title">{{ $t('artist.albums') }}</div>
            <CoverRow
                    :type="'album'"
                    :items="albums"
                    :sub-text="'releaseYear'"
                    :show-play-button="true"
            />
        </div>
        <div v-if="mvs.length !== 0" id="mvs" class="mvs">
            <div class="section-title"
            >MVs
                <router-link v-show="hasMoreMV" :to="`/artist/${artist.id}/mv`">{{
                    $t('home.seeMore')
                    }}</router-link>
            </div>
            <MvRow :mvs="mvs" subtitle="publishTime" />
        </div>
        <div v-if="eps.length !== 0" class="eps">
            <div class="section-title">{{ $t('artist.EPsSingles') }}</div>
            <CoverRow
                    :type="'album'"
                    :items="eps"
                    :sub-text="'albumType+releaseYear'"
                    :show-play-button="true"
            />
        </div>

        <div v-if="similarArtists.length !== 0" class="similar-artists">
            <div class="section-title">{{ $t('artist.similarArtists') }}</div>
            <CoverRow
                    type="artist"
                    :column-number="6"
                    gap="36px 28px"
                    :items="similarArtists.slice(0, 12)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CoverRow from "@/components/CoverRow.vue";
import TrackList from "@/components/TrackList.vue";
import { useRoute } from "vue-router";

const route=useRoute()
const show=ref(false);

</script>

<style scoped>

</style>
