import React, {useEffect, useReducer} from 'react';
import {globalState, init, reducer} from './src/state/context';

import BookNavi from './src';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useMapConfig} from './src/hooks';

const BookNaviReactNative = ({
    mapConfig,
    location = {
        column: 1,
        layer: 1,
        shelfNum: 1, //书籍所在书架号
        direct: 'A',
    },
    curShelfNum = 0,
    containerStyle = {
        width: 800,
        height: 800,
        backgroundColor: '#f2f2f2',
    },
    mapShow,
}) => {
    let receiveProps = {
        mapConfig,
        location,
        curShelfNum,
        containerStyle,
    };
    const [state, dispatch] = useReducer(reducer, receiveProps, init);
    useEffect(() => {
        if (mapShow) {
            dispatch({
                type: 'SHOW_MAP',
            });
        } else {
            dispatch({
                type: 'SHOW_LAYER',
            });
        }
    }, [mapShow]);
    useEffect(() => {
        dispatch({type: 'SET_LOCATION', location: location});
    }, [location]);
    return (
        <GestureHandlerRootView>
            <globalState.Provider value={{state, dispatch}}>
                <BookNavi />
            </globalState.Provider>
        </GestureHandlerRootView>
    );
};

export {BookNaviReactNative, useMapConfig};
