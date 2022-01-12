import React, { useContext, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ShowLayer from './components/ShowLayer';
import ShowMap from './components/ShowMap';
import TipBox from './components/TipBox';
import { globalState } from './state/context';

const BookNavi = () => {
    const {
        state: {
            containerStyle,
            curShelfNum,
            mapShow,
            mapConfig,
            location: { shelfNum, direct },
        },
        dispatch,
    } = useContext(globalState);
    let currentFlag = useMemo(() => curShelfNum === shelfNum, [curShelfNum, shelfNum])
    let renderTipBox = useMemo(() => {
        return (
            <View style={{ position: 'absolute', bottom: 10, left: (containerStyle.width - 620) / 2 }}>
                <TipBox text="去目标书架取书，在任意触摸屏扫描借阅！" />
            </View>
        )
    }, [])
    useEffect(() => {
        //将书籍所在书架选中
        let mapConfigCopy = mapConfig.elements.map((cube, index) => {
            cube.currentFlag = false;
            cube.activeFlag = false;
            if (cube.shelfNum === curShelfNum) {
                cube.currentFlag = true;
            }
            if (cube.shelfNum === shelfNum) {
                cube.activeFlag = true;
                cube.direction = direct;
                dispatch({
                    type: 'SET_ACTIVE',
                    active: {
                        bsType: cube.bsType,
                        column: cube.column,
                    },
                });
            }
            return cube
        });

        dispatch({ type: 'SET_MAPCONFIG', mapConfig: { elements: mapConfigCopy } });
    }, [shelfNum, direct]);
    return (
        <View style={[styles.bookNavi, { ...containerStyle }]}>
            {currentFlag && mapShow && <View
                style={styles.currentBox}>
                <View
                    style={styles.current}
                />
                <Text style={{ color: '#fff', fontSize: 24 }}>
                    注：目标书架与当前书架为同一书架
                </Text>
            </View>}
            {renderTipBox}
            {mapShow ? <ShowMap /> : <ShowLayer />}
        </View>
    );
};

const styles = StyleSheet.create({
    bookNavi: {
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 20,
    },
    currentBox: {
        position: 'absolute',
        top: 30,
        left: 180,
        alignItems: 'center',
        justifyContent: 'center',
    },
    current: {
        width: 440,
        height: 54,
        opacity: 0.5,
        backgroundColor: '#000',
        borderRadius: 20,
        position: 'absolute',
    }
});

export default BookNavi;
