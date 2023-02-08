
export const mapboxOldToken = "pk.eyJ1Ijoic3p1anlqIiwiYSI6ImNreWsxYndqczA3b2IybnBleDM2ZHVnbjkifQ.saFNYaCicGCxDTFXhg6RaQ"; // 原来的mapbox的token
export const mapboxMyToken = 'pk.eyJ1IjoiZ2VnZWppIiwiYSI6ImNrdjJpeGdsYzJ2OWIzMnA2OTUzNXJkdGMifQ.IpfJUvi40Saj1xYqQcTJvQ' // 对应下面自定义地图数据的token
/* Mapbox信息地图

可以通过
https://api.mapbox.com/styles/v1/gegeji/cl1bukqpt000m15kv7a9dp1l8.html?title=view&access_token=pk.eyJ1IjoiZ2VnZWppIiwiYSI6ImNrdjJpeGdsYzJ2OWIzMnA2OTUzNXJkdGMifQ.IpfJUvi40Saj1xYqQcTJvQ&zoomwheel=true&fresh=true#12.38/22.31104/114.00035
预览street-map标签效果

 通过
 https://api.mapbox.com/styles/v1/gegeji/cl06ky3d7000914tb457m156s.html?title=view&
 access_token=pk.eyJ1IjoiZ2VnZWppIiwiYSI6ImNrdjJpeGdsYzJ2OWIzMnA2OTUzNXJkdGMifQ.IpfJUvi40Saj1xYqQcTJvQ&
 zoomwheel=true&fresh=true#14.58/22.52944/113.95799
 预览卫星图标签效果
 */
export const mapboxStreetMapInfoStyle = 'mapbox://styles/gegeji/cl1bukqpt000m15kv7a9dp1l8' // 生产模式 （production mode）
export const mapboxStreetMapInfoDraftStyle = 'mapbox://styles/gegeji/cl1bukqpt000m15kv7a9dp1l8/draft' // 草稿模式 （draft mode）
export const mapboxSatelliteInfoStyle =  'mapbox://styles/gegeji/cl0oxyt51009n14qyokshh9vp' // 生产模式 （production mode）
export const mapboxSatelliteInfoDraftStyle =  'mapbox://styles/gegeji/cl0oxyt51009n14qyokshh9vp/draft' // 草稿模式 （draft mode）

// mapbox普通url
export const mapboxStreetMap = 'mapbox://styles/mapbox/streets-v11'
// export const mapboxStreetMap = 'mapbox://styles/gegeji/cl0gmgsih00c614rroskve8mr'
export const mapboxSatelliteMap = 'mapbox://styles/mapbox/satellite-streets-v11'
// export const mapboxSatelliteMap = 'mapbox://styles/gegeji/cl0ot12lw001w15qlb1ldsce1'

/**交通图信息。
 * @deprecated 这个图无法被编辑。Preview v2会报错，这是正常现象。
 */
export const mapboxNavigationMap = 'mapbox://styles/mapbox/navigation-day-v1'
// export const mapboxNavigationMap = 'mapbox://styles/mapbox/navigation-preview-day-v2'
export const mapboxTerrainMap = 'mapbox://mapbox.mapbox-terrain-dem-v1'

export const mapboxTrafficMap = 'mapbox://mapbox.mapbox-traffic-v1'

// 天地图token
export const tianDiTuToken = '104ee082b0fb3088a648239c7c7653e2'
//矢量底图地图
export const streetBaseMapUrl = 'https://t0.tianditu.gov.cn/vec_w/wmts?' +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&' +
    'TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + tianDiTuToken;
//矢量注记地图
export const streetMarkerMapUrl = 'https://t3.tianditu.gov.cn/cva_w/wmts?' +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&' +
    'TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + tianDiTuToken;
// 卫星底图地图
export const imageBaseUrl = 'http://t2.tianditu.gov.cn/img_w/wmts?' +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&' +
    'TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + tianDiTuToken

// 卫星注记地图
export const imageMarkerMapUrl = 'https://t0.tianditu.gov.cn/cia_w/wmts?' +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&' +
    'TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + tianDiTuToken;
