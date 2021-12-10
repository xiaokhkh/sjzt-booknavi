import { Animated, StyleSheet, View } from "react-native";
import {
	PanGestureHandler,
	PinchGestureHandler,
	State,
	TapGestureHandler
} from "react-native-gesture-handler";
import React, { ReactChild, createRef, useContext, useRef } from "react";

import {globalState} from '../state/context';

type Props = {
    children:ReactChild;
};
/**
 *
 * @param props
 * @returns
 */
const Controllers = ({children}: Props) => {
	const {
        state: {
            containerStyle: {width, height},
        }
    } = useContext(globalState);
	let pinchRef = createRef();
	let panRef = createRef();
	let doubleTaps = createRef();
	const animateView = useRef(null);
	const USE_NATIVE_DRIVER = true;
	const baseScale = new Animated.Value(1);
	const pinScale = new Animated.Value(1);
	let lastScale = 1;
	let scale = Animated.multiply(baseScale, pinScale);
	let translateX = new Animated.Value(0);
	let translateY = new Animated.Value(0);
	let lastOffset = {
		x: 0,
		y: 0,
	};
	//---------------------
	const onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: pinScale } }], {
		useNativeDriver: USE_NATIVE_DRIVER,
	});
	const onPinchHandlerStateChange = (event) => {
		if (event.nativeEvent.oldState === State.ACTIVE) {
			lastScale *= event.nativeEvent.scale;
			baseScale.setValue(lastScale);
			pinScale.setValue(1);
		}
	};
	const onPanHandlerGestureEvent = Animated.event(
		[
			{
				nativeEvent: {
					translationX: translateX,
					translationY: translateY,
				},
			},
		],
		{
			useNativeDriver: USE_NATIVE_DRIVER,
		}
	);
	const onPanHandlerStateChange = (event: { nativeEvent: { oldState: number; translationX: number; translationY: number; }; }) => {
		if (event.nativeEvent.oldState === State.ACTIVE) {
			lastOffset.x += event.nativeEvent.translationX;
			lastOffset.y += event.nativeEvent.translationY;
			translateX.setOffset(lastOffset.x);
			translateX.setValue(0);
			translateY.setOffset(lastOffset.y);
			translateY.setValue(0);
		}
	};
	const onDoubleTap = (event: { nativeEvent: { state: number; }; }) => {
		if (event.nativeEvent.state === State.ACTIVE) {
			translateX.setOffset(0);
			translateX.setValue(0);
			translateY.setOffset(0);
			translateY.setValue(0);
			lastOffset = {
				x: 0,
				y: 0,
			};
			baseScale.setValue(1);
			pinScale.setValue(1);
		}
	};
	return (
			<TapGestureHandler
				ref={doubleTaps}
				onHandlerStateChange={onDoubleTap}
				maxDurationMs={200}
				numberOfTaps={2}
				simultaneousHandlers={[pinchRef, panRef]}
			>
				<Animated.View>
					<PanGestureHandler
						ref={panRef}
						onGestureEvent={onPanHandlerGestureEvent}
						onHandlerStateChange={onPanHandlerStateChange}
						simultaneousHandlers={[pinchRef, doubleTaps]}
					>
						<Animated.View>
							<PinchGestureHandler
								ref={pinchRef}
								simultaneousHandlers={[panRef, doubleTaps]}
								onGestureEvent={onPinchGestureEvent}
								onHandlerStateChange={onPinchHandlerStateChange}
							>
								<Animated.View ref={animateView} style={{ width, height}}>
									<Animated.View
										style={[styles.container,
											{
												width, height,
												transform: [
													{ scale: scale },
													{ translateX: translateX },
													{ translateY: translateY },
												],
											},
										]}
									>
										{children}
									</Animated.View>
								</Animated.View>
							</PinchGestureHandler>
						</Animated.View>
					</PanGestureHandler>
				</Animated.View>
			</TapGestureHandler>
	);
};
const styles = StyleSheet.create({
	container:{
		justifyContent:'center',
		alignItems:'center',
	}
})

export default Controllers;

{
	/* <TipBox text="去目标书架取书，在任意触摸屏扫描借阅！" />
						{currentFlag && (
							<View
								style={{
									position: "absolute",
									top: 30,
									left: 180,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<View
									style={{
										width: 440,
										height: 54,
										opacity: 0.5,
										backgroundColor: "#000",
										borderRadius: 20,
										position: "absolute",
									}}
								/>
								<Text style={{ color: "#fff", fontSize: 24 }}>
									注：目标书架与当前书架为同一书架
								</Text>
							</View>
						)} */
}
