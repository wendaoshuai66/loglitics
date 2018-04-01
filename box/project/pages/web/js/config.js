document.write("<script language=javascript src='./js/config_local.js'></script>");

//=====================================================
//幻灯图片尺寸
var slideImageWidth = 500;
var slideImageHeight = 300;//黄金比例0.618
// 库存管理中物料剩余不足预警设置最大值（最小值为1）
var maxAlarmValue = 99999;
// 获取需要权限才能访问的菜单
var getAuthorityState = (function () {
    return [
        'suggestionAdd', 'repairRecordsAdd', 'lostAdd', 'foundAdd', 'fleaMarketAddSale', 'fleaMarketAddPurchase', 'dutyList',
        'workLogAdd','profile.view', 'myRecordsList','myFleaMarketListSale',
        'myFleaMarketListPurchase','myLostList','myFoundList','mySuggestionList','myRepairList','materialList',
        'materialUse','dutyList','myWorkLogList'
    ];
})();
var allSensitiveName = ['null'];
var uploadImgMaxCount = 10;
//
var schoolName = "陕西职业技术学院后勤保障部";