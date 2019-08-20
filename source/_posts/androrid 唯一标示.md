---
title: Android唯一标示
date: 2019-08-11 15:47:11
tags: android
---

### androrid 唯一标示

- 方案1：UUID + SD卡（存取）

```
APP首次使用时，创建UUID，并保存到SD卡中。
以后再次使用时，直接从SD卡取出来即可；
很多APP就是这么做的；

优点：数据唯一、不随APP一起删除；
缺点：需要SD卡读写权限；防不住用户手动删除SD卡的文件；

```
<!--more -->


- 方案2：imei + android_id + serial + 硬件uuid（自生成）

```
AndroidId : 如：df176fbb152ddce,无需权限,极个别设备获取不到数据或得到错误数据；
serial：如：LKX7N18328000931,无需权限,极个别设备获取不到数据；
IMEI : 如：23b12e30ec8a2f17，需要权限；
Mac: 如：6e:a5:....需要权限，高版本手机获得数据均为 00:00.....（不可使用）
Build.BOARD  如：BLA  主板名称,无需权限,同型号设备相同
Build.BRAND  如：HUAWEI  厂商名称,无需权限,同型号设备相同
Build.HARDWARE  如：kirin970  硬件名称,无需权限,同型号设备相同
Build......更多硬件信息，略
```
- imei和Build.SERIAL 在Q上也将会无法获取到

- 代码实现


```
import android.content.Context;
import android.os.Build;
import android.provider.Settings;
import android.telephony.TelephonyManager;

import java.security.MessageDigest;
import java.util.Locale;
import java.util.UUID;


public class DeviceIdUtil {
    /**
     * 获得设备硬件标识
     *
     * @param context 上下文
     * @return 设备硬件标识
     */
    public static String getDeviceId(Context context) {
        StringBuilder sbDeviceId = new StringBuilder();

        //获得设备默认IMEI（>=6.0 需要ReadPhoneState权限）
        String imei = getIMEI(context);
        //获得AndroidId（无需权限）
        String androidid = getAndroidId(context);
        //获得设备序列号（无需权限）
        String serial = getSERIAL();
        //获得硬件uuid（根据硬件相关属性，生成uuid）（无需权限）
        String uuid = getDeviceUUID().replace("-", "");

        //追加imei
        if (imei != null && imei.length() > 0) {
            sbDeviceId.append(imei);
            sbDeviceId.append("|");
        }
        //追加androidid
        if (androidid != null && androidid.length() > 0) {
            sbDeviceId.append(androidid);
            sbDeviceId.append("|");
        }
        //追加serial
        if (serial != null && serial.length() > 0) {
            sbDeviceId.append(serial);
            sbDeviceId.append("|");
        }
        //追加硬件uuid
        if (uuid != null && uuid.length() > 0) {
            sbDeviceId.append(uuid);
        }

        //生成SHA1，统一DeviceId长度
        if (sbDeviceId.length() > 0) {
            try {
                byte[] hash = getHashByString(sbDeviceId.toString());
                String sha1 = bytesToHex(hash);
                if (sha1 != null && sha1.length() > 0) {
                    //返回最终的DeviceId
                    return sha1;
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        //如果以上硬件标识数据均无法获得，
        //则DeviceId默认使用系统随机数，这样保证DeviceId不为空
        return UUID.randomUUID().toString().replace("-", "");
    }

    //需要获得READ_PHONE_STATE权限，>=6.0，默认返回null
    private static String getIMEI(Context context) {
        try {
            TelephonyManager tm = (TelephonyManager) 
context.getSystemService(Context.TELEPHONY_SERVICE);
            return tm.getDeviceId();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }

    /**
     * 获得设备的AndroidId
     *
     * @param context 上下文
     * @return 设备的AndroidId
     */
    private static String getAndroidId(Context context) {
        try {
            return Settings.Secure.getString(context.getContentResolver(), 
Settings.Secure.ANDROID_ID);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }

    /**
     * 获得设备序列号（如：WTK7N16923005607）, 个别设备无法获取
     *
     * @return 设备序列号
     */
    private static String getSERIAL() {
        try {
            return Build.SERIAL;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }

    /**
     * 获得设备硬件uuid
     * 使用硬件信息，计算出一个随机数
     *
     * @return 设备硬件uuid
     */
    private static String getDeviceUUID() {
        try {
            String dev = "3883756" +
                    Build.BOARD.length() % 10 +
                    Build.BRAND.length() % 10 +
                    Build.DEVICE.length() % 10 +
                    Build.HARDWARE.length() % 10 +
                    Build.ID.length() % 10 +
                    Build.MODEL.length() % 10 +
                    Build.PRODUCT.length() % 10 +
                    Build.SERIAL.length() % 10;
            return new UUID(dev.hashCode(), 
Build.SERIAL.hashCode()).toString();
        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    }

    /**
     * 取SHA1
     * @param data 数据
     * @return 对应的hash值
     */
    private static byte[] getHashByString(String data)
    {
        try{
            MessageDigest  messageDigest = MessageDigest.getInstance("SHA1");
            messageDigest.reset();
            messageDigest.update(data.getBytes("UTF-8"));
            return messageDigest.digest();
        } catch (Exception e){
            return "".getBytes();
        }
    }

    /**
     * 转16进制字符串
     * @param data 数据
     * @return 16进制字符串
     */
    private static String bytesToHex(byte[] data){
        StringBuilder sb = new StringBuilder();
        String stmp;
        for (int n = 0; n < data.length; n++){
            stmp = (Integer.toHexString(data[n] & 0xFF));
            if (stmp.length() == 1)
                sb.append("0");
            sb.append(stmp);
        }
        return sb.toString().toUpperCase(Locale.CHINA);
    }
}

```