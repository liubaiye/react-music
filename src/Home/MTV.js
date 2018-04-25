import React from 'react';
import {connect} from 'react-redux';
import {Flex} from 'antd-mobile';
import spinner from '../common/img/index.gooey-ring-spinner.svg';
import LazyLoad from 'react-lazyload';
import nodeApi from '../fetch/fetch'; //封装node 请求
class MTV extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mtvList: []
        };
        // this.deletHistory = this.deletHistory.bind(this); this.addHistory =
        // this.addHistory.bind(this); this.deletHistoryAll =
        // this.deletHistoryAll.bind(this);
    }
    loding() {
        let self = this
        let api = new nodeApi()
        var arr = []
        for (var i = 0; i <= 23; i++) {
            fetch(api.mv()) //获取歌曲
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        mtvList : data.data
                    })
                })
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
            <div className="mtv">
                <div className="videobox">
                    {
                        this.state.mtvList.length>0 ?this.state.mtvList.map((item,index)=>
                            <div className="item" key={index} onClick={()=>this.props.openMvDerail(item)}>
                                
                                    <LazyLoad once placeholder={<img alt="1" src={spinner}/>}>
                                        <img  src={item.cover} alt={item.name}/>
                                    </LazyLoad>
                                <div className="video-tbox">
                                    <span className="video-title ellipsis-2">{item.name}</span>
                                    <p className="video-name ellipsis-1">{item.artistName}</p>
                                </div>
                            </div>
                        ):<img src={spinner} style={{'width':'80px'}} className="loading"/>
                    }
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
        openMvDerail: (msg) => {
            dispatch({type: 'OPEN_MV_DETAIL', msg})
        }
    }
}
export default connect(mapStateToProps, mapdispatchtoprops)(MTV)