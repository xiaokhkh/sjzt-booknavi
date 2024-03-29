import React, { useEffect, useImperativeHandle, useReducer } from "react";
import { globalState, init, reducer } from "./src/state/context";

import BookNavi from "./src";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMapConfig } from "./src/hooks";

const BookNaviReactNative = React.forwardRef(
	(
		{
			libraryCode,
			location = {
				column: 1,
				layer: 1,
				shelfNum: 1, //书籍所在书架号
				direct: "A",
			},
			curShelfNum = 0,
			containerStyle = {
				width: 400,
				height: 400,
				backgroundColor: "#f2f2f2",
			},
			mapConfig,
		},
		ref
	) => {
		let defaultMapConfig = useMapConfig(libraryCode);
		let receiveProps = {
			mapConfig: mapConfig || defaultMapConfig,
			location,
			curShelfNum,
			containerStyle,
		};
		const [state, dispatch] = useReducer(reducer, receiveProps, init);
		useEffect(() => {
			dispatch({ type: "SET_LOCATION", location: location });
		}, [location]);
		useImperativeHandle(
			ref,
			() => {
				return {
					switch: () => {
						dispatch({ type: "SWITCH" });
					},
				};
			},
			[]
		);
		return (
			<GestureHandlerRootView>
				<globalState.Provider value={{ state, dispatch }}>
					<BookNavi />
				</globalState.Provider>
			</GestureHandlerRootView>
		);
	}
);

export { BookNaviReactNative, useMapConfig };
