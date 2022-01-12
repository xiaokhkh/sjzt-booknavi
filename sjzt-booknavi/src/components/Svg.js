// Svg.js
import React from 'react';
import SvgUri from '../lib/react-native-svg-uri/index';
import svgs from '../assets/svgs';

export default props => {
    // render() {
    const { color, width, height, style, icon } = props;

    let svgXmlData = svgs[icon];

    if (!svgXmlData) {
        let err_msg = `没有"${icon}"这个icon，请下载最新的icomoo并 npm run build-js`;
        throw new Error(err_msg);
    }
    return (
        <SvgUri
            width={width}
            height={height}
            svgXmlData={svgXmlData}
            fill={color}
            style={style}
        />
    );
    // }
};
