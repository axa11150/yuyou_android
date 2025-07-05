"ui";

importClass(android.content.Context);
importClass(android.provider.Settings);
const PackageName = context.getPackageName();
//浏览器下载
importClass(android.net.Uri);
importClass(android.content.Intent);
// 登录弹出框
importClass(android.widget.PopupWindow);
importClass(android.view.Gravity);
importClass(android.view.ViewGroup);
importClass(android.view.animation.ScaleAnimation);
importClass(android.view.animation.Animation);

var setting = require("./setting.js");
var common = require("./common.js");
var init = require("./init.js");
var goods_add = require("./goods_add.js");
var post_add = require("./post_add.js");
var goods_manage = require("./goods_manage.js");
var order = require("./order.js");
var wbzz = require("./wbzz.js");
var message = require("./message.js");
var ws = require("./ws.js");


// 显示主界面
showMainUI()
threads.start(function () {
    init.run();
});

// 显示主界面
function showMainUI(){
    ui.layout(
        '<drawer id="drawer">\
            <vertical>\
                <appbar>\
                    <toolbar id="toolbar" title="{{sys_msg.sys_name}}"/>\
                    <tabs id="tabs"/>\
                </appbar>\
                <viewpager id="viewpager">\
                    <frame>\
                        <ScrollView><vertical>\
                                <card w="*" h="auto" margin="7 5" cardCornerRadius="6dp" cardElevation="2dp">\
                                    <horizontal>\
                                        <vertical margin="10" layout_gravity="center_vertical" layout_weight="2">\
                                            <text id="username" size="18" color="#444444" text="{{setting.s.get(\'username\',\'请登录账号\')}}"/>\
                                            <text id="end_time"  padding="1" size="15" text="到期时间：{{setting.s.get(\'end_time\',\'2019-07-19 16:00:00\')}}" foreground="?selectableItemBackground"/>\
                                            <text id="phone_name"  padding="1" size="13" text="设备名：{{setting.phone_name}}" />\
                                        </vertical>\
                                        <button id="login" w="88dp" text="{{setting.s.get(\'username\')?\'重新登录\':\'登录账号\'}}"  color="#ff5d85ff" style="Widget.AppCompat.Button.Borderless.Colored"/>\
                                    </horizontal>\
                                </card>\
                                <card w="*" h="auto" margin="7 5" cardCornerRadius="6dp" cardElevation="2dp">\
                                    <vertical>\
                                        <Switch w="*" margin="10 3" textColor="#666666" checked="{{auto.service != null}}" text="开启无障碍服务" id="autoService"/>\
                                        <Switch w="*" margin="10 3" textColor="#666666" checked="{{common.getVersionName(setting.xy_pname) == setting.xy_app_version}}" text="安装xx {{setting.xy_app_version}}" id="initXyApp"/>\
                                        <horizontal w="*" margin="20 0">\
                                            <text >当前版本：</text>\
                                            <text id="now_xyv">{{common.getVersionName(setting.xy_pname)}}</text>\
                                            <button id="down_xy"  h="30" padding="8 0" text="浏览器下载" color="#ff5d85ff" style="Widget.AppCompat.Button.Borderless.Colored"/>\
                                        </horizontal>\
                                        <Switch w="*" margin="10 3" textColor="#666666" checked="" text="连接总服务器" id="initWs"/>\
                                        <Switch w="*" margin="10 3" textColor="#666666" checked="" text="屏幕截图权限" id="jietu"/>\
                                        <Switch w="*" margin="10 3" textColor="#666666" checked="true" text="内核自动更新" id=""/>\
                                        <Switch w="*" margin="10 3" textColor="#666666" checked="true" text="程序后台运行" id="IgnoredPower"/>\
                                        <Switch w="*" margin="10 3" textColor="#666666" checked="{{ui_log_floaty_status()}}" text="悬浮运行日志" id="log_floaty"/>\
                                    </vertical>\
                                </card>\
                                <card w="*" layout_weight="1" margin="7 5" cardCornerRadius="6dp" cardElevation="2dp">\
                                    <vertical margin="0 5">\
                                        <horizontal>\
                                            <text margin="10 3">心跳保活线程：</text>\
                                            <text color="#ff5d85ff" margin="1 4" id="xintiao">网络状态检测中...</text>\
                                        </horizontal>\
                                        <horizontal>\
                                            <text margin="10 3">后台弹出界面：</text>\
                                            <text color="#ff5d85ff" margin="1 4" id="houtai_tanchu">权限状态检测中...</text>\
                                        </horizontal>\
                                        <horizontal>\
                                            <text margin="10 3">程序内核版本：</text>\
                                            <text id="android_banben" color="#ff5d85ff" margin="1 4">{{setting.v2}}</text>\
                                        </horizontal>\
                                        <horizontal>\
                                            <text margin="10 3">设备内存剩余：</text>\
                                            <text id="AvailMem" color="#ff5d85ff" margin="1 4">{{Math.round(device.getAvailMem()/(1024*1024))}}M</text>\
                                        </horizontal>\
                                        <horizontal>\
                                            <text margin="10 3">设备安卓版本：</text>\
                                            <text id="android_ver" color="#ff5d85ff" margin="1 4">检测中...</text>\
                                        </horizontal>\
                                    </vertical>\
                                </card>\
                                <card w="*" layout_weight="1" margin="7 5" cardCornerRadius="6dp" cardElevation="2dp">\
                                    <vertical margin="0 5">\
                                        <text margin="10 3">程序任务队列：</text>\
                                        <text color="#ff5d85ff" margin="10 3" ellipsize="end" ems="20" line="5" id="task_list_text" text="任务队列正常|等待任务中..."></text>\
                                    </vertical>\
                                </card>\
                        </vertical></ScrollView>\
                    </frame>\
                    <frame>\
                        <card w="*" h="*" margin="7 5" cardCornerRadius="6dp" cardElevation="2dp">\
                            <vertical margin="2">\
                                {/* <text text="基础功能:" margin="3"/>\
                                <horizontal >\
                                    <button layout_weight="1" id="clear_img" text="清除缓存"/>\
                                    <button layout_weight="1" id="clear_task" text="清空队列"/>\
                                    <button layout_weight="1" id="restart_task" text="重启队列"/>\
                                    <button layout_weight="1" id="restart_app" text="重启内核"/>\
                                </horizontal> */}\
                                <text text="xx功能:" margin="3"/>\
                                <horizontal >\
                                    <Switch layout_weight="1" margin="3 3" textColor="#666666" checked="false" text="消息自动回复|聚合聊天|自动上架" id="auto_monitor"/>\
                                </horizontal>\
                                <horizontal >\
                                    <button layout_weight="1" id="yanghao" text="xxxx"/>\
                                    <button layout_weight="1" id="yanghao_unity" text="xxxx"/>\
                                    <button layout_weight="1" id="yanghao_tz" text="xxxx"/>\
                                    <button layout_weight="1" id="re_edit" text="xxxx"/>\
                                </horizontal>\
                                <horizontal >\
                                    <button layout_weight="1" id="xy_goods_polish" text="擦亮商品"/>\
                                    <button layout_weight="1" id="xy_goods_shelf_up" text="上架商品"/>\
                                    <button layout_weight="1" id="xy_goods_shelf_down" text="下架商品"/>\
                                    <button layout_weight="1" id="xy_del_down_goods" text="删除商品"/>\
                                </horizontal>\
                                <horizontal >\
                                    <button layout_weight="1" id="xy_init" text="绑定xx"/>\
                                    <button layout_weight="1" id="register" text="签到鱼币"/>\
                                    <button layout_weight="1" id="xy_goods_price_cut" text="一键降价"/>\
                                    <button layout_weight="1" id="remove_dongtai" text="删除动态"/>\
                                </horizontal>\
                                <horizontal >\
                                    <button layout_weight="1" id="del_message" text="删除消息"/>\
                                    <button layout_weight="1" id="remove_liuyan" text="删除留言"/>\
                                    <button layout_weight="1" id="xy_post_del" text="删除帖子"/>\
                                    <button layout_weight="1" id="first_show" text="优先曝光"/>\
                                </horizontal>\
                                <horizontal >\
                                    <button layout_weight="1" id="fast_goods_del" text="快速下架"/>\
                                    <button layout_weight="1" id="xy_goods_get" text="宝贝信息"/>\
                                    <button layout_weight="1" id="fast_re_edit" text="快速编辑"/>\
                                    <button layout_weight="1" id="get_order" text="同步订单"/>\
                                </horizontal>\
                                <text text="xx功能:" margin="3"/>\
                                <horizontal >\
                                    <button layout_weight="1" id="zz_goods_rub" text="擦亮商品"/>\
                                    <button layout_weight="1" id="zz_goods_up" text="上架商品"/>\
                                    <button layout_weight="1" id="zz_goods_down" text="下架商品"/>\
                                    <button layout_weight="1" id="zz_goods_del" text="删除商品"/>\
                                </horizontal>\
                                <horizontal >\
                                    <button layout_weight="1" id="zz_yanghao" text="xxxx"/>\
                                    <button layout_weight="1" id="zz_re_edit" text="流量模式"/>\
                                    <button layout_weight="1" id="" text="暂无功能"/>\
                                    <button layout_weight="1" id="open_zz" text="启动xx"/>\
                                </horizontal>\
                            </vertical>\
                        </card>\
                    </frame>\
                    <frame>\
                        <vertical>\
                            <card w="*" h="*" margin="7 5" cardCornerRadius="6dp" cardElevation="2dp">\
                                <vertical  h="*">\
                                    <Switch w="*" margin="10 3" textColor="#666666" checked="{{common.getVersionName(setting.zz_pname) == setting.zz_app_version}}" text="安装xx {{setting.zz_app_version}}" id="initZzApp"/>\
                                    <horizontal w="*" margin="20 0">\
                                        <text >当前版本：</text>\
                                        <text id="now_zzv">{{common.getVersionName(setting.zz_pname)}}</text>\
                                        <button id="down_zz"  h="30" padding="8 0" text="浏览器下载" color="#ff5d85ff" style="Widget.AppCompat.Button.Borderless.Colored"/>\
                                    </horizontal>\
                                    <Switch w="*" margin="10 3" textColor="#666666" checked="{{common.getVersionName(setting.pdd_pname) == setting.pdd_app_version}}" text="安装xx {{setting.pdd_app_version}}" id="initPddApp"/>\
                                    <horizontal w="*" margin="20 0">\
                                        <text >当前版本：</text>\
                                        <text id="now_pddv">{{common.getVersionName(setting.pdd_pname)}}</text>\
                                        <button id="down_pdd"  h="30" padding="8 0" text="浏览器下载" color="#ff5d85ff" style="Widget.AppCompat.Button.Borderless.Colored"/>\
                                    </horizontal>\
                                    <Switch w="*" margin="10 3" textColor="#666666" checked="{{common.getVersionName(setting.xhs_pname) == setting.xhs_app_version}}" text="安装xx {{setting.xhs_app_version}}" id="initXhsApp"/>\
                                    <horizontal w="*" margin="20 0">\
                                        <text >当前版本：</text>\
                                        <text id="now_xhsv">{{common.getVersionName(setting.xhs_pname)}}</text>\
                                        <button id="down_xhs"  h="30" padding="8 0" text="浏览器下载" color="#ff5d85ff" style="Widget.AppCompat.Button.Borderless.Colored"/>\
                                    </horizontal>\
                                </vertical>\
                                <text h="20" layout_gravity="left|bottom" text="如您希望能控制其他软件，可以向管理员反应" margin="12 1" textColor="#666666"  textSize="12sp"/>\
                            </card>\
                        </vertical>\
                    </frame>\
                    <frame>\
                        <card w="*" h="*" margin="7 5" cardCornerRadius="6dp" cardElevation="2dp">\
                            <vertical padding="8" h="auto">\
                                <vertical >\
                                    <com.stardust.autojs.core.console.ConsoleView  id="console"  h="*"/>\
                                </vertical>\
                            </vertical>\
                        </card>\
                    </frame>\
                </viewpager>\
            </vertical>\
        </drawer>'
    );
    
    //创建选项菜单(右上角)
    ui.emitter.on("create_options_menu", menu=>{
        menu.add("关于");
    });
    //监听选项菜单点击
    ui.emitter.on("options_item_selected", (e, item)=>{
        switch(item.getTitle()){
            case "关于":
                toast(sys_msg.sys_name+" v"+setting.v);
                break;
        }
        e.consumed = true;
    });
    activity.setSupportActionBar(ui.toolbar);
    
    //设置滑动页面的标题
    ui.viewpager.setTitles(["xx环境", "常用功能", "其他环境", "运行日志"]);
    //让滑动页面和标签栏联动
    ui.tabs.setupWithViewPager(ui.viewpager);

    // 设置控制台字体颜色
    ui.console.setConsole(runtime.console);
    try {
        //隐藏输入框
        ui.console.setInputEnabled(false);
        // 自定义日志颜色
        ui.console.setColor("V", "#c2c2c2");
        ui.console.setColor("D", "#cc000000");
        ui.console.setColor("I", "#009688");
        ui.console.setColor("W", "#1E9FFF");
        ui.console.setColor("E", "#FF5722");
    } catch (e) {
        let c = new android.util.SparseArray();
        let Log = android.util.Log;
        c.put(Log.VERBOSE, new java.lang.Integer(colors.parseColor("#c2c2c2")));
        c.put(Log.INFO, new java.lang.Integer(colors.parseColor("#009688")));
        c.put(Log.ERROR, new java.lang.Integer(colors.parseColor("#FF5722")));
        c.put(Log.WARN, new java.lang.Integer(colors.parseColor("#1E9FFF")));
        c.put(Log.DEBUG, new java.lang.Integer(colors.parseColor("#cc000000")));
        c.put(Log.ASSERT, new java.lang.Integer(colors.parseColor("#ffff534e")));
        ui.console.setColors(c);
        try {
            input_container = activity.findViewById(context.getResources().getIdentifier("input_container", "id", context.getPackageName()));
            input_container.attr("visibility", "gone");
        } catch (e) {
            input_container = activity.findViewById(context.getResources().getIdentifier("inputContainer", "id", context.getPackageName()));
            input_container.attr("visibility", "gone");
        }
    }

    // 连接总控
    ui.initWs.on("click", function(){
        if(auto.service == null) {
            ui.initWs.checked = false
            let m = "请先开启无障碍服务";
            toast(m);console.error(m)
            return false;
        }
        main();
    });

    //登录
    ui.login.on("click", function(checked) {
        setting.s.remove('access_token');
        setting.s.remove('username');
        setting.s.remove('end_time');
        showLoginUI()
    });

    // 当用户回到本界面时，resume事件会被触发
    ui.emitter.on("resume", function() {
        console.verbose("回到主界面")
        if(ui.autoService){
            //先判断有没有ui.autoService(在不在主页)  否则手机快速填充密码会报错
            ui.autoService.checked = auto.service != null;
            //忽略电池优化
            // ui.IgnoredPower.checked =  common.IgnoredPower()
            //app版本
            let now_xyv = common.getVersionName(setting.xy_pname)
            let now_zzv = common.getVersionName(setting.zz_pname)
            let now_pddv = common.getVersionName(setting.pdd_pname)
            let now_xhsv = common.getVersionName(setting.xhs_pname)
            ui.initXyApp.checked = now_xyv == setting.xy_app_version
            ui.initZzApp.checked =  now_zzv == setting.zz_app_version  
            ui.initPddApp.checked = now_pddv == setting.pdd_app_version 
            ui.initXhsApp.checked = now_xhsv == setting.xhs_app_version 
            ui.now_xyv.setText(now_xyv)
            ui.now_zzv.setText(now_zzv)
            ui.now_pddv.setText(now_pddv)
            ui.now_xhsv.setText(now_xhsv)
            ui.log_floaty.checked = ui_log_floaty_status();//悬浮运行日志
            ui.auto_monitor.checked = setting.auto_monitor != null && setting.auto_monitor.isAlive()//消息回复
            ui.AvailMem.setText(Math.round(device.getAvailMem()/(1024*1024))+"M")//内存剩余
            houtai_tanchu();//后台弹出界面
            ui.jietu.checked = setting.requestScreenshot;
            // 设置安卓版本
            // ui.android_ver.setText(setting.android_ver_text)
            // ui.android_ver.setTextColor(colors.parseColor(setting.android_ver_color))
        }

        authenticate()  //用户认证
    });

    //无障碍
    ui.autoService.on("check", function(checked) {
        if(checked && auto.service == null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
        }
    });

    // 悬浮运行日志
    ui.log_floaty.on("check", function(checked) {
        if (checked) {
            setting.s.put("log_floaty", true);
            if ($floaty.checkPermission()) {
                show_log_floaty()
                toastLog("悬浮运行日志已开启")
            } else {
                toastLog("请开启悬浮窗权限");
                ui.log_floaty.checked = false;
                $floaty.requestPermission();
            }
        }else{
            setting.s.put("log_floaty", false);
            setting.log_floaty = null
            floaty.closeAll()
        }

    });
    // 屏幕截图权限
    ui.jietu.on("check", function(checked) {
        if(checked && !setting.requestScreenshot) {
            threads.start(function(){
                try {
                    if (requestScreenCapture()) {
                        setting.requestScreenshot = true
                        console.verbose("屏幕截图权限申请成功")
                    }else{
                        setting.requestScreenshot = false
                    }
                } catch (error) {
                    setting.requestScreenshot = false
                }
            });
        }
    });

    //软件版本
    ui.initXyApp.on("check", function(checked) {
        //检测系统环境 App版本
        if(checked){
            let m = ''
            if(common.getVersionName(setting.xy_pname) == setting.xy_app_version){
                m = "xxApp初始化完成"
                toast(m);console.info(m)
            }else{
                if(setting.is_install_app){
                    toastLog("正在下载其他App")
                    ui.initXyApp.checked = false;
                    return
                }
                if(auto.service != null){
                    ui.viewpager.currentItem = 4
                    m = '正在安装xxApp'
                    toast(m);console.log(m)
                    console.log("请等待xxApp安装完成..")
                    threads.start(function(){
                        init.install('xy')
                    });
                }else{
                    m = '请先开启无障碍服务'
                    toast(m);console.log(m)
                    ui.initXyApp.checked = false;
                }
    
            }
        }
    });

    ui.initZzApp.on("check", function(checked) {
        //检测系统环境 App版本
        if(checked){
            if(common.getVersionName(setting.zz_pname) == setting.zz_app_version){
                let m = "xxApp初始化完成"
                toast(m);console.info(m)
            }else{
                if(setting.is_install_app){
                    toastLog("正在下载其他App")
                    ui.initZzApp.checked = false;
                    return
                }
                if(auto.service != null){
                    ui.viewpager.currentItem = 4
                    let m = '正在安装xxApp'
                    toast(m);console.log(m)
                    threads.start(function(){
                        init.install('zz')
                    });
                }else{
                    let m = '请先开启无障碍服务'
                    toast(m);console.log(m)
                    ui.initZzApp.checked = false;
                }
    
            }
        }
    });

    ui.initPddApp.on("check", function(checked) {
        //检测系统环境 App版本
        if(checked){
            if(common.getVersionName(setting.pdd_pname) == setting.pdd_app_version){
                let m = "xxApp初始化完成"
                toast(m);console.info(m)
            }else{
                if(setting.is_install_app){
                    toastLog("正在下载其他App")
                    ui.initPddApp.checked = false;
                    return
                }
                if(auto.service != null){
                    ui.viewpager.currentItem = 4
                    let m = '正在安装xxApp'
                    toast(m);console.log(m)
                    threads.start(function(){
                        init.install('pdd')
                    });
                }else{
                    let m = '请先开启无障碍服务'
                    toast(m);console.log(m)
                    ui.initPddApp.checked = false;
                }
    
            }
        }
    });
    ui.initXhsApp.on("check", function(checked) {
        //检测系统环境 App版本
        if(checked){
            if(common.getVersionName(setting.xhs_pname) == setting.xhs_app_version){
                let m = "xxApp初始化完成"
                toast(m);console.info(m)
            }else{
                if(setting.is_install_app){
                    toastLog("正在下载其他App")
                    ui.initXhsApp.checked = false;
                    return
                }
                if(auto.service != null){
                    ui.viewpager.currentItem = 4
                    let m = '正在安装xxApp'
                    toast(m);console.log(m)
                    threads.start(function(){
                        init.install('xhs')
                    });
                }else{
                    let m = '请先开启无障碍服务'
                    toast(m);console.log(m)
                    ui.initXhsApp.checked = false;
                }
    
            }
        }
    });
    //消息回复
    ui.auto_monitor.on("check", function(checked) {
        if(checked){
            ui.viewpager.currentItem = 4
            if(setting.auto_monitor ==null || !setting.auto_monitor.isAlive()){
                message.auto_monitor()  //消息监听
            }
        }else{
            setting.auto_monitor.interrupt() //关闭消息监听线程
        }
    });

    // 基础任务
    ui.clear_img.on("click", function(checked) {
        toast("清除缓存")
        ui.viewpager.currentItem = 4
        common.clear_img();
        toastLog("清除缓存成功")
    });
    ui.clear_task.on("click", function(checked) {
        toast("清空任务队列")
        ui.viewpager.currentItem = 4
        common.clear_task()
        toastLog("清空任务队列成功")
    });
    ui.restart_task.on("click", function(checked) {
        toast("重启任务队列")
        ui.viewpager.currentItem = 4
        common.restart_task()
        toastLog("重启任务队列成功")
    });
    ui.restart_app.on("click", function(checked) {
        toast("重启内核")
        ui.viewpager.currentItem = 4
        common.restart_aj()
    });

    // 下载
    ui.down_xy.on("click", function(checked) {
        toast("浏览器下载xx")
        ui.viewpager.currentItem = 4
        common.browser_down(setting.xy_app_url);
    });
    ui.down_zz.on("click", function(checked) {
        toast("浏览器下载xx")
        ui.viewpager.currentItem = 4
        common.browser_down(setting.zz_app_url);
    });
    ui.down_pdd.on("click", function(checked) {
        toast("浏览器下载xx")
        ui.viewpager.currentItem = 4
        common.browser_down(setting.pdd_app_url);
    });
    ui.down_xhs.on("click", function(checked) {
        toast("浏览器下载xx")
        ui.viewpager.currentItem = 4
        common.browser_down(setting.xhs_app_url);
    });
    // <button layout_weight="1" id="open_xy" text="启动xx"/>
    // ui.open_xy.on("click", function(checked) {
    //     toast("启动xx")
    //     ui.viewpager.currentItem = 4
    //     threads.start(function(){
    //         common.xy_home();
    //     });
    // });
    ui.open_zz.on("click", function(checked) {
        toast("启动xx")
        ui.viewpager.currentItem = 4
        threads.start(function(){
            common.zz_home();
        });
    });
    // xx
    ui.zz_goods_rub.on("click", function(checked) {
        toast("擦亮商品")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "wbzz.zz_goods_polish"})
    });
    ui.zz_goods_down.on("click", function(checked) {
        toast("下架商品")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "wbzz.zz_goods_shelf_down"})
    });
    ui.zz_goods_up.on("click", function(checked) {
        toast("上架商品")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "wbzz.zz_goods_shelf_up"})
    });
    ui.zz_goods_del.on("click", function(checked) {
        toast("删除商品")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "wbzz.zz_goods_del"})
    });
    ui.zz_yanghao.on("click", function(checked) {
        toast("xxxx")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "wbzz.zz_yanghao"})
    });
    ui.zz_re_edit.on("click", function(checked) {
        toast("流量模式")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "wbzz.zz_re_edit"})
    });
    // xx功能
    ui.yanghao.on("click", function(checked) {
        toast("xxxx")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.yanghao"})
    });
    ui.yanghao_unity.on("click", function(checked) {
        toast("xxxx")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.yanghao_unity"})
    });
    ui.yanghao_tz.on("click", function(checked) {
        toast("会玩xx")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.yanghao_tz"})
    });
    ui.re_edit.on("click", function(checked) {
        toast("编辑重发")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.xy_re_edit"})
    });
    ui.fast_re_edit.on("click", function(checked) {
        toast("快速编辑")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.xy_fast_re_edit"})
    });

    ui.xy_goods_polish.on("click", function(checked) {
        toast("擦亮商品")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.xy_goods_polish"})
    });
    ui.xy_goods_shelf_up.on("click", function(checked) {
        toast("上架商品")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.xy_goods_shelf_up"})
    });
    ui.xy_goods_shelf_down.on("click", function(checked) {
        toast("下架商品")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.xy_goods_shelf_down"})
    });
    ui.xy_del_down_goods.on("click", function(checked) {
        toast("删除商品")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.xy_del_down_goods"})
    });

    ui.xy_init.on("click", function(checked) {
        toast("绑定xx")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.xy_init"})
    });
    ui.register.on("click", function(checked) {
        toast("签到鱼币")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.register"})
    });
    ui.xy_goods_price_cut.on("click", function(checked) {
        toast("一键降价")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.xy_goods_price_cut"})
    });
    ui.remove_dongtai.on("click", function(checked) {
        toast("删除动态")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.remove_dongtai"})
    });


    ui.del_message.on("click", function(checked) {
        toast("删除消息")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.del_message"})
    });
    ui.remove_liuyan.on("click", function(checked) {
        toast("删除留言")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.remove_liuyan"})
    });
    ui.xy_post_del.on("click", function(checked) {
        toast("删除xx帖子")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "post_add.xy_post_del"})
    });
    ui.first_show.on("click", function(checked) {
        toast("优先曝光")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.first_show"})
    });
    ui.fast_goods_del.on("click", function(checked) {
        toast("快速下架")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.fast_goods_del"})
    });
    
    ui.xy_goods_get.on("click", function(checked) {
        toast("宝贝信息")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "goods_manage.xy_goods_get"})
    });
    ui.get_order.on("click", function(checked) {
        toast("同步订单")
        ui.viewpager.currentItem = 4
        setting.task_list.push({"task_type": "order.get_order"})
    });

}

