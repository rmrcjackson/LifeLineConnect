
function initListeners() {
    listenNewPic();
    listenBtnDownline();
    listenBtnLogout();
    //listenerBtnPausePlayBack();
    listenerBtnStopMessage();
    listenerBtnPlayMessage();
    listenerBtnRecordMessage();
    listenBtnUpline();
    listenBtnArchive();
    listenBtnSettings();
    //listenReplyBack();
    document.addEventListener("resume", function(event) {
        if (typeof user != 'undefined') {
            loginuser(user);
        } else {
            logout();
        }
    });
}

var VMTypes = {
    FromUpline: 1,
    FromDownline: 0,
    Archive: 2
};

function listenBtnLogout() {
    $('#btnLogout').click(function() {
        logout();
    });
}

function logout() {
    console.log(' --logging out');
    clearMessages();
    $("#username").val('');
    $("#password").val('');
    localStorage.removeItem('userID');
    user = null;
    $.mobile.changePage("#loginpage", { transition: "reverse slide" });
}


function listenNewPic() {
    $('#btnCaptureImage').on('tap', function() {
        capturePhoto();
    });
}

function listenBtnDownline() {
    $('#btnDownline').off().on('tap', function() {
        //console.log('form downline click');
        //console.log(VMTypes.FromDownline);
        clearMessages();
        localStorage.setItem('tabID', VMTypes.FromDownline);
        $('#messageheadertext').text('...from Downline');
        $('#popupMessagesText').html(sMessageDownline);
        $.mobile.changePage('#messages', { transition: 'slide' });
        $(this).addClass('buttonbgtap');
    }).off('vmouseover').on('vmouseover', function() {
        $(this).addClass('buttonbgtap');
    }).off('vmouseout').on('vmouseout', function() {
        $(this).removeClass('buttonbgtap');
    }).off('vmousecancel').on('vmousecancel', function() {
        $(this).removeClass('buttonbgtap');
    });
}

function listenBtnUpline() {
    $('#btnUpline').click(function() {
        console.log('form downline click');
        //console.log(VMTypes.FromUpline);
        clearMessages();
        localStorage.setItem('tabID', VMTypes.FromUpline);
        $('#messageheadertext').text('...from Upline');
        $('#popupMessagesText').html(sMessageUpline);
        $.mobile.changePage('#messages', { transition: 'slide' });
        $(this).addClass('buttonbgtap');
    }).off('vmouseover').on('vmouseover', function() {
        $(this).addClass('buttonbgtap');
    }).off('vmouseout').on('vmouseout', function() {
        $(this).removeClass('buttonbgtap');
    }).off('vmousecancel').on('vmousecancel', function() {
        $(this).removeClass('buttonbgtap');
    });
}

function listenBtnArchive() {
    $('#btnArchive').off().on('tap', function() {
        //console.log('form downline click');
        //console.log(VMTypes.Archive);
        clearMessages();
        localStorage.setItem('tabID', VMTypes.Archive);
        $('#messageheadertext').text('...Archive');
        $('#popupMessagesText').html(sMessagesArchive);
        $.mobile.changePage('#messages', { transition: 'slide' });
        $(this).addClass('buttonbgtap');
    }).off('vmouseover').on('vmouseover', function() {
        $(this).addClass('buttonbgtap');
    }).off('vmouseout').on('vmouseout', function() {
        $(this).removeClass('buttonbgtap');
    }).off('vmousecancel').on('vmousecancel', function() {
        $(this).removeClass('buttonbgtap');
    });
}

function listenNextPrevBtns() {
    //enabling or disabling next/prev buttons


    $('#btnPrevMessage').off().on('tap', function() {
        switchmessage('prev');
    });

    $('#btnNextMessage').off().on('tap', function() {
        switchmessage('next');
    });


}

function listenBtnSettings() {
    console.log('--binding listenBtnSettings');
    $('#btnSettingsPanel').off().on('tap', function() {


        $('#imgUserIcon').attr('src', sSiteUrl + '/DesktopModules/TeamTalkApp/Images/' + localStorage.getItem('userID') + '.thumb.jpg' + '?' + Math.random());

        $('#imgUserIcon')
            .load(function() {
                // Image is loaded
            })
            .error(function() {
                //Image is not loaded;
                $('#imgUserIcon').attr('src', sSiteUrl + '/DesktopModules/TeamTalkApp/Images/LL_57.png');
            });
        $.mobile.changePage("#pagesettings", { transition: "slide" });
        //    $(this).addClass('buttonbgtap');
        //}).off('vmouseover').on('vmouseover', function () {
        //    $(this).addClass('buttonbgtap');
        //}).off('vmouseout').on('vmouseout', function () {
        //    $(this).removeClass('buttonbgtap');
        //}).off('vmousecancel').on('vmousecancel', function () {
        //    $(this).removeClass('buttonbgtap');
    });
}

function listenHeaderLogoButton() {
    $(".headerlogo").on('vmouseover', function(event, ui) {
        $(this).addClass("headerlogoover");
    });
    $(".headerlogo").on('tap', function(event, ui) {
        $(this).addClass("headerlogoover");
    });
    $(".headerlogo").on('vmouseout', function(event, ui) {
        $(this).removeClass("headerlogoover");
    });
    $(".headerlogo").on('tap', function(event, ui) {

        if ($.mobile.activePage.attr('id') != 'loginpage') {
            $.mobile.changePage('#landingpage', {
                transition: "slide",
                reverse: true
            });
        }

    });
}


function listenUploadAndAcceptButton() {
    $('#btnAcceptUpload').off().on('tap', function() {
        $(this).addClass('ui-disabled');
        uploadMessage();
    });
}


function listenDeleteButton() {
    $('#btnDeleteMessage').on('tap', function() {
        $('#btnDeleteMessage').off();
        objActiveFile.remove(fileRemoveSuccess, fileRemoveFailure);
        $.mobile.changePage("#landingpage", {
            transition: "slide",
            reverse: true
        });
    });
}


function uploadMessage() {
    //console.log("triggering an upload");


    $.mobile.loading('show', {
        text: 'Please wait, uploading your message ...',
        textVisible: true,
        theme: 'b',
        textonly: true,
        html: ''
    });

    var sRedirPage = '';

    var CanSeeDownline = false;
    if (isIOS) {
        thisfullUploadPath = fullRecordPath;
        thisOS = 'ios';
    } else {
        thisfullUploadPath = fullUploadPath;
        thisOS = 'android';
    }
    //$.mobile.showPageLoadingMsg('a', 'Uploading Message...');

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = thisfullUploadPath.substr(thisfullUploadPath.lastIndexOf('/') + 1);
    options.mimeType = 'audio/wav';
    options.chunkedMode = false;
    var ft = new FileTransfer();
    var passToNum = 0;
    //var pageRedirect = '#landingpage';
    var sfileUploadSuccess = fileUploadSuccess;
    var sfileUploadFailure = fileUploadFailure;

    if ($.mobile.activePage.attr('id') == 'pageRecordMessage') {
        //recording NEW message:  
        var selectedOpt = $('#pageRecordMessage').find('option:selected').attr('value');
        //console.log(' -- upload message selectedOpt ' + selectedOpt);

        //alert(selectedOpt);
        switch (selectedOpt) {
        case '0':
//upline
//nothing is needed to pass up
            CanSeeDownline = false;
            break;
        case '1':
//downline
//show distro list
            CanSeeDownline = true;
            passToNum = $('#ddlDistroListRecordMessage').val();
            break;
        case '2':
//team number
            CanSeeDownline = true;
            passToNum = $('#custNo', '#pageRecordMessage').val();
            break;
        default:
        }
        messageTag = escape($('#messageTag').val());
        sRedirPage = 'landingpage';
    } else {
        //replying to message:

        messageTag = escape($('#txtTagReply').val());
        passToNum = localStorage.getItem('fromUserId'); //get ID of the person to pass to
        sfileUploadSuccess = fileUploadSuccessReply;
        sfileUploadFailure = fileUploadFailureReply;

        sRedirPage = 'pageMessageDetail';

        //console.log(' -- replying to message, to user: ' + passToNum);
    }


    //CanSeeDownline = localStorage.getItem('CanSeeDownline');
    if (CanSeeDownline == null) {
        CanSeeDownline = 0;
    }

    fileUploadURL = sSiteUrl + '/desktopmodules/teamtalkapp/uploadmessage.aspx?os=' + thisOS +
        '&User_ID=' + thisUserID +
        '&msgtag=' + messageTag +
        '&RecLength=' + thisMessageLength +
        '&PassDown=' + CanSeeDownline +
        '&PassTo=' + passToNum;

    console.log(' -- upload message passtonum: ' + passToNum);
    console.log("attempt file upload fileUploadURL = ");
    console.log(fileUploadURL);

    ft.upload(thisfullUploadPath, fileUploadURL, sfileUploadSuccess, sfileUploadFailure, options, true);
    if (isIOS) {
        //redirecting to the destination page, while it uploads in the background:
        $.mobile.changePage('#' + sRedirPage, {
            transition: "slide",
            reverse: true
        });
    }

}

function SetMessageAsListened(msgId) {
    //console.log('setting message ' + msgId + ' as listened ' + sActionUrl);
    var thisUserID = localStorage.getItem('userID');
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'SetMessageAsListened',
            'User_ID': thisUserID,
            'MessageID': msgId
        },
        success: function(data) {

            localStorage.setItem('refreshmessagedata', true);
            console.log('-- SetMessageAsListened result' + JSON.stringify(data));
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('------ error SetMessageAsListened : ' + errorThrown);

            return false;
        }
    });
}

function SetMessageAsUnlistened(msgId) {

    var thisUserID = localStorage.getItem('userID');
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'SetMessageAsUnListened',
            'User_ID': thisUserID,
            'MessageID': msgId
        },
        success: function(data) {
            //console.log('--setting message unlistned ' + JSON.stringify(data));
            localStorage.setItem('refreshmessagedata', true);
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('------ error SetMessageAsUnlistened : ' + errorThrown);

            return false;
        }
    });
}

function SaveSettings(ReceiveNotifications) {

    var thisUserID = localStorage.getItem('userID');
    //check if new image has been picked and save it:
    if ($('#imgChanged').val() == '1') {
        //upload new image:


        fileUploadURL = sSiteUrl + '/desktopmodules/teamtalkapp/UploadImage.aspx?User_ID=' + thisUserID; //fileUploadURL = 'http://localhost/theteam/desktopmodules/teamtalkapp/UploadImage.aspx?User_ID=' + thisUserID

        console.log("attempt file upload fileUploadURL: " + fileUploadURL);


        var smallImage = document.getElementById('imgUserIcon');
        var imageURI = smallImage.src; // $('#textImageData').val();
        var options = new FileUploadOptions();
        options.fileKey = "file";

        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        //var params = new Object();
        //params.value1 = "test";
        //params.value2 = "param";
        //options.params = params;
        console.log(' -- imageURI: ' + imageURI);

        var ft = new FileTransfer();
        //ft.upload(imageURI          , "http://some.server.com/upload.php", win, fail, options);
        ft.upload(imageURI, fileUploadURL, fileUploadSuccessImage, fileUploadFailure, options, true);
    }


    if (typeof deviceToken == 'undefined') {
        deviceToken = '';
    }

    //console.log(' --- saving settings for deviceToken ' + deviceToken + ', userid' + thisUserID);

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'SaveSettings',
            'User_ID': thisUserID,
            'ReceiveNotifications': ReceiveNotifications,
            'token': deviceToken
        },
        success: function(data) {
            //console.log(' -- SaveSettings : ReceiveNotifications- ' + ReceiveNotifications + ', status- ' + data.Status);

            $.mobile.loading('hide');
            if (data.Status == 0) {
                console.log(' -- error saving settings: ' + data.Message);
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('------ error SaveSettings : ' + errorThrown);

            return false;
        }
    });
}

function loadMessages() {


    //$('#pleasewait').fadeIn("slow");
    clearMessages();

    $('#btnRefreshMessages').click(function() {
        $.mobile.loading('show');
        loadMessages();
        $.mobile.loading('hide');
    });

    var tabID = localStorage.getItem('tabID');
    thisUserID = localStorage.getItem('userID');

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'GetVoicemailList',
            'User_ID': thisUserID,
            'tab': tabID
        },
        success: function(data) {
            //console.log('--- got message list ');
            //console.log(data);
            localStorage.setItem('messagedata', JSON.stringify(data));
            showMessageBubbles(data);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(': ' + errorThrown);
            return false;
        }
    });

}


