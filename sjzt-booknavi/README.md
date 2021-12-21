
## USAGE
```javascript
const App = () => {
    //booknavi.switch()用来切换地图和侧面图
    const booknavi = React.useRef(null);
    //书籍的位置信息
    let location = {
        layer: 1,
        column: 1,
        shelfNum: 3,
        direct: 'A',
    }; 
    //容器属性
    let containerStyle = {
        width: 400,
        height: 400,
        backgroundColor: '#f2f2f2',
    };
    return (
        <>
            <BookNaviReactNative
                libraryCode="65b075867701" //图书馆代码，不同的图书馆使用不同的地图配置
                location={location} 
                containerStyle={containerStyle}
                ref={ref => {
                    booknavi.current = ref;
                }}
            />
            <Button
                title="Switch"
                onPress={() => {
                    if (booknavi.current) {
                        booknavi.current.switch();
                    }
                }}
            />
        </>
    );
};
```