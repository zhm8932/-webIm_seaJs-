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


        //��ʼ������
        conn.init({
            onOpened : function() {
                console.log('��¼�ɹ�����')
                conn.setPresence();
            },
            onClosed : function() {
                //����ǳ��¼�
            },
            onTextMessage : function(message){  //�յ��ı���Ϣ������
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
                console.log("�յ��ı���Ϣ������");
            },
            //�յ���ϵ����Ϣ�Ļص�����
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
                //�쳣����
                //alert(e.msg);
            }
        });
        //����������Ϣ
        $body.on('click','.sendMsg',function(){
            sendText();
        })
        var sendText = function() {
            var username = $('.chat02_title').attr('data-username')
            var sendMsgHtml = ''
            console.log('��ʼ������Ϣ')
            var msg = $('textarea').val();
            var to = $("#sendto").val();
            var options = {
                to : 'zhm0302',  //�û���¼����sd����appkey��domain��֯jid����easemob-demo#chatdemoui_**TEST**@easemob.com����"to:TEST",��ͬ
                msg : msg,
                type : "chat"
            };

            if(msg){
                conn.sendTextMessage(options);   ////�����ı���Ϣ�ӿ�
                sendMsgHtml +='<div style="text-align:right"><p1 class="customer">'+username+'</p1> <p2>'+getLoacalTimeString()+'<br></p2> ' +
                    '<p3 classname="chat-content-p3" class="chat-content-p3">'+options.msg+' </p3> </div>'
                appendMsg(sendMsgHtml)
                $('textarea').val('');
            }

        };

        //��ȡ��ǰ��¼�˵���ϵ���б�
        conn.getRoster({
            success : function(roster) {
                //��ȡ�����б������к����б���Ⱦ��roster��ʽΪ��
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
                    //ros.subscriptioֵΪboth/toΪҪ��ʾ����ϵ��,�˴���APP�豣��һ�£����ܱ�֤�����ͻ��˵�¼��ĺ����б�һ��
                    if(ros.subscription =='both' || ros.subscription=='to'){
                        console.log("ros:",ros)
                        //newroster.push(ros);
                    }
                }
                //if (newroster.length >=0) {
                //    buildContactDiv("contractlist", newroster);//ҳ�洦��
                //    if (newroster.length > 0) {
                //        setCurrentContact(newroster[0].name);//ҳ�洦����һ����ϵ����Ϊ��ǰ����div
                //    }
                //}
                //conn.setPresence();
            }
        });



        $body.on('click','.close',function(){
            /*
			var popup = new utils.Popup({
                msg:'<aside><h5>��ʾ���˳��Ի�����Ϣ��¼��������</h5>',
                okText:'ȷ��',
                width:'360',
                //  isHide:false,
                okCallback:function(){

                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:'�˳��Ự�ɹ�!!'
                    }).hideMsg(function(){
                        $chatBox.fadeOut()
                        //sdk�ر����Ӳ���������״̬ΪCLOSED
                        conn.close();
                    })


                }
            })
			*/
        })

        $('body').on('click', '.chatBtn', function() {
            var username = $("#usename").val()||"zhm8932";
            var pass = $("#password").val();
            //�򿪿�����
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