function capturePhoto() {
    console.log("image click");
    // Take picture using device camera and retrieve image as base64-encoded string
    var destinationType = navigator.camera.DestinationType;
    navigator.camera.getPicture(onPhotoDataSuccess, onPhotoDataFail, {
        quality: 50,
        destinationType: destinationType.FILE_URL,
        correctOrientation: true,
        allowEdit: true,
        targetHeight: 73,
        targetWidth: 73
        //destinationType: destinationType.DATA_URL
    });
}

function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64 encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('imgUserIcon');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    //smallImage.src = "data:image/jpeg;base64," + imageData;
    smallImage.src = imageData;
    $('#imgChanged').val('1');

    var imageURI = imageData;
    //imageURI = imageURI.substring(5);
    imageURI = decodeURIComponent(imageURI);

    //$('#textImageData').val(imageURI);
}

function onPhotoDataFail(message) {
    //alert('Failed because: ' + message);
}

function clearMessages() {
    localStorage.removeItem("messagedata");
    $('#messagelist').empty();
}

function showMessageBubbles(data) {
    var tabID = localStorage.getItem('tabID');

    /* 1- from upline, 0 - from downline , 2 -archive */
    thisUserID = localStorage.getItem('userID');
    //$('#messagelist').hide();
    //$('#pleasewait').fadeOut("slow", function () { });

    var iTest = 0;
    var strTest = strTestOld = '';
    var bFirst = true;
    var bLast = false;

    $.each(data.TeamTalk, function(i, item) {

        var audoFile = messagePath + item.FileName;
        var fileLength = item.Length;
        var thisMessageBubbleClass;
        var thistapcss;
        var thisButtons;
        var canPassDown;
        var canPassUp;
        var blnCanPassDown = new Boolean(item.CanPassDown);
        var nameFrom = item.FirstName + ' ' + item.LastName;
        var dttmSubmit = item.DateSubmitted;
        var dttm = dttmSubmit.split('T');
        var date = dttm[0].split('-');

        var objDttmSubmit = new Object();

        objDttmSubmit.yr = date[0];
        objDttmSubmit.mo = date[1];
        objDttmSubmit.day = date[2];
        objDttmSubmit.tm = dttm[1];

        var sDateSubmitted = item.DateSubmitted.toString('yyyy-MM-dd');

        //console.log(sDateSubmitted);

        //dttmSubmit = objDttmSubmit.day + '/' + objDttmSubmit.mo + '/' + objDttmSubmit.yr + ' ' + objDttmSubmit.tm;

        canPassDown = (item.CanPassDown == '0') ? false : true;
        //canPassUp = (tabID != 0) ? 'display:none;' : '';

        //console.log('... canPassUp ' + canPassUp + ' ' + tabID);
        tags = item.Tags;

        var displayTags = '';
        if (iTest + 1 == data.TeamTalk.length) {
            bLast = true;
        }

        if (tags != '[]') {
            $(tags).each(function() {
                // console.log($(this)[0].ID);
                displayTags = '<li><b>' + $(this)[0].FirstName + ' ' + $(this)[0].LastName + '</b> says: ' + $(this)[0].Tag + '</li>' + displayTags;
            });
        } else {

            displayTags += '<li>No tags ...</li>';
        }

        switch (tabID) {
        //archive
        case '2':
            thisClass = 'messagebubble';
            thisPullDownClass = 'pulldown_archive';
            thisMessageBubbleClass = 'messagebubblemoreinfodesc';
            thistapcss = 'messagebubbletap';

            thisButtons = "";

            canPassUp = item.CanPassUp;

            break;
        default:
//new

// this css calls a different background based on iTest being odd or even
            thisPullDownClass = 'pulldown';
            thisClass = (iTest % 2 == 0) ? 'messagebubblenew1' : 'messagebubblenew2';
            thistapcss = (iTest % 2 == 0) ? 'messagebubblenew1tap' : 'messagebubblenew2tap';
            thisMessageBubbleClass = (iTest % 2 == 0) ? 'messagebubblemoreinfodescnew1' : 'messagebubblemoreinfodescnew2';
            thisMessageButtonClass = (iTest % 2 == 0) ? 'btndelete' : 'btndelete1';

            thisButtons = "";
            /* 1- from upline, 0 - from downline , 2 -archive */
            canPassUp = (tabID != 0) ? false : true;
            canPassUp = (item.CanReply == false) ? true : canPassUp;

            break;
        }

        // var badgeNew = "<div class='wrapperBadgeNew'></div>";
        // var badgeNone = "<div class='wrapperBadgeNone'></div>";

        var badgeClass = (item.ListenedTo) ? 'wrapperBadgeNone' : 'wrapperBadgeNew';

        // console.log('item ListenedTo = ' + item.ListenedTo + ' for id = ' + item.ID);


        strTestOld += "<div class='bubbleMsg " + thisClass + "' id='message_" + item.ID + "' msgId='" + item.ID + "' fromUserId='" + item.UserID +
            "' audioFile='" + audoFile + "' data-nameFrom='" + nameFrom + "' data-dttmSubmit='" + dttmSubmit + "' data-filelength = '" + fileLength + "' tapcss='" + thistapcss + "' canPassUp = '" + canPassUp + "' canPassDown='" + canPassDown + "' listenedTo='" + item.ListenedTo + "' >" +
            "<div class='messagethumbnail'>" +
            "<div class='" + badgeClass + "'></div>" +
            "<img src='" + item.SubmittedBy + "'>" +
            "</div>" +
            "<div class='messageinfo'>From <b><span>" + item.FirstName + " " + item.LastName + "</span></b><br />" +
            formatDate(item.DateSubmitted) + "<br />" +
            "<span class='messagelength'>Length: " + item.Length + "</span>" +
            "</div>" +
            "<div class='wrapperBubbleButtons'>" +
            //"<div class='btnMsgBubble btnPlay'></div>" +
                    //"<div class='btnMsgBubble btnMore'></div>" +
            "</div>" +
            "</div>" +
            "<div class='wrapperPullDown' id='wrapperPullDown_" + item.ID + "'>" +
            "<div id='pulldown_" + item.ID + "' style='display:none;' class='" + thisPullDownClass + "'>" +
            "<div id='message_moreinfo_" + item.ID + "'" + "' class='" + thisMessageBubbleClass + " thisMessageTags'><ul class='ultags'>" + displayTags + "</ul></div>" +
            "</div>" +
            thisButtons +
            "</div>";

        thisMsgClass = {
            listenedTo: (item.ListenedTo != "1") ? "new" : "old"
        };


        strTest += '<li class="' + thisMsgClass.listenedTo + '" data-idMsg="' + item.ID + '" data-usrFrom="' + item.UserID + '" data-fileAudio="'
            + audoFile + '" data-nameFrom="' + nameFrom + '" data-dttmSubmit="' + dttmSubmit + '" data-filelength="' + fileLength + '" data-tapCss="'
            + thistapcss + '" data-canpassup="' + canPassUp + '" data-canpassdown="' + canPassDown + '" data-listenedTo="' + item.ListenedTo + '" data-canreply="' + item.CanReply + '" data-first="'
            + bFirst + '" data-last="' + bLast + '" data-thismsgindx="' + (iTest + 1) + '" data-tags="' + htmlEncode(displayTags) + '">'
            + '<div class="column picture"><img src="' + item.SubmittedBy + '" alt="Picture of ' + nameFrom + '"></div>'
            + '<div class="column text">'
            + '<div class="name">' + item.FirstName + ' ' + item.LastName + '</div>'
            + '<div class="dttm">' + formatDate(dttmSubmit) + '</div>'
            + '<div class="length">' + item.Length + '</div>';
        "</div>" +
            +'</div>'
            + '</li>';

        bFirst = false;
        iTest += 1;
    });


    if (iTest == 0) {
        //console.log(' message count: ' + iTest);
        strTest = '<div id="nomessages">No messages ... </div>';
    }

    /* @TODO fade in message list as a call back of hiding please wait */
    $('#messagelist').html('<ul data-role="listview" data-inset="true" id="ulMessages">' + strTest + '</ul>');


    $('#messagelist li').off().on('tap', function() {
        $(this).addClass("messageListTap");
        console.log($(this).data());
        msgData = $(this).data();

        activeMessage = msgData.idmsg;
        //console.log(' -- message tags: ' + msgData.tags);

        localStorage.setItem('autoplay', '1');
        localStorage.setItem('thisMsgID', activeMessage);
        localStorage.setItem('audioFile', msgData.fileaudio);
        localStorage.setItem('ListenedTo', msgData.listenedto);
        localStorage.setItem('canreply', msgData.canreply);
        localStorage.setItem('data-filelength', msgData.filelength);
        localStorage.setItem('data-nameFrom', msgData.namefrom);
        localStorage.setItem('data-dttmSubmit', formatDate(msgData.dttmsubmit));
        localStorage.setItem('canPassDown', msgData.canpassdown);
        localStorage.setItem('canPassUp', msgData.canpassup);
        localStorage.setItem('fromUserId', msgData.usrfrom);
        localStorage.setItem('firstMsg', msgData.first);
        localStorage.setItem('lastMsg', msgData.last);
        localStorage.setItem('thisMsgIndx', msgData.thismsgindx);
        localStorage.setItem('msgtags', msgData.tags);

        //$('#labelMsgTag').html($('#message_moreinfo_' + activeMessage).html());

        $(this).addClass($(this).attr('tapcss'));
        $.mobile.changePage($('#pageMessageDetail'), { transition: 'slide' });

    }).off('vmouseover').on('vmouseover', function() {
        $(this).addClass("messageListTap");
    }).off('vmouseout').on('vmouseout', function() {
        $(this).removeClass("messageListTap");
    }).off('vmousecancel').on('vmousecancel', function() {
        $(this).removeClass("messageListTap");
    });


    $('.bubbleMsg').off().on('tap', function() {

    }).on('vmouseover', function() {
        $(this).addClass($(this).attr('tapcss'));
    }).on('vmouseout', function() {
        $(this).removeClass($(this).attr('tapcss'));
    });

    //showscrollbarsmessages();

    $.mobile.loading('hide');
}

function fileRemoveSuccessNoRedirect() {
    $.mobile.loading('hide');
    $('#btnPlayMessage, #btnAcceptUpload, #btnDeleteMessage').addClass('ui-disabled');
    $('#btnStartStopRecording').removeClass('ui-disabled');
    $('#audio_position').empty();
    $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': '0%' });
    listenDeleteButton();
    listenUploadAndAcceptButton();
    $('#messageTag').val('');
    $('#wrapperRecordingProgress #audio_position').html('');

}


function fileRemoveSuccess() {
    $.mobile.loading('hide');
    $('#btnPlayMessage, #btnAcceptUpload, #btnDeleteMessage').addClass('ui-disabled');
    $('#btnStartStopRecording').removeClass('ui-disabled');
    $('#audio_position').empty();
    $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': '0%' });
    listenDeleteButton();
    listenUploadAndAcceptButton();
    $('#messageTag').val('');
    $('#wrapperRecordingProgress #audio_position').html('');
    //$.mobile.changePage('#landingpage', {
    //    transition: "slide",
    //    reverse: true
    //});
    //$.mobile.back();
}

function fileRemoveFailure() {

    console.log("file remove failure");
}

function fileUploadSuccess(r) {
    $.mobile.loading('hide');

    //navigator.notification.alert('Thank you for your message.  It will take a minute or so for it to be delivered.', null, 'Message Sent', 'OK');
    objActiveFile.remove(fileRemoveSuccess, fileRemoveFailure);

    if (isIOS == false) {
        //redirecting to the destination page,:
        $.mobile.changePage('#landingpage', {
            transition: "slide",
            reverse: true
        });
    }


    topBar('Good news, your message has been sent.', $('#divLandingPageMessage'));

}


function fileUploadSuccessReply(r) {
    $.mobile.loading("hide");
    objActiveFile.remove(fileRemoveSuccess, fileRemoveFailure);


    if (isIOS == false) {
        //redirecting to the destination page,:
        $.mobile.changePage('#pageMessageDetail', {
            transition: "slide",
            reverse: true
        });
    }

    topBar('Good news, your message has been sent.', $('#divPageMessageDetailMessage'));


}


