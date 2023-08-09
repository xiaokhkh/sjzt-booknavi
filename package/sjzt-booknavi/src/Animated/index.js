import { Animated, Easing } from 'react-native';

export default class CreateAnimate {
    constructor() {}

    timing(value, toValue, duration = 500) {
        return Animated.timing(value, {
            toValue: toValue,
            duration: duration,
            delay: 0,
            easing: Easing.bezier(0.79, 0.01, 0.33, 1.01),
            useNativeDriver: true,
        });
    }
    getScaleLoopAnimate() {
        let scale = new Animated.Value(1);
        let scaleAnimate = Animated.sequence([
            this.timing(scale, 1),
            this.timing(scale, 0.9)
        ]);
        const runAnimated = () => {
            Animated.loop(scaleAnimate).start();
        };
        return [scale, runAnimated];
    }
    getMoveAnimate() {
        this.translateX = new Animated.Value(0);
        const moveIn = () => {
            this.timing(this.translateX, 1).start();
        };
        return [this.translateX, moveIn];
    }
    getValue() {
        const { scale, translateX } = this;
        return { scale, translateX };
    }
    getShowAnimate() {
        let scale = new Animated.Value(0);
        // let scaleAnimate = Animated.sequence([
        //     this.timing(scale, 0),
        //     this.timing(scale, 1),
        // ])
        const runAnimated = () => {
            this.timing(scale, 1, 500).start();
        };
        return [scale, runAnimated];
    }
}