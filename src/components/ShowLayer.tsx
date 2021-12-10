import {
    BookLocationSchema,
    BookshelfType,
    SideModuleSchema,
    SideModuleType,
} from '../Schema';
import {Image, StyleSheet, Text, View} from 'react-native';
import {LayersMap, bookshelfConfig} from './ModuleConfig';
import React, {useCallback, useContext, useMemo} from 'react';

import SideModule from './SideModule';
import {common} from '../assets';
import {globalState} from '../state/context';
import { useCheckOverSize } from '../hooks';

type Props = {
    bookLocation:BookLocationSchema,
}
const ShowLayer = ({bookLocation:{layer, column:columnNum}}: Props) => {
    const {
        state: {
            ModuleSize: {width: moduleWidth, height: moduleHeight},
            active:{
                bsType,
                column
            }
        },
    } = useContext(globalState);
    console.log(bsType)
    console.log(column)
    /**
     * layer层数不能大于/小于书架层高
     * column不能大于/小于书架节数
     */
    
    //根据bsType获取激活层板index | 侧面图容器尺寸
    const bookshelfProps = useMemo(() => {
        const {layerHeight} = bookshelfConfig[bsType];
        //将书籍位置（*节*层）转为模块的数组索引
        const activeLayer = columnNum * layerHeight + (1 - layer);
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
    let scale = useCheckOverSize(sideModuleBox.width, sideModuleBox.height, 60)
    //根据generatorMap渲染
    const renderLayers: (
        generatorMap: SideModuleSchema[],
    ) => JSX.Element[] = generatorMap => {
        let tempMap = Object.assign([], generatorMap);
        tempMap[activeLayer] = {type: SideModuleType.ACTIVESideModule};
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
        flexWrap: 'wrap',
    },
});
export default ShowLayer;