function fileUploadSuccessImage(r) {
    objActiveFile.remove(fileRemoveSuccess, fileRemoveFailure);
}

function fileUploadFailure(error) {
    console.log("An error has occurred: Code = " + error.code + " error message = " + error.message);


    var uploadTry = localStorage.getItem('uploadTry');
    if ((uploadTry == null) || (uploadTry.length === 0)) {
        $.mobile.loading('hide');
        uploadTry = 1; //first try
        localStorage.setItem('uploadTry', uploadTry);
        uploadMessage();
    } else if (uploadTry > 6) {
        switch (error.code) {
        case 3:
            // console.log("hanlding for error 3, maybe do a popup here and tell the user something");
                //navigator.notification.alert('Connection to Life Line systems is currently unavailable or collection script is erring.  Please confirm your connection and try again', null, 'Connection Failure or Error', 'OK');
            topBar('Connection to Life Line systems is currently unavailable or collection script is erring.  Please confirm your connection and try again.', $('#divLandingPageMessage'));
            $.mobile.loading('hide');
            $.mobile.changePage('#landingpage', { transition: "slide" });
            break;
        }
    } else if (uploadTry <= uploadTries) {
        $.mobile.loading('hide');
        uploadTry = uploadTry + 1;
        console.log(' --upload try ' + uploadTry);
        localStorage.setItem('uploadTry', uploadTry);
        uploadMessage();

    }


}

function fileUploadFailureReply(error) {
    console.log("An error has occurred: Code = " + error.code + " error message = " + error.message);

    var uploadTry = localStorage.getItem('uploadTry');
    if ((uploadTry == null) || (uploadTry.length === 0)) {
        $.mobile.loading('hide');
        uploadTry = 1; //first try
        localStorage.setItem('uploadTry', uploadTry);
        uploadMessage();
    } else if (uploadTry > uploadTries) {
        switch (error.code) {
        case 3:
            // console.log("hanlding for error 3, maybe do a popup here and tell the user something");
                //navigator.notification.alert('Connection to Life Line systems is currently unavailable or collection script is erring.  Please confirm your connection and try again', null, 'Connection Failure or Error', 'OK');
            $.mobile.loading('hide');
            $.mobile.changePage('#pageMessageDetail', { transition: "slide" });
            topBar('Connection to Life Line systems is currently unavailable or collection script is erring.  Please confirm your connection and try again.', $('#divPageMessageDetailMessage'));

            break;
        }
    } else if (uploadTry <= uploadTries) {
        $.mobile.loading('hide');
        uploadTry = uploadTry + 1;
        console.log(' --upload try ' + uploadTry);
        localStorage.setItem('uploadTry', uploadTry);
        uploadMessage();

    }
}

function onMediaSuccess() {
    console.log("playAudio():Audio Success");
    var objWrapperMessageDetails = $('#pageMessageDetail');
    var btn = {
        play: $('#btnPlayMessage', objWrapperMessageDetails),
        stop: $('#btnStopMessage', objWrapperMessageDetails),
        stopAndPause: $('#btnPauseMessage, #btnStopMessage', objWrapperMessageDetails),
        pause: $('#btnPauseMessage', objWrapperMessageDetails)
    };


    //btn.play.removeClass('ui-disabled');
    //btn.stopAndPause.addClass('ui-disabled');

}

function onMediaError(error) {
    console.log('..onMediaError code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function onMediaCreated() {
    console.log("calling onMediaCreated()");
    return;
}


function androidMediaCreateFailure(err) {
    console.log("androidMediaCreateFailure = " + err.message);
}

function iOSCreateMediaFailure(err) {
    console.log("iOSCreateMediaFailure = " + err.code);
}


function mediaPresent() {
    $('#btnPlayMessage').removeClass('ui-disabled');
}


/* end confirmation messages */

function createMedia(onMediaCreated, mediaStatusCallback) {
    if (mediaVar != null) {
        onMediaCreated();
        return;
    }

    if (typeof mediaStatusCallback == 'undefined')
        mediaStatusCallback = null;

    if (isIOS) {
        // /        console.log("------ is iOS -- -- ");
        //first create the file
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            console.log("inside of request filesystem");
            console.log(fileSystem);
            fileSystem.root.getFile(recordFileName, {
                    create: true,
                    exclusive: false
                }, function(fileEntry) {
                    console.log("File " + recordFileName + " created at " + fileEntry.fullPath);
                    objActiveFile = fileEntry;
                    fullRecordPath = fileEntry.fullPath;
                    mediaVar = new Media(fileEntry.fullPath, function() {
                        console.log("Media created successfully");
                        mediaPresent();
                    }, iOSCreateMediaFailure, mediaStatusCallback); //of new Media
                    onMediaCreated();
                }, iOSCreateMediaFailure); //of getFile
        }, iOSCreateMediaFailure); //of requestFileSystem
        return mediaVar;
    } else //it's Android
    {
        // console.log("we have an android phone and we're getting back in to createMedia again");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile(recordFileName, {
                    create: true,
                    exclusive: false
                }, function(fileEntry) {
                    objActiveFile = fileEntry;
                    fullRecordPath = recordFileName;
                    fullUploadPath = fileEntry.fullPath;
                    mediaVar = new Media(recordFileName, function() {
                        mediaPresent();
                    }, androidMediaCreateFailure, mediaStatusCallback); //of new Media
                    onMediaCreated();
                }, androidMediaCreateFailure); //of getFile
        }, androidMediaCreateFailure); //of requestFileSystem
        return mediaVar;
    }
}

function stopRecording(filreRemoveSuc) {

    try {
        mediaVar.stopRecord();
    } catch(ex) {
        console.log(' --error stopping recording: ' + ex.message);
    }
    // progressPlayBack gets added
    $('#wrapperRecordingProgress #audio_position').html(0 + ' sec');
    $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': '0%' });
    $('#wrapperRecordingProgress #message').empty().removeClass('objblink');
    $('#wrapperRecordingProgress #spinner').empty();
    console.log(' -- Enabling reply button: ');
    $('#btnAcceptUpload, #btnPlayMessage, #btnDeleteMessage, #btnStartStopRecording, #btnSendReply').removeClass('ui-disabled');
    $('#btnStopRecording').addClass('ui-disabled');


    $('#btnPlayMessage, #btnAcceptUpload, #btnSendReply, #btnDeleteMessage').addClass('ui-disabled');
    $('#btnStartStopRecording').removeClass('ui-disabled');
    $('#audio_position').empty();
    $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': '0%' });

    $('#messageTag').val('');
    $('#wrapperRecordingProgress #audio_position').html('');

    try {
        objActiveFile.remove(filreRemoveSuc, fileRemoveFailure);
    } catch(ex) {
        console.log('--error removing file at stop recoding: ' + ex.message);
    }

}

function endRecording(recInterval) {
    clearInterval(recInterval);
    mediaVar.stopRecord();


    // progressPlayBack gets added
    $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': '0%' });
    thisMessageLength = messageLength - recTime;
    // console.log("thisMessageLength = "+thisMessageLength);
    $('#wrapperRecordingProgress #audio_position').html(thisMessageLength + ' sec');

    // console.log("attempting to do some math on messageLength("+messageLength+") and recTime("+recTime+")");

    messageLength = parseInt(messageLength);
    recTime = parseInt(recTime);

    // alert('recTime = '+thisMessageLength);
    $('#wrapperRecordingProgress #message').empty().removeClass('objblink');
    $('#wrapperRecordingProgress #spinner').empty();
    $('#btnAcceptUpload, #btnPlayMessage, #btnDeleteMessage, #btnStartStopRecording, #btnSendReply').removeClass('ui-disabled');
    $('#btnStopRecording').addClass('ui-disabled');

}

function recordAudio(callback) {

    var recInterval;
    $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': '0%' });

    $('#wrapperRecordingProgress #containerProgressBar #progress-bar').addClass('progressRecord');

    $('#btnStopRecording').removeClass('ui-disabled');
    $('#btnPlayMessage, #btnDeleteMessage, #btnAcceptUpload, #btnStartStopRecording, #btnSendReply').addClass('ui-disabled');

    var objWrapperRecording = $('#wrapperRecordingProgress');
    $('#spinner', objWrapperRecording).html('<img src="images/recordingSpinner-05.gif" border="0">');
    $('#audio_position', objWrapperRecording).html(messageLength + ' sec');
    $('#message', objWrapperRecording).html('Recording').addClass('objblink');

    var objAudioPosition = $('#wrapperRecordingProgress #audio_position');

    createMedia(function() {
        var progressBarWidth = 0;
        mediaVar.startRecord();
        var recTime = messageLength;

        recInterval = window.setInterval(function() {
            recTime--;
            progressBarWidth = 100 - ((recTime / messageLength) * 100);

            console.log("progressBarWidth = " + progressBarWidth);

            $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': progressBarWidth + '%' });

            objAudioPosition.html(recTime + " sec");
            if (recTime <= 0) {
                endRecording(recInterval);
            }
        }, 1000);
        return callback(recInterval, mediaVar);
    });
}

// onSuccess Callback
//

function onRecordSuccess() {
    console.log("recordAudio():Audio Success");
    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, window.onSuccess, onError);
}

function onFileSystemSuccess(fileSystem) {
    console.log('fileSystem');
    console.log(fileSystem);
}

// onError Callback 
//

function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function setAudioPosition(position) {
    console.log(position);
    document.getElementById('audio_position').innerHTML = position;
}


function playRecordedAudio() {

    // ('inside of playAudio');
    $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': '0' });
    var mediaTimer;


    $('#btnStopRecording').removeClass('ui-disabled');
    $('#btnPlayMessage, #btnStartStopRecording, #btnDeleteMessage, #btnAcceptUpload').addClass('ui-disabled');

    console.log(' --fullRecordPath ' + fullRecordPath);

   myMedia = new Media(fullRecordPath,
        // success callback
        function() {
            // ('play callback');
            $('#btnPlayMessage, #btnStartStopRecording, #btnDeleteMessage, #btnAcceptUpload').removeClass('ui-disabled');
            $('#btnStopRecording').addClass('ui-disabled');
        },
        // error callback
        function(err) {
            console.log(" --attempting to play fullRecordPath = " + fullRecordPath);
            console.log(" --playAudio():Audio Error: " + err.code);
        }
    );


    myMedia.play();
    var objAudioPosition = $('#wrapperRecordingProgress #audio_position');

    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            myMedia.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > 0) {

                        var thisPosition = position * 100;
                        var progressBarWidth = thisPosition / thisMessageLength;
                        progressBarWidth = (progressBarWidth > 100) ? 100 : progressBarWidth.toFixed(2);
                        console.log("progressBarWidth = "+progressBarWidth);

                        $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': progressBarWidth + '%' });
                        objAudioPosition.html(Math.floor(position) + " sec");
                    } else {

                        $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': '100%' });


                        clearInterval(mediaTimer);
                        objAudioPosition.html(thisMessageLength + " sec");
                        console.log("position == something else!, position = " + position);
                        // alert('disable pause button here');
                        $('#btnStopMessage, #btnPauseMessage').addClass('ui-disabled');

                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 250);
    }


    // stop playback when the stop button is tapped
    $('#btnStopRecording').off().on('tap', function() {
        myMedia.stop();

        $('#btnPlayMessage, #btnStartStopRecording, #btnDeleteMessage, #btnAcceptUpload').removeClass('ui-disabled');
        $('#btnStopRecording').addClass('ui-disabled');
    });

    // if the user leaves the page, stop playback
    $('#pageRecordMessage').off().on('pagehide', function() {
        myMedia.stop();
        $('#btnPlayMessage, #btnStartStopRecording, #btnDeleteMessage, #btnAcceptUpload').removeClass('ui-disabled');
        $('#btnStopRecording').addClass('ui-disabled');
    });
}

