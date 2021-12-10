import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useContext, useMemo} from 'react';
import {SideModuleSchema, SideModuleType} from '../Schema';

import {bookshelfConfig} from './ModuleConfig';
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
    let text: string, style: object;
    if (type === SideModuleType.ACTIVESideModule) {
        text = '目标书籍';
        style = styles.active;
    } else if (type === SideModuleType.BASIC) {
        text = `${column}节1层`;
        style = styles.basic;
    }
    return (
        <>
            <View style={styles.selectedBox}>
                <View style={style} />
                <Text style={[styles.selectedText, {opacity: 0.8}]}>
                    {text}
                </Text>
            </View>
        </>
    );
};
const Module: ({type: SideModuleType, index: number}) => JSX.Element = ({
    type,
    index,
}) => {
    const {
        state: {active:{
            bsType,
            column
        }},
    } = useContext(globalState);

    const selectBoxShow = useMemo(() => {
        return (
            type === SideModuleType.BASIC ||
            type === SideModuleType.ACTIVESideModule
        );
    }, [type]);
    const randomImage = useMemo(() => {
        const randomIntegerInRange: (min: number, max: number) => number = (
            min,
            max,
        ) => Math.floor(Math.random() * (max - min + 1)) + min;
        return `NaviFront_${randomIntegerInRange(1, 6)}`;
    }, []);
    return (
        <>
            {selectBoxShow ? (
                <SelectLayer
                    type={type}
                    column={index / bookshelfConfig[bsType].layerHeight}
                />
            ) : null}
            <Image source={common[randomImage]} />
        </>
    );
};
const SideModule: ({item, index}: Props) => JSX.Element = ({item, index}) => {
    const {
        state: {
            ModuleSize: {width, height},
        },
    } = useContext(globalState);

    const renderItem = useCallback((type, index) => {
        switch (type) {
            case SideModuleType.SideModule:
                return <Module type={type} index={index} />;
            case SideModuleType.BASIC:
                return (
                    <>
                        <Module type={type} index={index} />
                    </>
                );
            case SideModuleType.ACTIVESideModule:
                return (
                    <>
                        <Module type={type} index={index} />
                    </>
                );
            default:
                break;
        }
    }, []);

    return <View style={{width, height}}>{renderItem(item.type, index)}</View>;
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
        zIndex: 9999,
    },
});
export default SideModule;
