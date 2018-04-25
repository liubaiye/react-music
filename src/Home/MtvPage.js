import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import nodeApi from '../fetch/fetch'; //封装node 请求
import spinner from '../common/img/index.gooey-ring-spinner.svg';
import bar from '../common/img/index.bar-chart-preloader.svg';
import lamp from '../common/img/index.messenger-typing-preloader.svg';
class MtvPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mtvList: null,
            mtvSrc:null,
            sameMtv:null
        };
  
    }
    loding() {
        let self = this
        let api = new nodeApi()
        let id = this.props.mvDetail.id
        fetch(api.mvDetail(id)) //获取歌曲
            .then(response => response.json())
            .then(data => {
                self.setState({mtvList: data.data},()=>{
                    let url = self.state.mtvList.brs[720]
                    self.playMtv(url)
                })
            }).then(()=>{
                let mtvId = this.state.mtvList.id
                fetch(api.simiMV(mtvId)).then(response => response.json())
                .then(data => {

                    self.setState({sameMtv: data})
                }) 
                }
            )

    }
    playMtv(url) {
        let self = this
        let api = new nodeApi()
        self.setState({
            mtvSrc:api.playMTV(url)
        })
        
    }
    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }
    componentWillReceiveProps(nextProps) {
        let self = this
        if (self.state.mtvList.id !== nextProps.mvDetail.id) { //判断是否切换了歌曲
            let newSet = nextProps.mvDetail
            self.setState({
                mtvList: newSet,
            }, () => {
                self.loding()
                $(self.refs.mtvPage).scrollTop(0)
            })
        }
    }
    componentDidMount() {
        let self = this
        this.loding()
    }
    render() {
        return (
            <div className="mtv-page" ref="mtvPage">
                <div className="quality">
                    <div className="back" onClick={this.props.RecommendClosed}>
                        <i className="icon-back"></i>
                    </div>
                    <h1 className="title">{this.props.mvDetail.name}</h1>
                </div>
                <div className="video-box">
                    <video
                        controls="controls"
                        src={this.state.mtvSrc} poster={this.state.mtvList?this.state.mtvList.cover:lamp}></video>
                    <div className="video-info-box">
                        {
                            this.state.mtvList ? 
                            <setion>
                                <p className="info-title">{this.state.mtvList.artistName}</p>
                                <p className="briefDesc">{this.state.mtvList.briefDesc}</p>
                                <div className="describe">
                                    <p>
                                        {this.state.mtvList.desc}
                                    </p>
                                </div>
                            </setion> : <img src={bar} style={{'width':'80px'}} className="loading"/>
                            
                        }
                        
                    </div>
                </div>
                <div className="like-disi" style={{'paddingBottom':`${this.props.PlayTools.playContorl ? '60px':''}`}}>
                    <h3 className="titles">相似MV推荐</h3>
                        <ul  className="disi-list">
                        {
                            this.state.sameMtv?this.state.sameMtv.mvs.map((item,index)=>
                                <li className="item" key={index} onClick={()=>this.props.MtvOpen(item)}>
                                    <div className="icon">
                                        <img alt={item.name} src={item.cover} width="110" height="80"/>
                                    </div>
                                    <div className="text">
                                        <h2 className="name ellipsis-1">{item.name}</h2>
                                        <p className="desc ellipsis-2">
                                            {item.briefDesc ? item.briefDesc:item.artistName}
                                        </p>
                                    </div>
                                </li>
                            ):<img src={spinner} style={{'width':'80px'}} className="loading"/>
                        }
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
        RecommendClosed() {
            dispatch({type: 'RECOMMEND_CLOSED'})
        },
        MtvOpen(msg) {
            dispatch({type: 'MTV_RELOAD',msg})
        }
    }
}
export default connect(mapStateToProps, mapdispatchtoprops)(MtvPage)