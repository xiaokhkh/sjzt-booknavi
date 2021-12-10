import React, {useReducer} from 'react';
import {globalState, initState, reducer} from './src/state/context';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { mapConfig } from './src/components/ModuleConfig';

const BookNaviContainer = ({
    libraryCode,
    curShelfNum, 
    containerStyle,
    children,
}) => {
    //根据libraryCode去请求地图配置


    Object.assign(initState, {
        curShelfNum,
        containerStyle,
        ModuleSize:{
            width:180,
            height:61
        },
        mapConfig
    })
    const [state, dispatch] = useReducer(reducer, initState);
    return (
        <GestureHandlerRootView>
            <globalState.Provider value={{state, dispatch}}>
                {children}
            </globalState.Provider>
        </GestureHandlerRootView>
    );
};

export {BookNaviContainer};