function playAudio(autoPlay) {
    // Create Media object from src
    console.log('playing audio');
    var objProgressBar = $('#wrapperPlaybackProgress #containerProgressBar #progress-bar');
    var src = window.localStorage.getItem('audioFile');
    var my_media = new Media(src, onMediaSuccess, onMediaError);

    // Play audio
    if (autoPlay == 1) {
        my_media.play();
    }

    var thisFileLength = window.localStorage.getItem('data-filelength');


    var hms = thisFileLength;
    var a = hms.split(':');
    var fileLength = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

    var msgListenedTo = window.localStorage.getItem('ListenedTo');
    var thisMessageID = window.localStorage.getItem('thisMsgID');
    var prevPosition;
    var iCounter = 0;

    //console.log(' --fileLength: ' + fileLength + ' a ' + a + ' thisFileLength ' + thisFileLength);

    // Update my_media position every second
    var mediaTimer;
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            //console.log('--media timer: ' + mediaTimer);
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    var progressBarWidth;
                    if (position > -1) {


                        //console.log("-- position " + position + " fileLength " + fileLength + "");
                        progressBarWidth = (position / fileLength) * 100;
                        progressBarWidth = (progressBarWidth >= 100) ? 100 : progressBarWidth;
                        //console.log("..progressBarWidth = " + progressBarWidth);
                        objProgressBar.css({ 'width': progressBarWidth + '%' });
                    }
                    if (progressBarWidth == 100) {

                        if (msgListenedTo == 0) {

                            SetMessageAsListened(thisMessageID);
                            msgListenedTo = 1;
                            $('#btnMarkAsUnlistened').removeClass("ui-disabled");

                        }


                        $('#btnStopMessage').trigger('tap');

                        //stopAudio();
                    }

                    //hack to fix discrepancy between lengh and actual file length in Android:
                    if (prevPosition > 0 && position > 0 && prevPosition == position && (position > (fileLength - fileLength / 10))) {
                        //
                        //  position = fileLength;
                        console.log(' -- stopping audio, discrepancy in lengths iCounter ' + iCounter);
                        console.log(' --' + prevPosition + ' ' + position);

                        iCounter += 1;

                        if (iCounter > 3) {
                            objProgressBar.css({ 'width': '100%' });
                            $('#btnStopMessage').trigger('tap');
                            if (msgListenedTo == 0) {

                                SetMessageAsListened(thisMessageID);
                                msgListenedTo = 1;
                                $('#btnMarkAsUnlistened').removeClass("ui-disabled");

                            }
                        }

                        //                                        if (isIOS){
                        //                                        //iPhone hack fix for media play:
                        //                                        console.log('--progressBarWidth ' + progressBarWidth);
                        //                                        var msgListenedTo = localStorage.getItem('ListenedTo');
                        //                                        var thisMessageID = localStorage.getItem('thisMsgID');
                        //                                        objProgressBar.css({ 'width': '100%' });
                        //                                        btn.stopAndPause.addClass('ui-disabled');
                        //                                        btn.play.removeClass('ui-disabled');
                        //                                        $('#btnPauseMessageText').text('Pause');
                        //                                        btn.pause.buttonMarkup({ icon: 'pause' });
                        //                                        
                        //                                        if (msgListenedTo == 0) {
                        //                                        
                        //                                        SetMessageAsListened(thisMessageID);
                        //                                        msgListenedTo = 1;
                        //                                        $('#btnMarkAsUnlistened').removeClass("ui-disabled");
                        //                                        
                        //                                        }
                        //                                        }

                    }
                    prevPosition = position;
                    // setAudioPosition((position) + " sec");

                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 1);
    }
}

function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
    var mediaTimer;
    clearInterval(mediaTimer);
    mediaTimer = null;
}

function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}


$('#pageMessageDetail').off('pagehide').on('pagehide', function() {
    stopAudio();
    $('#btnPauseMessageText').text('Pause');
    //btn.pause.buttonMarkup({ icon: 'pause' });
    my_media.release();

});

function listenerBtnRecordMessage() {
    $('#btnRecordNewMessage').off().on('tap', function() {


        var canSeeDownline = window.localStorage.getItem('CanSeeDownline');
        var element = $('#wrapperPageRecord').detach();
        $('#divRecordControls').append(element).trigger('create');
        $('#txtPassToNumberRecordMessage').val('');
        //$.mobile.changePage("#pageRecordMessage", { transition: "slide" });
        //bind passing up/down events:

        $('#wrapperPageRecord #messageTag').val('');
        $('#dPickDistroList').hide();
        $('#dPassToTeamNumRecordMessage').hide();
        $('#divtxtPassToNumberRecordMessage').hide();


        if (canSeeDownline == 0) {

            $('#hidedownline').remove();
            $('#hideindv').remove();
            $('#hidedownline').css('display', 'none').parent('div').parent('.ui-select').css('display', 'none');
            $('#hideindv').css('display', 'none').parent('div').parent('.ui-select').css('display', 'none');
            //$('#hidedownline').parent().hide();
            //console.log(' --hiding downline option: ');
        } else {
            if ($("#hideindv").length == 0) {
                $('#ddlRecordMessagePass').append('<option value="2" id="hideindv">Individual or Life Line#</option>');
            }
            if ($("#hidedownline").length == 0) {
                $('#ddlRecordMessagePass').prepend('<option value="1" id="hidedownline">Downline</option>');
            }


        }
        var thisUserID = window.localStorage.getItem('userID');
        if (thisUserID == OWuserID) {
            //OW:
            $('#hideupline').remove();
            $('#ddlRecordMessagePass').val(1);
            $('#dPassToTeamNumRecordMessage').slideUp();
            $('#divtxtPassToNumberRecordMessage').slideUp();
            $('#dPickDistroList').slideDown();
        }

        $('#messageTag').val('');

        $('#ddlRecordMessagePass').change(function() {
            var selectedOpt = $(this).find("option:selected").attr('value');
            //alert(selectedOpt);
            switch (selectedOpt) {
            case '0':
//upline
//nothing is needed to pass up
                $('#dPickDistroList').slideUp();
                $('#dPassToTeamNumRecordMessage').slideUp();
                $('#divtxtPassToNumberRecordMessage').slideUp();
                break;
            case '1':
//downline
//show distro list
                $('#dPassToTeamNumRecordMessage').slideUp();
                $('#divtxtPassToNumberRecordMessage').slideUp();
                $('#dPickDistroList').slideDown();

                break;
            case '2':
//team number
                $('#dPickDistroList').slideUp();
                $('#dPassToTeamNumRecordMessage').slideDown();
                $('#divtxtPassToNumberRecordMessage').slideDown();
                break;
            default:
            }

            $('#txtPassToNumberRecordMessage').focus();


        });


        var objPage = $(this).parents("[data-role='page']");
        var thisCustNo = $('#custNo', '#pageRecordMessage').val();
        console.log("thisCustNo = " + thisCustNo);

        //localStorage.setItem('custNo', $('#custNo', '#pageRecordMessageDetails').val());
        if ($('#ddlRecordMessagePass').val() == "2") {
            if (!thisCustNo) {
                console.log("nothing here");
                navigator.notification.alert("Please start typing out the name or Life Line# of the individual you send this message to.  When you see them in the list (remember, you can scroll), tap their name, then tap the 'Next' button.", null, 'Please Select from List', 'Ok');
                return false;
            }
        }


        wireAutoComplete('#txtPassToNumberRecordMessage', '#custNo', $("#pageRecordMessage"));
        $('#txtPassToNumberRecordMessage').text('');
        $($("#pageRecordMessage")).find('#custNo').val('');
        $($("#pageRecordMessage")).find('[data-type=search]').val('');
        $($("#pageRecordMessage")).find('[data-icon=delete]').addClass('ui-input-clear-hidden');

        listenerBtnRecordPauseMessage();
        listenerBtnPlayMessage();


        //$.mobile.changePage("#pageRecordMessage", { transition: "slide" });

        populateDistroList(window.localStorage.getItem('fromUserId'), "pageRecordMessage", $('#ddlDistroListRecordMessage'), onAfterRecordpageLoad);


        $(this).addClass("buttonbgtap");
    }).off('vmouseover').on('vmouseover', function() {
        $(this).addClass("buttonbgtap");
    }).off('vmouseout').on('vmouseout', function() {
        $(this).removeClass("buttonbgtap");
    }).off('vmousecancel').on('vmousecancel', function() {
        $(this).removeClass("buttonbgtap");
    });


}


function onAfterRecordpageLoad() {
    var myselect = $('#ddlRecordMessagePass');
    myselect[0].selectedIndex = 0;
    myselect.selectmenu("refresh");
}

function onEmpty() {

}

function listenerBtnRecordPauseMessage() {
    /*<*/
    listenDeleteButton();
    listenUploadAndAcceptButton();
    $('#wrapperRecordingProgress #containerProgressBar #progress-bar').css({ 'width': '0%' });
    $('#wrapperRecordingProgress #audio_position').html('');

    $('#btnStartStopRecording').off().on('tap', function() {
        recordAudio(function(recInterval, mediaVar) {
            $('#btnStopRecording').off().on('tap', function() {
                endRecording(recInterval);
            });
        });
    });
    $('#btnPlayMessage').off().on('tap', function() {
        playRecordedAudio();
    });
    /*>*/
}



    var btn = {
        play: $('#btnPlayMessage', window.objWrapperMessageDetails),
        stop: $('#btnStopMessage', window.objWrapperMessageDetails),
        stopAndPause: $('#btnPauseMessage, #btnStopMessage', window.objWrapperMessageDetails),
        pause: $('#btnPauseMessage', window.objWrapperMessageDetails)
    };
    $('#btnPauseMessageText').click(function() {
        if ($('#btnPauseMessageText').text() == 'Pause') {
            //pauseAudio();
            alert("clicked")
            my_media.pause();
            //stopAudio();
            $('#btnPauseMessageText').text('Resume');
            //btn.pause.buttonMarkup({ icon: 'play' });
        } else {
            my_media.play();
            //playAudio(1);
            $('#btnPauseMessageText').text('Pause');
            //btn.pause.buttonMarkup({ icon: 'pause' });
        }
        btn.pause.addClass("buttonbgtap");
    }).on('vmouseover', function() {
        btn.pause.addClass("buttonbgtap");
    }).on('vmouseout', function() {
        btn.pause.removeClass("buttonbgtap");
    });


function listenerBtnStopMessage() {
    var btn = {
        play: $('#btnPlayMessage'),
        stop: $('#btnStopMessage'),
        stopAndPause: $('#btnPauseMessage, #btnStopMessage'),
        pause: $('#btnPauseMessage')
    };
    $('#btnPauseMessageText').click(function() {
        //console.log('--clicked on stop button listenerBtnStopMessage()');
        stopAudio();
        btn.stopAndPause.addClass('ui-disabled');
        btn.play.removeClass('ui-disabled');

        $('#btnPauseMessageText').text('Pause');
        //btn.pause.buttonMarkup({ icon: 'pause' });

    }).on('vmouseover', function() {
        btn.stop.addClass("buttonbgtap");
    }).on('vmouseout', function() {
        btn.stop.removeClass("buttonbgtap");
    });
}

function listenerBtnPlayMessage() {
    var btn = {
        play: $('#btnPlayMessage', window.objWrapperMessageDetails),
        stop: $('#btnStopMessage', window.objWrapperMessageDetails),
        stopAndPause: $('#btnPauseMessage, #btnStopMessage', window.objWrapperMessageDetails),
        pause: $('#btnPauseMessage', window.objWrapperMessageDetails)
    };
    $('#btnPlayMessage').click(function() {
        btn.stopAndPause.removeClass('ui-disabled');
        btn.play.addClass('ui-disabled');

        if ($.mobile.activePage.attr("id") == "pageMessageDetail") {
            playAudio(1);
            //my_media.play()
        } else {
            playRecordedAudio();
        }


    }).on('vmouseover', function() {
        btn.play.addClass("buttonbgtap");
    }).on('vmouseout', function() {
        btn.play.removeClass("buttonbgtap");
    });
}


/*page show/init events*/
$('#landingpage').on('pageinit', function() {
    listenHeaderLogoButton();
});
$('#pageMessageDetail').on('pageinit', function() {
    listenNextPrevBtns();
});

// in case a user has entered a customer number, to prenvent them form unintentially passing a number when they return, this wipes it out when they leave the page 
$('#passtonumber').off('pagehide').on('pagehide', function() {
    $('#custNo', $(this)).val('');
});


$('#pageRecordMessage').off('pagehide').on('pagehide', function() {
    $('#custNo', $(this)).val('');
    console.log('--ending recording');
    stopRecording(fileRemoveSuccessNoRedirect);
});

$('#pagereply').off('pagehide').on('pagehide', function() {
    console.log('--ending recording');
    stopRecording(fileRemoveSuccessNoRedirect);
});

