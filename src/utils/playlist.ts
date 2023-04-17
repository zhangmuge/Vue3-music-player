import {dailyRecommendPlaylist, getPlaylistDetail, recommendPlaylist} from "@/api/playlist";
import {isAccountLoggedIn} from "@/utils/auth";

export async function getRecommendPlayList(limit: number, removePrivateRecommand: boolean) {
    if (isAccountLoggedIn()) {
        const playlists = await Promise.all([
            dailyRecommendPlaylist(),
            recommendPlaylist({limit})
        ]);
        // @ts-ignore
        let recommend = playlists[0].data.recommend ?? [];
        if (recommend.length) {
            if (removePrivateRecommand) recommend = recommend.slice(1);
            await replaceRecommendResult(recommend);
        }
        // @ts-ignore
        return recommend.concat(playlists[1].data.result).slice(0, limit);
    } else {
        const response = await recommendPlaylist({ limit });
        // @ts-ignore
        return response.data.result;
    }
}
async function replaceRecommendResult(recommend: any) {
    for (const r of recommend) {
        if (specialPlaylist.indexOf(r.id) > -1) {
            const data = await getPlaylistDetail(r.id, true);
            const playlist = data.playlist;
            if (playlist) {
                r.name = playlist.name;
                r.picUrl = playlist.coverImgUrl;
            }
        }
    }
}
const specialPlaylist = [3136952023, 2829883282, 2829816518, 2829896389];
