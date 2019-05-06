
var helper = new POS_Helper();
$.fn.scrollToElement = function (elem, speed) {
    var $this = jQuery(this);
    var $this_top = $this.offset().top;
    var $this_bottom = $this_top + $this.outerHeight(true);
    var $elem = jQuery(elem);
    var $elem_top = $elem.offset().top;
    var $elem_bottom = $elem_top + $elem.outerHeight(true);

    if ($elem_top > $this_top && $elem_bottom < $this_bottom) {
        return;
    }
    var scroll_to;
    if ($elem_top < $this_top) {
        scroll_to = {
            scrollTop: $this.scrollTop() - $this_top + $elem_top
        };
    } else {
        scroll_to = {
            scrollTop: $elem_bottom - $this_bottom + $this.scrollTop()
        };
    }
    $this.animate(scroll_to, speed === undefined ? 100 : speed);
    return this;
};

$.fn.setCursorToTextEnd = function() {
    var $initialVal = this.val();
    this.val($initialVal);
};
$.fn.setCursorPosition = function (pos) {
    this.each(function (index, elem) {
        if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
        } else if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    });
    return this;
};

function formatMoney(n, dp) {
    var s = '' + (Math.floor(n)),
        d = n % 1,
        i = s.length,
        r = '';
    while ((i -= 3) > 0) {
        r = ',' + s.substr(i, 3) + r;
    }
    return s.substr(0, i + 3) + r +
        (d ? '.' + Math.round(d * Math.pow(10, dp || 2)) : '');
};

function unFormatMoney(value) {
    value = String(value);
    return value.replace(/,/g, "");
}

function doGetCaretPosition(oField) {
    var iCaretPos = 0;
    if (document.selection) {
        oField.focus();
        var oSel = document.selection.createRange();
        oSel.moveStart('character', -oField.value.length);
        iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0')
        iCaretPos = oField.selectionStart;
    return iCaretPos;
}

function setCaretPosition(elem, caretPos) {
    console.log(caretPos);
    if (elem != null) {
        if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        } else {
            if (elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            } else
                elem.focus();
        }
    }
}


if( typeof jconfirm != 'undefined'){
    jconfirm.defaults = {
        animation: 'zoom',
        closeAnimation: 'zoom',
        animateFromElement : false,
        backgroundDismiss: true,
        draggable: false,
    }
}

function POS_Helper(){
    var methods = this;
    methods.isTouchDevice = function(){
        return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
    }
    methods.dialog = function(message , icon , type, time , position ) {
        var _type  = type == null ? 'info' : type ;
        var _position = position == undefined ? {from: "top",align: "right"} : position;
        var _icon = icon == undefined ? '' : icon;
        var _message = message == undefined ? '' : message;
        $.notify(
            {
                icon: _icon,
                message: _message,
            }, 
            {
                type: _type,
                timer: time,
                delay: 500,
                dismissonclick:true,
                newest_on_top: true,
                placement : _position,
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutRight'
                },
            }
        );
      }
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
    methods.createId = function(){
        var idStrLen = 32;
        var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
        idStr += (new Date()).getTime().toString(36) + "_";
        do {
            idStr += (Math.floor((Math.random() * 35))).toString(36);
        } while (idStr.length < idStrLen);

        return (idStr);
    }
    methods.checkCloseModal = function(){
        if( document.querySelectorAll('.modal.in').length >  0 ){
            $('body').addClass('modal-open');
        }
    }
    methods.isNumber = function(str) {
        var pattern = /^\d+$/;
        return pattern.test(str); // returns a boolean
    }
    
    return this;
}

(function ($) {
    // Behind the scenes method deals with browser
    // idiosyncrasies and such
    $.caretTo = function (el, index) {
        if (el.createTextRange) { 
            var range = el.createTextRange(); 
            range.move("character", index); 
            range.select(); 
        } else if (el.selectionStart != null) { 
            el.focus(); 
            el.setSelectionRange(index, index); 
        }
    };

    // The following methods are queued under fx for more
    // flexibility when combining with $.fn.delay() and
    // jQuery effects.

    // Set caret to a particular index
    $.fn.caretTo = function (index, offset) {
        return this.queue(function (next) {
            if (isNaN(index)) {
                var i = $(this).val().indexOf(index);
                
                if (offset === true) {
                    i += index.length;
                } else if (offset) {
                    i += offset;
                }
                
                $.caretTo(this, i);
            } else {
                $.caretTo(this, index);
            }
            
            next();
        });
    };

    // Set caret to beginning of an element
    $.fn.caretToStart = function () {
        return this.caretTo(0);
    };

    // Set caret to the end of an element
    $.fn.caretToEnd = function () {
        return this.queue(function (next) {
            $.caretTo(this, $(this).val().length);
            next();
        });
    };
}(jQuery));