$(document).on("pagebeforeshow", "#passtonumber", function() {

    wireAutoComplete('#txtPassToNumber', '#custNo', $("#passtonumber"));

    $('#txtPassToNumber, #txtPassToNumberTag').val('');

    $('#btnPassToNumber').off().on('tap', function() {
        thisCustNo = $('#passtonumber #custNo').val();
        console.log("thisCustNo = " + thisCustNo);

        // console.log("here's the ciustomer number we're trying to pass "+thisCustNo);
        if (!thisCustNo) {
            // alert('please pick a number from the list then click pass');
            alert('To proceed, please start entering the name or Life Line# of the person you wish to pass to.  Pick the person from that list, then tap the "Pass" button.', null, 'Please Pick List', 'Ok');
            // navigator.notification.alert('To proceed, please start entering the name or team number of the person you wish to pass to.  Pick the person from that list, then tap the "Pass" button.', null, 'Please Pick List', 'Ok');
            return false;

        } else {
            confirmMessage('Are you sure you want to pass this message?', onConfirmPass, 'Pass Message', 'Yes,Cancel');
        }
        // if (isNaN(thisCustNo) == false && thisCustNo.length > 0) {
        //     checkTeamNumber(thisCustNo);
        // } else {
        //     navigator.notification.alert('Please enter team#', null, 'Team#', 'Ok');
        // }
    });
});

$(document).on("pagebeforeshow", "#pagemanagedistros", function(event, ui) {

    $.mobile.loading('show', {
        text: 'Please wait, loading distribution lists...',
        textVisible: true,
        theme: 'b',
        textonly: false,
        html: ''
    });

    thisUserID = localStorage.getItem('userID');
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'GetDistroLists',
            'User_ID': thisUserID
        },
        success: function(data) {

            var listItems = '<li data-icon="plus"><a href="#" id="btnCreateNewDistro">Create new list</a></li>';

            $.each(data.TeamGetVoicemailDistroList, function(i, item) {
                if (item.NumContacts > -1) {
                    listItems += "<li  data-icon='edit'><a href='#' data-distroid='" + item.ID + "' class='btnViewEditDistro' data-distroname='" + item.Description + "'>" + item.Description + "<span class='ui-li-count'>" + item.NumContacts + "</span></a></li>";
                }


            });


            $('#ulmanagedistros').html(listItems);


            $("#ulmanagedistros").listview("refresh");
            $('#btnCreateNewDistro').off().on('tap', function() {
                $('#uldistromembers').empty();
                localStorage.setItem('distroid', '0');
                $('#btnDeleteList').parent().hide();
                $('#txtDistroName').val('');
                $.mobile.changePage('#pageeditdistrolist');
            });

            $('.btnViewEditDistro').off().on('tap', function(e) {
                $('#uldistromembers').empty();
                localStorage.setItem('distroid', $(this).attr("data-distroid"));
                $('#txtDistroName').val($(this).attr("data-distroname"));
                $('#btnDeleteList').parent().show();
                $.mobile.changePage('#pageeditdistrolist');
            });

            $.mobile.loading('hide');
        }
    });


});


$(document).on("pagebeforeshow", "#landingpage", function(event, ui) {


    var distroId = localStorage.getItem('distroid');
    var thisUserID = localStorage.getItem('userID');
    if (distroId == 0) {
        //new distro:
    } else {
        //existing distro:

        $.mobile.loading('show', {
            text: 'Please wait, loading users...',
            textVisible: true,
            theme: 'b',
            textonly: false,
            html: ''
        });

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: sActionUrl,
            data: {
                'Action': 'GetUsersInDistroList',
                'ListID': distroId
            },
            success: function(data) {

                console.log(JSON.stringify(data));
                $.each(data.VoiceMailDistroListMembersWithName, function(i, item) {

                    var includedownline = '';
                    //console.log('--include dnln: ' + item.IncludeDownline);
                    if (item.IncludeDownline) {
                        includedownline = '<p style="padding-top:5px;">Includes downline</p>';
                    }

                    var listItem = "<li data-icon='delete' id='li" + item.UserID + "'' data-userid='" + item.UserID + "' data-includedownline='"
                        + item.IncludeDownline + "' data-existinguser='1'><a href='#' data-userid='" + item.UserID + "' data-includedownline='" + item.IncludeDownline
                        + "'  ><h2>" + item.DisplayName + "</h2>" + includedownline + "</a><a href='#' class='btnDeleteUserFromDistro'  data-userid='" + item.UserID + "'>Delete User</a></li>";

                    $('#uldistromembers').append(listItem);
                });

                //$("#uldistromembers").listview("destroy").listview();


                $('.btnDeleteUserFromDistro').off().on('tap', function(e) {

                    confirmMessageDeleteUserFromList($(this));
                    //confirmMessage('Are you sure you want to delete this user from distribution list?', onConfirmDeleteUserFromList($(this)), 'Pass Message', 'Yes,Cancel');

                    //var liuserid = $(this).attr("data-userid");
                    ////delete from list:
                    //console.log('--deleting user: ' + liuserid);
                    //$(this).parent().hide();
                    //$("#uldistromembers").listview("refresh");


                });

                $.mobile.loading('hide');
                //$('#pageeditdistrolist').trigger("create");

            }
        });
    }

    wireAutoComplete('#txtDistroUser', '#custNoDistro', $("#pageeditdistrolist"));
    $('#btnDeleteList').off().on('tap', function() {
        confirmMessage('Are you sure you want to delete this distribution list?', onConfirmDeleteList, 'Delete Distribution List', 'Yes,Cancel');
    });


    $('#btnSaveList').unbind("click").click(function () {
        //saving list:
        $.mobile.loading('show', {
            text: 'Please wait, saving distribution list...',
            textVisible: true,
            theme: 'b',
            textonly: true,
            html: ''
        });

        thisUserID = localStorage.getItem('userID');
        var distroId = localStorage.getItem('distroid');
        var distroName = $('#txtDistroName').val();

        if (distroId == 0) {
            //new distro:
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: sActionUrl,
                data: {
                    'Action': 'AddDistroList',
                    'User_ID': thisUserID,
                    'DistroName': distroName
                },

                success: function(data) {

                    var iDistroListID = data.ListID;
                    console.log('--new list ID: ' + iDistroListID);
                    //cycle through each user:
                    var listItems = $("#uldistromembers li");
                    listItems.each(function(idx, li) {
                        var itm = $(li);

                        AddUserToList(itm.attr('data-includedownline'), iDistroListID, itm.attr('data-userid'));
                    });


                }
            });
        } else {
            //existing distro:

            console.log('--updating list ID: ' + distroId);
            //cycle through each user:
            var listItems = $("#uldistromembers li");
            listItems.each(function(idx, li) {


                var itm = $(li);
                //console.log('li: ' + li.innerHTML);

                if (itm.attr('data-existinguser') == '0' && itm.is(":visible") == true) {
                    console.log('-- passed check, adding new user: ' + itm.attr('data-existinguser'));
                    AddUserToList(itm.attr('data-includedownline'), distroId, itm.attr('data-userid'));

                }

                if (itm.attr('data-existinguser') == '1' && itm.is(":visible") == false) {
                    DeleteUserFromDistroList(distroId, itm.attr('data-userid'));

                }


            });


            UpdateDistroListName(distroId, $('#txtDistroName').val());
            $.mobile.loading('hide');
        }


        $.mobile.changePage('#pagemanagedistros', { reverse: true });
    });
    $('#btnAddUserToDistroList').unbind("click").click(function () {
        console.log('adding user' + $('#custNo').val() + ' to distro list');
        if ($.isNumeric($('#custNo').val()) == true) {
            console.log('--Adding ' + $('#custNo').val());
            var newuserid = $('#custNo').val();
            var chkDownline = $('#chkBoxAddDownline').is(':checked');

            $.mobile.loading('show', {
                text: 'Please wait, adding user to distribution list...',
                textVisible: true,
                theme: 'b',
                textonly: true,
                html: ''
            });

            thisUserID = localStorage.getItem('userID');
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: sActionUrl,
                data: {
                    'Action': 'GetUserInfo',
                    'User_ID': newuserid
                },
                success: function(data) {
                    var includedownline = '';
                    //console.log('--include dnln: ' + chkDownline);
                    if (chkDownline) {
                        includedownline = '<p style="padding-top:5px;">Includes downline</p>';
                    }


                    var listItem = "<li data-icon='delete' id='li" + newuserid + "'' data-userid='" + newuserid + "' data-includedownline='" + chkDownline +
                        "' data-existinguser='0'><a data-userid='" + newuserid + "' data-includedownline='" + chkDownline + "'  ><h2>"
                        + data.DisplayName + "</h2>" + includedownline + "</a><a href='#' class='btnDeleteUserFromDistro' data-userid='" + newuserid + "'>Delete User</a></li>";

                    console.log('adding ' + newuserid + ' to distro list');
                    $('#uldistromembers').append(listItem);
                    $("#uldistromembers").listview("refresh");

                    $('.btnDeleteUserFromDistro').click(function(e) {
                        confirmMessageDeleteUserFromList($(this));
                        
                    });


                }
            });

            $('#txtDistroUser').text('');
            $($("#pageeditdistrolist")).find('#custNo').val('');
            $($("#pageeditdistrolist")).find('[data-type=search]').val('');
            $($("#pageeditdistrolist")).find('[data-icon=delete]').addClass('ui-input-clear-hidden');

            $.mobile.loading('hide');
        }

    });

});

$(document).on("pagebeforeshow", "#landingpage", function(event, ui) {
    //refresh message counters:

    //$.mobile.loading('show', {
    //    text: 'Please wait, loading users...',
    //    textVisible: true,
    //    theme: 'b',
    //    textonly: false,
    //    html: ''
    //});

    $.mobile.loading('show');

    //$.mobile.showPageLoadingMsg();

    thisUserID = localStorage.getItem('userID');
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'GetUnreadMessageCount',
            'User_ID': thisUserID
        },
        success: function(data) {
            console.log("Downline message count" + data.countMessagesDownline);
            if (data.countMessagesDownline < 10) {
                $("#sFromDownline").text(data.countMessagesDownline);
            } else {
                $("#sFromDownline").text('9+');
            }

            if (data.countMessagesUpline < 10) {
                $("#sFromUpline").text(data.countMessagesUpline);
            } else {
                $("#sFromUpline").text('9+');
            }

            $.mobile.loading('hide');

            return true;
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(': ' + errorThrown);
            $.mobile.loading('hide');
            return false;
        }
    });


    $('#btnTest').off().on('tap', function() {
        //console.log(' --showing dissapearing message:');
        //topBar("Test Message", $('#landingpage'));
        $.mobile.changePage('#landingpage', {
            transition: "slide"
        });
        //loadnewmessage(57,1)
        ;

    });
});

$(document).on("pagebeforeshow", "#pageRecordMessage", function(event, ui) {
    $('#btnAcceptUploadText').text('Send');
    $('#btnDeleteMessage').show();


    $('#btnPlayMessage', '#wrapperRecordControlButtons').click(function() {
        //clicked on a play button:
        playRecordedAudio();
        btn.stopAndPause.removeClass('ui-disabled');
        btn.play.addClass('ui-disabled');
    });


});

$(document).on("pagebeforeshow", "#passup", function(event, ui) {
    $('#txtPassUp').val('');

    $('#btnPassUpPage').off().on('tap', function() {

        confirmMessage('Are you sure you want to pass up this message?', onConfirmPassUp, 'Pass Message Up', 'Yes,Cancel');


        //console.log(' --passing up message');

        //var thisMessageID = localStorage.getItem('thisMsgID');
        //$.mobile.loading('show', {
        //    text: 'Please wait ...',
        //    textVisible: true,
        //    theme: 'b',
        //    textonly: true,
        //    html: ''
        //});

        //passUpMessage(localStorage.getItem('thisMsgID'), $('#txtPassUp').val());

        //$.mobile.changePage("#pageMessageDetail", {
        //    transition: "slide",
        //    reverse: true
        //});

    });
});


$(document).on("pagebeforeshow", "#passdown", function(event, ui) {


    $('#btnPassDownPage').off().on('tap', function() {
        confirmMessage('Are you sure you want to pass down this message?', onConfirmPassDown, 'Pass Message Down', 'Yes,Cancel');

        //var thisMessageID = localStorage.getItem('thisMsgID');
        //$.mobile.loading('show');
        //var passTo = 0;
        //passDownMessage(localStorage.getItem('thisMsgID'), localStorage.getItem('userID'), $('#txtPassDown').val(), passTo);
        //$.mobile.loading('hide');
        //$.mobile.changePage("#pageMessageDetail", {
        //    transition: "slide",
        //    reverse: true
        //});
    });
});

