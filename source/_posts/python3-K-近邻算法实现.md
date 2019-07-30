---
title: python3 K-近邻算法实现
date: 2017-08-03 13:47:11
tags: 机器学习
---

#### Python3实现K-近邻算法

```
import numpy as np
import operator


# 函数说明:创建数据集
# Parameters:
#     无
# Returns:
#     group - 数据集
#     labels - 分类标签
def createDataSet():
    #四组二维特征
    group = np.array([[1,101],[5,89],[108,5],[115,8]])
    #四组特征的标签
    labels = ['爱情片','爱情片','动作片','动作片']
    return group, labels



# 函数说明:kNN算法,分类器
# 
# Parameters:
#     inX - 用于分类的数据(测试集)
#     dataSet - 用于训练的数据(训练集)
#     labes - 分类标签
#     k - kNN算法参数,选择距离最小的k个点
# Returns:
#     sortedClassCount[0][0] - 分类结果
 
def classify0(inX, dataSet, labels, k):
    print("开始查看下dataSet")
    print(dataSet)
    #numpy函数shape[0]返回dataSet的行数
    dataSetSize = dataSet.shape[0]
    print("查看下得到的行数：")
    print(dataSetSize)
    #在列向量方向上重复inX共1次(横向)，行向量方向上重复inX共dataSetSize次(纵向)
    dataSettemp = np.tile(inX, (dataSetSize, 1))
    print("查看下dataSettemp：")
    print(dataSettemp)
    diffMat = dataSettemp - dataSet
    print("查看下diffMat：")
    print(diffMat)
    #二维特征相减后平方
    sqDiffMat = diffMat**2
    print("二维特征相减后平方:")
    print(sqDiffMat)
    #sum()所有元素相加，sum(0)列相加，sum(1)行相加
    sqDistances = sqDiffMat.sum(axis=1)
    print("um()所有元素相加，sum(0)列相加，sum(1)行相加:")
    print(sqDistances)

    #开方，计算出距离
    distances = sqDistances**0.5
    print("开方，计算出距离:")
    print(distances)
    #返回distances中元素从小到大排序后的索引值
    sortedDistIndices = distances.argsort()
    print("sortedDistIndices:")
    print(sortedDistIndices)

    #定一个记录类别次数的字典
    classCount = {}
    for i in range(k):
        #取出前k个元素的类别
        voteIlabel = labels[sortedDistIndices[i]]
        print(voteIlabel)
        #dict.get(key,default=None),字典的get()方法,返回指定键的值,如果值不在字典中返回默认值。
        #计算类别次数
        classCount[voteIlabel] = classCount.get(voteIlabel,0) + 1
    #python3中用items()替换python2中的iteritems()
    #key=operator.itemgetter(1)根据字典的值进行排序
    #key=operator.itemgetter(0)根据字典的键进行排序
    #reverse降序排序字典
    sortedClassCount = sorted(classCount.items(),key=operator.itemgetter(1),reverse=True)
    #返回次数最多的类别,即所要分类的类别
    #排序后是个二维的list类型
    print("排序后结果：")
    print(sortedClassCount)
    return sortedClassCount[0][0]

if __name__ == '__main__':
    #创建数据集
    group, labels = createDataSet()
    #测试集
    test = [101,20]
    #kNN分类
    test_class = classify0(test, group, labels, 3)
    #打印分类结果
    print(test_class)
    
```