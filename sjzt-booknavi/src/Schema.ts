
export enum SideModuleType {
    SideModule,
    ACTIVESideModule,
    BASIC,
    DESK,
    VOID,
}
export enum BookshelfType {
    Six = 0,
    Four = 10,
    Desk = 20,
}
export type BookshelfSchema = {
    type: BookshelfType;
    layerHeight: number;
};
export type SideModuleSchema = {
    type: SideModuleType;
    width?: number;
    height?: number;
};
export type BookLocationSchema = {
    column: number;
    layer: number;
    shelfNum?: number; //书籍所在书架号
    direct?: string;
};

export enum CubeType  {
    BASE,
    BOOKSHELF,
}
//coordinate
export interface Coordinate {
    x: number;
    y: number;
}

export interface BaseSchema {
    id: number;
    coord: Coordinate;
    cubeWidth: number;
    cubeHeight: number;
    priority: number;
    type:CubeType;//调用不同的组件渲染
    assetName?:string;
}

export interface BookshelfCubeSchema {
    base: BaseSchema;
    currentFlag: boolean;
    activeFlag: boolean;
    direction?: string;
    shelfNum?: number;
    bsType:BookshelfType;//根据不同的type选择不同的assetsPath
    column:number;
}

export interface FloorSchema {
    base: BaseSchema;
}
export interface WallSchema {
    base: BaseSchema;
}
export type MapConfig = {
    elements: BookshelfCubeSchema[];
    floor?: FloorSchema;
    wall?: WallSchema[];
};