$('#pagereply').off('pageshow').on('pageshow', function(event, ui) {

    //moving recording to the new div:


});


$(document).on("pagebeforeshow", "#pageMessageDetail", function() {

    $(this).addClass('ui-page-active');
    var canSeeDownline = window.localStorage.getItem('CanSeeDownline');

    var objWrapperMessageDetails = $('#pageMessageDetail');
    var tabID = window.localStorage.getItem('tabID');

    //checking if it should autoplay:
    var autoplay = window.localStorage.getItem('autoplay');
    window.localStorage.setItem('autoplay', '0');
    var btn = {
        play: $('#btnPlayMessage', objWrapperMessageDetails),
        stop: $('#btnStopMessage', objWrapperMessageDetails),
        stopAndPause: $('#btnPauseMessage, #btnStopMessage', objWrapperMessageDetails),
        pause: $('#btnPauseMessage', objWrapperMessageDetails)
    };
    if (autoplay == '1') {
        //autoplaying:

        btn.play.addClass('ui-disabled');
        btn.stopAndPause.removeClass('ui-disabled');
        $('#btnPauseMessageText').text('Pause');
        $('#btnPauseMessage').removeClass('ui-disabled');
        $('#btnStopMessage').removeClass('ui-disabled');
        btn.play.addClass('ui-disabled');
        playAudio(1);
        $('#btnPlayMessage').trigger('tap');
    } else {
        //reset buttons:

        $('#btnPauseMessageText').text('Pause');
        $('#btnPauseMessage').addClass('ui-disabled');
        $('#btnStopMessage').addClass('ui-disabled');
        btn.play.removeClass('ui-disabled');
        playAudio(0);
    }


    $('#messagelist').empty();
    $('#labelMessageFrom').text(window.localStorage.getItem('data-nameFrom'));
    $('#labelMessageSentOn').text(window.localStorage.getItem('data-dttmSubmit'));
    $('#labelMsgTag').html("<ul class='ultags'>" + window.localStorage.getItem('msgtags') + "</ul>");

    var thisMessageID = window.localStorage.getItem('thisMsgID');
    var canPassUp = window.localStorage.getItem('canPassUp');
    var canPassDown = window.localStorage.getItem('canPassDown');
    var msgListenedTo = window.localStorage.getItem('ListenedTo');

    if (msgListenedTo == 0) {
        $('#btnMarkAsUnlistened').addClass("ui-disabled");
    } else {


        $('#btnMarkAsUnlistened').removeClass("ui-disabled");
        $('#btnMarkAsUnlistened').off().on('tap', function() {
            msgListenedTo = 0;
            SetMessageAsUnlistened(thisMessageID);
            $('#btnMarkAsUnlistened').addClass("ui-disabled");
            $("#panelmessagedetails").panel("close");
        });

    }

    console.log('--this message id:' + thisMessageID);


    $('#btnDeleteArchive').off().on('tap', function() {
        thisMsgID = window.localStorage.getItem('thisMsgID');
        confirmMessage("Are you sure you want to delete this message?", onConfirmDelete, "Confirm Delete", "Yes,Cancel");
    });


    if (canPassUp == 'true') {
        $('#btnPassUp').removeClass("ui-disabled");
    } else {
        $('#btnPassUp').addClass("ui-disabled");
    }

    if (canPassDown == 'true') {
        $('#btnPassDown').removeClass("ui-disabled");
        $('#btnPassDown').off().on('tap', function(event) {
            $.mobile.changePage('#passdown', {
                transition: "slide"
            });
            populateDistroList(window.localStorage.getItem('fromUserId'), "", $('#distrolist'), onEmpty);
            $('#txtPassDown').val('');
        });
    } else {
        //console.log('hiding pass down button');
        $('#btnPassDown').addClass("ui-disabled");
    }

    //previous/next buttons:
    var bFirstMessage = window.localStorage.getItem('firstMsg');
    var bLastMessage = window.localStorage.getItem('lastMsg');
    var thisMessageID = window.localStorage.getItem('thisMsgID');
    if (bFirstMessage == 'true') {
        $('#btnPrevMessage').addClass("ui-disabled");
    } else {
        $('#btnPrevMessage').removeClass("ui-disabled");
    }

    if (bLastMessage == 'true') {
        $('#btnNextMessage').addClass("ui-disabled");
    } else {
        $('#btnNextMessage').removeClass("ui-disabled");
    }


    $('#btnReply, #btnReplyInline').off().on('tap', function(event) {
        $('#divReplyWithVoice').show();
        $('#divReplyWithText').hide();
        $('#txtTagReply').val('');


        $('#txtPassToNumberRecordMessage').text('');
        $($("#pageRecordMessage")).find('#custNo').val('');
        $($("#pageRecordMessage")).find('[data-type=search]').val('');
        $($("#pageRecordMessage")).find('[data-icon=delete]').addClass('ui-input-clear-hidden');

        listenerBtnRecordPauseMessage();
        listenerBtnPlayMessage();

        var element = $('#wrapperPageRecord').detach();
        $('#divReplyWithVoice').append(element).trigger('create');

        //var elementFooter = $('#divRecordMessageFooter').detach();
        //$('#divReplyWithVoiceButtons').append(elementFooter).trigger('create');
        //$('#btnDeleteMessage').hide();

        $('#btnReplyWithVoice').off().on('tap', function() {
            $('#divReplyWithVoice').show();
            //$('#divReplyWithVoiceButtons').show();
            //$('#divReplyWithText').hide();
            $('#btnAcceptUploadText').text('Reply');
            $('#btnDeleteMessage').hide();
            $('#btnSendReply').addClass("ui-disabled");
        });
        $('#btnReplyWithText').off().on('tap', function() {
            $('#divReplyWithVoice').hide();
            //$('#divReplyWithVoiceButtons').hide();
            $('#divReplyWithText').show();
            $('#btnSendReply').removeClass("ui-disabled");

        });
        $('#btnReplyCancel').off().on('tap', function() {
            $.mobile.changePage("#pageMessageDetail", {
                transition: "slide",
                reverse: true
            });
        });

        $('#btnSendReply').off().on('tap', function() {

            var isHidden = $('#divReplyWithVoice').is(':hidden');

            if (isHidden == true) {


                confirmMessage('Are you sure you want to reply to this message?', onConfirmReply, 'Reply', 'Yes,Cancel');

                //console.log(' --replying to message');

                //$.mobile.loading('show');


                //replyWithText(localStorage.getItem('thisMsgID'), localStorage.getItem('userID'), $('#txtTagReply').val(), localStorage.getItem('fromUserId'));

                //$.mobile.changePage("#pageMessageDetail", {
                //    transition: "slide",
                //    reverse: true
                //});

            } else {
                //console.log(' --replying to message with voice');
                confirmMessage('Are you sure you want to reply to this message?', onConfirmReplyWithVoice, 'Reply', 'Yes,Cancel');
            }


        });

        $.mobile.changePage('#pagereply', {
            transition: "slide"
        });


    });


    var canReply = window.localStorage.getItem('canreply');
    //console.log('-- can reply ' + canReply);
    if (canReply == 'true') {
        $('#btnReplyInline').removeClass("ui-disabled");
        $('#btnReply').removeClass("ui-disabled");
    } else {
        $('#btnReplyInline').addClass("ui-disabled");
        $('#btnReply').addClass("ui-disabled");
    }

    //archive message:
    if (tabID != 2) {
        $('#btnArchiveMessage').removeClass("ui-disabled");
        $('#btnArchiveMessage').off().on('tap', function() {
            thisMsgID = window.localStorage.getItem('thisMsgID');
            confirmMessage('Are you sure you want to archive this message?', onConfirmArchive, 'Archive Message', 'Yes,Cancel');
        });

    } else {

        //$('#btnReplyInline').addClass("ui-disabled");
        //$('#btnReply').addClass("ui-disabled");
        //$('#btnPassToTeamNumber').addClass("ui-disabled");
        $('#btnArchiveMessage').addClass("ui-disabled");
        $('#btnMarkAsUnlistened').addClass("ui-disabled");
    }

    //console.log('--can pass up ' + canPassUp);
    if (canSeeDownline == 0) {
        //new member:
        $('#btnPassToTeamNumber').addClass("ui-disabled");
    } else {
        $('#btnPassToTeamNumber').removeClass("ui-disabled");
    }


});
$(document).on("pagebeforeshow", "#messages", function() {


    var refreshMessages = localStorage.getItem('refreshmessagedata');
    console.log('-- refresh messages :' + refreshMessages);

    $.mobile.loading('show', {
        text: 'Please wait, loading messages...',
        textVisible: true,
        theme: 'b',
        textonly: false,
        html: ''
    });

    if (localStorage.getItem('messagedata') == null || refreshMessages) {
        // alert(' -- loading messages from server');
        loadMessages();

    } else {
        // alert(' -- showing messages from cache');
        var retrievedObject = localStorage.getItem('messagedata');
        showMessageBubbles(JSON.parse(retrievedObject));
    }

    //$('#messagelist').iscrollview("_create");

    //var myView = $("#messagelist").data("mobileIscrollview");
    //myView.refresh();


});
$('#pagetest').off('pageshow').on('pageshow', function() {

});
$(document).on("pagebeforeshow", "#pagesettings", function() {
    $('#imgChanged').val('0');
    //console.log(' -- receive notifications: ' + localStorage.getItem('ReceiveNotifications'));
    if (localStorage.getItem('ReceiveNotifications') == "1") {
        //notifications are ON
        $("#flipReceiveNotifications").val('1').slider('refresh');
    } else {
        //notifications are OFF
        $("#flipReceiveNotifications").val('0').slider('refresh');
    }

    $('#btnSaveSettings').off().on('tap', function() {
        //console.log(' --saving settings');
        var timeoutID;
        //saving settings:

        $.mobile.loading('show');
        SaveSettings($('#flipReceiveNotifications').find(":selected").val());
        localStorage.setItem('ReceiveNotifications', $('#flipReceiveNotifications').find(":selected").val());


        $.mobile.changePage('#landingpage', {
            transition: "slide",
            reverse: true
        });

    }); //$('#slider-2').val(0).slider('refresh');
    //var i = 1;                     //  set your counter to 1

    //function myLoop() {           //  create a loop function
    //    setTimeout(function () {    //  call a 3s setTimeout when the loop is called
    //        $('#slider-2').val(i).slider('refresh');          //  your code here
    //        i++;                     //  increment the counter
    //        if (i < 100) {            //  if the counter < 10, call the loop function
    //            myLoop();             //  ..  again which will trigger another 
    //        }                        //  ..  setTimeout()
    //    }, 1000)
    //}

    //myLoop();
});

/* end page show events*/

