import { Animated, StyleSheet, Text, View } from 'react-native';

import CreateAnimate from '../Animated';
import React from 'react';
import Svg from './Svg';

function TipBox({ text }) {
    let scaleAnimate = new CreateAnimate();
    let [scaleShow, runAnimatedShow] = scaleAnimate.getShowAnimate();
    runAnimatedShow();
    // 去目标书架取书，在任意触摸屏扫描借阅！
    return (
        <Animated.View
            style={[styles.tipBox, { transform: [{ scale: scaleShow }] }]}>
            <View style={styles.tipMask} />
            <Svg
                icon="triangle"
                color="#38c350"
                width={33}
                height={28}
                style={styles.triangle}
            />
            <Text style={styles.tip}>{text}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    tipBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 640,
        borderRadius: 55,
        height: 80,
    },
    tipMask: {
        width: 640,
        height: 80,
        borderRadius: 55,
        backgroundColor: '#38c350',
        position: 'absolute',
        opacity: 1,
    },
    tip: {
        fontSize: 32,
        textAlign: 'center',
        color: '#fff',
    },
    triangle: {
        position: 'absolute',
        top: -20,
        left: 300,
    },
});
export default TipBox;
