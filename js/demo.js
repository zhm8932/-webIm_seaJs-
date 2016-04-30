define(function(require,exports,module){
    //var utils = require('../utils');
	require('./jquery');
    require('./sdk/easemob.im-1.1');
    require('./sdk/easemob.im-1.1.shim');
    //var imConfig = require('../easemob.im.config');
    $(function () {
        var $body = $('body')
        var $chatBox = $('.chatBox')

        var getLoacalTimeString = function getLoacalTimeString() {
            var date = new Date();
            var time = date.getHours() + ":" + date.getMinutes() + ":"
                + date.getSeconds();
            return time;
        }

        var appendMsg = function(html){
            var $chat01_content = $('.chat01_content')
            $chat01_content.append(html)
            var scrollHeight = $chat01_content[0].scrollHeight
            console.log('$chat01_content:',$chat01_content)
            console.log('scrollHeight:',scrollHeight)
            $chat01_content.scrollTop(scrollHeight)
        }

        var conn = null;
        conn = new Easemob.im.Connection();


        //初始化连接
        conn.init({
            onOpened : function() {
                console.log('登录成功！！')
                conn.setPresence();
            },
            onClosed : function() {
                //处理登出事件
            },
            onTextMessage : function(message){  //收到文本消息处理动作
                var message = message
                var msgHtml = ''
                console.log(message);

                $.each(message,function(key,value){
                    console.log(key,":",value)
                })

                msgHtml += '<div style="text-align:left"><p1 class="master">'+message.from+'</p1> <p2>'+getLoacalTimeString()+'<br></p2> ' +
                    '<p3 classname="chat-content-p3" class="chat-content-p3">'+message.data+' </p3> </div>'

                appendMsg(msgHtml)
                console.log(msgHtml)
                console.log("收到文本消息处理动作");
            },
            //收到联系人信息的回调方法
            onRoster : function (message){
                /**
                 [{
                groups: [{0: "default",
                        length: 1}],
                jid: "easemob-demo#chatdemoui_l2@easemob.com",
                name: "l2",
                subscription: "to"
            }]
                 */
                console.log("onRoster:",message)
            },
            onError : function(e) {
                //异常处理
                //alert(e.msg);
            }
        });
        //发送文字消息
        $body.on('click','.sendMsg',function(){
            sendText();
        })
        var sendText = function() {
            var username = $('.chat02_title').attr('data-username')
            var sendMsgHtml = ''
            console.log('开始发送消息')
            var msg = $('textarea').val();
            var to = $("#sendto").val();
            var options = {
                to : 'zhm0302',  //用户登录名，sd根据appkey和domain组织jid，如easemob-demo#chatdemoui_**TEST**@easemob.com，中"to:TEST",下同
                msg : msg,
                type : "chat"
            };

            if(msg){
                conn.sendTextMessage(options);   ////发送文本消息接口
                sendMsgHtml +='<div style="text-align:right"><p1 class="customer">'+username+'</p1> <p2>'+getLoacalTimeString()+'<br></p2> ' +
                    '<p3 classname="chat-content-p3" class="chat-content-p3">'+options.msg+' </p3> </div>'
                appendMsg(sendMsgHtml)
                $('textarea').val('');
            }

        };

        //获取当前登录人的联系人列表
        conn.getRoster({
            success : function(roster) {
                //获取好友列表，并进行好友列表渲染，roster格式为：
                /** [
                 {
                     jid:"asemoemo#chatdemoui_test1@easemob.com",
                     name:"test1",
                     subscription: "both"
                 },
                 {
                     jid:"asemoemo#chatdemoui_test2@easemob.com",
                     name:"test2",
                     subscription: "from"
                 }
                 ]
                 */
                for(var i in roster){
                    var ros = roster[i];
                    //ros.subscriptio值为both/to为要显示的联系人,此处与APP需保持一致，才能保证两个客户端登录后的好友列表一致
                    if(ros.subscription =='both' || ros.subscription=='to'){
                        console.log("ros:",ros)
                        //newroster.push(ros);
                    }
                }
                //if (newroster.length >=0) {
                //    buildContactDiv("contractlist", newroster);//页面处理
                //    if (newroster.length > 0) {
                //        setCurrentContact(newroster[0].name);//页面处理将第一个联系人作为当前聊天div
                //    }
                //}
                //conn.setPresence();
            }
        });



        $body.on('click','.close',function(){
            /*
			var popup = new utils.Popup({
                msg:'<aside><h5>提示：退出对话后消息记录将不存在</h5>',
                okText:'确定',
                width:'360',
                //  isHide:false,
                okCallback:function(){

                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:'退出会话成功!!'
                    }).hideMsg(function(){
                        $chatBox.fadeOut()
                        //sdk关闭连接并处理连接状态为CLOSED
                        conn.close();
                    })


                }
            })
			*/
        })

        $('body').on('click', '.chatBtn', function() {
            var username = $("#usename").val()||"zhm8932";
            var pass = $("#password").val();
            //打开开连接
            conn.open({
                user : username,
                pwd : 'zhm123456',
                appKey : 'easemob-demo#chatdemoui'
            });
            $('.chat02_title').attr('data-username','zhm8932')

            var displayName = 'zhm0302'
            $chatBox.fadeIn();
            $(".masterUser").html(username)
            $('#talkTo').html('<a href="#">' + displayName + '</a>');
        })
    })


})