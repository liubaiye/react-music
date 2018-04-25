import React from 'react';
import {Button, Icon} from 'antd';
import {PullToRefresh, Toast} from 'antd-mobile';
import FontAwesome from 'react-fontawesome';
import nodeApi from '../fetch/fetch'; //封装node 请求
import $ from 'jquery';
import LazyLoad from 'react-lazyload';
import imgURL from '../common/img/13.png';
import Loding from '../playTools/loding';
import {connect} from 'react-redux';
import spinner from '../common/img/index.gooey-ring-spinner.svg';
class RankList extends React.Component {
    constructor(props, context) {
        super(props, context),
        this.state = {
            bgImg: imgURL,
            scroll:false,
            listData:[],
            result:null,
            tracks:null,
            itemSong:[],
            index:0,
            artists:null
        }
        this.LuckPlay = this.LuckPlay.bind(this); 
    }
    rankIco(index){
        switch (index){
            case 0:
            return `<span className ="icon icon0"></span>`;
            case 1 :
            return `<span className ="icon icon1"></span>`;
            case 2:
            return `<span className ="icon icon2"></span>`;
            default:
            return `<span className="text">${index+1}</span>`;
        }
    }
    rankView(){
        return this
        .props
        .RankList
        .tracks
        .map((item,index) => 
        <li className ="item" key = {item.id} onClick = {() => this.props.playSong({self: item, allSong: this.props.RankList.tracks})}>
            <div className ="rank">
                {
                    index<3 ? <span className ={`icon icon${index}`}></span> :  <span className ={`text`}>{index+1}</span>
                }
            </div>
            <div className ="content">
                <h2 className ="name">{item.name}</h2>
                <p className ="desc">{item.ar[0].name} - {item.al.name} </p>
            </div>
        </li> )
    }
    singerView(){
        let dom = this.state.artists ? this.state.artists.hotSongs.map((item,index) => 
        <li className ="item" key = {item.id} onClick = {() => this.props.playSong({self: item, allSong: this.state.artists.hotSongs})}>
            <div className ="content">
                <h2 className ="name">{item.name}</h2>
                <p className ="desc">{item.ar[0].name} {item.ar[1] ? item.ar[1].name:''} - {item.al.name} </p>
            </div>
        </li> ):''
        return dom
    }
    LuckPlay(){
        let self =this
        let leg =  self.props.RankList.tracks? self.props.RankList.tracks.length :self.state.artists.hotSongs.length
        let num =  Math.floor(Math.random()*leg)
        console.log(num)
        let obj 
        self.props.RankList.tracks ? obj={
            self:self.props.RankList.tracks[num],
            allSong:self.props.RankList.tracks
        } : obj={
            self:this.state.artists.hotSongs[num],
            allSong:this.state.artists.hotSongs
        }
        self.props.playSong(obj)
    }
    coverImgUrl(){
        if(this.props.RankList.tracks){
            return this.props.RankList.coverImgUrl
        }else{
            return this.props.RankList.picUrl
        }
    }
    componentWillMount(){
        let singerID= this.props.RankList.id
        this.loading(singerID)
    }
    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }
    loading(id){
        let self = this
        let api = new nodeApi()
            fetch(api.artistsSong(id)) //获取歌曲
            .then(response => response.json())
            .then(data => {
                self.setState({
                    artists:data
                })
           
            })
    }
  
    componentDidMount() {
        let self = this
     
        $(self.refs.songList).scroll(() => {
            let top = $(self.refs.box)
                .offset()
                .top
            let viewH = $(self.refs.songList).height()
            let contentH = $(self.refs.songList)
                .get(0)
                .scrollHeight
            let scrollTop = $(self.refs.songList).scrollTop()
            top <= 44
                ? self.setState({scroll: true})
                : self.setState({scroll: false})

        })

    }
    

    render() {
        return (
            <div className='rank-list' ref="songList">
                <div className="quality">
                    <div className="back" onClick={this.props.RecommendClosed}>
                        <i className="icon-back"></i>
                    </div>
                    <h1 className="title">{this.props.RankList.name}</h1>
                </div>
                <div
                    className={`bg-image ${this.state.scroll
                    ? 'active'
                    : ''}`}
                    style={{
                    backgroundImage: 'url(' + this.coverImgUrl() + ')'
                }}>
                    <div className="play-wrapper">
                        <div className="play">
                            <i className="iconfont icon-ic_play_circle_fill_ icon-play"></i>
                            <span className="text"  onClick={this.LuckPlay}>随机播放全部</span>
                        </div>
                    </div>
                    <div className="filter"></div>
                </div>
                <div className="list" ref="box">
                    <div className="song-list-wrapper">
                        <div
                            className="song-list"
                            style={{
                            'paddingBottom': `${this.props.PlayTools.playContorl
                                ? '60px'
                                : ''}`
                        }}>
                       <ul>
                            {this.props.RankList.tracks ? this.rankView() : this.singerView()}
                        </ul>
                           
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
const mapStateToProps = (store) => { //去拿到store 赋值给props
    return store
}
const mapdispatchtoprops = (dispatch) => {
    return {
        RecommendClosed() {
            dispatch({type: 'RECOMMEND_CLOSED'})
        },
        playSong(SongArr) {
            dispatch({type: 'PLAY_SONG', SongArr})
        }
    }
}
export default connect(mapStateToProps, mapdispatchtoprops)(RankList)