function switchmessage(sDirection) {
    //sDirection: 'next','prev'

    var iMsgIndx = localStorage.getItem('thisMsgIndx');
    var tabID = localStorage.getItem('tabID');
    if (sDirection == 'next') {
        iMsgIndx = parseInt(iMsgIndx) + 1;
    } else {
        iMsgIndx = parseInt(iMsgIndx) - 1;
    }

    localStorage.setItem('autoplay', '1');
    var iTest = iMsgIndx;
    var retrievedObject = localStorage.getItem('messagedata');
    var dataMainList = JSON.parse(retrievedObject);

    var data = dataMainList.TeamTalk[parseInt(iMsgIndx) - 1];
    var audoFile = messagePath + data.FileName;
    var fileLength = data.Length;
    var thisMessageBubbleClass;
    var thistapcss;
    var thisButtons;
    var canPassDown;
    var canPassUp;
    var blnCanPassDown = new Boolean(data.CanPassDown);
    var nameFrom = data.FirstName + ' ' + data.LastName;
    var dttmSubmit = data.DateSubmitted;
    var dttm = dttmSubmit.split('T');
    var date = dttm[0].split('-');
    var bFirst = true;
    var bLast = false;
    var objDttmSubmit = new Object();

    objDttmSubmit.yr = date[0];
    objDttmSubmit.mo = date[1];
    objDttmSubmit.day = date[2];
    objDttmSubmit.tm = dttm[1];


    canPassDown = (data.CanPassDown == '0') ? false : true;
    canPassUp = (tabID != 0) ? false : true;

    tags = data.Tags;
    // console.log(tags);
    var displayTags = '';

    if (tags != '[]') {
        $(tags).each(function() {
            // console.log($(this)[0].ID);
            displayTags = '<li><b>' + $(this)[0].FirstName + ' ' + $(this)[0].LastName + '</b> says: ' + $(this)[0].Tag + '</li>' + displayTags;
        });
    } else {

        displayTags += '<li>No tags ...</li>';
    }

    switch (tabID) {
    //archive
    case '2':
        thisClass = 'messagebubble';
        thisPullDownClass = 'pulldown_archive';
        thisMessageBubbleClass = 'messagebubblemoreinfodesc';
        thistapcss = 'messagebubbletap';
        canPassUp = data.CanPassUp;
        break;
    default:
//new

// this css calls a different background based on iTest being odd or even
        thisPullDownClass = 'pulldown';
        thisClass = (iTest % 2 == 0) ? 'messagebubblenew1' : 'messagebubblenew2';
        thistapcss = (iTest % 2 == 0) ? 'messagebubblenew1tap' : 'messagebubblenew2tap';
        thisMessageBubbleClass = (iTest % 2 == 0) ? 'messagebubblemoreinfodescnew1' : 'messagebubblemoreinfodescnew2';
        thisMessageButtonClass = (iTest % 2 == 0) ? 'btndelete' : 'btndelete1';

        thisButtons = "";

        canPassUp = (tabID != 0) ? false : true;
        canPassUp = (data.CanReply == false) ? true : canPassUp;

        break;
    }


    if (parseInt(iMsgIndx) == dataMainList.TeamTalk.length) {
        bLast = true;
    }

    if (iMsgIndx > 1) {
        bFirst = false;
    }


    //console.log(' -- bLast ' + bLast + ' ' + (parseInt(iMsgIndx) - 1) + ' ' + (dataMainList.TeamTalk.length));


    $('#labelMessageFrom').text(nameFrom);
    $('#labelMessageSentOn').text(formatDate(dttmSubmit));

    localStorage.setItem('thisMsgID', data.ID);
    localStorage.setItem('audioFile', audoFile);

    localStorage.setItem('ListenedTo', data.ListenedTo);
    localStorage.setItem('canreply', data.CanReply);
    localStorage.setItem('data-filelength', fileLength);
    localStorage.setItem('data-nameFrom', nameFrom);
    localStorage.setItem('data-dttmSubmit', formatDate(dttmSubmit));
    localStorage.setItem('canPassDown', canPassDown);
    localStorage.setItem('canPassUp', canPassUp);
    localStorage.setItem('fromUserId', data.UserID);
    localStorage.setItem('firstMsg', bFirst);
    localStorage.setItem('lastMsg', bLast);
    localStorage.setItem('thisMsgIndx', iMsgIndx);
    localStorage.setItem('msgtags', displayTags);


    if (sDirection == 'next') {
        $.mobile.changePage($('#pageMessageDetail'), { allowSamePageTransition: true, transition: "slide" });
    } else {
        $.mobile.changePage($('#pageMessageDetail'), { allowSamePageTransition: true, transition: "reverse slide" });
    }


    //$.mobile.changePage($('#pageMessageDetail'), { allowSamePageTransition: true, transition: "fade" });


}

function loadnewmessage(msgid, tabid) {
    $.mobile.changePage($('#messages'), { allowSamePageTransition: true });
    //$.mobile.loading('show');

    $.mobile.loading('show', {
        text: 'Please wait, loading messages...',
        textVisible: true,
        theme: 'b',
        textonly: true,
        html: ''
    });


    switch (tabid) {
    case VMTypes.FromUpline:
        $('#messageheadertext').text('...from Upline');
        $('#popupMessagesText').html(sMessageUpline);
        break;
    case VMTypes.FromDownline:
        $('#messageheadertext').text('...from Downline');
        $('#popupMessagesText').html(sMessageDownline);
        break;
    }


    console.log(' --loading new message, msgid: ' + msgid + ' tabid' + tabid);

    //$('#pleasewait').fadeIn("slow");
    clearMessages();

    localStorage.setItem('tabID', tabid);
    var tabID = localStorage.getItem('tabID');
    thisUserID = localStorage.getItem('userID');

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'GetVoicemailList',
            'User_ID': thisUserID,
            'tab': tabID
        },
        success: function(data) {
            console.log(' ---loading new message: ' + msgid);

            var bFirst = true;
            var bLast = false;
            var iTest = 0;
            var bBreak = false;

            $.each(data.TeamTalk, function(i, item) {

                var audoFile = messagePath + item.FileName;
                var fileLength = item.Length;
                var thisMessageBubbleClass;
                var thistapcss;
                var thisButtons;
                var canPassDown;
                var canPassUp;
                var blnCanPassDown = new Boolean(item.CanPassDown);
                var nameFrom = item.FirstName + ' ' + item.LastName;
                var dttmSubmit = item.DateSubmitted;


                var dttm = dttmSubmit.split('T');
                var date = dttm[0].split('-');

                var objDttmSubmit = new Object();

                objDttmSubmit.yr = date[0];
                objDttmSubmit.mo = date[1];
                objDttmSubmit.day = date[2];
                objDttmSubmit.tm = dttm[1];


                tags = item.Tags;

                var displayTags = '';

                if (tags != '[]') {
                    $(tags).each(function() {
                        // console.log($(this)[0].ID);
                        displayTags = '<li><b>' + $(this)[0].FirstName + ' ' + $(this)[0].LastName + '</b> says: ' + $(this)[0].Tag + '</li>' + displayTags;
                    });
                } else {

                    displayTags += '<li>No tags ...</li>';
                }

                if (iTest + 1 == data.TeamTalk.length) {
                    bLast = true;
                }

                if (item.ID == msgid) {
                    $('#labelMessageFrom').text(nameFrom);
                    $('#labelMessageSentOn').text(formatDate(dttmSubmit));

                    canPassUp = (tabID != 0) ? false : true;
                    canPassUp = (item.CanReply == false) ? true : canPassUp;


                    localStorage.setItem('autoplay', '1');
                    localStorage.setItem('thisMsgID', item.ID);
                    localStorage.setItem('audioFile', audoFile);
                    localStorage.setItem('ListenedTo', item.listenedto);
                    localStorage.setItem('canreply', item.CanReply);
                    localStorage.setItem('data-filelength', fileLength);
                    localStorage.setItem('data-nameFrom', nameFrom);
                    localStorage.setItem('data-dttmSubmit', formatDate(dttmSubmit));
                    localStorage.setItem('canPassDown', canPassDown);
                    localStorage.setItem('canPassUp', canPassUp);
                    localStorage.setItem('fromUserId', item.UserID);
                    localStorage.setItem('firstMsg', bFirst);
                    localStorage.setItem('lastMsg', bLast);
                    localStorage.setItem('thisMsgIndx', iTest + 1);
                    localStorage.setItem('msgtags', displayTags);


                    bBreak = true;

                    console.log('  --changing to message #' + msgid + ' : ' + item.ID);
                    $.mobile.changePage($('#pageMessageDetail'), { allowSamePageTransition: true, transition: "slide" });
                }


                //if (bBreak) { break}

                bFirst = false;
                iTest += 1;
            });


        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(': ' + errorThrown);
            return false;
        }
    });

    $.mobile.loading('hide');
}


/************************ 
*************************
********* HELPERS *******
*************************
*************************/

function formatDate(sDate) {

    var myDate = new Date(sDate);
    var curr_hour = myDate.getHours() + 4;
    var day = myDate.getDate();

    if (curr_hour == 24) {
        day++;
    }

    if (curr_hour < 12 || curr_hour == 24) {
        a_p = "AM";
    } else {
        a_p = "PM";
    }
    if (curr_hour == 0) {
        curr_hour = 12;
    }
    if (curr_hour > 12) {
        curr_hour = curr_hour - 12;
    }

    // console.log(curr_hour);
    return ((myDate.getMonth() + 1) + "/" + day + "/" + myDate.getFullYear() + ' ' + curr_hour + ":" + myDate.getMinutes() + ' ' + a_p);
}


Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
};
Date.prototype.addDays = function(d) {
    this.setDays(this.getDays() + d);
    return this;
};

function htmlEncode(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}


function populateDistroList(UserID, sPage, distrolist, callback) {

    $.mobile.loading('show', {
        text: 'Please wait...',
        textVisible: true,
        theme: 'b',
        textonly: false,
        html: ''
    });


    var tabID = localStorage.getItem('tabID');
    thisUserID = localStorage.getItem('userID');
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'GetDistroLists',
            'User_ID': thisUserID
        },
        success: function(data) {

            var listItems = '<option value=0>All</option>';

            //if (tabID == 0) {
            //    listItems += '<option value=' + UserID + '>' + ReplyTo + '</option>';
            //}

            $.each(data.TeamGetVoicemailDistroList, function(i, item) {

                listItems += "<option value='" + item.ID + "'>" + item.Description + "</option>";

            });


            $(distrolist).html(listItems);


            if (sPage.length > 0) {
                $.mobile.changePage("#" + sPage, { transition: "slide" });
            }


            $(distrolist).prop('selectedIndex', 0);
            //$(distrolist).selectmenu('refresh');
            $(distrolist).selectmenu('refresh', true); //callback();


            $.mobile.loading('hide');
        }
    });
}

/* confirmation messages and handlers: */

function confirmMessage(sMessage, sOnConfirm, sTitle, sButtons) {
    navigator.notification.confirm(
        sMessage,
        sOnConfirm,
        sTitle,
        sButtons);
}

function confirmMessageDeleteUserFromList(obj) {
    navigator.notification.confirm(
        'Are you sure you want to delete this user from distribution list?',
        function(buttonIndex) {
            onConfirmDeleteUserFromList(buttonIndex, obj);
        },
        'Delete User From List',
        'Yes,Cancel'
    );


}

function onConfirmDeleteUserFromList(buttonIndex, obj) {
    if (buttonIndex == 1) {
        var liuserid = $(obj).attr("data-userid");
        console.log(' -- liuserid' + liuserid);
        $(obj).parent().hide();
        $("#uldistromembers").listview("refresh");
    } else {

    }
}

function onConfirmDelete(buttonIndex) {


    if (buttonIndex == 1) {

        console.log('-- deleting message: ' + thisMsgID);

        thisUserID = localStorage.getItem('userID');
        var thisMsgID = localStorage.getItem('thisMsgID');

        $.mobile.loading('show');
        deleteMessage(thisMsgID, thisUserID);
        clearMessages();
        $.mobile.loading('hide');

        $.mobile.changePage("#messages", {
            transition: "slide",
            reverse: true
        });


    } else {

    }
}


function onConfirmReply(buttonIndex) {
    if (buttonIndex == 1) {
        console.log(' --replying to message');

        $.mobile.loading('show');


        replyWithText(localStorage.getItem('thisMsgID'), localStorage.getItem('userID'), $('#txtTagReply').val(), localStorage.getItem('fromUserId'));

        $.mobile.changePage("#pageMessageDetail", {
            transition: "slide",
            reverse: true
        });


    }
}

function onConfirmReplyWithVoice(buttonIndex) {
    if (buttonIndex == 1) {
        console.log(' --replying to message');

        $.mobile.loading('show');


        //passToTeamNumber(localStorage.getItem('thisMsgID'), localStorage.getItem('userID'), $('#txtTagReply').val(), localStorage.getItem('fromUserId'));
        uploadMessage();

        //$.mobile.changePage("#pageMessageDetail", {
        //    transition: "slide",
        //    reverse: true
        //});


    }
}


function onConfirmPassUp(buttonIndex) {
    if (buttonIndex == 1) {
        console.log(' --passing up message');

        var thisMessageID = localStorage.getItem('thisMsgID');
        $.mobile.loading('show', {
            text: 'Please wait ...',
            textVisible: true,
            theme: 'b',
            textonly: true,
            html: ''
        });

        passUpMessage(localStorage.getItem('thisMsgID'), $('#txtPassUp').val());

        $.mobile.changePage("#pageMessageDetail", {
            transition: "slide",
            reverse: true
        });
    }
}

function onConfirmDeleteList(buttonIndex) {
    if (buttonIndex == 1) {

        $.mobile.loading('show');
        var distroId = localStorage.getItem('distroid');
        DeleteDistroList(distroId);
        $.mobile.loading('hide');
        $.mobile.changePage("#pagemanagedistros", {
            transition: "slide",
            reverse: true
        });
    }
}

