var load_data_to_modal_checked = false;
var load_data_to_element_checked = false;
$.fn.modal.Constructor.prototype.enforceFocus = function() {
    var $modalElement = this.$element;
    $(document).on('focusin.modal',function(e) {
        if ($modalElement[0] !== e.target
            && !$modalElement.has(e.target).length
            && $(e.target).parentsUntil('*[role="dialog"]').length === 0) {
            $modalElement.focus();
        }
    });
};
function load_data_to_modal(ob, modal) {
    if( !load_data_to_modal_checked ){
        load_data_to_modal_checked = true;
        var url = $(ob).attr('data-url');
        $(modal).html('');
        helper.get(url)
        .done(function(res){
            load_data_to_modal_checked = false;
            if( res.status != 403){
                $(modal).html(res);
                $(modal).modal('show');
                if ($(ob).parents('.select2-container').length) {
                    $(ob).parents('.select2-container').remove();
                }
            }
        })
    }
}
function load_data_to_element(ob, element){
    if( !load_data_to_element_checked ){
        load_data_to_element_checked = true;
        var url = $(ob).attr('data-url');
        $(element).html('');
        helper.get(url)
        .done(function(res){
            load_data_to_element_checked = false;
            if( res.status != 403){
                $(element).html(res);
            }
        })
    }

}
Vue.filter('only-day', function(value) {
    return moment(new Date(value * 1000)).format('DD/MM/YYYY');
});

Vue.filter('fb-time', function(value) {
    return moment(value).format('H:m DD/MM');
});

Vue.filter('sub-string', function(value) {
    if(value.length < 30){
        return value.substring(0, 30);
    }
    return value.substring(0, 30)+' ...';
});

Vue.filter('day-text', function(value) {
    return moment(value * 1000).format('dddd');
});

Vue.filter('day-number', function(value) {
    return moment(value * 1000).format('DD');
});

Vue.filter('hour', function(value) {
    return moment(value * 1000).format('HH:mm');
});

Vue.filter('month', function(value) {
    return moment(value * 1000).format('MM');
});

Vue.filter('fb-remain-time', function(value) {
    return moment(value).fromNow();
});

Vue.filter('time-ago', function(value) {
   return moment(new Date(value * 1000)).fromNow();
});

function load_modal_from_url(modal, url) {
    $(modal).html('');
    $(modal).load(url , function(){
        $(modal).modal('show');
    });
}

Number.prototype.formatMoney = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};


