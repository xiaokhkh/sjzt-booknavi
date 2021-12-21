import {BookNaviReactNative, useMapConfig} from './sjzt-booknavi';
import {Button, StatusBar} from 'react-native';
import React, {useState} from 'react';
//
// import preview from './preview.jpg';

const App = () => {
    const booknavi = React.useRef(null);
    let location = {
        layer: 1,
        column: 1,
        shelfNum: 3,
        direct: 'A',
    };
    let containerStyle = {
        width: 400,
        height: 400,
        backgroundColor: '#f2f2f2',
    };
    return (
        <>
            <StatusBar setHidden={{hidden: true}} />
            <BookNaviReactNative
                libraryCode="65b075867701"
                location={location}
                containerStyle={containerStyle}
                ref={ref => {
                    booknavi.current = ref;
                }}
            />
            <Button
                title="Switch"
                onPress={() => {
                    if (booknavi.current) {
                        booknavi.current.switch();
                    }
                }}
            />
        </>
    );
};

export default App;
