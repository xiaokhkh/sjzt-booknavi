import * as assets from '../assets';

import {
    Animated,
    Image,
    ImageSourcePropType,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { BookshelfCubeSchema, BookshelfType } from '../types/Schema';
import React, { useContext, useEffect, useMemo, useRef } from 'react';

import CreateAnimate from '../Animated';
import { globalState } from '../state/context';
import { useCheckOverSize } from '../hooks';

type DirectionProps = {
    sourceName: ImageSourcePropType;
    activeFlag: boolean;
    directionLocation: {
        top: number;
        left: number;
    };
};
const Direction = ({
    sourceName,
    activeFlag,
    directionLocation,
}: DirectionProps) => {
    if (!activeFlag) {
        return <></>;
    }
    let animated = new CreateAnimate();
    const [scale, runAnimated] = animated.getScaleLoopAnimate()
    runAnimated()
    return (
        <Animated.Image
            source={sourceName}
            style={[
                styles.directFloat,
                { ...directionLocation },
                { transform: [{ scale: scale }] },
            ]} />
    );
};
const BookshelfCube = ({
    base: { cubeWidth, cubeHeight, coord, priority },
    bsType,
    column,
    currentFlag,
    activeFlag,
    shelfNum,
    direction,
}: BookshelfCubeSchema) => {
    const { dispatch } = useContext(globalState);
    /**
     * 根据bsType读取不同的资源目录
     */
    const asset = assets[`bs_${bsType + column}`];
    const BI = 1.3;
    let directionLocation = {
        top: -25,
        left: 0,
    };
    let shelfNumLocation = {
        top: 182,
        left: 300,
    };
    let currentLocation = {
        top: 60,
        left: 100,
    };
    if (bsType === BookshelfType.Desk) {
        shelfNumLocation = {
            top: 265,
            left: 408,
        };
        currentLocation = {
            top: 95,
            left: 165,
        };
        directionLocation = {
            top: -36,
            left: 20,
        };
    } else if (bsType === BookshelfType.Six && column === 2) {
        shelfNumLocation = {
            top: 9.5 * 10,
            left: 16.2 * 10,
        };
        currentLocation = {
            top: 20,
            left: 50,
        };
        // directionLocation = {
        //     top: -36,
        // };
    }
    return (
        <TouchableOpacity
            activeOpacity={activeFlag ? 0.9 : 1}
            onPress={() => {
                dispatch({ type: 'SHOW_LAYER' });
            }}
            style={{
                position: 'absolute',
                width: cubeWidth,
                height: cubeHeight,
                top: coord.y,
                left: coord.x,
                zIndex: priority,
            }}>
            {currentFlag ? (
                <Image
                    style={[styles.current, { ...currentLocation }]}
                    source={asset[`current`]}
                />
            ) : (
                <></>
            )}
            <Image
                style={[styles.shelfNum, { ...shelfNumLocation }]}
                source={assets[`common`][`bookshelfNum_${shelfNum}`]}
            />
            <Direction
                {...{
                    activeFlag,
                    directionLocation,
                    sourceName: asset[`direction_${direction}`],
                }}
            />
            <Image
                source={asset[`${activeFlag ? 'active' : 'normal'}`]}
                style={{ top: 0, left: 0, width: '100%', height: '100%' }}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
};

const CubeSets = () => {
    //每一个图书馆对应着一份地图配置
    //获取2.5D地图配置 -> 初始化时获取 -> 外部传入(不需要重复请求)
    const {
        state: {
            containerStyle: { width: containerWidth, height: containerHeight },
            mapConfig,
        },
    } = useContext(globalState);
    let cubeBoxContainerSize = useMemo(() => {
        let count = mapConfig.elements.length;
        let lastEl = mapConfig.elements[count - 1];
        let firstEl = mapConfig.elements[0];
        return {
            width: lastEl.base.coord.x + lastEl.base.cubeWidth,
            height: Math.abs(
                firstEl.base.coord.y +
                firstEl.base.cubeHeight +
                lastEl.base.coord.y,
            ),
        };
    }, [mapConfig]);
    /**
     * 检测当前尺寸是否超出容器尺寸，如果超出返回scale值
     */
    let scale = useCheckOverSize(
        cubeBoxContainerSize.width,
        cubeBoxContainerSize.height,
        0,
    );
    //将cubebox居中
    let calcuOffsetforCenter = useMemo(() => {
        const calcuCenterPoint = ({ width, height }) => {
            //w:1000, h:500, x:500, y:250
            return {
                x: width / 2,
                y: height / 2,
            };
        };
        let containerCP = calcuCenterPoint({
            width: containerWidth,
            height: containerHeight,
        });
        const { width, height } = cubeBoxContainerSize;
        let cubeBoxCp = calcuCenterPoint({ width: width * scale, height: height * scale });
        return {
            left:
                containerWidth - cubeBoxContainerSize.width < 0
                    ? 0
                    : containerCP.x - cubeBoxCp.x,
            top: (containerCP.y - cubeBoxCp.y),
        };
    }, []);
    //根据地图配置渲染
    const renderCube = () => {
        return mapConfig.elements.map((cube, index) => {
            return <BookshelfCube {...cube} key={`cube${index}`} />;
        });
    };
    return (
        <View
            style={{
                width: containerWidth,
                height: containerHeight,
            }}>
            <View
                style={{
                    position: 'absolute',
                    ...calcuOffsetforCenter,
                    transform: [{ scale }],
                }}>
                {renderCube()}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    current: {
        position: 'absolute',
        zIndex: 9999,
    },
    directFloat: {
        position: 'absolute',
        zIndex: 999999,
    },
    shelfNum: {
        position: 'absolute',
        zIndex: 9999,
    },
});
export default CubeSets;