function showLoginUI() {
    var view = ui.inflate(
        '<vertical layout_weight="1" gravity="center" bg="#00ffffff">\
            <vertical gravity="center" margin="25" bg="#ffffff">\
            <text text="{{sys_msg.sys_name}}系统账号" size="15" color="#000000" padding="24 10" />\
            <vertical margin="25 0 25 10">\
                <linear>\
                <text gravity="center" color="#555555" size="17" text="账号 " />\
                <input textColor="#000000" id="username2" w="*" />\
                </linear>\
                <linear>\
                <text gravity="center" color="#555555" size="17" text="密码 " />\
                <input textColor="#000000" id="password2" w="*" password="true" />\
                </linear>\
            </vertical>\
            <relative>\
                <button id="cancel2" layout_alignParentLeft="true" text="取消" style="Widget.AppCompat.Button.Borderless.Colored" w="auto"/>\
                <button id="login2" layout_alignParentRight="true" text="登录" style="Widget.AppCompat.Button.Borderless.Colored" w="auto"/>\
            </relative>\
            </vertical>\
        </vertical>',
        null,
        false
      );
      let mPopWindow = new PopupWindow(
        view,
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT,
        true
    ); //参数为1.View 2.宽度 3.高度
    mPopWindow.setFocusable(true);
    mPopWindow.setOutsideTouchable(false);
    mPopWindow.setContentView(view);
    
    mPopWindow.setOnDismissListener(
        new PopupWindow.OnDismissListener({
        onDismiss: function () {
            backgroundAlpha(1);
        },
        })
    );
    
    mPopWindow.showAtLocation(activity.getWindow().getDecorView(), Gravity.CENTER, 0, 0);
    //动画
    let myAnim = new ScaleAnimation(0, 1, 0, 1, Animation.RELATIVE_TO_SELF, 0.5, 1, 0.5);
    myAnim.setDuration(500);
    view.startAnimation(myAnim);
    backgroundAlpha(0.5);
    
    view.login2.click(function () {
        if(!view.username2.text()){
            toastLog("请输入账号")
        }else if(!view.password2.text()){
            toastLog("请输入密码")
        }else{
            check_name_pwd(view.username2.text(),view.password2.text())
            mPopWindow.dismiss();
        }

    });
    view.cancel2.click(function () {
        mPopWindow.dismiss();
    });
}

