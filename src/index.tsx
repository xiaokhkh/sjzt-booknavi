import React, {useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {
    BookLocationSchema,
} from './Schema';
import ShowLayer from './components/ShowLayer';
import ShowMap from './components/ShowMap';
import {globalState} from './state/context';

type Props = {
    mapShow: number;
    bookLocation: BookLocationSchema;
};
const BookNavi = ({bookLocation}:Props) => {
    const {
        state: {
			containerStyle,
            curShelfNum,
            mapShow = true,
            mapConfig,
        },dispatch
    } = useContext(globalState);
	const {shelfNum, direct} = bookLocation;
    useEffect(()=>{
        mapConfig.elements.forEach((cube,index) => {
            if (cube.shelfNum === curShelfNum) {
                cube.currentFlag = true;
            }
            if (cube.shelfNum === shelfNum) {
                cube.activeFlag = true;
                cube.direction = direct;
                dispatch({
                    type: 'SET_ACTIVE',
                    active: {bsType: cube.bsType, column: cube.column},
                });
            }
        }); 
    }, [mapConfig])
    
    return (
        <View style={[styles.bookNavi, {...containerStyle}]}>
            {mapShow ? (
                <ShowMap shelfNum = {shelfNum} direct = {direct}/>
            ) : (
                <ShowLayer bookLocation = {bookLocation}/>
            )}
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
