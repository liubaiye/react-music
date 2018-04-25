import React from 'react';
import {connect} from 'react-redux';
import nodeApi from '../fetch/fetch'; //封装node 请求
import LazyLoad from 'react-lazyload';
import spinner from '../common/img/index.gooey-ring-spinner.svg';
class NewSong extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rank: [],
        };
        // this.deletHistory = this.deletHistory.bind(this); this.addHistory =
        // this.addHistory.bind(this); this.deletHistoryAll =
        // this.deletHistoryAll.bind(this);
    }
    loding() {
        let self = this
        let api = new nodeApi()
        var arr = []
        for(var i=0;i<=23;i++){
            fetch(api.rank(i)) //获取歌曲
            .then(response => response.json())
            .then(data => {
                let rankObj = {
                    id:data.playlist.id,
                    name:data.playlist.name,
                    coverImgUrl:data.playlist.coverImgUrl,
                    tracks:data.playlist.tracks
                }
                arr.push(rankObj)
            }).then(
                ()=>{
                    self.setState({
                        rank:arr
                    })
                }
            )
        }

    }
    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }
    componentDidMount() {
        this.loding()
    }
    render() {
        return (
            <div className="new-song">
                <div className="rank">
                    <div className="toplist">
                        <ul>
                            {
                              this.state.rank.length>1 ?  
                              this.state.rank.map((item,index)=>
                                <li className="item" key={index} onClick={()=>this.props.openRankList(item)}>
                                        <div className="icon">
                                        <LazyLoad once placeholder={<img alt="1" src={spinner}/>}>
                                        <img   width="100"
                                                height="100" src={item.coverImgUrl} alt={item.name}/>
                                        </LazyLoad>
                                            
                                        </div>
                                        <ul className="songlist">
                                            {
                                                item.tracks.map((i,indexs)=>{
                                                    if(indexs<3){
                                                        return  <li className="song" key={indexs}>
                                                        <span>{indexs+1}</span>
                                                        <span>{i.name}—{i.ar[0].name}</span>
                                                        </li>
                                                    }
                                                }
                                               )
                                            }
                                        </ul>
                                </li>
                               ):<img src={spinner} style={{'width':'80px'}} className="loading"/>
                            }
                        </ul>
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
        togglePlayer: (msg) => {
            dispatch({type: 'TOGGLE_PLAYER', msg})
        },
        openRankList: (msg) => {
            dispatch({type: 'OPEN_RANK_LIST', msg})
        }
    }
}
export default connect(mapStateToProps, mapdispatchtoprops)(NewSong)