package com.lianxing.logistics.controller.information;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.util.ResourceUtils;
import net.sf.json.JSONObject;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class SummernoteUploadController extends BaseController {

    private static Logger logger = LogManager.getLogger(SummernoteUploadController.class);

    @Transactional
    @ResponseBody
    @RequestMapping(value = "/summernote/fileupload")
    public synchronized JSONObject upload(HttpServletRequest request) {
        logger.info("[start] /summernote/fileupload");
        // 网站地址
        String webServerUploadInforUrl = "";
        webServerUploadInforUrl = ResourceUtils.get("sys", "webServerUploadInforUrl");
        logger.info("[webServerUploadInforUrl]:" + webServerUploadInforUrl);
        // 网站部署物理绝对路径地址
        String webServerUploadInforLocation = "";
        webServerUploadInforLocation = ResourceUtils.get("sys", "webServerUploadInforLocation");
        logger.info("[webServerUploadInforLocation]:" + webServerUploadInforLocation);
        // 转换为文件类型的request
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        // 获取对应file对象
        Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
        Iterator<String> fileIterator = multipartRequest.getFileNames();
        // 图片存放绝对路径
        String path = webServerUploadInforLocation;
        ConcurrentHashMap resultMap = new ConcurrentHashMap<>(Collections.EMPTY_MAP);
        while (fileIterator.hasNext()) {
            String fileKey = fileIterator.next();
            // 获取对应文件
            MultipartFile multipartFile = fileMap.get(fileKey);
            if (multipartFile.getSize() != 0L) {
                String imgName = "";
                try {
                    String[] split = multipartFile.getOriginalFilename().split("\\.", -1);
                    imgName = System.currentTimeMillis() + "." + split[split.length == 0 ? 0 : split.length - 1];
                    String strPath = path;
                    File filePath = new File(strPath);
                    if (!filePath.exists()) {
                        filePath.mkdirs();
                    }
                    multipartFile.transferTo(new File(path, imgName));
                } catch (IllegalStateException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                // 暂时配置到本地的nginx图片服务器
                resultMap.put("url", webServerUploadInforUrl + imgName);
                logger.info("[url] --->>>>>" + imgName);
                resultMap.put("message", "SUCCESS");
                resultMap.put("name", imgName);
                logger.info("[end] /summernote/fileupload");
                logger.info("url: " + webServerUploadInforUrl + imgName);
            } else {
                logger.info("[error] /summernote/fileupload");
                resultMap.put("message", "ERROR");
            }
        }
        return JSONObject.fromObject(resultMap);
    }

}
