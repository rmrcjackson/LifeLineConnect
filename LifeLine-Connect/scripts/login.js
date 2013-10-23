var deviceToken;
var sActionUrl = 'http://www.life-leadership-home.com/desktopmodules/teamtalkapp/actions.aspx';
var messagePath = 'http://line.the-life-business.com/';//'http://talk.the-team.biz/';
var sSiteUrl = 'http://www.life-leadership-home.com/';
var user = new Object();
// var my_media;
var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad"
    : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone"
    : (navigator.userAgent.match(/iPhone/i)) == "iPod" ? "iPod"
    : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android"
    : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry"
    : "null";
var isIOS = (deviceType.match(/(iPad|iPhone|iPod)/)) ? true : false;
var my_media = null;
var mediaTimer = null;
var recordFileName = "recording.wav";
var objActiveFile;
var fullRecordPath = '';
var fullUploadPath = '';
var status = null;
var mediaVar;
var messageLength = 90;
var uploadTries = 6;
var recTime;
var thisMessageLength;
var custNo;
var OWuserID = 61241449;
//scrollers:
var iScrollMessages;
var iScrollMessageDetails;
var iScrollRecord;
var iScrollEditList;
//
var sMessageUpline = '<p>Messages in this folder are from LIFE Members in your upline.  If you have new messages they will appear in a red burst on the Welcome screen.  The new messages are listed in chronological order with the newest message listed at the top of the page.  New or unlistened to messages are displayed in gray and after you have listened they are displayed in black.  Select the message you want to play and then you will be given several message action options on the next screen including a tasks button in the upper right.</p>';
var sMessageDownline = '<p>Messages in this folder are from LIFE Members in your downline.  If you have new messages they will appear in a red burst on the Welcome screen.  The new messages are listed in chronological order with the newest message listed at the top of the page.  New or unlistened to messages are displayed in gray and after you have listened they are displayed in black.  Select the message you want to play and then you will be given several message action options on the next screen including a tasks button in the upper right.</p>';
var sMessagesArchive = '<p>Messages in this folder are messages from either upline or downline that you have decided to save.</p>';
var pushCreds = {
    googlePID: '850892990634',
    pushWooshAppID: '00E07-3DAED',
    pushWooshAppName: 'LifeLine'
};

(function (global) {
    var $loginWrap,
        $logoutWrap,
        $username,
        $password,
        $loggedUser;

    function init() {
        $loginWrap = $("#login-wrap");
        $logoutWrap = $("#logout-wrap");
        $username = $("#username");
        $password = $("#password");
        $loggedUser = $("#logout-username");

        setMode("login");

        $("#login-reset").on("click", clearForm);
        $("#btnLogin").on("click", login);
        $("#btnLogout").on("click", logout);
    }

    $(document).on("deviceready", init);

    function clearForm() {
        $username.val("");
        $password.val("");
    }

    function setMode(mode) {
        if (mode === "login") {
            $loginWrap.show();
            $logoutWrap.hide();
        }
        else {
            $loginWrap.hide();
            $logoutWrap.show();
        }
    }

    function login() {
        var username = $username.val().trim(),
            password = $password.val().trim();

        if (typeof deviceToken == 'undefined') {
            deviceToken = '';
        }

        loginDataObject = {
            'Action': 'CheckLogin',
            'Username': $("#username").val(),
            'Password': $("#password").val(),
            'deviceToken': deviceToken
        };

        if (username === "" || password === "") {
            navigator.notification.alert("Both fields are required!",
                                         function () { },
                                         "Login failed",
                                         'OK');
        } else {
            $.ajax({
                type: 'POST',
                dataType: 'JSON',
                url: sActionUrl,
                data: loginDataObject,

                success: function (data) {
                    $('#spanUserName').text('logged in as ' + $("#username").val());
                    console.log(JSON.stringify(data));

                    if ($('#chkRemember').prop('checked')) {
                        localStorage.setItem('rememberme', 1);
                    } else { localStorage.setItem('rememberme', 0); }
                    //user.ID = data.User_ID;
                    //user.CanSeeDownline = data.CanSeeDownline;
                    user = data;
                    //loginuser(user);

                    if (parseInt(user.User_ID) > 0) {
                        loginuser(data);
                        // homePage();

                    } else {
                        navigator.notification.alert("Wrong username or password",
                                          function () { },
                                          "Login Error",
                                          'OK');
                    }
                },

                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('------ login Error : ' + errorThrown + textStatus);
                    return false;
                }
            });

            initListeners();
            setMode("logout");
        }
    }

    function logout() {
        clearForm();
        setMode("login");
        console.log(' --logging out');
        clearMessages();
        $("#username").val('');
        $("#password").val('');
        localStorage.removeItem('userID');
        user = null;
        $.mobile.changePage("#loginpage", { transition: "reverse slide" });
    }
    
    function loginuser(usrObj) {
        localStorage.setItem('user', usrObj);
        localStorage.setItem('userID', usrObj.User_ID);
        localStorage.setItem('CanSeeDownline', usrObj.CanSeeDownline);
        localStorage.setItem('ReceiveNotifications', usrObj.ReceiveNotifications);

        if (usrObj.UplineName.length > 0) {
            $('#spanUplineName,#spanUplineNamePassUp').html(usrObj.UplineName);
        }
        else {
            $('#spanUplineName,#spanUplineNamePassUp').html('-');
        }

        if (usrObj.CanSeeDownline == 0) {
            $('#btnpagemanagedistros').hide();
        }
        else {
            $('#btnpagemanagedistros').show();
        }
        //$('#ulSettings').listview('refresh');

        if (usrObj.CanSeeDownline == 0) {
            $("#divdownline").hide();
            //$('#ddlRecordMessagePass').val('1');
            //todo set 
        } else {
            $("#divdownline").show();
            //$('#ddlRecordMessagePass').val('0');
        }


        if (usrObj.ID == OWuserID) {
            //OW:
            $('#hideupline').remove();
            $('#ddlRecordMessagePass').val(1);
            $('#dPassToTeamNumRecordMessage').slideUp();
            $('#divtxtPassToNumberRecordMessage').slideUp();
            $('#dPickDistroList').slideDown();
        }
        else {

            if ($("#hideupline").length == 0) {
                $('#ddlRecordMessagePass').prepend('<option value="0" id="hideupline">Upline</option>');
            }

            $('#ddlRecordMessagePass').val(0);
        }
        $.mobile.changePage($('#landingpage'), { transition: "slide" });
    }


})(window);