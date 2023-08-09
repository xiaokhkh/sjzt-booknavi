import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {BookshelfType, SideModuleSchema, SideModuleType} from '../types/Schema';
import React, {useContext, useMemo} from 'react';

import CreateAnimate from '../Animated';
import {bookshelfConfig} from '../ModuleConfig';
import {common} from '../assets';
import {globalState} from '../state/context';

type Props = {
    item: SideModuleSchema;
    index: number;
};
const SelectLayer: ({type: SideModuleType, column: number}) => JSX.Element = ({
    type,
    column,
}) => {
    let animated = new CreateAnimate();
    const [scale, runAnimated] = animated.getScaleLoopAnimate()
    runAnimated()
    let text: string, style: object;
    if (type === SideModuleType.ACTIVESideModule) {
        text = '目标书籍';
        style = styles.active;
    } else if (type === SideModuleType.BASIC) {
        text = `${column}节1层`;
        style = styles.basic;
    }
    return (
            <View style={[styles.selectedBox]}>
                <Animated.View style={[style,{
                    transform:[{scale}]
                }]} />
                <Text style={[styles.selectedText, {opacity: 0.8}]}>
                    {text}
                </Text>
            </View>
    );
};
/** */
const Module: ({type: SideModuleType, index: number}) => JSX.Element = ({
    type,
    index,
}) => {
    const {
        state: {
            active: {bsType},
        },
    } = useContext(globalState);
    /**
     * 给定位模块用的，标示是哪列
     */
    let column = useMemo(() => {
        if (bsType === BookshelfType.Desk) {
            if(index > 5 && index < 18){
                return Math.floor(index / bookshelfConfig[bsType].layerHeight) + 2;
            }else{
                return index > 5? 5 : 1;
            }
        } else {
            return index / bookshelfConfig[bsType].layerHeight;
        }
    }, [bsType, index]);
    const selectBoxShow = useMemo(() => {
        return (
            type === SideModuleType.BASIC ||
            type === SideModuleType.ACTIVESideModule
        );
    }, [type]);
    const randomImage = useMemo(() => {
        if (type === SideModuleType.DESK) {
            return `desk`;
        }
        const randomIntegerInRange: (min: number, max: number) => number = (
            min,
            max,
        ) => Math.floor(Math.random() * (max - min + 1)) + min;
        return `NaviFront_${randomIntegerInRange(1, 6)}`;
    }, []);

    return (
        <>
            {/* <Text
                style={{
                    position: 'absolute',
                    fontSize: 24,
                    color: '#000',
                    zIndex: 99999,
                }}>
                {index}
            </Text> */}
            {selectBoxShow ? <SelectLayer type={type} column={column} /> : null}
            <Image source={common[randomImage]} />
        </>
    );
};
const SideModule: ({item, index}: Props) => JSX.Element = ({item, index}) => {
    let {
        state: {
            ModuleSize: {width, height},
        },
    } = useContext(globalState);
    if (item.type === SideModuleType.DESK) {
        width = item.width;
        height = item.height;
    }
    return (
        <View style={{width, height}}>
            <Module type={item.type} index={index} />
        </View>
    );
};
const styles = StyleSheet.create({
    selectedBox: {
        width: 170,
        height: 56,
        position: 'absolute',
        top: 5,
        left: 5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:999,
    },
    active: {
        position: 'absolute',
        zIndex: 1,
        width: 170,
        height: 56,
        backgroundColor: '#38c350',
        opacity: 0.8,
    },
    basic: {
        position: 'absolute',
        zIndex: 1,
        width: 170,
        height: 56,
        backgroundColor: '#000000',
        opacity: 0.4,
    },
    selectedText: {
        fontSize: 24,
        color: '#fff',
        zIndex:999,
    },
});
export default SideModule;
