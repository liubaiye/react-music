import React from 'react';
import {connect} from 'react-redux';
import nodeApi from '../fetch/fetch'; //封装node 请求
import LazyLoad from 'react-lazyload';
import spinner from '../common/img/index.gooey-ring-spinner.svg';
import bar from '../common/img/index.bar-chart-preloader.svg';
import lamp from '../common/img/index.messenger-typing-preloader.svg';
class SingerList extends React.Component {
    constructor(props, context) {
        super(props, context),
        this.state = {
            artists:[]
        }
    }
    loading(){
        let self = this
        let api = new nodeApi()
        fetch(api.artists())//获取歌曲
            .then(response => response.json())
            .then(data => {
                self.setState({
                    artists:data.artists                    
                })
        })
    }
    componentDidMount(){
        this.loading()
    }
    render() {
        return (
            <div className="singer">
                <div className="listview">
                    <ul>
                        <li className="list-group">
                            <h2 className="list-group-title">热门</h2>
                            <ul>
                                {
                                     this.state.artists.length>0?this.state.artists.map((item,index)=>
                                    <li className="list-group-item" key={index} onClick={()=>this.props.openRankList(item)}>
                                        <LazyLoad once placeholder={<img alt="1" style={{'width':'50px','height':'50px'}} src={spinner}/>}>
                                        <img
                                            className="avatar"
                                            alt={item.name}
                                            src={item.img1v1Url}/>
                                        </LazyLoad>
                                       
                                        <span className="name">{item.name}</span>
                                    </li>
                                    ):<img src={spinner} style={{'width':'80px'}} className="loading"/>
                                }
                            </ul>
                        </li>
                    </ul>
                   
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
        openRankList: (msg) => {
            dispatch({type: 'OPEN_RANK_LIST', msg})
        }
    }
}
export default connect(mapStateToProps, mapdispatchtoprops)(SingerList)