// 如果条件具备，且未手动启动过main 
var atto_start_main =  setInterval(function(){
    if(auto.service != null) {
        if(setting.main_threads ==null || !setting.main_threads.isAlive()){
            main();
            clearInterval(atto_start_main);
        }
    }
},1500)


if(ui_log_floaty_status()){
    show_log_floaty()
}
houtai_tanchu()
requestScreenshot()
setTimeout(function(){
    common.start_task_list()
},2500)

function main() {
    // 这里写脚本的主逻辑
    setting.main_threads = threads.start(function () {
        if(common.getVersionName(setting.xy_pname) != setting.xy_app_version){
            ui.run(function(){
                ui.initWs.checked = false
            });
            let m = "请先安装指定版本的xx"
            toast(m);console.error(m)
            return false
        }
        if(setting.ws_status){
            console.info('大功告成，您可以在云端控制该终端了~');
        }else{
            ws.run();
        }
        // 防干扰线程
        common.interference()
        events.on("exit", function(){
            try {
                setting.allow_ws_re =false;
                setting.ws.cancel();
                setting.interference.interrupt()
            } catch (error) {
                console.error("程序退出时出错：")
                console.error(error)
            }

        });
    });

}

// 认证
function authenticate(){
    threads.start(function(){
        // console.log('开始检查jwt')
        if(setting.s.contains('access_token')){
            try {

            } catch (error) {
                console.verbose("检查jwt异常")
                console.error(error)
            }
        }else{
            toastLog('请先进行登录');
        }
    })
    
}

