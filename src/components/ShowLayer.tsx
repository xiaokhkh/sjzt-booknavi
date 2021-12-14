import {
    BookLocationSchema,
    BookshelfType,
    SideModuleSchema,
    SideModuleType,
} from '../types/Schema';
import {Image, StyleSheet, Text, View} from 'react-native';
import {LayersMap, bookshelfConfig} from '../ModuleConfig';
import React, {useCallback, useContext, useMemo} from 'react';

import SideModule from './SideModule';
import {common} from '../assets';
import {globalState} from '../state/context';
import {useCheckOverSize} from '../hooks';

const ShowLayer = () => {
    const {
        state: {
            ModuleSize: {width: moduleWidth, height: moduleHeight},
            active: {bsType, column},
            location: {layer, column: columnNum},
        },
    } = useContext(globalState);
    /**
     * layer层数不能大于/小于书架层高
     * column不能大于/小于书架节数
     */
    //根据bsType获取激活层板index | 侧面图容器尺寸
    const bookshelfProps = useMemo(() => {
        const {layerHeight} = bookshelfConfig[bsType];
        let activeLayer: number;
        //将书籍位置（*节*层）转为模块的数组索引
        if (bsType === BookshelfType.Desk) {
            if(columnNum > 2 && columnNum < 5){
                activeLayer = (columnNum - 2) * layerHeight + (layerHeight - layer);
            }else{
                
                let layerHeight = 2;
                if(columnNum >= 5) {
                    activeLayer = ((columnNum + 4) * layerHeight + 1) + (1 - layer);
                }else{
                    activeLayer = columnNum * layerHeight + (1 - layer);
                }
                //1-1 = 2
                //1-2 = 1
                //2-1 = 4
                //2-2 = 3
                //5-1 = 19 2
                //5-2 = 18 1               
                //6-1 = 21 4               
                //6-2 = 20 3
            }
        } else {
            activeLayer = columnNum * layerHeight + (1 - layer);
        }
        const sideModuleBox = {
            width: moduleWidth * column,
            height: moduleHeight * layerHeight,
        };
        return {
            activeLayer, //模块的数组索引
            sideModuleBox,
        };
    }, [layer, column, bsType, columnNum]);
    const {activeLayer, sideModuleBox} = bookshelfProps;
    const generatorMap: SideModuleSchema[] = useMemo(() => {
        return LayersMap[bsType + column];
    }, [column, bsType]);
    // 超出容器尺寸，调整缩放比例
    let scale = useCheckOverSize(sideModuleBox.width, sideModuleBox.height, 60);
    //两列两层渲染
    const renderDeskColumn = useCallback(
        (deskColumn: SideModuleSchema[], realIndex) => {
            return (
                <View key={`renderDeskColumn${realIndex}`}>
                    <View
                        style={{
                            flexDirection: 'column',
                            flexWrap: 'wrap',
                            width: moduleWidth * 2,
                            height: moduleHeight * 2,
                        }}>
                        {deskColumn.map((item, index) => {
                            realIndex += 1;
                            if (item.type === SideModuleType.DESK) {
                                return <></>;
                            }
                            return (
                                <SideModule
                                    item={item}
                                    index={realIndex}
                                    key={`sideModule${realIndex}`}
                                />
                            );
                        })}
                    </View>
                    <SideModule
                        item={deskColumn[4]}
                        index={realIndex}
                        key={`desk${realIndex}`}
                    />
                </View>
            );
        },
        [],
    );

    //根据generatorMap渲染
    const renderLayers: (
        generatorMap: SideModuleSchema[],
    ) => JSX.Element[] = generatorMap => {
        let tempMap: SideModuleSchema[] = Object.assign([], generatorMap);
        console.log(generatorMap);

        tempMap[activeLayer] = {type: SideModuleType.ACTIVESideModule};
        if (bsType === BookshelfType.Desk) {
            let deskArr = [];
            //格式化数组
            for (let index = 1; index <= tempMap.length; index++) {
                if (tempMap[index]?.type === SideModuleType.DESK) {
                    deskArr.push(tempMap.splice(index - 4, 5));
                }
            }
            let realIndex = 0;
            return deskArr.map((outItem, outIndex) => {
                let flag = true;
                //渲染一列desk，渲染一列normal
                if (deskArr.length - 1 === outIndex) {
                    flag = false;
                }
                return (
                    <>
                        {renderDeskColumn(outItem, realIndex)}
                        {flag &&
                            tempMap.map((item, index) => {
                                realIndex =
                                    index + (outIndex + 1) * outItem.length;
                                return (
                                    <SideModule
                                        item={item}
                                        index={realIndex}
                                        key={`normal${realIndex}`}
                                    />
                                );
                            })}
                    </>
                );
            });
        }
        return tempMap.map((item, index) => {
            return (
                <SideModule
                    item={item}
                    index={index}
                    key={`sideModule${index}`}
                />
            );
        });
    };
    return (
        <View style={[styles.container, {transform: [{scale}]}]}>
            <View style={[styles.sideModuleBox, {...sideModuleBox}]}>
                {renderLayers(generatorMap)}
            </View>
            {useMemo(() => {
                return (
                    <View
                        style={{
                            flexDirection: 'row',
                            width: sideModuleBox.width + 45,
                            height: 25,
                        }}>
                        <Image
                            source={common['bottom_point']}
                            resizeMode="cover"
                        />
                        <Image
                            style={{flex: 1}}
                            source={common['bottom']}
                            resizeMode="stretch"
                        />
                        <Image
                            style={{
                                transform: [{rotateY: '180deg'}],
                            }}
                            source={common['bottom_point']}
                            resizeMode="cover"
                        />
                    </View>
                );
            }, [sideModuleBox])}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sideModuleBox: {
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
});
export default ShowLayer;