String.prototype.padLeft = function(len, c) {
    var s = this,
        c = c || '0';
    while (s.length < len) s = c + s;
    return s;
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

Array.prototype.move = function(from,to){
  this.splice(to,0,this.splice(from,1)[0]);
  return this;
};

function unFormatMoney(value) {
    value = String(value);
    return value.replace(/,/g, "");
}


// $(document).on('show.bs.modal', '.modal', function () {
//     $(document.body).addClass('modal-open');
// }).on('hidden.bs.modal', '.modal', function () {
//     $(document.body).removeClass('modal-open');
// })

function Helper() {
    var methods = this;
    var init = function() {
        // methods.loader();
        methods.initSelect2();
        methods.initMobileNavbar();
        $('[data-toggle="tooltip"]').tooltip();
        $('.trigger-edit-user-data').on('click', function(event){
            event.preventDefault();
            $('#edit_user').empty();
            $('#edit_user').load($(this).data('url'), function(res){
                $('#modal-edit-current-user').modal('show');
            })
        })
        
    }

    methods.StringToInt = function(value){
        var string  = String(value).replace(/,/g, "");
        return parseInt(string);
    }
    methods.checkCloseModal = function(){
        if( document.querySelectorAll('.modal.in').length >  0 ){
            $('body').addClass('modal-open');
        }
    }
    methods.url = function(param){
        window.replaceHash(param);
    }
    methods.initSelect2 = function() {

    }
    methods.initMobileNavbar = function() {
        var open = false;
        var profileOpen = false;
        var navbar = $('.navbar-custom');
        var trigger = $('.mobile-trigger');
        var body = $('body');
        trigger.on('click', function(event) {
            event.preventDefault();
            if (open) {
                body.removeClass('menu-is-opening');
                navbar.removeClass('active');
                trigger.removeClass('active');
            } else {
                body.addClass('menu-is-opening');
                navbar.addClass('active');
                trigger.addClass('active');
            }
            open = !open;
        });
        $('body').on('click', function(event) {
            if (open) {
                if (!$(event.target).is('.navbar-custom , .navbar-custom * , .mobile-trigger , .mobile-trigger *')) {
                    navbar.removeClass('active');
                    trigger.removeClass('active');
                    body.removeClass('menu-is-opening');
                    open = !open;
                }
            }
        });
        $('.navigation-menu .has-submenu  > a').on('click', function(event) {
            event.preventDefault();
            if( $(window).width() < 992){
                var parent = $(this).parent();
                var submenu = parent.find('.submenu');
                if (parent.hasClass('is-opening')) {
                    submenu.slideUp();
                    parent.removeClass('is-opening');

                } else {
                    $('.navigation-menu .has-submenu').not(parent).removeClass('is-opening');
                    $('.navigation-menu .has-submenu .submenu').not(submenu).slideUp();
                    submenu.slideDown();
                    parent.addClass('is-opening');

                }
            }
        });

    }
    methods.checkItem = function(myList, key, value) {
        if (value == undefined) return false;
        if (myList.filter(function(e) {
                return e[key] == value;
            }).length > 0) {
            return true;
        } else return false;
    }
    methods.getItemIndex = function(myList, key, value) {
            if (value == undefined) return false;
            var index = -1;
            for (var i = 0; i < myList.length; i++) {
                if (myList[i][key] == value) index = i;
            }
            return index;
        }
    methods.showForm = function(formData) { }
    methods.getPercent = function(current, total) {
            var percent = current / total;
            percent = percent.toFixed(2);
            percent = percent * 100;
            return percent;
        }
    methods.toDate = function(dateStr) {
        var parts = dateStr.split("/");
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    methods.toDateTime = function(dateStr) {
        var parts = dateStr.split("/");
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    }
    methods.copyToClipboard = function(param) {

        var temp = $('<input >');
        temp.css({
            'position': 'fixed',
            top: 0,
            left: 0,
        });
        $("body").append(temp);
        temp.val(param).select();
        document.execCommand("copy");
        temp.remove();
    }
    methods.showNotification = function(message, icon , type, time ) {
      icon  = icon == null ? '' : icon;
      type  = type == null ? 'info' : type ;
        $.notify({
            icon: icon,
            message: message
        }, {
            type: type,
            timer: time,
            delay: 500,
            newest_on_top: true,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutRight'
            },
        });
    }
    methods.showComfirmDialogRemove = function(title, content, btn_done, btn_close, callback) {
        $.confirm({
            title: title,
            content: content,
            icon: 'fa fa-question',
            type: "red",
            animation: 'zoom',
            animateFromElement: false,
            theme: 'modern',
            draggable: false,
            buttons: {
                ok: {
                    text: btn_done,
                    btnClass: 'btn-danger',
                    keys: ['enter'],
                    action: function() {
                        callback();
                    }
                },
                cancel: {
                    text: btn_close,
                    btnClass: 'btn-default',
                }
            }
        });
    }
    methods.confirmDialogMulti = function(title, content, color, btn_done, btn_done_class, btn_close, btn_close_class, callback,callback1){
        $.confirm({
            title: title,
            content:content,
            type: "red",
            draggable: false,
            theme: 'material',
            buttons: {
                ok: {
                    text:btn_done,
                    btnClass: (btn_done_class == '') ? 'btn-primary' : btn_done_class,
                    keys: ['enter'],
                    action: function() {
                        callback();
                    }
                },
                cancel: {
                    text: btn_close,
                    keys: ['esc'],
                    btnClass: (btn_close_class == '') ? 'btn-default' : btn_close_class,
                     action: function() {
                       callback1();
                    },
                }
            }
        });
    }
    methods.comfirmDialog = function(title, content, color, btn_done, btn_done_class, btn_close, btn_close_class, callback) {
        $.confirm({
            title: title,
            content: content,
            type: "red",
            draggable: false,
            theme: 'material',
            buttons: {
                ok: {
                    text: btn_done,
                    btnClass: btn_done_class,
                    keys: ['enter'],
                    action: function() {
                        callback();
                    }
                },
                cancel: {
                    text: btn_close,
                    keys: ['esc'],
                    btnClass: btn_close_class,
                }
            }
        });
    }
    methods.openNewWindow = function(url){
        window.open(url,"_blank" , "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=0,width=900,height=1000");
    }
    methods.imageExists = function(url, callback) {
        var img = new Image();
        img.onload = function() {
            callback(true);
        };
        img.onerror = function() {
            callback(false);
        };
        img.src = url;
    }
    methods.showNotify = function(message) {
            $.toast({
                heading: !1,
                text: message,
                position: 'bottom-left',
                loaderBg: 'rgb(255, 152, 0)',
                icon: 'warning',
                hideAfter: 30000,
                stack: 1
            });
        }
    methods.formatDate = function(date, format) {
            var date = new Date(date),
                day = date.getDate(),
                month = date.getMonth() + 1,
                year = date.getFullYear(),
                hours = date.getHours(),
                minutes = date.getMinutes(),
                seconds = date.getSeconds();
            if (!format) {
                format = "mm/dd/yyyy";
            }
            format = format.replace("mm", month.toString().replace(/^(\d)$/, '0$1'));
            if (format.indexOf("yyyy") > -1) {
                format = format.replace("yyyy", year.toString());
            } else if (format.indexOf("yy") > -1) {
                format = format.replace("yy", year.toString().substr(2, 2));
            }
            format = format.replace("dd", day.toString().replace(/^(\d)$/, '0$1'));
            if (format.indexOf("t") > -1) {
                if (hours > 11) {
                    format = format.replace("t", "pm");
                } else {
                    format = format.replace("t", "am");
                }
            }
            if (format.indexOf("HH") > -1) {
                format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
            }
            if (format.indexOf("hh") > -1) {
                if (hours > 12) {
                    hours -= 12;
                }
                if (hours === 0) {
                    hours = 12;
                }
                format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
            }
            if (format.indexOf("mm") > -1) {
                format = format.replace("mm", minutes.toString().replace(/^(\d)$/, '0$1'));
            }
            if (format.indexOf("ss") > -1) {
                format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
            }
            return format;
        }
        // lấy định dạng file upload
    methods.getFileExtension = function(file) {
            return (file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1).toLowerCase());
        }
        // lấy định dạng file theo link
    methods.getLinkExtension = function(url) {
            return (url.slice((Math.max(0, url.lastIndexOf(".")) || Infinity) + 1)).toLowerCase();
        }
        // kiểm tra định dạng file có hợp lệ
    methods.checkFileExtension = function(type, filename_extensions) {
            for (var i = 0; i < filename_extensions.length; i++) {
                if (filename_extensions[i] == type) return true;
            }
            return false;
        }
        // kiem tra du lieu
    methods.isEmail = function(str) {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str); // returns a boolean
    }
    methods.isNumber = function(str) {
        var pattern = /^\d+$/;
        return pattern.test(str); // returns a boolean
    }
    methods.isJSON =  function(text){
        if (typeof text!=="string"){
            return false;
        }
        try{
            JSON.parse(text);
            return true;
        }
        catch (error){
            return false;
        }
    }
    methods.isTouchDevice = function(){
        return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
    }
    methods.isPhone = function(str) {
        var pattern = /^[0-9]*$/;
        return pattern.test(str); // returns a boolean
    }
    methods.isPattern = function(pattern, str) {
        return pattern.test(str);
    }
    methods.isNotEmpty = function(str) {
        var pattern = /\S+/;
        return pattern.test(str);
    }
    methods.isFloat = function(str){
        var pattern = /^[+-]?\d+(\.\d+)?$/;
        return pattern.test(str);
    }
    methods.isUnicode = function(str){
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127) return true;
        }
        return false;
    }
    methods.isSpace = function(str){
        str =  str.trim();
        return str.indexOf(' ') >= 0 ? true : false;
    }
    methods.computeArray = function(arr1, arr2) {
            if (typeof arr1 == 'array' && typeof arr2 == 'array') {
                if (arr1.length == arr2.length) {
                    var isSame = true;
                    for (var i = 0; i < arr1.length; i++) {
                        if (arr1[i] != arr2[i]) {
                            isSame = false;
                        }
                    }
                    return isSame;
                }
                return false;
            }
            return false;
        }
        // khoi tao unique id
    methods.createId = function() {
        var idStrLen = 32;
        var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
        idStr += (new Date()).getTime().toString(36) + "_";
        do {
            idStr += (Math.floor((Math.random() * 35))).toString(36);
        } while (idStr.length < idStrLen);

        return (idStr);
    }

    // get token
    methods._token = function() {
            if ($('meta[name=csrf-token]').length) {
                var _token = $('meta[name=csrf-token]').attr('content');
                return (_token === undefined) ? null : _token;
            }
            return null;
        }
    methods.slug = function  (str) {
        str = str.toLowerCase();
        str = methods.convertCharacters(str);
        return str.toString().trim()
            .replace(/\s+/g, '-')
            .replace(/&/g, '-and-')
            .replace(/[^\w\-]+/g, '') 
            .replace(/\-\-+/g, '-');
    }
        // convert character
    methods.convertCharacters = function(str) {
            var removalMap = {
                'A': /[AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄ]/g,
                'AA': /[Ꜳ]/g,
                'AE': /[ÆǼǢ]/g,
                'AO': /[Ꜵ]/g,
                'AU': /[Ꜷ]/g,
                'AV': /[ꜸꜺ]/g,
                'AY': /[Ꜽ]/g,
                'B': /[BⒷＢḂḄḆɃƂƁ]/g,
                'C': /[CⒸＣĆĈĊČÇḈƇȻꜾ]/g,
                'D': /[DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ]/g,
                'DZ': /[ǱǄ]/g,
                'Dz': /[ǲǅ]/g,
                'E': /[EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ]/g,
                'F': /[FⒻＦḞƑꝻ]/g,
                'G': /[GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ]/g,
                'H': /[HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ]/g,
                'I': /[IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ]/g,
                'J': /[JⒿＪĴɈ]/g,
                'K': /[KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ]/g,
                'L': /[LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ]/g,
                'LJ': /[Ǉ]/g,
                'Lj': /[ǈ]/g,
                'M': /[MⓂＭḾṀṂⱮƜ]/g,
                'N': /[NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ]/g,
                'NJ': /[Ǌ]/g,
                'Nj': /[ǋ]/g,
                'O': /[OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ]/g,
                'OI': /[Ƣ]/g,
                'OO': /[Ꝏ]/g,
                'OU': /[Ȣ]/g,
                'P': /[PⓅＰṔṖƤⱣꝐꝒꝔ]/g,
                'Q': /[QⓆＱꝖꝘɊ]/g,
                'R': /[RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ]/g,
                'S': /[SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ]/g,
                'T': /[TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ]/g,
                'TZ': /[Ꜩ]/g,
                'U': /[UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ]/g,
                'V': /[VⓋＶṼṾƲꝞɅ]/g,
                'VY': /[Ꝡ]/g,
                'W': /[WⓌＷẀẂŴẆẄẈⱲ]/g,
                'X': /[XⓍＸẊẌ]/g,
                'Y': /[YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ]/g,
                'Z': /[ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ]/g,
                'a': /[aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ]/g,
                'aa': /[ꜳ]/g,
                'ae': /[æǽǣ]/g,
                'ao': /[ꜵ]/g,
                'au': /[ꜷ]/g,
                'av': /[ꜹꜻ]/g,
                'ay': /[ꜽ]/g,
                'b': /[bⓑｂḃḅḇƀƃɓ]/g,
                'c': /[cⓒｃćĉċčçḉƈȼꜿↄ]/g,
                'd': /[dⓓｄḋďḍḑḓḏđƌɖɗꝺ]/g,
                'dz': /[ǳǆ]/g,
                'e': /[eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ]/g,
                'f': /[fⓕｆḟƒꝼ]/g,
                'g': /[gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ]/g,
                'h': /[hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ]/g,
                'hv': /[ƕ]/g,
                'i': /[iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı]/g,
                'j': /[jⓙｊĵǰɉ]/g,
                'k': /[kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ]/g,
                'l': /[lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ]/g,
                'lj': /[ǉ]/g,
                'm': /[mⓜｍḿṁṃɱɯ]/g,
                'n': /[nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ]/g,
                'nj': /[ǌ]/g,
                'o': /[oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ]/g,
                'oi': /[ƣ]/g,
                'ou': /[ȣ]/g,
                'oo': /[ꝏ]/g,
                'p': /[pⓟｐṕṗƥᵽꝑꝓꝕ]/g,
                'q': /[qⓠｑɋꝗꝙ]/g,
                'r': /[rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ]/g,
                's': /[sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ]/g,
                't': /[tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ]/g,
                'tz': /[ꜩ]/g,
                'u': /[uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ]/g,
                'v': /[vⓥｖṽṿʋꝟʌ]/g,
                'vy': /[ꝡ]/g,
                'w': /[wⓦｗẁẃŵẇẅẘẉⱳ]/g,
                'x': /[xⓧｘẋẍ]/g,
                'y': /[yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ]/g,
                'z': /[zⓩｚźẑżžẓẕƶȥɀⱬꝣ]/g,
            };

            for (var latin in removalMap) {
                var nonLatin = removalMap[latin];
                str = str.replace(nonLatin, latin);
            }

            return str;
        }
        // http request
    methods.get = function(url, timeout) {
         timeout =  timeout == null ? 15000 :  timeout;
        var formData = new FormData;
        formData.append('_token', helper._token());
        var promise = $.ajax({
                type: 'GET',
                data: formData,
                url: url,
                contentType: false,
                processData: false,
                timeout: timeout,
            })
            .done(function(response, status, xhr) {
                if( response.status == 403){
                    promise.abort();
                }
                // preconfigured logic for success
            })
            .fail(function(xhr, status, err) {
                //predetermined logic for unsuccessful request
            })
            .always(function(res){
                if( res.hasOwnProperty('status') && res['status'] == 403){
                    $.confirm({
                        title : '',
                        content : res['message'],
                        type : 'red',
                        buttons : {
                            oke : {
                                text : 'Đóng',
                                btnClass : 'btn-inverse',
                            }
                        }
                    })
                }
            });
        return promise;
    }
    methods.post = function(url, data, timeout) {
      timeout =  timeout == null ? 30000 :  timeout;
        data.append('_token', methods._token());
        var promise = $.ajax({
                type: 'POST',
                data: data,
                url: url,
                contentType: false,
                processData: false,
                timeout: timeout,
            })
            .done(function(response, status, xhr) {

            })
            .fail(function(xhr, status, err) {
                //predetermined logic for unsuccessful request
            })
            .always(function(res){
                if( res.hasOwnProperty('status') && res['status'] == 403){
                    $.confirm({
                        title : '',
                        content : res['message'],
                        type : 'red',
                        buttons : {
                            oke : {
                                text : 'Đóng',
                                btnClass : 'btn-inverse',
                            }
                        }
                    })
                }

            });
        return promise;
    }
    methods.sendLogs = function(data) {
        if(socket){
            if(data.hasOwnProperty("data_log")){
                var datalog = data.data_log;
                socket.emit("send-log-notification", {
                    message : datalog['data']['message'],
                    ip:ip,
                    hostname: location.hostname,
                    email:user_login,
                    data: data.saleorder,
                    client_db: cdb
                });    
            }else{
                socket.emit("send-log-notification", {
                    message : data['data']['message'],
                    ip:ip,
                    hostname: location.hostname,
                    email:user_login,
                    client_db: cdb
                });
            }
        }
    }
    methods.tableResize = function(element){

    }
    methods.triggerExpandTable = function(e){

    }
    methods.closeModal = function(){
        if( document.querySelectorAll('.modal.in').length >  0 ){
            $('body').addClass('modal-open');
        }
    }
    methods.convertWeight = function(value,unit){
        switch(unit) {
        case "kg":
            return value;
            break;
        case "gram":
            return (value/1000).toFixed(3);
            break;
        case "tấn":
            return value*1000;
            break;
        default:
            return value;
        }
    }
    methods.showVueFormError = function(state , ref , type){
      return;
        var firstErrorField= Object.keys(state.$error)[0];
        var firstErrorName = Object.keys(state.$error[firstErrorField]['$error'])[0];

        ref.$children.forEach(function(item){
            if( item.name == firstErrorField){
                if( item.$slots.hasOwnProperty(firstErrorName) && item.$slots[firstErrorName].length){
                    var slot = item.$slots[firstErrorName][0];
                    return;
                    if(slot.hasOwnProperty('children') && slot['children'].length){
                        var message = slot['children'][0].text;
                        return;
                    }
                }
            }
        })
        return;
    }



    // call back init function
    init();
    return this;
}
var helper = new Helper();
if (typeof notify_status != 'undefined' && notify_status == true) {
    var socketIO = function() {
        var socket = this.socket = io.connect('http://192.168.1.30:3000');
        var user = null;
        var self = this;
        var color = this.color = {
            success: '#4caf50',
            warning: '#ffa91c',
        }
        var userInfo = this.userInfo = JSON.parse(userData);
        if (!sessionStorage.getItem("userInfo")) {
            sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        socket.on('connect', function() {
            setTimeout(function(){
                var user_data = {
                    id: userInfo._id,
                    name: userInfo.name,
                    socket_id: socket.id,
                }
                socket.emit('user connected', user_data);
            }, 2000);
        });
        socket.on('new user connected', function(data) {
            var msg = data + ' vừa đăng nhập !';
            $.toast({
                heading: !1,
                text: msg,
                position: 'bottom-left',
                bgColor: color.success,
                icon: !1,
                hideAfter: 5000,
                stack: 1
            });
        });
        socket.on('user logout', function(data) {
            var msg = data + ' vừa đăng xuất !';
            $.toast({
                heading: !1,
                text: msg,
                position: 'bottom-left',
                bgColor: color.warning,
                icon: !1,
                hideAfter: 5000,
                stack: 1
            });
        });
        socket.on('sendNotification', function(data) {
            data = JSON.parse(data);
            if (data.hasOwnProperty('socket_id')) {
                if (data.socket_id == self.socket_id) {
                    return;
                }
            }
            var msg = (data.hasOwnProperty('message')) ? data.message : '';
            var now = moment(new Date(parseInt(data.created_at) * 1000)).format('h:mm:ss A DD-MM-YYYY ');
            msg += '<div class="text-right mg-top-5">' + now + '</div>';
            $.toast({
                heading: !1,
                text: msg,
                position: 'bottom-left',
                bgColor: color.success,
                icon: !1,
                hideAfter: false,
                stack: 1
            });
            if (typeof IndexRoute != undefined) {
                var controller = data.hasOwnProperty('controller') ? data.controller : null;
                if (controller != null) {
                    switch (controller) {
                        case 'SaleOrderController':
                            {
                                if (typeof listOrder != 'undefined') {
                                    if (listOrder.hasOwnProperty('vm')) {
                                        listOrder.vm.load(1);
                                    }
                                }
                                break;
                            }

                        case 'WarehouseImportController':
                            {
                                if (typeof listWarehouse != 'undefined') {
                                    if (listWarehouse.hasOwnProperty('vm')) {
                                        listWarehouse.vm.load(1);
                                    }
                                }
                                break;
                            }
                        case 'WarehouseExportController':
                            {
                                if (typeof listWarehouse != 'undefined') {
                                    if (listWarehouse.hasOwnProperty('vm')) {
                                        listWarehouse.vm.load(1);
                                    }
                                }
                                break;
                            }


                        default:
                            break;

                    }
                }
            }

            return;
        });

        return this;
    }
    var appSocket = new socketIO();
}

$(document).on('click','.toggle-trigger',function(e) {
  //handler code here
    var tr = $(e.target).closest('tr');
    if( tr.attr('expand')   ==  'true'){
        tr.attr('expand' , false);
    }else{
        tr.attr('expand' , true);
    }
});

function debounce(func, wait) {
  var timeout;

  return function() {
    var context = this,
        args = arguments;

    var executeFunction = function() {
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(executeFunction, wait);
  };
};


// fixed menu when srcoll
function scrollOptionSticky(){
  $(window).scroll(function(){
    var sticky = $('.option-sticky'),
    scroll = $(window).scrollTop();
    if (scroll >= 140){
      sticky.addClass('fixed');
    }
    else{
      sticky.removeClass('fixed');
    }

    if ($(this).scrollTop() > 100) {
      $('.scrollup').fadeIn();
    } else {
      $('.scrollup').fadeOut();
    }
  });
}
scrollOptionSticky();
jQuery.fn.scrollTo = function(elem, speed) {
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top
    }, speed == undefined ? 1000 : speed);
    return this;
}
