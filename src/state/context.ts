import {
    BookLocationSchema,
    BookshelfType,
    MapConfig,
} from '../types/Schema';

import React from 'react';

interface InitState {
    ModuleSize: {
        width: number;
        height: number;
    };
    active: {
        bsType: BookshelfType;
        column: number;
    };
    curShelfNum?: number;
    containerStyle?: {
        width: number;
        height: number;
        backgroundColor: string;
    };
    mapShow: boolean;
    mapConfig?: MapConfig;
    location?: BookLocationSchema;
}
let initState: InitState = {
    ModuleSize: {
        width: 180,
        height: 60,
    },
    active: {
        bsType: BookshelfType.Six,
        column: 4,
    },
    mapShow: true,
};
const reducer = (state: InitState, action) => {
    switch (action.type) {
        case 'SHOW_MAP':
            return {...state, mapShow: true, btnText: '去场景地图'};
        case 'SHOW_LAYER':
            return {...state, mapShow: false, btnText: '去书架正面'};
        case 'SET_MAPCONFIG':
            return {...state, mapConfig: action.mapConfig};
        case 'SET_ACTIVE':
            return {...state, active: action.active};
        case 'SET_LOCATION':
            return {...state, location: action.location};
        case 'SET_CURSHELFNUM':
            return {...state, curShelfNum: action.curShelfNum};
        default:
            return state;
    }
};
const globalState = React.createContext({state: initState, dispatch: null});
function init(receiveState) {
    return {
        ...Object.assign(initState, receiveState),
    };
}
export {globalState, reducer, init, initState};
