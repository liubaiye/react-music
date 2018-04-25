import React from 'react'
import {Carousel,Slider,Progress} from 'antd-mobile'
import Hammer from 'react-hammerjs'
import nodeApi from '../fetch/fetch'; //封装node 请求
import $ from 'jquery'
import {connect} from 'react-redux';

const computed=(arr,index,currentTimes)=>{ // 歌词滚动，mmp终于撸出来了。多思考
        let thisTime = arr[index].time
        let nextTime = (index+1)<arr.length ? arr[index+1].time : thisTime
        if(thisTime<=currentTimes&&nextTime>currentTimes){ //不想花时间了，这里最后一行歌词就是不能高亮，也不要问为什么，逻辑思维不行就是不行
           return true
        }else{
            return false
        }
}

class PlayTools extends React.Component { //播放器
    constructor(props, context) {
        super(props, context),
        this.state = {
            loop:false,//是否为单曲循环，默认是歌单循环
            transY:0,
            lrcState: true,
            width: 0,
            audioUrl: null,
            PlayTools: this.props.PlayTools,
            NormalOrMin:this.props.NormalOrMin,
            toNowSong:this.props.nowPlay,
            lyric:[],
            currentTimes:null,
            rangeVal:null,
            songDetails:null,
            albumName:null,
            artistsName:null

        }
    }
    transY =()=>{//歌词滚动
        let arr =this.refs.pureMusic&&this.refs.pureMusic.firstChild.children.length>1 ? this.refs.pureMusic.firstChild.children :null
        let line = 32
        let self = this
        if(arr){
            for(let i = 0;i<arr.length;i++){
                if(i>4&&$(arr[i]).hasClass('current')&&i<arr.length-4){
                    let hasText = arr[i].innerText == ''
                        let tops = (i-4)*line
                        self.setState({
                            transY:tops
                        })
                     break
                }
            }
            
        }
    }
    componentWillReceiveProps(nextProps) {
        let self = this
        if (self.state.toNowSong.id !== nextProps.nowPlay.id) { //判断是否切换了歌曲
            let newSet = nextProps.PlayTools
            let NormalOrMins = nextProps.NormalOrMin
            self.setState({
                PlayTools: Object.assign({}, newSet),
                NormalOrMin:true,
                toNowSong:nextProps.nowPlay
            }, () => {
                self.loding()
                self.setState({
                    transY:0
                })
            })
        }
    }
    seek(){//音频文件转换 格式 XX : XX
        let n = 60
        let duration = this.state.toNowSong.duration ? this.state.toNowSong.duration : this.state.toNowSong.dt
        let current = duration/1000
        let minNum = parseInt(current/n)
        let float =(current/n-minNum)*n
        let min = parseInt(float) === 0 ? `${minNum}:0${parseInt(float)}` : `${minNum}:${parseInt(float)}`
        return min
    }
    progress(){
        let duration = this.state.toNowSong.duration ? this.state.toNowSong.duration : this.state.toNowSong.dt
        let current = duration/1000
        let point = (this.state.currentTimes/ current)*100
        return point
    }
    duration(){//播放条控制
        if(this.state.toNowSong){
            let currentTimes = this.state.currentTimes
            let n = 60
            let minNum = parseInt(currentTimes/n)
            let float =(currentTimes/n-minNum)*n
     
            let min = ()=>{
                if(currentTimes<=59){
                    if(Math.round(currentTimes)<10){
                        return `0:0${Math.round(currentTimes)}`
                    }else{
                        return `0:${Math.round(currentTimes)}`
                    }
                   
                }else{
                    if(parseInt(float)<10){
                        return `${minNum}:0${parseInt(float)}`
                    }else{
                        return `${minNum}:${parseInt(float)}`
                    }
                    
                }
            }       
            return {
                max : this.state.toNowSong.duration ? this.state.toNowSong.duration/1000:this.state.toNowSong.dt/1000,
                value :currentTimes,
                now:min()
            }
        }
    }
    songDetail(){//获取歌曲详情
        let self = this
        let id = self.state.toNowSong.id // 获取当前的id
        let api = new nodeApi()
        fetch(api.songDetail(id))//获取歌曲
            .then(response => response.json())
            .then(data => {
                self.setState({
                    songDetails:data.songs[0]
                })
        })
    }
    playerBtn(e) { //播放按钮
        this.setState({
            PlayTools: Object.assign({}, this.state.PlayTools, {
                playState: !this.state.PlayTools.playState
            })
        }, () => { //细节，state 更新后状态不会马上获取到，需要在回调里面使用
            this.state.PlayTools.playState
                ? this
                    .refs
                    .audio
                    .play()
                : this
                    .refs
                    .audio
                    .pause();
        })
        e.stopPropagation()
    }
    handleSwipe(val) {
        let arro = val.deltaX //判断左滑右滑
        let self = this
        let width = $(this.refs.middle).width()
        if (arro > 0) {
            self.setState({lrcState: true, width: 0})
        } else {
            self.setState({lrcState: false, width: width})
        }
    }
    blurPicUrl(val){ //歌曲封面
        if(this.state.toNowSong.album&&this.state.toNowSong.album.blurPicUrl&&this.state.toNowSong.album.picId){
            return this.state.toNowSong.album.blurPicUrl
        }else if(this.state.songDetails){
            return this.state.songDetails.al.picUrl
        }else{
            return 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'
        }
    }
    audioPlaying(){//监听歌曲播放事件
        let self = this
        self.refs.audio.addEventListener('timeupdate',function(){
            self.setState({
                currentTimes:self.refs.audio.currentTime
            })
            self.transY()
        })
        self.refs.audio.addEventListener('ended',function(){
            let loop = self.state.loop
            self.refs.audio.pause()
            self.setState({
                currentTimes:null,
                rangeVal:null
            })
            if(loop){
                self.refs.audio.loop = true
                self.refs.audio.play()
                self.refs.audio.currentTime = 0
            }else{
                self.nextSong(2)
            }
        })
        
    }
   
