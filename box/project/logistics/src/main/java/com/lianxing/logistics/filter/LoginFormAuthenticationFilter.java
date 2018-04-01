package com.lianxing.logistics.filter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.PasswordHelper;

import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;

public class LoginFormAuthenticationFilter extends FormAuthenticationFilter {

    // private static Logger logger = LogManager.getLogger(LoginFormAuthenticationFilter.class);

    @Override
    protected AuthenticationToken createToken(ServletRequest request, ServletResponse response) {
        String username = getUsername(request);
        String password = getPassword(request);
        // logger.info(username);
        // logger.info(password);
        boolean rememberMe = false;
        return new UsernamePasswordToken(username, PasswordHelper.encryptPassword(password, Const.SALT).toCharArray(),
                rememberMe, getHost(request));
    }
}