function onConfirmPass(buttonIndex) {
    if (buttonIndex == 1) {

        //console.log(' --passing message to a specific team#');
        var thisMessageID = localStorage.getItem('thisMsgID');
        $.mobile.loading('show');


        var objParent = $('#passtonumber');
        var custNo = $(objParent).find('#custNo').val();
        console.log('---passtonumber message to: ' + custNo);

        passToTeamNumber(localStorage.getItem('thisMsgID'), localStorage.getItem('userID'), $('#txtPassToNumberTag').val(), custNo);
        $.mobile.loading('hide');
        $.mobile.changePage("#pageMessageDetail", {
            transition: "slide",
            reverse: true
        });

    }
}

function onConfirmPassDown(buttonIndex) {
    if (buttonIndex == 1) {
        var thisMessageID = localStorage.getItem('thisMsgID');
        $.mobile.loading('show');
        var passTo = 0;
        var thisUserID = localStorage.getItem('userID');
        passDownMessage(localStorage.getItem('thisMsgID'), thisUserID, $('#txtPassDown').val(), passTo);
        $.mobile.loading('hide');
        $.mobile.changePage("#pageMessageDetail", {
            transition: "slide",
            reverse: true
        });
    }
}

function onConfirmArchive(buttonIndex) {
    if (buttonIndex == 1) {
        var thisMessageID = localStorage.getItem('thisMsgID');
        var thisUserID = localStorage.getItem('userID');
        $.mobile.loading('show');
        archiveMessage(thisMsgID, thisUserID);
        clearMessages();
        $.mobile.changePage("#messages", {
            transition: "slide",
            reverse: true
        });
        $('#message_' + thisMsgID).slideUp();
        $.mobile.loading('hide');
    }

}


//message manipulations:

function deleteMessage(MessageID, User_ID) {
    console.log('--deleting message:');
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'DeleteMessage',
            'User_ID': User_ID,
            'MessageID': MessageID
        },
        success: function(data) {
            console.log('deleting message userid: ' + User_ID + ' Message ID: ' + MessageID + ' Status: ' + data.Status);
            return data.Status.toString();
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('------ error : ' + errorThrown);

            return '0';
        }
    });
}

function archiveMessage(MessageID, User_ID) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'ArchiveMessage',
            'User_ID': User_ID,
            'MessageID': MessageID
        },
        success: function(data) {
            console.log('archiving message userid: ' + User_ID + ' Message ID: ' + MessageID + ' Status: ' + data.Status);
            return data.Status.toString();
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('------ error : ' + errorThrown);

            return '0';
        }
    });
}

function passToTeamNumber(MessageID, User_ID, sTag, PassTo) {

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'PassToTeamNumber',
            'User_ID': User_ID,
            'MessageID': MessageID,
            'tag': encodeURIComponent(sTag),
            'PassTo': PassTo
        },
        success: function(data) {
            console.log(' ----- pass to individual team#: ' + User_ID + ' Message ID: ' + MessageID + ' sTag:' + sTag + ' PassTo:' + PassTo + ' Status: ' + data.Status);
            $.mobile.loading('hide');
            return data.Status.toString();
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('----Pass Up error : ' + errorThrown);

            return '0';
        }
    });
}

function replyWithText(MessageID, User_ID, sTag, PassTo) {

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'replyWithText',
            'User_ID': User_ID,
            'MessageID': MessageID,
            'tag': encodeURIComponent(sTag),
            'PassTo': PassTo
        },
        success: function(data) {
            console.log(' ----- replyWithText team#: ' + User_ID + ' Message ID: ' + MessageID + ' sTag:' + sTag + ' PassTo:' + PassTo + ' Status: ' + data.Status);
            $.mobile.loading('hide');
            return data.Status.toString();
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('----replyWithText error : ' + errorThrown);

            return '0';
        }
    });
}

function passDownMessage(MessageID, User_ID, sTag, passTo) {

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'PassDown',
            'User_ID': User_ID,
            'MessageID': MessageID,
            'tag': encodeURIComponent(sTag),
            'PassTo': passTo
        },
        success: function(data) {
            console.log(' ----passDownMessage: ' + User_ID + ' Message ID: ' + MessageID + ' sTag:' + sTag + ' passTo:' + passTo + ' Status: ' + data.Status);
            return data.Status.toString();
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('---Pass down error : ' + errorThrown);

            return '0';
        }
    });
}

function passUpMessage(MessageID, sTag) {
    var User_ID = localStorage.getItem('userID');
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'PassUp',
            'User_ID': User_ID,
            'MessageID': MessageID,
            'tag': encodeURIComponent(sTag)
        },
        success: function(data) {
            console.log(' ----- passUpMessage: ' + User_ID + ' Message ID: ' + MessageID + ' sTag:' + sTag + ' Status: ' + data.Status);
            $.mobile.loading('hide');
            return data.Status.toString();
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('----Pass Up error : ' + errorThrown);

            return '0';
        }
    });
}

//end message manipulations

function AddUserToList(bIsIncludeDownline, listID, userID) {

    console.log('-- AddUserToList ' + userID + ' ' + listID);

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'AddUserToDistroList',
            'User_ID': userID,
            'ListID': listID,
            'IsIncludeDownline': bIsIncludeDownline
        },

        success: function(data) {
            console.log('--adding user to list:  ' + data.Status);


        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('------ error AddUserToList: ' + errorThrown);
            return false;
        }
    });
}

function DeleteDistroList(listID) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'DeleteDistroList',
            'ListID': listID
        },

        success: function(data) {
            console.log('--DeleteDistroList:  ' + data.Status);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('------ error DeleteDistroList: ' + errorThrown);
            return false;
        }
    });
}

function DeleteUserFromDistroList(listID, userID) {
    //json = AddUserToDistroList(Request("ListID"), Request("User_ID"), Request("IsIncludeDownline"))
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'DeleteUserFromDistroList',
            'User_ID': userID,
            'ListID': listID
        },

        success: function(data) {
            console.log('--deleting user from list:  ' + data.Status);


        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('------ error DeleteUserFromDistroList: ' + errorThrown);
            return false;
        }
    });
}

function UpdateDistroListName(listID, listName) {
    //json = AddUserToDistroList(Request("ListID"), Request("User_ID"), Request("IsIncludeDownline")) 
    listName = encodeURIComponent(listName);
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: sActionUrl,
        data: {
            'Action': 'UpdateDistroName',
            'listName': listName,
            'ListID': listID
        },

        success: function(data) {
            console.log('--UpdateDistroListName:  ' + listID + ' ' + ' ' + listName + ' ' + data.Status);


        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('------ error UpdateDistroListName: ' + errorThrown);
            return false;
        }
    });
}

// this one wires the source up with autocomplete and handling for an X that will wipe out it's contents

function wireAutoComplete(strRefSource, strRefTarget, objParent) {

    //console.log(' --strRefSource : ' + strRefSource + ' strRefTarget: ' + strRefTarget);

    $(strRefSource).off().on("listviewbeforefilter", function(e, data) {
        var $ul = $(this),
            $input = $(data.input),
            value = $input.val(),
            html = "";
        $ul.html("");

        if ((value && value.length > 2 && isNumber(value) == false) || (isNumber(value) == true && value.length == 8)) {

            $.mobile.loading('show', {
                text: 'Please wait ...',
                textVisible: true,
                theme: 'b',
                textonly: true,
                html: ''
            });

            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");

            $ul.listview("refresh");

            var thisUserID = localStorage.getItem('userID');

            $("form.ui-listview-filter a span.ui-btn-inner span.ui-icon")
                .removeClass("ui-icon-delete")
                .addClass("ui-icon ui-icon-loading ui-icon-ajax");

            $.ajax({
                url: sActionUrl,
                dataType: "json",
                data: {
                    action: 'SearchUsers',
                    SearchString: $input.val(),
                    User_ID: thisUserID
                },
                success: function(data) {
                    if (data.TeamGetVoiceMailPeopleSearch.length == 0) {
                        $.mobile.loading('hide');
                        $('#loadingMessage', objParent).hide();

                        var sMessage = " wasn't able to find anything in our system. You can search on first/last name or Life Line number.";

                        if (objParent.selector != '#pageeditdistrolist') {
                            topBar("Search for '" + $input.val() + sMessage, $('#dPassToTeamNumRecordMessage'));
                        } else {
                            //edit distro page:
                            topBar("Search for '" + $input.val() + sMessage, $('#divEditDistroMessage'));
                        }
                    } else {

                        if (objParent.selector == '#pageeditdistrolist') {
                            $('#divCollapsibleEditDistroList').collapsible({ collapsed: false }).trigger("collapse");
                            //$("#uldistromembers").listview("refresh");
                        }

                        $.each(data.TeamGetVoiceMailPeopleSearch, function(i, item) {
                            var id = 'sel' + item.UserID;
                            var link = "<a href='#' id='" + id + "' data-id='" + item.UserID + "' data-canentiredownline='" + item.CanEntireDownline + "'>" + item.FullName + "</a>";
                            html += "<li data-inset='true' value=" + item.UserID + " class='selautocomplete' id='" + id + "' data-canentiredownline='" + item.CanEntireDownline + "'>" + link + "</li>";
                        });


                    }


                    $ul.html(html);
                    $ul.listview("refresh");
                    $ul.trigger("updatelayout");

                    $("form.ui-listview-filter a span.ui-btn-inner span.ui-icon").removeClass("ui-icon-loading ui-icon-ajax").addClass("ui-icon-delete");

                    $('.selautocomplete a').off().on('tap', function() {

                        var custNo = $(this).attr('data-id');

                        if (objParent.selector == '#pageeditdistrolist') {
                            //edit distro page:
                            console.log(' -- can see downline: ' + $(this).attr('data-canentiredownline'));
                            $('#CanEntireDownline').val($(this).attr('data-canentiredownline'));

                            if ($(this).attr('data-canentiredownline') == 'true') {
                                //console.log('enabling checkbox');
                                $('#chkBoxAddDownline').checkboxradio("enable").checkboxradio("refresh");
                            } else {
                                //console.log('disabling checkbox');
                                $('#chkBoxAddDownline').attr("checked", false);
                                $('#chkBoxAddDownline').checkboxradio("disable").checkboxradio("refresh");

                            }


                        }
                        console.log(custNo + ' added to on screen list');
                        $input.val($(this).text());
                        $(strRefSource).text($(this).text());
                        $('#custNo').val(custNo);

                        //$(strRefSource).hide();
                    });
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('------ error : ' + errorThrown);
                    return false;
                }
            });

            $.mobile.loading('hide');


        }
    });


}

function topBar(message, parent) {

    //var header = ('.header', parent);
    //<a href='#' data-role='button' data-icon='info' data-iconpos='notext' data-theme='e' data-inline='true' disabled='disabled' id='btnDynamicMessage'>Info</a>
    var sHtml = "<div id='divTopBarMessage'><p class='ui-body-e' style='padding: 1em;'>" + message + "</p></div>";


    //$('#divTopBarMessage').remove();

    if ($('#divTopBarMessage').length) {
        // Do something
    } else {
        $("<div />", { html: sHtml }).hide().prependTo(parent)
            .slideDown('fast').delay(2000).slideUp(function() { $(this).remove(); });

        // $("#btnDynamicMessage").button();
    }


}

//scrollbars:

function showscrollbarsmessages() {
    //fix for a weird space at the bottom:
    //console.log(' -- min ' + $('#messages').css('min-height').replace('px',''));
    //$('#messages').css('min-height', $('#messages').css('min-height').replace('px', '') + 52);
    //var minh = $('#messages').css('min-height').replace('px', '') * 1 + 52;
    ////console.log(' -- minh ' + minh);
    //$('#messages').css('min-height', minh);
    ////console.log(' -- min ' + $('#messages').css('min-height').replace('px', ''));
    ////$('messages').trigger("create");
    //if (typeof iScrollMessages != 'undefined') {
    //    iScrollMessages.refresh();
    //}
    //else {

    //    iScrollMessages = new iScroll('iscrollwrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, snap: false });

    //}

}


//-end scroll bars-//

function isNumber(o) {
    return !isNaN(o - 0) && o !== null && o.replace(/^\s\s*/, '') !== "" && o !== false;
}