package com.lianxing.logistics.controller.user;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.User;
import com.lianxing.logistics.service.TeacherServiceImpl;
import com.lianxing.logistics.util.HttpUtil;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONObject;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller
public class TeacherController extends BaseController {

    private static Logger logger = LogManager.getLogger(TeacherController.class);

    @Autowired
    private TeacherServiceImpl teacherService;

    @Autowired
    private UserController userController;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getTeacherList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getTeacherList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = teacherService.getPageInfo(request);
            // 拼接HQL以及SQL需要的Map
            Map<String, Map> paraMap = teacherService.getSeachMapInfo(request);
            // 获取满足查询条件并分页后的对象(校区管理不需要分页不需要查询,传入空)
            List<User> list = teacherService.getList(page, paraMap, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = teacherService.getTeacherAllCountFromPara(paraMap, true);
            json = getTableData(list, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 添加/修改教员信息
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/saveTeacher", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> saveTeacher(HttpServletRequest request) {
        JSONObject json = registerUser(request);
        String apiName = "saveTeacher";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 修改教员的启用状态
     *
     * @param statusType 确定修改什么状态
     * @param id         修改的实体id
     * @return 状态修改
     */
    @Transactional
    @RequestMapping(value = "/changeTeacherStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = changeUserStatus(statusType, id, request);
        userController.sendSuccessMessageForUser(statusType, id);
        String apiName = "changeTeacherStatus";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 根据Id删除对应的教员(逻辑删除)
     *
     * @param id 校区Id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteTeacher", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = deleteCommon(id);
        String apiName = "deleteTeacher";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 重置教员密码
     *
     * @param id 校区Id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/resetPswTeacher", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> resetPswTeacher(@RequestParam("id") String id) {
        JSONObject json = resetPswUserCommon(id);
        String apiName = "resetPswTeacher";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

}
