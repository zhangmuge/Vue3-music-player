import axios from "axios";
import Dexie from 'dexie'
import useStore from "@/store";
const db= new Dexie('music');
db.version(4).stores({
    trackDetail: '&id, updateTime',
    lyric: '&id, updateTime',
    album: '&id, updateTime',
});

db.version(3)
    .stores({
        trackSources: '&id, createTime',
    })
    .upgrade(tx =>
        tx
            .table('trackSources')
            .toCollection()
            .modify(
                track => !track.createTime && (track.createTime = new Date().getTime())
            )
    );

db.version(1).stores({
    trackSources: '&id',
});

let tracksCacheBytes = 0;
async function deleteExcessCache(){
    const store = useStore();
    if(store.settings.cacheLimit===false||tracksCacheBytes<store.settings.cacheLimit*1024*1024){
        return;
    }
       try{
        // @ts-ignore
           const delCache=await db.trackSources.orderBy('createTime').first();
           // @ts-ignore
           await db.trackSources.delete(delCache.id);
           tracksCacheBytes-=delCache.source.byteLength;
           console.debug(
               `[debug][db.js] deleteExcessCacheSucces, track: ${delCache.name}, size: ${delCache.source.byteLength}, cacheSize:${tracksCacheBytes}`
           );
           deleteExcessCache()
       }catch (error){
           console.debug('[debug][db.js] deleteExcessCacheFailed', error);
       }
}
export function getTrackSource(id:string) {
    // @ts-ignore
    return db.trackSources.get(Number(id)).then(track => {
        if (!track) return null;
        console.debug(
            `[debug][db.js] get track from cache 👉 ${track.name} by ${track.artist}`
        );
        return track;
    });
}
// @ts-ignore
export function cacheTrackDetail(track, privileges) {
    // @ts-ignore
    db.trackDetail.put({
        id: track.id,
        detail: track,
        privileges: privileges,
        updateTime: new Date().getTime(),
    });
}

export function getTrackDetailFromCache(ids: string[]) {
    // @ts-ignore
    return db.trackDetail
        .filter((track: { id: any; }) => {
            return ids.includes(String(track.id));
        })
        .toArray()
        .then((tracks: any[]) => {
            const result = { songs: [], privileges: [] };
            ids.map(id => {
                const one = tracks.find(t => String(t.id) === id);
                // @ts-ignore
                result.songs.push(one?.detail);
                // @ts-ignore
                result.privileges.push(one?.privileges);
            });
            // @ts-ignore
            if (result.songs.includes(undefined)) {
                return undefined;
            }
            return result;
        });
}

export function cacheLyric(id: any, lyrics: any) {
    // @ts-ignore
    db.lyric.put({
        id,
        lyrics,
        updateTime: new Date().getTime(),
    });
}

export function getLyricFromCache(id: any) {
    // @ts-ignore
    return db.lyric.get(Number(id)).then(result => {
        if (!result) return undefined;
        return result.lyrics;
    });
}

export function cacheAlbum(id: any, album: any) {
    // @ts-ignore
    db.album.put({
        id: Number(id),
        album,
        updateTime: new Date().getTime(),
    });
}

export function getAlbumFromCache(id: any) {
    // @ts-ignore
    return db.album.get(Number(id)).then(result => {
        if (!result) return undefined;
        return result.album;
    });
}

export function countDBSize() {
    const trackSizes: any[] = [];
    // @ts-ignore
    return db.trackSources
        .each((track: { source: { byteLength: any; }; }) => {
            trackSizes.push(track.source.byteLength);
        })
        .then(() => {
            const res = {
                bytes: trackSizes.reduce((s1, s2) => s1 + s2, 0),
                length: trackSizes.length,
            };
            tracksCacheBytes = res.bytes;
            console.debug(
                `[debug][db.js] load tracksCacheBytes: ${tracksCacheBytes}`
            );
            return res;
        });
}

export function clearDB() {
    return new Promise(resolve => {
        db.tables.forEach(function (table) {
            table.clear();
        });
        // @ts-ignore
        resolve();
    });
}
