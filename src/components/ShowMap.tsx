import {StyleSheet, View} from 'react-native';

import Controllers from './Controllers';
import CubeSets from './CubeSets';
import React from 'react';

interface Props {
  shelfNum:number,
  direct:string,
}
const ShowMap = ({shelfNum, direct}: Props) => {
  return (
      <Controllers >
        <CubeSets shelfNum = {shelfNum} direct = {direct}/>
      </Controllers>
  );
};

export default ShowMap;
