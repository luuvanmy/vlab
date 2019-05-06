Vue.component('keyboard', {
    template : `
        <div class="modal fade  modal-keyboard">
            <div class="modal-dialog" role="document">
                <div class="modal-content" >
                    <div class="modal-header">
                        <div class="input-group ">
                            <div class="input-group-btn">
                                <button class="btn" @click.stop.prevent="_decr()"><i class="fa fa-minus"></i></button>
                            </div>
                            <input   class="form-control" v-model="value" @keydown.stop.prevent="_input($event)" ref="money" />
                            <div class="input-group-btn">
                                <button class="btn" @click.stop.prevent="_incr()"><i class="fa fa-plus"></i></button>
                            </div>
                        </div>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col col-xs-4"><button class="btn" @click.stop.prevent="press(7)">7</button></div>
                            <div class="col col-xs-4"><button class="btn" @click.stop.prevent="press(8)">8</button></div>
                            <div class="col col-xs-4"><button class="btn" @click.stop.prevent="press(9)">9</button></div>
                        </div>
                        <div class="row">
                            <div class="col col-xs-4"><button class="btn" @click.stop.prevent="press(4)">4</button></div>
                            <div class="col col-xs-4"><button class="btn" @click.stop.prevent="press(5)">5</button></div>
                            <div class="col col-xs-4"><button class="btn" @click.stop.prevent="press(6)">6</button></div>
                        </div>
                        <div class="row">
                            <div class="col col-xs-4"><button class="btn" @click.stop.prevent="press(1)">1</button></div>
                            <div class="col col-xs-4"><button class="btn" @click.stop.prevent="press(2)">2</button></div>
                            <div class="col col-xs-4"><button class="btn" @click.stop.prevent="press(3)">3</button></div>
                        </div>
                        <div class="row">
                            <div class="col col-xs-4"><button class="btn btn-small" @click.stop.prevent="selected()">Chọn</button></div>
                            <div class="col col-xs-4"><button class="btn " @click.stop.prevent="press(0)">0</button></div>
                            <div class="col col-xs-4"><button class="btn btn-small" @click.stop.prevent="remove()">Xóa</button></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="row">
                            <div class="col col-xs-6">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Đóng (Esc)</button>
                            </div>
                            <div class="col col-xs-6">
                                <button type="submit" class="btn btn-success" @click.stop.prevent="onSave()">Xong (Enter)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            value: '',
            callback: null,
            onClose : null,
            max: 999999999,
            keycodes : {
                96 : 0,
                97 : 1,
                98 : 2,
                99 : 3,
                100 : 4,
                101 : 5,
                102 : 6,
                103 : 7,
                104 : 8,
                105 : 9,
                48 : 0,
                49 : 1,
                50 : 2,
                51 : 3,
                52 : 4,
                53 : 5,
                54 : 6,
                55 : 7,
                56 : 8,
                57 : 9,
            },
        }
    },
    methods: {
        _incr: function () {
            var value = parseInt(this.unFormatMoney(this.value));
            if( value >= this.max){
                value = this.max;
            }else{
                value ++;
            }
            this.value = this.formatMoney(value);
            this.$nextTick(function () {
                $(this.$refs.money).focus().setCursorPosition(this.value.length);
            })
        },
        _decr: function () {
            var value = parseInt(this.unFormatMoney(this.value));
            if (value > 0) {
                value--;
                this.value = this.formatMoney(value);
            }
            this.$nextTick(function () {
                $(this.$refs.money).focus().setCursorPosition(this.value.length);
            })
        },
        _input:  function(event){
            event.preventDefault();
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                this.onSave();
                return;
            }
            if (keyCode == 8 || keyCode == 46) {
                event.preventDefault();
                event.stopPropagation();
                this.remove();
                return;
            }
            if (this.keycodes.hasOwnProperty(keyCode)) {
                var num = this.keycodes[keyCode];
                this.press(num);
            }
        },
        press : function(num){
            var el = this.$refs.money;
            var value = this.value;
            var start = el.selectionStart;
            var end = el.selectionEnd;
            var index = this.getCaret();
            var newIndex = 0;
            var number = String(num);

            if (start == end) {
                var rangeBefore = value.substring(0, index);
                rangeBefore = _.split(rangeBefore, ',').length;
                var newvalue = value.substring(0, index) + number + value.substring(index, value.length);
                newvalue = this.unFormatMoney(newvalue);
                newvalue = this.formatMoney(newvalue);
                var rangeAfter = newvalue.substring(0, index + 1);
                rangeAfter = _.split(rangeAfter, ',').length;
                newIndex = (rangeAfter > rangeBefore) ? index + 2 : index + 1;
            } else {
                var rangeBefore = value.substring(0, end);
                rangeBefore = _.split(rangeBefore, ',').length;
                var newvalue = value.substring(0, start) + number + value.substring(end, value.length);
                newvalue = this.unFormatMoney(newvalue);
                newvalue = this.formatMoney(newvalue);
                var rangeAfter = newvalue.substring(0, start + 1);
                rangeAfter = _.split(rangeAfter, ',').length;
                newIndex = (rangeAfter > rangeBefore) ? start + 2 : start + 1;
            }
            var newValue = this.unFormatMoney(newvalue);
            var isMax = false;
            if( newValue >= this.max){
                newvalue = this.formatMoney(this.max);
                isMax = true;
            }
            this.value = newvalue;
            this.$nextTick(function () {
                if( isMax || newIndex == 0){
                    newIndex = newvalue.length;
                }else{
                    var lastChacracter = newvalue.substring(newIndex - 1, newIndex);
                    if (lastChacracter == ',') {
                        newIndex = newIndex - 1;
                    }
                }
                $(el).focus().setCursorPosition(newIndex);
            })
        },
        remove: function () {
            var index = this.getCaret();
            console.log(index);
            var el = this.$refs.money;
            var value = _.toString(this.value);
            var start = el.selectionStart;
            var end = el.selectionEnd;
            var newIndex = 0;
            if (start == end) {
                if (index >= 0) {
                    var rangeBefore = value.substring(0, index);
                    rangeBefore = _.split(rangeBefore, ',').length;
                    var newvalue = value.substring(0, index - 1) + value.substring(index, value.length);
                    newvalue = unFormatMoney(newvalue);
                    newvalue = formatMoney(newvalue);
                    var rangeAfter = newvalue.substring(0, index + 1);
                    rangeAfter = _.split(rangeAfter, ',').length;
                    newIndex = (rangeAfter < rangeBefore) ? index - 2 : index - 1;
                }
            } else {
                if (start >= 0) {
                    var rangeBefore = value.substring(0, end);
                    rangeBefore = _.split(rangeBefore, ',').length;
                    var newvalue = value.substring(0, start) + value.substring(end, value.length);
                    newvalue = unFormatMoney(newvalue);
                    newvalue = formatMoney(newvalue);
                    var rangeAfter = newvalue.substring(0, start + 1);
                    rangeAfter = _.split(rangeAfter, ',').length;
                    newIndex = (rangeAfter < rangeBefore) ? start - 2 : start - 1;
                }
            }
            var newValue = this.unFormatMoney(newvalue);
            var isMin = false;
            if( newValue >= this.max){
                newvalue = this.formatMoney(this.max);
                isMin = true;
            }
            this.value = newvalue;
            this.$nextTick(function () {
                if( isMin || newIndex == 0){
                    newIndex = newvalue.length;
                }else{
                    var lastChacracter = newvalue.substring(newIndex - 1, newIndex);
                    if (lastChacracter == ',') {
                        newIndex = newIndex - 1;
                    }
                }
                $(el).focus().setCursorPosition(newIndex);
            })
        },
        onKey: function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                this.onSave();
            }
            if (keyCode >= 48 && keyCode <= 57) {
                event.preventDefault();
                var num = this.keycodes[keyCode];
                this.press(num);
            }
        },
        selected: function () {
            this.$refs.money.select();
        },
        show: function (value, callback , max , onClose) {
            this.value = this.formatMoney(value);
            this.callback = callback;
            this.max = max == undefined ? 999999999 : max;
            console.log(onClose);
            this.onClose = typeof onClose == 'function' ? onClose : null; 
            $(this.$el).modal('show');
        },
        onSave: function () {
            if (typeof this.callback == 'function') {
                this.callback(parseInt(this.unFormatMoney(this.value)));
                $(this.$el).modal('hide');
            }
        },
        unFormatMoney : function(value){
            var text = _.toString(value);
            return _.parseInt( text.replace(/,/g, "") );
        },
        formatMoney : function(n, dp){
            var s = '' + (Math.floor(n)),
                d = n % 1,
                i = s.length,
                r = '';
            while ((i -= 3) > 0) {
                r = ',' + s.substr(i, 3) + r;
            }
            return s.substr(0, i + 3) + r + (d ? '.' + Math.round(d * Math.pow(10, dp || 2)) : '');
        },
        onBlur : function(){
            this.position = {
                from : this.$refs.money.selectionStart,
                to : this.$refs.money.selectionEnd,
            }
        },
        getCaret : function () {
            var iCaretPos = 0;
            var oField = this.$refs.money;
            if (document.selection) {
                oField.focus();
                var oSel = document.selection.createRange();
                oSel.moveStart('character', -oField.value.length);
                iCaretPos = oSel.text.length;
            } else if (oField.selectionStart || oField.selectionStart == '0')
                iCaretPos = oField.selectionStart;
            return iCaretPos;
        },
        setCaret : function(index) {
            var elem = this.$refs.money;
            if (elem != null) {
                if (elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.move('character', index);
                    range.select();
                } else {
                    if (elem.selectionStart) {
                        elem.focus();
                        elem.setSelectionRange(index, index);
                    } else
                        elem.focus();
                }
            }
        }
    },
    mounted: function () {
        var vm = this;
        $(this.$el).on('hidden.bs.modal', function () {
            vm.value = '';
            vm.callback = null;
            vm.max = 999999999;
            $(document).unbind('keypress');
            if( typeof vm.onClose == 'function'){
                console.log('close');
                vm.onClose();
            }
            if( $('.modal.in').length ){
                $('body').addClass('modal-open');
            }

        });
        $(this.$el).on('shown.bs.modal', function () {
            vm.selected();
            $(document).bind("keypress",function(event){
                event.preventDefault();
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if( keyCode  == 13){
                    event.preventDefault();
                    vm.onSave();
                }
            });
        });
        for (var index = 0; index <= 9; index++) {
            var key = 48 + index;
            this.keycodes[key] = index;
        }
        this.keycodes[45] = 0;
    }
});