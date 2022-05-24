import {
	BookshelfCubeSchema,
	BookshelfSchema,
	BookshelfType,
	Coordinate,
	CubeType,
	SideModuleSchema,
	SideModuleType,
} from "./types/Schema";

/**
 * 书架配置
 */
const bookshelfConfig: BookshelfSchema[] = [];

bookshelfConfig[BookshelfType.Six] = {
	type: BookshelfType.Six,
	layerHeight: 6,
};
bookshelfConfig[BookshelfType.Four] = {
	type: BookshelfType.Four,
	layerHeight: 4,
};
bookshelfConfig[BookshelfType.Desk] = {
	type: BookshelfType.Desk,
	layerHeight: 6,
};
/**
 * 生成侧面图配置
 */
function generatorLayersMap(bookshelfConfig: BookshelfSchema[]): Array<SideModuleSchema[]> {
	let LayersMap: Array<SideModuleSchema[]> = [];
	/**
	 * 根据bsType,column生成数组，后续按照数组内元素生成书架侧面图
	 * @param bsType
	 * @returns
	 */
	const generatorLayers: (
		config: BookshelfSchema,
		column: number,
		LayersMap: Array<SideModuleSchema[]>
	) => void = (config, column, LayersMap) => {
		const normal = { type: SideModuleType.SideModule };
		const basic = { type: SideModuleType.BASIC };
		const desk = { type: SideModuleType.DESK, width: 360, height: 240 };
		const normalFill: (config: BookshelfSchema, column: number) => void = (config, column) => {
			const { type: bsType, layerHeight } = config;
			const layers = layerHeight * column;
			LayersMap[bsType + column] = fillArray(layers, (index: number) => {
				if (column > 4) {
					//节数大于4，则标记每节书架的1层，否则只标记第一节
					return index % layerHeight == 0 ? basic : normal;
				}
				if (index === layerHeight) {
					return basic;
				}
				return normal;
			});
		};
		const deskFill: (config: BookshelfSchema, column: number) => void = (config, column) => {
			//
			const { type: bsType, layerHeight } = config;
			const layers = layerHeight * column - 14;
			22;
			LayersMap[bsType + column] = fillArray(layers, (index: number) => {
				if (index == 2 || index == 11 || index == 19) {
					return basic;
				}
				if (index == 5 || index == 22) {
					return desk;
				}
				return normal;
			});
		};
		//生成对应的SideModuleSchema
		const fillArray: (layers: number, fn: Function) => SideModuleSchema[] = (layers, fn) => {
			let LayersArray: SideModuleSchema[] = [];
			for (let index = 1; index <= layers; index++) {
				LayersArray[index] = fn(index);
			}
			return LayersArray;
		};
		/**
		 * 根据bookshelfSchema.type填充[bsType+column]对应的数组
		 */
		if (config.type === BookshelfType.Four || config.type === BookshelfType.Six) {
			normalFill(config, column);
		} else if (config.type === BookshelfType.Desk) {
			deskFill(config, column);
		}
	};

	bookshelfConfig.forEach((config, index) => {
		for (let column = 1; column <= 8; column++) {
			generatorLayers(config, column, LayersMap);
		}
	});
	return LayersMap;
}

/**
 * 生成地图配置
 */