// 登录
function check_name_pwd(uname,pwd){
    threads.start(function(){
        console.log('开始验证用户名和密码...')
        var url = setting.api_domain + "login";
        var res = http.post(url, {
            "name": uname,
            "pwd": pwd,
            "is_mobile": true,
            "phone_info":common.mobile_info(),
        });

        let r = res.body.json();
        // console.verbose(r)
        if(r.code === 0){
            // 处理时间到标准格式
            setting.s.put("end_time", r.data.authorize_end_time);
            var end_time = setting.s.get("end_time")
            console.log("到期时间："+end_time)
            end_time=end_time.replace(/-/g,':').replace(' ',':');
            end_time=end_time.split(':');
            let end_time1 = new Date(end_time[0],(end_time[1]-1),end_time[2],end_time[3],end_time[4],end_time[5]);
            // 如果已到期
            if(new Date(end_time1) - new Date() <0){
                toast("请在总控端激活系统后再尝试登录");
                console.error("请在总控端激活系统后再尝试登录");
            }else{
                //写入access_token
                setting.s.put("access_token", r.data.access_token);
                setting.s.put("username", r.data.name);
                setting.s.put("end_time", r.data.authorize_end_time);
                ui.post(function(){
                    ui.username.setText(setting.s.get("username"));
                    ui.login.setText("重新登录");
                    ui.end_time.setText("到期时间："+setting.s.get("end_time"));
                })
                if(setting.s.contains('access_token')){
                    console.log('写入jwt成功');
                    toast('登录成功');
                    console.info('登录成功')
                }
            }
        }else{
            toast(r.msg);
            console.error(r.msg);
        }
    });

}

