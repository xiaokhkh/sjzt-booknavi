// import {BookshelfType, SideModuleSchema, SideModuleType} from '../components/Schema';

import {useContext, useMemo} from 'react';

import {globalState} from '../state/context';

/**
* 检测当前尺寸是否超出容器尺寸，如果超出返回scale值
*/
export function useCheckOverSize (curWidth:number, curHeight:number, delay:number) {
    const {
        state:{
            containerStyle:{
                width:containerWidth,
                height:containerHeight,
            }
        }
    } = useContext(globalState)
    return useMemo(()=>{
        let scale = 1;
        if(curWidth > containerWidth){
            scale = (containerWidth - delay) / curWidth
        }
        if(curHeight > containerHeight){
            let tempScale = (containerHeight - delay) / curHeight
            scale = (scale !== 1 && tempScale < scale)? tempScale:scale;
        }
        return scale;
    }, [containerWidth, containerHeight, curWidth, curHeight]);

}