    loding() { //数据加载
        let self = this
        let id = self.state.toNowSong.id // 获取当前的id
        let api = new nodeApi()
        self.setState({
            transY:0,
            lyric:[]
        })
        self.songDetail()
        self.songMessage()
        fetch(api.songUrl(id))//获取歌曲
            .then(response => response.json())
            .then(data => {
                let audio = data.data[0].url
                self.setState({
                    audioUrl: audio
                })
                self.refs.audio.play()
        })
        fetch(api.lyric(id))//获取歌词
            .then(response => response.json())
            .then(data => {
                if(data.lrc){
                    let lyricArr = data.lrc.lyric.split("[0"); 
                    let arr = []
                    for(let i = 1;i<lyricArr.length;i++){
                        let lettle = lyricArr[i].split("]");
                        if(lettle[1].length<=1) continue
                        let times = lettle[0].split(':')
                        let newtime = times[0]*60+parseFloat(times[1])
                        arr.push({
                            time:newtime,
                            lyr:lettle[1]
                        })
                    }
                    self.setState({lyric: arr})
                  
                }else{
                    return false
                }
                
            });
           
           
    }

    log(val){//播放条滚动，这个慎拖，有bug。我也不知道怎么优化
        this.refs.audio.currentTime = val
        this.setState({
            rangeVal : val,
            currentTime : this.state.rangeVal
        })
    }
    nextSong(type){ //播放下一首、或者上一首
        let songList = this.state.PlayTools.song.all
        let nowId=this.state.toNowSong.id
        let nextSong = null
        let self = this
        for(let i =0;i<songList.length;i++){
            if(songList[i].id === nowId){
                if(type===2){
                    nextSong = i ==(songList.length-1) ? songList[0]: songList[i+1]//下一首
                }else{
                    nextSong = i == 0 ? songList[songList.length-1]: songList[i-1]//上一首
                }
                self.setState({
                    toNowSong :nextSong,
                    transY:0
                }, () =>{
                    self.loding()
                    self.props.currentSong(nextSong)
                } 
               )
               break
            }
        }
    }
    loop(){//循环 有bug 后期修复如果修复好的话你就看不到这个注释了
        this.setState({
            loop:!this.state.loop
        },()=>this.audioPlaying())
    }
    songMessage(){//歌曲信息，数据接口比较坑爹俩种格式的数据，不得已只能做判断了
        let self =this
        if(this.state.toNowSong.album){
            this.setState({
                albumName:self.state.toNowSong.album.name,
                artistsName:self.state.toNowSong.artists[0].name
            })
        }else{
           
            this.setState({
                albumName:self.state.toNowSong.al.name,
                artistsName:self.state.toNowSong.ar[0].name
            })
        }
    }
    render() {
        return (
            <div className="player" ref="middle">
                <audio ref="audio" src={this.state.audioUrl}></audio>
                <div
                    className={`normal-player ${this.props.NormalOrMin
                    ? 'active'
                    : ''}`}>
                    <div className="background">
                        <img
                            width="100%"
                            height="100%"
                            src={this.blurPicUrl()}
                            alt="1"/>
                    </div>
                    <div className="top">
                        <div className="back">
                            <i
                                className="icon-back"
                                onClick={()=>this.props.
                                    togglePlayer('hide')
                                    }></i>
                        </div>
                        <h1 className="title">{this.state.toNowSong.name}</h1>
                        <h2 className="subtitle">{this.state.albumName}—{this.state.artistsName}</h2>
                    </div>
                        <div className="middle">
                        <Hammer onSwipe={this
                        .handleSwipe
                        .bind(this)}>
                            <div
                                className="middle-l"
                                style={{
                                opacity: this.state.lrcState
                                    ? '1'
                                    : '0',
                                transitionDuration: '300ms'
                            }}>
                                <div className="cd-wrapper" key='0'>
                                    <div className="cd">
                                        <img className={`image ${this.state.PlayTools.playState
                                        ? 'play' : ''}`} src={this.blurPicUrl()} alt="1"/>
                                    </div>
                                    <div className="playing-lyric-wrapper">
                                        <div className="playing-lyric">{this.state.lyric.length<1?<p>此歌曲为没有填词的纯音乐，请您欣赏</p> : 
                                        this.state.lyric.map((item,index)=><p className={`text ${computed(this.state.lyric,index,this.state.currentTimes)
                                        ? 'current' : ''}`}  key={index}>{computed(this.state.lyric,index,this.state.currentTimes)
                                            ?item.lyr:''}</p>)
                                    }</div>
                                    </div>
                                </div>
                            </div>
                            </Hammer >
                            <div
                                className="middle-r"
                                style={{
                                'transform': this.state.lrcState
                                    ? 'translate3d(0px, 0px, 0px)'
                                    : `translate3d(-${this.state.width}px, 0px, 0px)`,
                                'transitionDuration': '300ms'
                            }}>
                             
                            
                                <div className="lyric-wrapper" ref="pureMusic">
                                <Hammer onSwipe={this
                        .handleSwipe
                        .bind(this)}>
                                    <div
                                        className="pure-music"
                                        style={{transform: `translate3d(0px, -${this.state.transY}px, 0px)`}} >
                                        {this.state.lyric.length<1?<p>此歌曲为没有填词的纯音乐，请您欣赏</p> : 
                                        this.state.lyric.map((item,index)=><p className={`text ${computed(this.state.lyric,index,this.state.currentTimes)
                                        ? 'current' : ''}`}  key={index}>{item.lyr}</p>)
                                    }
                                    </div>
                                    </Hammer >
                                </div>
                            
                            </div>
                         
                        </div>
                    
                    <div className="bottom">
                        <div className="dot-wrapper">
                            <span
                                className={`dot ${this.state.lrcState
                                ? 'active'
                                : ''}`}></span>
                            <span
                                className={`dot ${ !this.state.lrcState
                                ? 'active'
                                : ''}`}></span>
                        </div>
                        <div className="progress-wrapper">
                            <span className="time time-l">{this.duration().now}</span>
                            <div className="progress-bar-wrapper">
                            <Slider
                                    defaultValue={0}
                                    min={0}
                                    step={0.1}
                                    value={this.duration().value}
                                    max={this.duration().max}
                                    onChange={this.log.bind(this)}
                                    
                                />
                            </div>
                            <span className="time time-r">{this.seek()}</span>
                        </div>
                        <div className="operators">
                            <div className="icon i-left">
                                <i className={`${this.state.loop ? 'icon-loop' : 'icon-sequence'}`} onClick={this.loop.bind(this)}></i>
                            </div>
                            <div className="icon i-left" >
                                <i className="icon-prev" onClick={this.nextSong.bind(this,1)}></i>
                            </div>
                            <div className="icon i-center">
                                <i  className={`needsclick ${this.state.PlayTools.playState ? 'icon-play' : 'icon-pause'}`}  onClick={this
                                .playerBtn
                                .bind(this)}></i>
                            </div>
                            <div className="icon i-right" >
                                <i className="icon-next" onClick={this.nextSong.bind(this,2)}></i>
                            </div>
                            <div className="icon i-right">
                                <i className="icon icon-not-favorite"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="mini-player"
                    onClick={()=>this.props.
                    togglePlayer('show')
                    }>
                    <Progress percent={this.progress()} position="normal"  appearTransition  className="Progress"/>
                    <div className="icon">
                        <img width="40" height="40" className={this.state.PlayTools.playState
                            ? 'played'
                            : 'pause'} //这里控制图片的旋转和暂停 css3
                            alt="1" src={this.blurPicUrl()} alt="1"/>
                    </div>
                    <div className="text">
                        <h2 className="name">{this.state.toNowSong.name}</h2>
                        <p className="desc">{this.state.albumName}—{this.state.artistsName}</p>
                    </div>
                    <div className="control">
                            <i
                                onClick={this
                                .playerBtn
                                .bind(this)}
                                className={`icon-mini ${this.state.PlayTools.playState
                            ? 'icon-play-mini'
                            : 'icon-pause-mini'}`}
                               ></i>
                      
                    </div>

                    <div className="control">
                        <i className="icon-playlist"></i>
                    </div>
                </div>

            </div>
        )
    }
   
    componentDidMount(){
        this.loding()
        let self = this
        self.audioPlaying()
    }
}
const mapStateToProps = (store) => { //去拿到store 赋值给props
    return store
}
const mapdispatchtoprops = (dispatch) => {
    return {
        togglePlayer:(msg)=>{
            dispatch({type: 'TOGGLE_PLAYER', msg})
        },
        currentSong:(msg)=>{
            dispatch({type: 'CURRENT_SONG', msg})
        }
    }
}
export default connect(mapStateToProps, mapdispatchtoprops)(PlayTools)
