import React from 'react';
import {Button, Icon} from 'antd';
import { PullToRefresh,Toast } from 'antd-mobile';
import nodeApi from '../fetch/fetch';//封装node 请求
import $ from 'jquery';
import LazyLoad from 'react-lazyload';
import imgURL from '../common/img/13.png';  
import {connect} from 'react-redux';
import spinner from '../common/img/index.gooey-ring-spinner.svg';
import messenger from '../common/img/index.messenger-typing-preloader.svg';
class HighqualityDetail extends React.Component {
    constructor(props, context) {
        super(props, context),
        this.state = {
            bgImg: imgURL,
            scroll:false,
            listData:[],
            result:null,
            tracks:null,
            itemSong:[],
            index:0
        }
        this.LuckPlay = this.LuckPlay.bind(this); 
    }
    LuckPlay(){
        let leg = this.state.itemSong.length
        let num =  Math.floor(Math.random()*leg)
        this.props.playSong({
            self:this.state.itemSong[num],
            allSong:this.state.itemSong})
    }
    render() {
        return (
            <div
                className={`HighqualityDetail ${this.props.PageState === 'Highquality'
                ? 'active'
                : ''}`} ref="songList">
                <div className="quality">
                    <div className="back" onClick={this.props.RecommendClosed}>
                        <i className="icon-back"></i>
                    </div>
                    <h1 className="title">{this.state.result ? this.state.result.name :	<img src={messenger}  className="top-loading"/> }</h1>
                </div>
                <div
                    className={`bg-image ${this.state.scroll ? 'active':''}`}
                    style={{
                    backgroundImage: 'url(' + this.state.bgImg + ')'
                }}>
                    <div className="play-wrapper">
                        <div className="play">
                            <i className="iconfont icon-ic_play_circle_fill_ icon-play"></i>
                            <span className="text" onClick={this.LuckPlay}>随机播放全部</span>
                        </div>
                    </div>
                    <div className="filter"></div>
                </div>
                <div className="list" ref="box">
                    <div className="song-list-wrapper">
                        <div className="song-list"  style={{'paddingBottom':`${this.props.PlayTools.playContorl ? '60px':''}`}}>
                            <ul>
                            { 
                                this.state.tracks ?
                                this.state.itemSong.map((item)=>
                                <li className="item" key={item.id} onClick={() => this.props.playSong({self:item,allSong:this.state.itemSong})}>
                                <div className="icon">
                                    <img width="60" height="60" alt="1" src={item.album.blurPicUrl ? item.album.blurPicUrl :'data:image/png;base64,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'} alt={item.name}/>
                                    </div>
                                    <div  className="text">
                                        <h2 className="name">{item.name}</h2>
                                        <p  className="desc">{item.artists[0].name} - {item.album.name}</p>
                                    </div>
                                </li>
                            ) : <img src={spinner} style={{'width':'80px'}} className="loading"/>
                            }
                            </ul>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
    
    newArray(oldArr,callback){ //前端分页
        let arr = []
        let s =  parseInt(oldArr.length / 20)
        let n = 0
        for (let i = 1; i <= s; i++) {
            let star = (i - 1) * 20;
            arr[n++] = oldArr.slice(star, star + 20);
        }
        let y = oldArr.length - s * 20;
        if (y > 0) {
            arr[n++] = oldArr.slice(s * 20);
        }
        return callback(arr)
    }
    loding(url) {
        let self = this
        let api = new nodeApi()
        fetch(api.playlistDetail(url))
        .then(response => response.json())
        .then(data => {
            this.newArray(data.result.tracks,(val)=>{
                self.setState({
                    tracks : val,
                    itemSong:val[0]
                })
            })
            self.setState({
                result : data.result,
                bgImg:data.result.coverImgUrl
            })
            
        });
    }
    componentWillMount(){
        
    }
    componentDidMount(){
        let self = this

        $(self.refs.songList).scroll(()=>{
            let top = $(self.refs.box).offset().top
            let viewH = $(self.refs.songList).height() 
            let contentH = $(self.refs.songList).get(0).scrollHeight
            let scrollTop = $(self.refs.songList).scrollTop()
            top<=44 ? self.setState({
                scroll : true
            }) : self.setState({
                scroll : false
            })
            if(scrollTop/(contentH -viewH)>=0.95){ //到达底部100px时,加载新内容  
                let length = self.state.tracks.length - 1
                if(self.state.index<length){
                    self.setState({
                        index : ++self.state.index,
                        itemSong:self.state.itemSong.concat(self.state.tracks[self.state.index])
                    })
                }
                
            }  
        })
        let url = this.props.RecommendId
        this.loding(url)
    }
}
const mapStateToProps =(store)=>{ //去拿到store 赋值给props
    return store
}
const mapdispatchtoprops=(dispatch)=>{
    return {
        RecommendClosed () {
            dispatch({ type: 'RECOMMEND_CLOSED'})
        },
        playSong(SongArr){
            dispatch({ type: 'PLAY_SONG',SongArr})
        }
    }
}
export default connect(mapStateToProps,mapdispatchtoprops)(HighqualityDetail)