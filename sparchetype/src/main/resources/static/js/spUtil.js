// 工具类
var spUtil = {};

/**
 * 提交表单
 * @param param
 */
spUtil.submitForm = function(options) {
    // 默认配置
    var defaultConfig = {
        type: "POST",
        async: true,
        success: function (result) {
            if (result.code === 0) {
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //刷新父页面，注意一定要在关闭当前iframe层之前执行刷新
                parent.location.reload();
                //关闭当前frame
                parent.layer.close(index);
            } else {
                layer.alert(result.msg, {
                    icon: 2
                });
            }
        },
        error: function (e) {
            layer.alert(e, {
                icon: 2
            });
        }
    };

    var config = $.extend({}, defaultConfig, options, {
        // 此处写覆盖默认和传参配置
    });

    $.ajax(config);
};

/**
 * Ajax 请求
 */
spUtil.ajax = function (options) {
    var _this = this, loadingIndex;
    var opt = $.extend({}, {
        async: true,
        dataType: 'json',
        type: 'GET',
        serializable: false,
        selfProcessShow: false
    }, options);

    opt.beforeSend = function () {
        if (options.showLoading) {
            loadingIndex = layer.load();
        }
        options.beforeSend && options.beforeSend();
    };

    // 获取请求地址
    opt.url = _this.generateUrl(options.url);
    // 成功回调
    opt.success = function (data) {
        if (data.code === 0) {
            options.success && options.success(data);
        } else {
            if (!options.errNoTip) {
                tnComp.operationTip(data.msg, 'error');
                layer.alert('操作失败，请重试！', {
                    icon: 2
                });
            }
        }
    };
    // 失败回调
    opt.error = function (jqXHR, textStatus, errorThrown) {
        if (_this.sessionCheck(jqXHR, textStatus, errorThrown, options.sessionNoTip)) {
            return;
        }

        if (options.error) {
            options.error();
        } else {
            layer.alert('操作失败，请重试！', {
                icon: 2
            });
        }
    };

    // 请求完成回调
    opt.complete = function () {
        options.complete && options.complete();
        options.showLoading ? layer.close(loadingIndex) : '';
    };

    // json参数序列化
    if (opt.serializable) {
        opt.contentType = 'application/json';
        opt.data = JSON.stringify(opt.data);
    }

    var ajax = $.ajax(opt);
    return ajax;
};

/**
 * session失效处理
 * @returns {boolean}
 */
spUtil.sessionCheck = function (jqXHR, textStatus, errorThrown, sessionNoTip) {
    if (jqXHR.status === 401) {
        if (!sessionNoTip) {
            tnComp.operationTipCallback('登录状态已失效，请重新登录！', 'error', function () {
                top.location = '/';
            });
        } else {
            // session超时，不提示直接跳转
            top.location = '/';
        }
        return true;
    }
};

/**
 * 将对象转为url路径字符串参数（编码之后的字符串）
 * @param param
 * @param key
 * @returns {string}
 */
spUtil.parseParam = function (a) {
    var s = [],
        rbracket = /\[\]$/,
        isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        add = function (k, v) {
            v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
            s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
        },
        buildParams = function (prefix, obj) {
            var i, len, key;

            if (prefix) {
                if (isArray(obj)) {
                    for (i = 0, len = obj.length; i < len; i++) {
                        if (rbracket.test(prefix)) {
                            add(prefix, obj[i]);
                        } else {
                            buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i]);
                        }
                    }
                } else if (obj && String(obj) === '[object Object]') {
                    for (key in obj) {
                        buildParams(prefix + '[' + key + ']', obj[key]);
                    }
                } else {
                    add(prefix, obj);
                }
            } else if (isArray(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    add(obj[i].name, obj[i].value);
                }
            } else {
                for (key in obj) {
                    buildParams(key, obj[key]);
                }
            }
            return s;
        };

    return buildParams('', a).join('&').replace(/%20/g, '+');
};

/**
 * 解析url路径参数为对象
 * @param url
 */
spUtil.parseQueryString = function (url) {
    var obj = {};
    var keyvalue = [];
    var key = "",
        value = "";
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    for (var i in paraString) {
        keyvalue = paraString[i].split("=");
        key = keyvalue[0];
        value = decodeURIComponent(keyvalue[1]);
        obj[key] = value;
    }
    return obj;
};