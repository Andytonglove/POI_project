# 微信小程序 · POI地图

POI地图是一个在小程序中借助 LBS 地图功能实现地图需要上报等功能的小程序。
本小程序基于开源的美食地图小程序构建。

## 产品描述

POI数据采集及核验移动应用

## 功能截图

>见文件夹miniprogram/images/show

| 首页 | 详情页 | 核验页 |
| ---- |  ----| ----|
|![](https://raw.githubusercontent.com/Andytonglove/POI_project/guan/miniprogram/images/show/map.jpg) |![](https://raw.githubusercontent.com/Andytonglove/POI_project/guan/miniprogram/images/show/info.png)| ![](https://raw.githubusercontent.com/Andytonglove/POI_project/guan/miniprogram/images/show/verify.png) |
| 搜索 | 留言板 |
| ![](https://raw.githubusercontent.com/Andytonglove/POI_project/guan/miniprogram/images/show/search.jpg) |![](https://raw.githubusercontent.com/Andytonglove/POI_project/guan/miniprogram/images/show/message.png)|

## 产品功能

`选题 2` ：POI数据采集及核验移动应用（POI: Point of Interest，兴趣点，地图查询、定位操作重要的数据源：房子、商铺、公交站、花坛、树木、景点等各类地表实体、现象的要素，有一定利用价值）

基本需求

1. ***地理信息平台支持***（地图查询、显示、路径计算、导航）

>采集者：上传POI照片、拍照位置、 POI分类及基本描述信息

>核验者：发现错误后，标识出错POI,上传更新后的POI照片、拍照位置、 POI分类及基本描述信息

>系统向采集者发消息，通知有错误数据需订正，采集者复核后可选择更新或驳回

>系统向核验者者发消息，通知采集者处理结果

>用户可在地图上按类别查询显示POI数据分布、错误标识及进展进展

>用户可地图平台导航功能，导航至指定POI位置

>支持采集者与核验者建立讨论，交流错误标识详情，无法达成共识可交上级主管部门处理

## 拓展功能

1. **支持定义多种类型的标记，不同类型标记在地图中显示不同图标，并且支持统计不同类型标记的数量**
2. **丰富的分享功能，支持分享给微信好友，分享到朋友圈，生成标记成功激励海报分享等多种分享功能**
3. **支持用户自主上传，展示用户的个人上传日志**
4. **支持第一次进入小程序的用户查看功能引导页**

请前往当前基于模板编写的[地图标记小程序模板](https://github.com/Volcano-Yang/map-marker-miniprogram)查看

## 特性

- 基于微信小程序地图实现
- 使用[小程序·云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)，无需编写后端代码
- 全移动端交互，数据管理无需再开电脑
- 独立配置项目，方便自行部署

## 安装使用

请查看 [安装教程](https://github.com/CloudKits/miniprogram-foodmap/wiki/Install)

## 配置文件说明

请查看 [配置文件说明](https://github.com/CloudKits/miniprogram-foodmap/wiki/Settings)

## 依赖服务说明

请查看 [依赖服务说明](https://github.com/CloudKits/miniprogram-foodmap/wiki/Service)

## FAQ

常见问题请参看 [FAQ](https://github.com/CloudKits/miniprogram-foodmap/wiki/FAQ)

## LICENSE

本项目基于 Apache License 2.0 开放源代码授权 

## 开发人员

guan
ge update
