const stateDefault = {
    NormalOrMin:true,//默认打开normal 播放界面
    PlayTools: { //控制条状态
        playContorl: false, //每次点击歌曲展开播放界面
        playState: false, //播放暂停控制
        song: null //歌单内点击 获取 点击的歌曲对象 和歌单数组
    },
    nowPlay:null,//当前播放的歌曲详情
    RecommendId: '', //歌单id
    PageState: 'HomePage', //页面渲染路由
    RankList:null,//榜单详情
    mvDetail:null
}
export default(state = stateDefault, actions) => {

    switch (actions.type) {
            //打开热门歌单
        case 'OPEN_RECOMMEND':
            return Object.assign({}, state, {
                RecommendId: actions.msg.ID,
                PageState: actions.msg.template
            })
            //关闭歌单列表
        case 'RECOMMEND_CLOSED':
            return Object.assign({}, state, {PageState: 'HomePage'})
            //播放选中歌曲
        case 'PLAY_SONG':
            let NormalOrMin = state.NormalOrMin
            let stateSong = state.PlayTools.song
            let actionsID= actions.SongArr.self.id
            if(stateSong&&stateSong.self.id === actionsID){
                return Object.assign({}, state, {
                    NormalOrMin:true
                })
            }else{
                return Object.assign({}, state, {
                    NormalOrMin:true,
                    PlayTools: {
                        playContorl: true,
                        song: {
                            self: actions.SongArr.self,
                            all: actions.SongArr.allSong
                        },
                        playState: true
                    },
                    nowPlay:actions.SongArr.self
                })
            }
        case 'TOGGLE_PLAYER': //播放界面切换
        if(actions.msg =='hide'){
            return Object.assign({}, state, {
                NormalOrMin:false
            })
        }else{
            return Object.assign({}, state, {
                NormalOrMin:true
            })
        }
        case 'CURRENT_SONG'://切歌
        return Object.assign({}, state,{
            nowPlay:actions.msg
        })
        case 'SEARCH_ABLE'://搜索界面打开
        return Object.assign({}, state,{
            PageState: 'SearchPage'
        })
        case 'BREAK_HOME'://返回主页
        return Object.assign({}, state,{
            PageState: 'HomePage'
        })
        case 'CHICO_SEARCH'://选中搜索的歌曲
        return Object.assign({}, state,{
            NormalOrMin:true,
            nowPlay: actions.msg.self,
            PlayTools:{
                playContorl:true,
                playState:true,
                song:{
                    self:actions.msg.self,
                    all:actions.msg.all
                }
            }
        })
        case 'OPEN_RANK_LIST'://打开排行榜单
        return Object.assign({}, state,{
            PageState: 'RankList',
            RankList:actions.msg
        })
        case 'OPEN_MV_DETAIL'://打开mtv 页面
        return Object.assign({}, state,{
            PageState: 'MtvPage',
            mvDetail:actions.msg
        })
        case 'MTV_RELOAD'://mtv切换
        return Object.assign({}, state,{
            mvDetail:actions.msg
        })
        default:
            return state
    }

}