// 登录弹出框
function backgroundAlpha(bgAlpha) {
    lp = activity.getWindow().getAttributes();
    lp.alpha = bgAlpha; //0.0-1.0
    activity.getWindow().setAttributes(lp);
}
// 显示日志悬浮
function show_log_floaty() {
    if(setting.log_floaty == null){
        let w = floaty.rawWindow(
            '<vertical bg="#90000000" h="1" w="1" id="ConSP"><com.stardust.autojs.core.console.ConsoleView h="*" id="ConS" margin="10"/></vertical>'
        );
        setTimeout(function () {
            w.setSize(device.width*0.6, device.height * 0.16);
            w.setTouchable(false);
            ui.run(() => {
                input_container = w.ConS.findViewById(context.getResources().getIdentifier("input_container", "id", context.getPackageName()));
                input_container.attr("visibility", "gone");
                w.ConS.setConsole(runtime.console);
                let c = new android.util.SparseArray();
                let Log = android.util.Log;
                c.put(Log.VERBOSE, new java.lang.Integer(colors.parseColor("#009688")));
                c.put(Log.INFO, new java.lang.Integer(colors.parseColor("#009688")));
                c.put(Log.ERROR, new java.lang.Integer(colors.parseColor("#FF5722")));
                c.put(Log.WARN, new java.lang.Integer(colors.parseColor("#009688")));
                c.put(Log.DEBUG, new java.lang.Integer(colors.parseColor("#009688")));
                c.put(Log.ASSERT, new java.lang.Integer(colors.parseColor("#009688")));
                w.ConS.setColors(c);
                w.ConSP.attr("w", Math.floor(device.width* 0.6) +"px")
                w.ConSP.attr("h", Math.floor(device.height* 0.16) +"px")
            });
            setting.log_floaty = true            
        },200)
    }
}
function ui_log_floaty_status(params) {
    return setting.s.get('log_floaty',false) && $floaty.checkPermission()
}

