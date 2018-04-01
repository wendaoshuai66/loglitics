package com.lianxing.logistics.util.date;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class DateTime {

    // 时间格式定义字符串
    public static String ymdhmss = "yyyy-MM-dd HH:mm:ss.SSS";
    public static String ymdhms = "yyyy-MM-dd HH:mm:ss";
    public static String ymd = "yyyy-MM-dd";
    public static String ymdhm = "yyyy-MM-dd HH:mm";
    public static String hm = "HH:mm";
    public static String hms = "HH:mm:ss";
    private static String year = "yyyy";
    private static String month = "MM";
    private static String day = "dd";

    /**
     * 获得当前时间
     *
     * @param type
     * @return String
     */
    public static String getCurrentDateTime(Integer type) {
        String pattern = "";
        switch (type) {
            case 1:
                pattern = ymd;
                break;
            case 2:
                pattern = ymdhm;
                break;
            case 3:
                pattern = ymdhms;
                break;
            case 4:
                pattern = ymdhmss;
                break;
            case 5:
                pattern = hm;
                break;
            case 6:
                pattern = hms;
                break;
            default:
                pattern = ymd;
        }
        SimpleDateFormat sdf = new SimpleDateFormat(pattern, Locale.ENGLISH);
        return sdf.format(new Date());
    }

    /**
     * 获得指定日期的前一天
     *
     * @param dateStr
     * @return Date
     * @throws ParseException
     */
    public static Date getYesterday(String dateStr) throws ParseException {
        Date date = stringToDate(dateStr, 1);
        return new Date(date.getTime() - 86400000L);
    }

    /**
     * 获得指定日期的后一天
     *
     * @param dateStr
     * @return Date
     * @throws ParseException
     */
    public static Date getNextDay(String dateStr) throws ParseException {
        Date date = stringToDate(dateStr, 1);
        return new Date(date.getTime() + 86400000L);
    }

    /**
     * 获得指定日期的上一个月的这一天
     *
     * @param dateStr
     * @return date
     * @throws ParseException
     */
    public static Date getLastMonthDay(String dateStr) throws ParseException {
        Calendar c = Calendar.getInstance();
        c.setTime(stringToDate(dateStr, 1));
        c.add(Calendar.MONTH, -1);
        return new Date(c.getTime().getTime());
    }

    /**
     * 比较2个日期的大小
     *
     * @param dateStr2 ,
     *                 String
     * @return boolean
     * @throws ParseException
     */
    public static boolean compare_date(Date date1, String dateStr2) throws ParseException {
        Date date2 = stringToDate(dateStr2, 1);
        if (date1.getTime() < date2.getTime()) {
            return true;
        }
        return false;
    }

    /**
     * 获得当前年份
     *
     * @return String
     */
    public static String getCurrentYear() {
        SimpleDateFormat sdf = new SimpleDateFormat(year, Locale.ENGLISH);
        return sdf.format(new Date());
    }

    /**
     * 获得当前月份
     *
     * @return String
     */
    public static String getCurrentMonth() {
        SimpleDateFormat sdf = new SimpleDateFormat(month, Locale.ENGLISH);
        return sdf.format(new Date());
    }

    /**
     * 获得当前日期
     *
     * @return String
     */
    public static String getCurrentDay() {
        SimpleDateFormat sdf = new SimpleDateFormat(day, Locale.ENGLISH);
        return sdf.format(new Date());
    }

    /**
     * 时间String转换为Date类型
     *
     * @param date ,
     *             Integer
     * @return Date
     * @throws ParseException
     */
    public static Date stringToDate(String date, Integer type) throws ParseException {
        String pattern = "";
        switch (type) {
            case 1:
                pattern = ymd;
                break;
            case 2:
                pattern = ymdhm;
                break;
            case 3:
                pattern = ymdhms;
                break;
            case 4:
                pattern = ymdhmss;
                break;
            case 5:
                pattern = hms;
                break;
            default:
                pattern = ymd;
        }
        SimpleDateFormat sdf = new SimpleDateFormat(pattern, Locale.ENGLISH);
        return sdf.parse(date);
    }

    /**
     * 时间Date转换为String类型
     *
     * @param date ,
     *             Integer
     * @return String
     * @throws ParseException
     */
    public static String dateToString(Date date, Integer type) throws ParseException {
        String dateStr = null;
        if (date != null) {
            String pattern = "";
            switch (type) {
                case 1:
                    pattern = ymd;
                    break;
                case 2:
                    pattern = ymdhm;
                    break;
                case 3:
                    pattern = ymdhms;
                    break;
                case 4:
                    pattern = ymdhmss;
                    break;
                default:
                    pattern = ymd;
            }
            SimpleDateFormat sdf = new SimpleDateFormat(pattern, Locale.ENGLISH);
            dateStr = sdf.format(date);
        }
        return dateStr;
    }

    /**
     * 根据开始和结束日期判断指令状态
     *
     * @param startTime ,String
     * @return String
     * 0 未开始
     * 1 已结束
     * 2 执行中
     * @throws ParseException
     */
    public static String getCommandStatus(String startTime, String endTime) throws ParseException {
        Date startDate = stringToDate(startTime, 1);
        Date endDate = stringToDate(endTime, 1);
        Date today = stringToDate(getCurrentDateTime(1), 1);
        String commandStatus = "2";
        if (startDate.getTime() > today.getTime()) {
            commandStatus = "0";
        } else if (endDate.getTime() < today.getTime()) {
            commandStatus = "1";
        }
        return commandStatus;
    }

    /**
     * 获取时间范围的开始时间
     *
     * @param timeRange
     * @return String
     */
    public static String getStartTime(String timeRange) {
        String[] strArray = timeRange.split(" - ");
        return strArray[0];
    }

    /**
     * 获取时间范围的结束时间
     *
     * @param timeRange
     * @return String
     */
    public static String getEndTime(String timeRange) {
        String[] strArray = timeRange.split(" - ");
        return strArray[1];
    }

    // 返回天转化为秒的long数字
    public static int getSecondFromDay(Integer day) {
        return day * 24 * 60 * 60;
    }

}