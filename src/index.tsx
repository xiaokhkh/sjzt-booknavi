import React, {useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import ShowLayer from './components/ShowLayer';
import ShowMap from './components/ShowMap';
import {globalState} from './state/context';

const BookNavi = () => {
    const {
        state: {
            containerStyle,
            curShelfNum,
            mapShow,
            mapConfig,
            location: {shelfNum, direct},
        },
        dispatch,
    } = useContext(globalState);
    useEffect(() => {
        //将书籍所在书架选中
        mapConfig.elements.forEach((cube, index) => {
            if (cube.shelfNum === curShelfNum) {
                cube.currentFlag = true;
            }
            if (cube.shelfNum === shelfNum) {
                cube.activeFlag = true;
                cube.direction = direct;
                dispatch({
                    type: 'SET_ACTIVE',
                    active:{
                        bsType:cube.bsType,
                        column:cube.column
                    },
                });
            }
        });
        dispatch({type: 'SET_MAPCONFIG', mapConfig: mapConfig});
    }, []);
    return (
        <View style={[styles.bookNavi, {...containerStyle}]}>
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
});

export default BookNavi;
