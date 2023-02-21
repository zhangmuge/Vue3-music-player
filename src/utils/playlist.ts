import {dailyRecommendPlaylist, recommendPlaylist} from "@/api/playlist";
import {isAccountLoggedIn} from "@/utils/auth";

export function getRecommendPlayList(limit: number, removePrivateRecommand: boolean) {
    // if(isAccountLoggedIn()){
    //     const playlists=await Promise.all([
    //         dailyRecommendPlaylist(),
    //         recommendPlaylist({limit})
    //     ]);
    //
    //     // const recommend=playlists[0].recommend??[];
    //
    // }
    // else{
    // }
    return recommendPlaylist({limit})
}
