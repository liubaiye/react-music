import React from 'react';
import {Tabs} from 'antd-mobile';
import PlayTools from '../playTools/playTools';
import NewSong from './NewSong';
import MTV from './MTV';
import MtvPage from './MtvPage';
import Recommend from './Recommend';
import SingerList from './SingerList';
import HighqualityDetail from './HighqualityDetail';
import SearchPage from './SearchPage';
import RankList from './RankList';
import FontAwesome from 'react-fontawesome';
import $ from 'jquery';
import {connect} from 'react-redux';
const TabPane = Tabs.TabPane;
const tabs = [
    {
        index:0,
        title: '推荐'
    }, {
        index:1,
        title: '榜单'
    }, {
        index:2,
        title: 'MTV'
    }, {
        index:3,
        title: '歌手'
    }
];
class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context),

        this.state = {
            page:0,
            topState: false,
            TabsList: [
                {
                    Components: Recommend
                }, {
                  
                    Components: NewSong
                }, {
                    
                    Components: MTV
                }, {
                  
                    Components: SingerList
                }
            ]
        }
    }
 
    tabClick(e,index){
        this.setState({
            page : index
        })
    }
    render() {
        return (
            <div
                className={`HomePage ${this.props.PageState === 'HomePage'
                ? ''
                : 'leave'}`}>
                <div className="header">
                    <div className="search" >
                        <i className="icon-search" onClick={()=>this.props.searchAble()}></i>
                    </div>
                    <div className="title">
                        <div className="icon"></div>
                        <span className="m-text">Little Baby</span>
                    </div>
                    <div className="mine" onClick={()=>{this.props.editerName()}}>
                        <i className="icon-mine"></i>
                    </div>
                </div>
                <div  className={`contair ${this.state.topState ? 'fixed' : ''}`} style={{'paddingBottom':`${this.props.PlayTools.playContorl ? '60px':''}`}}>
                    <Tabs 
                        tabBarUnderlineStyle={{'border':'1px #ffcd32 solid'}}
                        tabBarActiveTextColor={'#ffcd32'}
                        swipeable={false}
                        tabBarBackgroundColor={'#222'}
                        tabs={tabs}
                        initialPage={this.state.page} onTabClick={this.tabClick.bind(this)}>
                        {this
                            .state
                            .TabsList
                            .map((item, index) => 
                            index===this.state.page ? <item.Components key={index}></item.Components>:''
                           )
                        }
                    </Tabs>
                </div>
                {
                   this.props.PlayTools.playContorl ? <PlayTools></PlayTools> : ''
                }
                {this.props.PageState === 'Highquality'
                    ? <HighqualityDetail></HighqualityDetail>
                    : ''
                }
                {this.props.PageState === 'SearchPage'
                    ? <SearchPage></SearchPage>
                    : ''
                }
                {this.props.PageState === 'RankList'
                    ? <RankList></RankList>
                    : ''
                }
                {this.props.PageState === 'MtvPage'
                    ? <MtvPage></MtvPage>
                    : ''
                }
            </div>
            
        )
    }
    
    scoller() {
        var top = $(window).scrollTop()
        top > 50
            ? this.setState({topState: true})
            : this.setState({topState: false})
    }

    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }
    componentDidMount() {
        $(window).scroll(() => this.scoller())
    }
}
const mapStateToProps =(store)=>{ //去拿到store 赋值给props
    return store
}
const mapdispatchtoprops=(dispatch)=>{
    return {
        editerName: ()=>{
            dispatch({ type: 'CLICK_HEAD'})
        },
        searchAble:()=>{
            dispatch({ type: 'SEARCH_ABLE'})
        }
    }
}
 export default connect(mapStateToProps,mapdispatchtoprops)(HomePage)