// 后台弹出权限
function houtai_tanchu() {
    let has_tanchu = false
    try {
        has_tanchu = context.getSystemService("appops").checkOp(10021, android.os.Binder.getCallingUid(), context.getPackageName()) == 0 
    } catch (e) {
        // 不是小米手机
        has_tanchu = true
    }
    if(has_tanchu){
        ui.run(function(){
            ui.houtai_tanchu.setText("权限正常")
            ui.houtai_tanchu.setTextColor(colors.parseColor('#ff5d85ff'))
        })
    }else{
        let m = "请授予后台弹出界面权限"
        console.error(m);
        ui.run(function(){
            ui.houtai_tanchu.setText(m)
            ui.houtai_tanchu.setTextColor(colors.parseColor('#FF5722'))
        })
    }
}

// 截图权限
function requestScreenshot() {
    threads.start(function () {
        for(let i=0;i<1000;i++){
            sleep(100)
            if(auto.service != null){
                break
            }
        }
        if(auto.service != null){
            // 新建线程,来处理请求截图权限的弹出卡片
            let thread_jietu = threads.start(function () {
                //在新线程执行的代码
                let i = 0;
                while (i < 5) {
                    // log("子线程");
                    clickNode("text", "立即开始")
                    i++;
                }
            });
            //请求截图
            if (!requestScreenCapture()) {
                toast("请求截图失败");console.warn("请求截图失败")
            } else {
                // log("停止线程,请求截图权限成功")
                thread_jietu.interrupt();  //停止线程执行
                console.verbose("屏幕截图权限申请成功")
                setting.requestScreenshot = true
                ui.run(function() {
                    ui.jietu.checked = setting.requestScreenshot;
                })
            };
        }

    });
};
function clickNode(way, content, milliSecond) {
    if (!milliSecond) { milliSecond = 1000 }
    let result = false
    if (!content) {
        return result
    }
    let object
    if (way == "text") {
        object = text(content).visibleToUser(true).findOne(1000);
    } else if (way == "desc") {
        object = desc(content).visibleToUser(true).findOne(1000);
    } else if (way == "id") {
        object = id(content).visibleToUser(true).findOne(1000);
    } else if (way == "className") {
        object = className(content).visibleToUser(true).findOne(1000);
    } else {
        log("clickNode:" + way + " 参数不正确")
    }

    if (object != null) {
        if (object.clickable()) {
            result = object.click()
            result && sleep(milliSecond)
        } else {
            log("clickNode:" + content + " 不可点击")
        }
    } else {
        // log("clickNode:" + content + " 不存在/没找到")
    }

    return result
};