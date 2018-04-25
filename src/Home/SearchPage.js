import React from 'react';
import {connect} from 'react-redux';
import {SearchBar, Button, PullToRefresh} from 'antd-mobile';
import nodeApi from '../fetch/fetch'; //封装node 请求
import $ from 'jquery'
const hotWords = [
    '张震岳',
    '李宗盛',
    'The Fly',
    '病变',
    '说散就散',
    '空空如也',
    '李荣浩',
    'Cosmo Sheldrake',
    'Sia',
    '等你下课'
]
class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            down: true,
            searchVal: '',
            searchSong: null,
            historySearch:[]
        };
        this.deletHistory = this.deletHistory.bind(this);
        this.addHistory = this.addHistory.bind(this);
        this.deletHistoryAll = this.deletHistoryAll.bind(this);
    }
    Search(val) {
        let self = this
        this.setState({
            searchVal: val
        }, () => {
            let keyWords = self.state.searchVal // 获取当前的id
            let api = new nodeApi()
            fetch(api.search(keyWords)) //获取歌曲
                .then(response => response.json())
                .then(data => {
                    if (data.code == 200) {
                     
                        self.setState({
                            searchSong: null
                        }, () => self.setState(
                            {
                                searchSong: data.result.songs
                            }
                        ))
                   
                    } else {
                        console.log('400')
                    }
                })
                .catch(function (e) {
                    console.log('erro');
                });
        })
    }
    onClear() {
        this.setState({searchVal: null})
    }
    hotWords(val) {
        let self = this
        self.setState({
            searchVal: val
        }, () => {
            self.Search(self.state.searchVal)
            self.manualFocusInst.focus();})
    }
    addHistory(obj){
        let self = this
        let newHistorySearch = self.state.historySearch
        newHistorySearch.push(obj.self.name)
        let arr = newHistorySearch
     
        self.setState({
            historySearch:arr
        })
  
        self.props.chicoSearch(obj)
    }
    deletHistory(e,item){
      
        let self = this 
        let filter = self.state.historySearch.filter((items)=> items != item)
        this.setState({
            historySearch:filter
        })
        e.stopPropagation();
    }
    deletHistoryAll(){
        this.setState({
            historySearch:()=>this.state.historySearch.length = 0
        })
    }
    componentDidMount() {
        let self = this
    }
    render() {
        return (
            <div className="SearchPage search">
                <div
                    className="header"
                    style={{
                    'display': 'block'
                }}>
                    <div className="search">
                        <i className="icon-back"style={{
                            'fontSize': '19px'
                        }} onClick={() => {
                            this.props.breakHome()
                        }}></i>
                    </div>
                    <div className="title">
                        <div className="icon"></div>
                        <span className="m-text">{this.props.name}</span>
                    </div>
                    <div className="mine">
                        <i className="icon-mine" ></i>
                    </div>
                </div>
                <div className="search-box-wrapper">
                    <SearchBar
                        onClear={this
                        .onClear
                        .bind(this)}
                        placeholder="输入歌曲歌手进行查询"
                        onChange={this
                        .Search
                        .bind(this)}
                        value={this.state.searchVal}  ref={ref => this.manualFocusInst = ref}/>
                </div>
                {!this.state.searchVal
                    ? <div className="shortcut-wrapper">
                            <div className="shortcut">
                                <div>
                                    <div
                                        className="hot-key"
                                        style={{
                                        'pointerEvents': 'auto'
                                    }}>
                                        <h1 className="title">热门搜索</h1>
                                        <ul ref="hotWords">
                                            {hotWords.map((item, index) => <li
                                                    className="item"
                                                    key={index}
                                                    onClick={this
                                                    .hotWords
                                                    .bind(this, item)}>
                                                    <span>{item}</span>
                                                </li>)
                                            }
                                        </ul>
                                    </div>
                                    {
                                        this.state.historySearch.length>0 ? <div
                                        className="search-history"
                                        style={{
                                        'pointerEvents': 'auto'
                                    }}>
                                        <h1 className="title">
                                            <span className="text">搜索历史</span>
                                            <span className="clear" onClick={()=>this.deletHistoryAll()}>
                                                <i className="icon-clear" ></i>
                                            </span>
                                        </h1>
                                        <div className="search-list">
                                            <ul >
                                                {
                                                  this.state.historySearch.map((item,index)=>
                                                    <li className="search-item" key={index} onClick={this
                                                        .hotWords
                                                        .bind(this, item)}>
                                                        <span className="text">{item}</span>
                                                        <span className="icon" onClick={(e)=>this
                                                        .deletHistory(e,item)}>
                                                            <i className="icon-delete"></i>
                                                        </span>
                                                    </li>
                                                  )
                                                }
                                            </ul>
                                        </div>
                                    </div>:''
                                    }
                                </div>
                            </div>
                        </div>
                    : <div className="search-result" style={{'paddingBottom':`${this.props.PlayTools.playContorl ? '60px':''}`}}>
                        <div className="suggest">
                            <ul className="suggest-list">

                                {this.state.searchSong
                                    ? this
                                        .state
                                        .searchSong
                                        .map((item, index) => <li
                                            className="suggest-item"
                                            key={index}
                                            style={{
                                            'pointerEvents': 'auto'
                                        }} onClick={()=>
                                            this.addHistory({
                                                self:item,
                                                all:this
                                                .state
                                                .searchSong
                                            })
                                            }>
                                            <div className="icon">
                                                <i className="icon-music"></i>
                                            </div>
                                            <div className="name">
                                                <p className="text">{item.name}-{item.artists[0].name}</p>
                                            </div>
                                        </li>)
                                    : ''
                                }
                            </ul>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (store) => { //去拿到store 赋值给props
    return store
}
const mapdispatchtoprops = (dispatch) => {
    return {
        breakHome: () => {
            dispatch({type: 'BREAK_HOME'})
        },
        chicoSearch:(msg)=>{
            
            dispatch({type: 'CHICO_SEARCH',msg})
        }
    }
}
export default connect(mapStateToProps, mapdispatchtoprops)(SearchPage)