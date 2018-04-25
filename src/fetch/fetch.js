class nodeApi {
    constructor() {
        this.port = `http://localhost:4000/`;
        this.method = 'GET';
        this.mode="no-cors";
        this.body_type = 'form';
        this.bodys = {};
        this.credentials = 'omit';
        this.return_type = 'json';
        this.overtime = 0;
        this.firstThen = undefined;
    }
    banner() { // 歌单
        return `${this.port}banner`
    }
    highquality(url) { // 歌单
        return url ? this.port +`top/playlist/highquality`+ url : this.port +`top/playlist/highquality`
    }
    playlistDetail(url) { // 获取歌单详情
        return `${this.port}playlist/detail?id=${url}`
    }
    songUrl(url) { // 获取歌曲播放audio
        return `${this.port}music/url?id=${url}`
    }
    songDetail(url) { // 获取歌曲详情
        return `${this.port}song/detail?ids=${url}`
    }
    lyric(url){// 获取歌曲歌词
        return `${this.port}lyric?id=${url}`
    }
    comment(id,number){// 获取歌曲评论
        return `${this.port}comment/music?id=${id}&limit=${number}`
    }
    search(url){// 歌曲搜索
        return `${this.port}search/?keywords= ${url}&limit=100`
    }
    rank(url){// 新歌
        return `${this.port}top/list?idx=${url}`
    }
    artists(url){// 歌手排行
        return `${this.port}top/artists`
    }
    artistsSong(url){// 歌手排行
        return `${this.port}artists?id=${url}`
    }
    mv(url){// 歌手排行
        return `${this.port}top/mv?limit=80`
    }
    mvDetail(url){// 歌手排行
        return `${this.port}mv?mvid=${url}`
    }
    playMTV(url){ // mv地址
        return `${this.port}mv/url?url=${url}`
    }
    simiMV(url){ //相似mv
        return `${this.port}simi/mv?mvid=${url}`
    }

}
export default nodeApi;