function createMapConfig(libraryCode) {
	let mapConfig = { elements: [] };
	/**
	 *
	 * @param cols
	 * @param rows
	 * @param cubeSchema
	 */
	function generateCubeSet(
		total: number,
		rowNum: number,
		spaceX,
		spaceY,
		cubeSchema: BookshelfCubeSchema
	) {
		let result = [];
		let rowFirstCoord: Coordinate = { x: 0, y: 0 };
		// const diffX = spaceY | 25;
		// const diffY = spaceX | 30; //rowSpace
		let colDiff = {
			diffX: (290 * spaceY) / 15,
			diffY: (168 * spaceY) / 15,
		};
		let rowDiff = {
			diffX: (62 * spaceX) / 8,
			diffY: (-36 * spaceX) / 8,
		};
		let cols = Math.ceil(total / rowNum);
		function createCols(rowFirstCoord, colNum, num) {
			let tempArr = [];
			let preCoord = { ...rowFirstCoord };
			for (let index = 1; index <= num; index++) {
				let tempObj = { ...cubeSchema };
				let num = index + (colNum - 1) * rowNum;
				tempObj.base.id = num;
				tempObj.shelfNum = num;
				tempObj.base.priority = total * 5 - num;
				if (index !== 1) {
					preCoord.x += rowDiff.diffX;
					preCoord.y += rowDiff.diffY;
				}
				tempObj.base.coord = preCoord;
				//
				tempArr.push(JSON.parse(JSON.stringify(tempObj)));
			}
			return tempArr;
		}
		for (let index = 1; index <= cols; index++) {
			let goal = rowNum;
			if (index !== 1) {
				rowFirstCoord.x += colDiff.diffX;
				rowFirstCoord.y += colDiff.diffY;
			}
			//如果是最后一行，计算出还剩几个书架渲染
			if (index === cols) {
				goal = total - rowNum * (index - 1);
			}
			result = result.concat(createCols(rowFirstCoord, index, goal));
		}
		return result;
	}

	const bookshelfAtSix: BookshelfCubeSchema = {
		base: {
			id: 0,
			coord: { x: 0, y: 0 },
			cubeWidth: 410,
			cubeHeight: 360,
			priority: 1,
			type: CubeType.BOOKSHELF,
		},
		currentFlag: false,
		activeFlag: false,
		shelfNum: 1,
		direction: "A",
		bsType: BookshelfType.Six, //根据不同的bsType及column选择不同的assetsPath
		column: 4,
	};
	const bookshelfAtDesk: BookshelfCubeSchema = {
		base: {
			id: 0,
			coord: { x: 0, y: 0 },
			cubeWidth: 496,
			cubeHeight: 464,
			priority: 1,
			type: CubeType.BOOKSHELF,
		},
		currentFlag: false,
		activeFlag: false,
		shelfNum: 1,
		direction: "A",
		bsType: BookshelfType.Desk, //根据不同的bsType及column选择不同的assetsPath
		column: 6,
	};
	const bookshelfAtFour: BookshelfCubeSchema = {
		base: {
			id: 0,
			coord: { x: 0, y: 0 },
			cubeWidth: 496,
			cubeHeight: 464,
			priority: 1,
			type: CubeType.BOOKSHELF,
		},
		currentFlag: false,
		activeFlag: false,
		shelfNum: 1,
		direction: "A",
		bsType: BookshelfType.Four, //根据不同的bsType及column选择不同的assetsPath
		column: 6,
	};
	const bookshelfAtSixColumn2: BookshelfCubeSchema = {
		base: {
			id: 0,
			coord: { x: 0, y: 0 },
			cubeWidth: 274,
			cubeHeight: 266,
			priority: 1,
			type: CubeType.BOOKSHELF,
		},
		currentFlag: false,
		activeFlag: false,
		shelfNum: 1,
		direction: "A",
		bsType: BookshelfType.Six, //根据不同的bsType及column选择不同的assetsPath
		column: 2,
	};
	if (libraryCode === "65b0758681ea6cbb533a961c5eb75e02") {
		mapConfig.elements.push(
			//阜康图书馆
			...generateCubeSet(4, 4, 20, 20, bookshelfAtSix)
		);
	} else if (libraryCode === "746573744c6962") {
		//智图办公区测试
		mapConfig.elements.push(...generateCubeSet(2, 2, 20, 20, bookshelfAtSixColumn2));
	} else if (libraryCode === "56db5c424e008282") {
		//4节1层测试用
		mapConfig.elements.push(...generateCubeSet(1, 1, 20, 20, { ...bookshelfAtFour, column: 1 }));
	} else if (libraryCode === "65b075867701") {
		//新疆省图书馆
		mapConfig.elements.push(...generateCubeSet(3, 3, 28, 20, bookshelfAtDesk));
	} else {
		mapConfig.elements.push(...generateCubeSet(2, 2, 20, 20, bookshelfAtSixColumn2));
	}
	return mapConfig;
}

const LayersMap = generatorLayersMap(bookshelfConfig);
export { LayersMap, bookshelfConfig, createMapConfig };
