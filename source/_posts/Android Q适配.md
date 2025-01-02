---
title: Android Q适配
tags: Android
categories: App
toc: true
abbrlink: 51024
date: 2019-08-11 15:47:11
---


## 适配指南：
- 安卓Q | 用户画像等功能受影响，Device ID禁用适配指南

## 变更影响：
- 1、影响范围

所有通过READ_PHONE_STATE权限获取Device ID的应用以及将设备WiFi Mac地址作为设备唯一标志符的应用都将受影响，预计受影响的应用比例超过90%。

- 2、兼容性表现

对于TargetSdkVersion<Q且没有申请READ_PHONE_STATE权限的应用和TargetSdkVersion>=Q的全部应用，获取device id会抛异常SecurityException。

对于 TargetSdkVersion<Q且申请了READ_PHONE_STATE权限的应用，通过getDeviceId接口读取的值为Null。

当设备连接到不同的 Wi-Fi 网络时，系统会随机生成不同的 MAC 地址，将无法作为用户唯一标志。

- 3、受影响的业务场景

所有依赖Device ID以及固定Mac地址数据的业务都会受到影响，如数据统计、推荐、用户历史数据记录、广告、用户画像等。

## 适配指导：
- 1、参照官方文档进行适配

- 唯一标识符最佳方案：

```
https://developer.android.google.cn/training/articles/user-data-ids

Device ID变更介绍文档：

https://developer.android.google.cn/preview/privacy/data-identifiers

```

- 2、使用Android ID 代替Device ID

```

Android ID获取代码：

Settings.System.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);

Android ID和Device ID主要区别在于手机恢复出厂设置后，Android ID将被重置，而Device ID无法重置。
```