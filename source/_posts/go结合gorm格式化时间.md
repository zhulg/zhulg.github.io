---
title: go结合gorm格式化时间
tags: go
categories: go
toc: true
abbrlink: 41039
date: 2018-11-21 12:28:35
---

- go使用gorm做数据库映射时，数据库里存储时间为UTC时间
- 返回给前端数据可能涉及到记录的创建时间，需要对时间进行格式化
- Go中使用gorm时，通过加入gorm.Model到自己的struct来定义一个model,一般定义时间类型为time.Time。由于在go的time包中实现json.Marshaler接口时指定了使用RFC3339Nano这种格式，所以model序列化为JSON的时候默认调MarshalJSON方法把time.Time类型的字段都搞成这种格式

## 格式化时间格式
- https://stackoverflow.com/questions/28800672/how-to-add-new-methods-to-an-existing-type-in-go 通过别名和内嵌方式进行重写json.Marshaler方法。
- 如果没有使用gorm则需要通过别名定义，重写arshalJSON方法即可。如果涉及到使用gorm方式则需要加上database/sql的Value和Scan方法才行（否则时间字段在数据库里没有生成）
- 参见： https://github.com/jinzhu/gorm/issues/1611#issuecomment-329654638。

## 使用方式

```
package utils

import (
	"time"
	//"strconv"
	"fmt"
	"database/sql/driver"
	"strconv"
)

type LocalTime struct {
	time.Time
}

func (t LocalTime) MarshalJSON() ([]byte, error) {
	//格式化秒
	seconds := t.Unix()
	return []byte(strconv.FormatInt(seconds, 10)), nil
}

func (t LocalTime) Value() (driver.Value, error) {
	var zeroTime time.Time
	if t.Time.UnixNano() == zeroTime.UnixNano() {
		return nil, nil
	}
	return t.Time, nil
}

func (t *LocalTime) Scan(v interface{}) error {
	value, ok := v.(time.Time)
	if ok {
		*t = LocalTime{Time: value}
		return nil
	}
	return fmt.Errorf("can not convert %v to timestamp", v)
}
```
- 使用时在model里时间字段，使用LocalTime类型


