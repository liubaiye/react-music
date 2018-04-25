import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './redux/index';
import {createStore} from 'redux'
import {Provider} from 'react-redux';
let stores = createStore(store)
ReactDOM.render(
    <div>
    <Provider store={stores} key="provider">
        <App/>
    </Provider>
</div>
, document.getElementById('root'));
registerServiceWorker();
