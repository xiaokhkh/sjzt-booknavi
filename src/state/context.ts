import { BookshelfCubeSchema, BookshelfType, MapConfig } from '../Schema';
import React, { ReactPropTypes } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface InitState {
    curShelfNum?:number,
    containerStyle?:{
        width:number,
        height:number,
        backgroundColor:string,
    },
    ModuleSize?:{
        width:number,
        height:number,
    },
    active?:{
        bsType:BookshelfType,
        column:number,
    }
    mapConfig?:MapConfig,
    mapShow?:boolean,
}
let initState:InitState = {}
const reducer = (state, action) => {
    switch (action.type) {
        case 'SWITCH':
            const showSwitch = action;
            return {...state, showSwitch}
        case 'SHOW_MAP':
            return { ...state, mapShow: true, btnText: '去书架正面' };
        case 'SET_ACTIVE':
            return {...state, active:action.active}
        case 'SHOW_LAYER':
            return { ...state, mapShow: false, btnText: '去场景地图' };
        case 'SET_LOCATION':
            return { ...state, bookLocation: action.location };
        case 'SET_CURSHELFNUM':
            return { ...state, curShelfNum: action.curShelfNum };
        default:
            return state;
    }
};
const globalState = React.createContext({state:initState, dispatch:null});

export {globalState, reducer, initState}