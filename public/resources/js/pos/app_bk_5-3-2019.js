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
Vue.component('tab-order', {
    template: `
        <div class="table-order-container-full">
            <div class="box-list-order" v-if="loader">
                <div class="box-loading" >
                    <svg class="circular" viewBox="25 25 50 50">
                        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                    </svg>
                </div>
            </div>
            <transition name="fade">
                <div class="box-list-order" v-if="!loader">
                    <div class="box-list-order-header">
                        <div class="inline-block inline-title">
                            <p>Tìm thấy <strong>{{pagination.total_records}}</strong> đơn hàng theo yêu cầu .</p>
                        </div>
                        <div class="inline-block inline-search">
                            <div class="form-search">
                                <input type="text" v-model.trim="pagination.keyword" placeholder="Nhập từ khóa cần tìm ..." class="form-control" />
                            </div>
                        </div>
                        <div class="inline-block inline-daterange">
                            <daterange-picker v-model="pagination.range"></daterange-picker>
                        </div>
                        <div class="inline-block inline-status">
                            <div class="btn-group" role="group" aria-label="...">
                                <button @click.stop.prevent="pagination.status = 'publish' " :class="{'btn-primary' : pagination.status =='publish'}" class="btn btn-default">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button @click.stop.prevent="pagination.status = 'disable' " :class="{'btn-primary' : pagination.status =='disable'}" class="btn btn-default">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        
                        
                    </div>
                    <div class="box-list-order-body ">
                        <div class="table table-orders">
                            <div class="table-head">
                                <div class="row">
                                    <div class="col index">#</div>
                                    <div class="col center">
                                        <div class="col code">Mã hóa đơn</div>
                                        <div class="col created">Ngày tạo</div>
                                        <div class="col source">Khu vực/ bàn</div>
                                        <div class="col customer">Khách hàng</div>
                                        <div class="col user">Nhân viên</div>
                                        <div class="col total">Tổng tiền</div>
                                    </div>
                                    <div class="col actions">Tác vụ</div>
                                </div>
                            </div>
                            <div class="table-body" >
                                
                                <template v-if="pagination.loading">
                                    <div class="box-loading" style="height:300px">
                                        <svg class="circular" viewBox="25 25 50 50">
                                            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                                        </svg>
                                    </div>
                                </template>
                                <template v-else>
                                    <template v-if="pagination.data.length">
                                        <div class="row" v-for="(item , index) in pagination.data">
                                            <div class="col index">{{(pagination.limit * (pagination.page - 1)) + index + 1}}</div>
                                            <div class="col center">
                                                <div class="col code">{{item.code}}</div>
                                                <div class="col created">{{item.created_at | full-time}}</div>
                                                <div class="col source">
                                                    <template v-if="item.source == null">
                                                        ---
                                                    </template>
                                                    <template v-else>
                                                        <span v-if="_.has(item , 'source.group.name')">{{item.source.group.name}}</span> / <span v-if="_.has(item , 'source.name')">{{item.source.name}}</span> 
                                                    </template>
                                                </div>
                                                <div class="col customer">
                                                    <template v-if="_.has(item , 'customer.name')">{{item.customer.name}}</template>
                                                    <template v-else> --- </template>
                                                </div>
                                                <div class="col user">
                                                    <template v-if="_.has(item , 'user.name')">{{item.user.name}}</template>
                                                    <template v-else> --- </template>
                                                </div>
                                                <div class="col total">{{item.total_must_payment | money}}</div>
                                            </div>
                                            <div class="col actions">
                                                <a  target="_blank" :href="'/admin/sales/saleorder/getEditOrder?_id='+ item._id">
                                                    <i class="material-icons text-primary" >info</i>
                                                </a>
                                                <a  @click="_remove(item)" v-if="pagination.status == 'publish'">
                                                    <i class="material-icons text-danger" >delete</i>
                                                </a>
                                                <a  @click="_restore(item)" v-else>
                                                    <i class="material-icons text-success" >restore</i>
                                                </a>
                                                <a  @click="_print(item)" >
                                                    <i class="material-icons text-warning" >print</i>
                                                </a>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <h3 class="text-center pd-30 text-danger no-mg">Không tìm thấy dữ liệu</h3>
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="box-list-order-footer">
                        <div class="row">
                            <div class="col-xs-6">
                                <div class="inline-block inline-limit">
                                    <select2 :options="limits" v-model="pagination.limit"></select2>
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <div class="text-right">
                                    <pagination :total="pagination.total" :current="pagination.page" :change="_changePage"></pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            
        </div>
    `,
    props: {
        options: {
            required: true,
        },
    },
    data: function () {
        return {
            loader: true,
            limits :[
                { id : 10 , text : 10},
                { id : 20 , text : 20},
                { id : 30 , text : 30},
                { id : 50 , text : 50},
                { id : 100 , text : 100},
            ],
            pagination: {
                limit: 10,
                page: 1,
                type: 'all',
                data: [],
                total: 0,
                total_records: 0,
                loading: false,
                status: 'publish',
                range : {
                    startDate : parseInt(moment().startOf('day').valueOf() / 1000),
                    endDate : parseInt(moment().endOf('day').valueOf() / 1000),
                },
                keyword: '',
                isAdmin: this.options.userType == 'manager' ? true : false,
            },
            timeout : null,
        }
    },
    methods: {
        _load: function () {
            if (this.pagination.loading) return;
            this.pagination.loading = true;
            var data = {
                type: this.pagination.type,
                limit: this.pagination.limit,
                page: this.pagination.page,
                isAdmin: this.pagination.isAdmin,
                keyword: this.pagination.keyword,
                status: this.pagination.status,
            }
            if( this.pagination.range.hasOwnProperty('startDate') && this.pagination.range.hasOwnProperty('endDate')){
                if(_.isDate(new Date(this.pagination.range.startDate * 1000)) && _.isDate(new Date(this.pagination.range.endDate * 1000))){
                    data['startDate'] = this.pagination.range.startDate;
                    data['endDate'] = this.pagination.range.endDate;
                }
            }
            $.post("/admin/sales/pos/postLoadSaleOrder", data , (res) => {
                if (res.error == false) {
                    this.pagination.data = res.sale_orders;
                    if (this.pagination.limit != res.limit) {
                        this.pagination.limit = res.limit;
                    }
                    this.pagination.page = res.page;
                    this.pagination.total = res.total;
                    this.pagination.total_records = res.total_records;
                }
            }).fail(function () {}).always(() => {
                this.pagination.loading = false;
                if (this.loader) {
                    setTimeout(() => {
                        this.loader = false;
                    }, 1000);
                }
            });
        },
        _changePage: function (page) {
            this.pagination.page = page;
            this._load();
        },
        _print: function (item) {
            $.post("/admin/sales/pos/printOrder", {
                _id: item._id,
                name: _.has(item, 'source.name') ? item.source.name : '',
                note: item.note,
                mode: 'create',
            }, (res) => {
                var frm = document.getElementById('iframe');
                frm.contentDocument.open();
                frm.contentDocument.writeln(res);
                frm.contentDocument.close();
                setTimeout(function () {
                    frm.contentWindow.print();
                    frm.contentWindow.close();
                }, 500);
            }).fail(function () {}).always(function () {
                // vm.loader = false;
            });
        },
        _info: function (item) {
            window.location.href = "/admin/sales/saleorder/getEditOrder?_id=" + item._id;

        },
        _newtab: function (item) {
            console.log(item);
        },
        _restore: function(item){
            $.confirm({
                title : 'Thông báo ',
                content : 'Bạn có muốn khôi phục hóa đơn này ?',
                buttons :{
                    oke : {
                        text : 'Đồng ý',
                        btnClass : 'btn-success',
                        action : ()=>{
                            $.post("/admin/sales/saleorder/postPublishListOrder", {
                                data : [item._id],
                            }, (res) => {
                                if( res.error ==  false){
                                    this._load();
                                    helper.dialog(res.message , 'check' , 'success', 1000);
                                }else{
                                    helper.dialog(res.message , 'warning' , 'warning', 1000);
                                }
                            }).fail(function () {}).always(function () {
                                
                            });
                        }
                    },
                    close : {
                        text : 'Đóng',
                        btnClass : 'btn-default'
                    }
                }
            })
        },
        _remove: function (item) {
            $.confirm({
                title : 'Thông báo ',
                content : 'Bạn có muốn xóa hóa đơn này ?',
                buttons :{
                    oke : {
                        text : 'Đồng ý',
                        btnClass : 'btn-success',
                        action : ()=>{
                            $.post("/admin/sales/saleorder/postTrashListOrder", {
                                data : [item._id],
                            }, (res) => {
                                if( res.error ==  false){
                                    this._load();
                                    helper.dialog(res.message , 'check' , 'success', 1000);
                                }else{
                                    helper.dialog(res.message , 'warning' , 'warning', 1000);
                                }
                            }).fail(function () {}).always(function () {
                                
                            });
                        }
                    },
                    close : {
                        text : 'Đóng',
                        btnClass : 'btn-default'
                    }
                }
            })
        }

    },
    computed: {

    },
    watch :{
        'pagination.limit' : function(value){
            if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
        },
        'pagination.status' : function(value){
            if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
        },
        'pagination.range' : {
            handler : function(){
                if( this.pagination.page != 1){
                    this.pagination.page = 1;
                }
                this._load();
            },
            deep : true,
        },
        'pagination.keyword' : function() {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(()=>{
                if( this.pagination.page != 1){
                    this.pagination.page = 1;
                }
                this._load();
            }, 1000);
        }
    },
    mounted: function () {
        this._load();
    }
})
Vue.component('ComponentPayment',{
    template : `
            <div class="payment-wrapper">
                <div class="payment-container" :class="{ 'is-active' : loader }">
                    <div class="payment-content">   
                         <button @click="_close()" class="close" data-dismiss="modal" aria-label="Close"><i class="fal fa-times"></i></button>
                        <div class="payment-left" >
                            <div class="box">
                                <div class="box-header">
                                    <strong>{{data.name}}</strong>
                                </div>
                                <div class="box-body">
                                    <div class="table table-product-on-payment">
                                        <div class="table-head">
                                            <div class="row">
                                                <div class="col index">#</div>
                                                <div class="col name">Sản phẩm</div>
                                                <div class="col quantity">SL</div>
                                                <div class="col price">Đơn giá</div>
                                                <div class="col total">Thành tiền</div>
                                            </div>
                                        </div>
                                        <div class="table-body" >
                                           
                                                <div class="row" v-for="( item , index) in data.products">
                                                    <div class="col index">{{index + 1}}</div>
                                                    <div class="col name">{{item.product_name}}</div>
                                                    <div class="col quantity">{{item.request_quantity | money}}</div>
                                                    <div class="col price">{{item.price_sale | money}}</div>
                                                    <div class="col total">{{item.request_quantity * item.price_sale | money}}</div>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-footer">
                                    <div class="item">
                                        <div class="item-title">Tổng cộng</div>
                                        <div class="item-value">{{sum | money}}</div>
                                    </div>
                                    <div class="item" v-if="data.deposit_cost > 0">
                                        <div class="item-title">Khách thanh toán trước</div>
                                        <div class="item-value">{{data.deposit_cost | money}}</div>
                                    </div>
                                    <div class="item">
                                        <div class="item-title">Giảm giá</div>
                                        <div class="item-value">{{data.discount_value | money}}</div>
                                    </div>
                                    <div class="item">
                                        <div class="item-title">Phí giao hàng </div>
                                        <div class="item-value">{{shippingFee | money}}</div>
                                    </div>
                                    <div class="item">
                                        <div class="item-title">Thành tiền</div>
                                        <div class="item-value">{{sum + shippingFee - data.discount_value - data.deposit_cost| money}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="payment-right">
                            <div class="box">
                                <div class="box-header">
                                    <strong v-once>
                                        <template v-if=" _.has(data , 'customer.name') ">
                                            Khách hàng : {{data.customer.name}} - {{data.customer.phone}}
                                        </template>
                                    </strong>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <div class="form-group">
                                                <label>
                                                    <input type="checkbox" v-model="delivery">&nbsp;Giao hàng tận nơi</label>
                                            </div>
                                        </div>
                                        <template v-if="delivery">
                                            <vue-form :state="formstate" @submit.stop.prevent="onSubmit()">
                                                <div class="col-xs-12">
                                                    <validate class="form-group">
                                                        <input name="name" required v-model="customer.name" type="text" class="form-control" placeholder="Tên khách hàng ...">
                                                        <field-messages show="$submitted" name="name">
                                                            <p slot="required" class="form-error">Chưa nhập tên khách hàng</p>
                                                        </field-messages>
                                                    </validate>
                                                </div>
                                                <div class="col-xs-12">
                                                    <validate class="form-group">
                                                        <input name="phone" required v-model="customer.phone" type="text" class="form-control" placeholder="Số điện thoại ...">
                                                        <field-messages show="$submitted" name="phone">
                                                            <p slot="required" class="form-error">Chưa nhập tên khách hàng</p>
                                                        </field-messages>
                                                    </validate>
                                                </div>
                                                <div class="col-xs-6">
                                                    <validate class="form-group">
                                                        <select2 name="province_id" required class="form-control" :label="['_id' , 'name']" :options="$root.provinces" v-model="customer.province_id" placeholder="Chọn Tỉnh/TP" :search="true"></select2>
                                                        <field-messages show="$submitted" name="province_id">
                                                            <p slot="required" class="form-error">Chưa nhập tên khách hàng</p>
                                                        </field-messages>
                                                    </validate>
                                                </div>
                                                <div class="col-xs-6">
                                                    <validate class="form-group">
                                                        <select2 name="district_id" required class="form-control" :options="districts" v-model="customer.district_id" placeholder="Chọn Quận/Huyện" :search="true"></select2>
                                                        <field-messages show="$submitted" name="district_id">
                                                            <p slot="required" class="form-error">Chưa nhập tên khách hàng</p>
                                                        </field-messages>
                                                    </validate>
                                                </div>
                                                <div class="col-xs-12">
                                                    <validate class="form-group">
                                                        <input name="address" required type="text" class="form-control" placeholder="Địa chỉ người nhận ..." v-model="customer.address">
                                                        <field-messages show="$submitted" name="address">
                                                            <p slot="required" class="form-error">Chưa nhập tên khách hàng</p>
                                                        </field-messages>
                                                    </validate>
                                                </div>
                                            </vue-form>
                                        </template>
                                    </div>
                                    <div class="panel">
                                        <div class="panel-body">
                                            <div class="item">
                                                <div class="item-title">
                                                    Tiền khách thanh toán :
                                                </div>
                                                <div class="item-value">
                                                    <strong>{{ sum + shippingFee - data.discount_value - data.deposit_cost | money}}</strong>
                                                </div>
                                            </div>
                                            <div class="item">
                                                <div class="item-title">
                                                    Tiền khách đưa :
                                                </div>
                                                <div class="item-value">
                                                    <div class="form-control" @click.stop.prevent="showAmountKeyboard()">{{amount | money}}</div>
                                                </div>
                                            </div>
                                            <div class="item">
                                                <div class="item-title">
                                                    Tiền thừa trả khách :
                                                </div>
                                                <div class="item-value">
                                                    <strong v-if="amount >= (sum + shippingFee - data.discount_value - data.deposit_cost)">{{Math.abs( amount - (sum + shippingFee - data.discount_value - data.deposit_cost) ) | money}}</strong>
                                                    <strong v-else>Khách đưa chưa đủ</strong>
                                                </div>
                                            </div>

                                            <ul class="list-items">
                                                <li v-for="item in listSuggestAmount">
                                                    <button @click.stop.prevent="onChooseAmount(item)" class="btn btn-default">{{item | money}}</button>
                                                </li>
                                                <li>
                                                    <button @click.stop.prevent="showAmountKeyboard()" class="btn btn-default">Số khác</button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-footer">
                                    <div class="btn-groups">
                                        <button class="btn btn-warning btn-payment" style="float: left;width:50%;font-size:16px;" @click.stop.prevent="printItem()">
                                            In tạm (F11)
                                        </button>
                                        <button class="btn btn-success btn-payment" style="float: left;width:50%;font-size:16px;" @click.stop.prevent="send()">
                                            Xác nhận (Enter)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
    `,
    props : {
        data : {},
        options : {},
    },
    data : function(){
        return {
            formstate  : {},
            delivery: false,
            amount : 0,
            loading : false,
            sum : 0,
            customer : {
                _id: '',
                name: '',
                phone: '',
                province_id: '',
                district_id: '',
                address : '',
            },
            loader : false,
        }
    },
    methods:{
        SuggestAmount : function(number){
            var coins = [500, 1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5, 2e5, 5e5];
            var preCalculate = [];
            var findMax = function(e, t) {
                for (var n = t[0], i = 1; i < t.length; i++) t[i] > n && (n = t[i]);
                    return n
            }
            var greedy = function(e, t) {
                for (var n = e, i = []; n > 0;) {
                    var r = findMax(n, t);
                    n -= r, i.push(r)
                }
                return i.reduce(function(e, t) {
                    return e + t
                }, 0)
            }
            var dfs = function(e, t, n, i) {
                if (n > i) preCalculate.push(e);
                else
                    for (var r = t; r < coins.length; r++) - 1 === e.indexOf(coins[r]) && dfs(e.concat([coins[r]]), r, n + 1, i)
                }
            var findOptimizePayingAmount = function(e) {
                var t = [],
                n = 0;
                if (e >= 1e7 && (n = Math.floor(e / 1e7), e %= 1e7), !preCalculate || 0 === preCalculate.length)
                    for (var i = 1; i <= 10; i++) dfs([coins[0]], 0, 1, i);
                        for (i = 0; i < preCalculate.length; i++) {
                            var r = greedy(e, preCalculate[i]);
                            n > 0 && (r = 1e7 * n + r), -1 === t.indexOf(r) && t.push(r)
                        }
                        return t.sort(function(e, t) {
                            return e > t ? 1 : e < t ? -1 : 0
                        })
                    }
            return findOptimizePayingAmount(number);
        },
        onChooseAmount : function(number){
            this.amount = number;
        },
        showAmountKeyboard: function (index) {
            var vm = this;
            var current = parseInt(vm.amount);
            vm.$root.$refs.keyboard.show(current, function (res) {
                if (res != current) {
                    vm.amount = res;
                }
            })
        },
        onSubmit: function(){

        },
        send : function(){
            var vm = this;
            if( vm.loading ) return;
            var timeout = 0;
            if( vm.delivery ){
                if( vm.formstate.$submitted == false){
                    vm.formstate.$submitted = true;
                    timeout = 300;
                }
            }
            setTimeout( function() {
                if( vm.delivery ){
                    if( !vm.formstate.$valid){
                        return;
                    }
                }
                if( vm.amount  < (vm.data.total + vm.shippingFee) ){
                    helper.dialog('Khách chưa đưa đủ tiền thanh toán !' , 'warning' ,'warning' ,3000);
                    return;
                }
                vm.sendData();
                return;
                
            }, timeout);
        },
        sendData : function(){
            this.loading = true;
            var object = {
                source_id : this.data._id,
                delivery : this.delivery,
                discount_value : this.data.discount_value,
                customer : this.customer,
                delivery_fee : this.shippingFee,
            }
            $.post("/admin/sale/pos/postPaymentSaleSource", object ,  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    var object = {
                        source : res.source,
                        payment : res.source._id,
                    }
                    if( res.hasOwnProperty('unrelation') ){
                        object['unrelation'] = res.unrelation;
                    }
                    
                    this.$root.updateSource(object);
                    this.options.tab = 'table';
                    this.options.activeTable = '';
                    this.loader = false;
                    
                    helper.dialog(res.message, 'check' , 'success', 2000);
                    if( this.options.allow_print){
                        this._print({ id : res.so_id , name : res.source.name , note : res.source.note});
                    }
                    
                }else{
                    helper.dialog(res.message, 'error', 'danger', 4000);
                }
            }).fail(function () {}).always(function () {
                this.loading = false;
            });
        },
        _print : function(res){
            $.post("/admin/sales/pos/printOrder?id="+this.data._id, {
                _id: res.id,
                name: res.name,
                note : res.note,
                mode: 'create',
            },  (res)=>{
                var frm =   document.getElementById('iframe');
                frm.contentDocument.open();
                frm.contentDocument.writeln(res);
                frm.contentDocument.close();
                setTimeout(function () {
                   frm.contentWindow.print();
                   frm.contentWindow.close();
                }, 500);
            }).fail(function () {}).always(function () {
                // vm.loader = false;
            });
        },
        printItem : function(){
            $.post("/admin/sales/pos/printItem?id="+this.data._id, {
                id: this.data._id
            },  (res)=>{
                var frm =   document.getElementById('iframe');
                frm.contentDocument.open();
                frm.contentDocument.writeln(res);
                frm.contentDocument.close();
                setTimeout(function () {
                   frm.contentWindow.print();
                   frm.contentWindow.close();
                }, 500);
            }).fail(function () {}).always(function () {
                // vm.loader = false;
            });
        },
        _close: function(){
            this.loader = false;
        }
    },
    computed : {
        listSuggestAmount : function(){
            if( this.data != null ){
                return this.SuggestAmount(this.sum + this.shippingFee - this.data.discount_value - this.data.deposit_cost);
            }
            return [];
        },
        districts : function(){
            var vm = this;
            if( this.customer.province_id != ''){
                var province = _.find(this.$root.provinces ,{_id : this.customer.province_id});
                if( province != undefined){
                    return province.districts;
                }
            }
            return [];
        },
        shippingFee : function(){
            if( this.delivery){
                if( this.customer.district_id != '' && this.customer.province_id != ''){
                    var province = _.find(this.$root.provinces ,{_id : this.customer.province_id});
                    if( province != undefined){
                        var district = _.find(province.districts ,{_id : this.customer.district_id});
                        if( district != undefined){
                            return district.fee;
                        }
                    }
                }
            }
            return 0;
        }
    },
    created : function(){
        if( !this.data.hasOwnProperty('deposit_cost')){
            this.$set(this.data, 'deposit_cost' , 0);
        }
        var sum = 0;
        this.data.products.forEach((item)=>{
            sum += item.price_sale * item.request_quantity;
        });

        this.sum = sum;
        this.amount = this.sum + this.shippingFee - this.data.discount_value - this.data.deposit_cost;
        if ( _.has(this.data ,'customer._id') ) {
            this.customer = {
                _id: this.data.customer._id,
                name: this.data.customer.name,
                phone: this.data.customer.phone,
                province_id: this.data.customer.hasOwnProperty('province_id') ? this.data.customer.province_id : '',
                district_id: this.data.customer.hasOwnProperty('district_id') ? this.data.customer.district_id : '',
                address : this.data.customer.hasOwnProperty('address') ? this.data.customer.address : '',
            }
        }
    },
    watch :{
        loader : function(value){
            if( value == false){
                setTimeout(()=>{
                    this.$emit('update:data' , null );
                }, 300);
            }
        }
    },
    mounted : function(){
        var vm = this;
        
        $(this.$el).on('click', function(event){
            if( !$(event.target).is('.payment-content , .payment-content *') ){
                vm._close();
            }
        })
        this.$watch('customer.province_id' , function(value){
            this.customer.district_id = '';
        });
        setTimeout(function() {
            vm.loader = true;
        }, 100);
    },
})
Vue.component('setting', {
    template : `
        <div>
            <div ref="modalSetting" class="modal fade modal-setting" role="dialog" >
                <div class="modal-dialog " role="document" >
                    <div class="modal-content" >
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body">
                            <ul class="nav nav-tabs" role="tablist">
                                <li :class="{ 'active' : tab == 'config'}">
                                    <a @click.stop.prevent="_changeTab('config')" >Cấu hình chung</a>
                                </li>
                                <li :class="{ 'active' : tab == 'product'}">
                                    <a @click.stop.prevent="_changeTab('product')" >Sản phẩm</a>
                                </li>
                                <li :class="{ 'active' : tab == 'group'}">
                                    <a @click.stop.prevent="_changeTab('group')" >Khu vực</a>
                                </li>
                                <li :class="{ 'active' : tab == 'source'}">
                                    <a @click.stop.prevent="_changeTab('source')" >Bàn</a>
                                </li>
                                <li :class="{ 'active' : tab == 'user'}">
                                    <a @click.stop.prevent="_changeTab('user')" >Nhân viên</a>
                                </li>
                            </ul>
                            <div class="tab-content">
                                <template v-if="loading">
                                    <div class="box-loading">
                                        <div class="box-loading-icon">
                                            <svg class="circular" viewBox="25 25 50 50">
                                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                                            </svg>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="tab-pane active fade in" v-if="tab == 'config'">
                                        <p>
                                            <label><input type="checkbox" v-model="config.allow_print" /> In hóa đơn khi thanh toán</label>
                                        </p>
                                        <p>
                                            <label><input type="checkbox" v-model="config.notify_chief" /> Áp dụng báo bếp</label>
                                        </p>
                                        <p>
                                            <label><input type="checkbox" v-model="config.allow_book" /> Áp dụng đặt bàn</label>
                                        </p>
                                        <p>
                                            <label><input type="checkbox" v-model="config.open_menu" /> Mở thực đơn khi chọn bàn</label>
                                        </p>
                                        <p>
                                            <label><input type="checkbox" v-model="config.auto_hide_product" /> Tự động ẩn sản phẩm khi hết</label>
                                        </p>
                                        <p>
                                            <label><input type="checkbox" v-model="config.allow_import_quantity" /> Cho phép nhập số lượng sản phẩm</label>
                                        </p>
                                        <p>
                                            <label>Thời gian thông báo đặt bàn trước (phút) : </label>
                                            <span class="inline-block" style="width:100px">
                                                <money class="form-control" v-model="config.time_book_notify"></money>
                                            </span>
                                        </p>
                                        <div class="text-right pd-15">
                                            <a @click.stop.prevent="_onSaveConfig()" class="btn btn-success">
                                                <i class="material-icons">check</i> &nbsp; Lưu cập nhật
                                            </a>
                                        </div>
                                    </div>
                                    <div class="tab-pane active fade in" v-if="tab == 'product'">
                                        
                                        <div class="row mg-bottom-10">
                                            <div class="col-xs-3">
                                                <label>Từ khóa</label>
                                                <div class="form-search">
                                                    <input v-model.trim="filter.keyword" type="text" class="form-control"  placeholder="Nhập từ khóa cần tìm "/>
                                                </div>
                                            </div>
                                            <div class="col-xs-3">
                                                <label>Ngành hàng</label>
                                                <select2 :options="categories" v-model="filter.category_id"></select2>
                                            </div>
                                            <div class="col-xs-3">
                                                <label>Chế biến</label>
                                                <select2 :options="processings" v-model="filter.processing"></select2>
                                            </div>
                                            <div class="col-xs-3 mg-bottom-10 text-right">
                                                <a href="#" class="btn btn-success btn-add-product" @click.stop.prevent="_showModalProducts($event)">
                                                    <i class="far fa-plus"></i> &nbsp; Thêm sản phẩm
                                                </a>
                                            </div>
                                        </div>
                                        <div class="box-table" >
                                            <div class="box-header">
                                                <div class="item">
                                                    <div class="item-checkbox">
                                                        <input type="checkbox" v-model="selectAll"  />
                                                    </div>
                                                    <div class="item-index">#</div>
                                                    <div class="item-name">Sản phẩm</div>
                                                    <div class="item-category">Ngành hàng</div>
                                                    <div class="item-chief">Chế biến</div>
                                                    <div class="item-action"></div>
                                                </div>
                                            </div>
                                            <div class="box-body box-body-list-products" >
                                               
                                                    <template v-if="listData.length">
                                                        <div class="item" v-for="(item, index) in listData">
                                                            <div class="item-checkbox">
                                                                <input type="checkbox" v-model="checkBox" :value="item._id" />
                                                            </div>
                                                            <div class="item-index">{{(products.limit * (products.page - 1)) + index + 1}}</div>
                                                            <div class="item-name">{{ _.has(item , 'VariantName')? item.VariantName : ''}}</div>
                                                            <div class="item-category">
                                                                {{ _.has(item , 'Category.name') ? item.Category.name : '' }}
                                                            </div>
                                                            <div class="item-chief">
                                                                <span @click.stop.prevent="_onClick(item)" class="switch" :class="{ 'is-active' : item.processing}"></span>
                                                            </div>
                                                            <div class="item-action">
                                                                <a href="#" @click.stop.prevent="_onRemove(item._id)" class="danger"><i class="material-icons">delete</i></a>
                                                            </div>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="pd-top-30 pd-bottom-30 text-center">
                                                            <h3>Không tìm thấy sản phẩm</h3>
                                                        </div>
                                                    </template>
                                                
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="row ">
                                            <div class="col-xs-12">
                                                <div class="dropup">
                                                    <button :disabled="checkBox.length == 0" class="btn btn-default dropdown-toggle" type="button"  data-toggle="dropdown">
                                                        <i class="material-icons">reply_all</i>&nbsp;&nbsp;Chọn thao tác thực hiện trên 
                                                    </button>
                                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                                        <li><a @click="_changeState(true)">Chế biến</a></li>
                                                        <li><a @click="_changeState(false)">Không chế biến</a></li>
                                                        <li><a @click="_removeAll()">Xóa tất cả sản phẩm khỏi pos</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div class="tab-pane active fade in" v-if="tab == 'group'">
                                        <div class="text-right mg-bottom-20">
                                            <a href="#" class="btn btn-success" @click.stop.prevent="_showModalCreateGroup()">
                                                <i class="far fa-plus"></i> &nbsp; Tạo mới khu vực
                                            </a>
                                        </div>
                                        <div class="box-table" >
                                            <div class="box-header">
                                                <div class="item">
                                                    <div class="item-checkbox"><input type="checkbox" v-model="selectAllGroup" /></div>
                                                    <div class="item-index">#</div>
                                                    <div class="item-group-name">Tên khu vực</div>
                                                    <div class="item-group-warehouse">Chi nhánh</div>
                                                    <div class="item-group-state">Trạng thái</div>
                                                    <div class="item-action"></div>
                                                </div>
                                            </div>
                                            <div class="box-body box-body-list-group" >
                                               
                                                    <template v-if="groups.length">
                                                        <div class="item" v-for="(item, index) in groups">
                                                            <div class="item-checkbox">
                                                                <input type="checkbox" v-model="checkBoxGroup" :value="item._id" />
                                                            </div>
                                                            <div class="item-index">{{index + 1}}</div>
                                                            <div class="item-group-name">{{item.name}}</div>
                                                            <div class="item-group-warehouse">{{item.warehouse_name}}</div>
                                                            <div class="item-group-state">
                                                                <span class="status success" v-if="item.status == 'publish'">Đang hoạt động</span>
                                                                <span class="status danger" v-else-if="item.status == 'trash'">Ngừng hoạt động</span>
                                                            </div>
                                                            <div class="item-group-action">
                                                                <a href="#" @click.stop.prevent="_onEditGroup(index)" class="primary"><i class="material-icons">info</i></a>
                                                                <template v-if="item.status == 'publish'">
                                                                    <a href="#" @click.stop.prevent="_onGroupChangeStatus(index, 'trash')" class="danger"><i class="material-icons">delete</i></a>
                                                                </template>
                                                                <template v-else-if="item.status =='trash'">
                                                                    <a href="#" @click.stop.prevent="_onGroupChangeStatus(index, 'publish')" class="success"><i class="material-icons">restore</i></a>
                                                                </template>
                                                            </div>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="pd-top-30 pd-bottom-30 text-center">
                                                            <h3>Không tìm thấy dữ liệu</h3>
                                                        </div>
                                                    </template>
                                               
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="row ">
                                            <div class="col-xs-12">
                                                <div class="dropup">
                                                    <button :disabled="checkBoxGroup.length == 0" class="btn btn-default dropdown-toggle" type="button"  data-toggle="dropdown">
                                                        <i class="material-icons">reply_all</i>&nbsp;&nbsp;Chọn thao tác thực hiện trên 
                                                    </button>
                                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                                        <li><a @click="_changeStatusSelectedGroup('publish')">Đang hoạt động</a></li>
                                                        <li><a @click="_changeStatusSelectedGroup('trash')">Ngừng hoạt động</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div class="tab-pane active fade in" v-if="tab == 'source'">
                                        <div class="text-right mg-bottom-20">
                                            <a href="#" class="btn btn-success" @click.stop.prevent="_showModalCreateSource()">
                                                <i class="far fa-plus"></i> &nbsp; Tạo mới bàn
                                            </a>
                                        </div>
                                        <div class="box-table" >
                                            <div class="box-header">
                                                <div class="item">
                                                    <div class="item-checkbox"><input type="checkbox" v-model="selectAllSource" /></div>
                                                    <div class="item-index">#</div>
                                                    <div class="item-source-name">Tên Bàn</div>
                                                    <div class="item-source-group">Khu vực</div>
                                                    <div class="item-source-warehouse">Chi nhánh</div>
                                                    <div class="item-source-state">Trạng thái</div>
                                                    <div class="item-action"></div>
                                                </div>
                                            </div>
                                            <div class="box-body box-body-list-source" >
                                                
                                                    <template v-if="sources.length">
                                                        <div class="item" v-for="(item, index) in sources">
                                                            <div class="item-checkbox">
                                                                <input type="checkbox" v-model="checkBoxSource" :value="item._id" />
                                                            </div>
                                                            <div class="item-index">{{index + 1}}</div>
                                                            <div class="item-source-name">{{item.name}}</div>
                                                            <div class="item-source-group">{{item.group.name}}</div>
                                                            <div class="item-source-warehouse">{{item.group.warehouse_name}}</div>
                                                            <div class="item-source-state">
                                                                <span class="status success" v-if="item.status == 'publish'">Đang hoạt động</span>
                                                                <span class="status danger" v-else-if="item.status == 'trash'">Ngừng hoạt động</span>
                                                            </div>
                                                            <div class="item-source-action">
                                                                <a href="#" @click.stop.prevent="_onEditSource(index)" class="primary"><i class="material-icons">info</i></a>
                                                                <template v-if="item.status == 'publish'">
                                                                    <a href="#" @click.stop.prevent="_onSourceChangeStatus(index, 'trash')" class="danger"><i class="material-icons">delete</i></a>
                                                                </template>
                                                                <template v-else-if="item.status =='trash'">
                                                                    <a href="#" @click.stop.prevent="_onSourceChangeStatus(index, 'publish')" class="success"><i class="material-icons">restore</i></a>
                                                                </template>
                                                            </div>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="pd-top-30 pd-bottom-30 text-center">
                                                            <h3>Không tìm thấy dữ liệu</h3>
                                                        </div>
                                                    </template>
                                                
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="row ">
                                            <div class="col-xs-12">
                                                <div class="dropup">
                                                    <button :disabled="checkBoxSource.length == 0" class="btn btn-default dropdown-toggle" type="button"  data-toggle="dropdown">
                                                        <i class="material-icons">reply_all</i>&nbsp;&nbsp;Chọn thao tác thực hiện trên 
                                                    </button>
                                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                                        <li><a @click="_changeStatusSelectedSource('publish')">Đang hoạt động</a></li>
                                                        <li><a @click="_changeStatusSelectedSource('trash')">Ngừng hoạt động</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane active fade in" v-if="tab == 'user'">
                                        <div class="box-table"> 
                                            <div class="box-header">
                                                <div class="item">
                                                    <div class="item-index">#</div>
                                                    <div class="item-user-name">Tên Bàn</div>
                                                    <div class="item-user-warehouse">Chi nhánh</div>
                                                    <div class="item-user-state">Trạng thái</div>
                                                    <div class="item-user-type">Loại nhân viên</div>
                                                </div>
                                            </div>
                                            <div class="box-body" >
                                                <template v-if="users.data.length">
                                                    <div class="item" v-for="(item, index) in users.data">
                                                        <div class="item-index">{{index + 1}}</div>
                                                        <div class="item-user-name">{{item.name}}</div>
                                                        <div class="item-user-warehouse">
                                                            <div v-for="w in item.warehouses">
                                                                {{w.name}}
                                                            </div>
                                                        </div>
                                                        <div class="item-user-state">
                                                            <span class="status success" v-if="item.status == 'active'">Đang hoạt động</span>
                                                            <span class="status danger" v-else-if="item.status == 'trash'">Ngừng hoạt động</span>
                                                        </div>
                                                        <div class="item-user-type">
                                                            <select2 :options="users.type" v-model="item.type_pos" placeholder="Chọn loại nhân viên"></select2>
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div class="pd-top-30 pd-bottom-30 text-center">
                                                        <h3>Không tìm thấy dữ liệu</h3>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                        <div class="text-right pd-10 mg-top-20">
                                            <button class="btn btn-success" @click.stop.prevent="_saveListUser()">
                                                <i class="material-icons">check</i>&nbsp;Lưu cập nhật
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="modal-footer">
                            
                        </div>
                    </div>
                </div>
            </div>
            <div ref="modalProduct" class="modal fade modal-list-products" role="dialog" >
                <div class="modal-dialog " role="document" >
                    <div class="modal-content" >
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Danh sách sản phẩm</h4>
                        </div>
                        <div class="modal-body">
                            <div class="row mg-bottom-10">
                                <div class="col-xs-6">
                                    <label>Từ khóa</label>
                                    <div class="form-search">
                                        <input type="text" class="form-control" v-model="products.keyword" placeholder="Nhập từ khóa cần tìm "/>
                                    </div>
                                </div>
                                <div class="col-xs-6">
                                    <label>Ngành hàng</label>
                                    <select2 :options="categories" v-model="products.category_id"></select2>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover table-setting">
                                    <thead>
                                        <tr>
                                            <th class="td-checkbox"><input type="checkbox" v-model="selectAllProduct" /></th>
                                            <th class="td-index">#</th>
                                            <th class="td-name">Tên sản phẩm</th>
                                            <th class="td-category">Danh mục</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-if="products.data.length">
                                            <tr v-for="(item, index) in products.data" 
                                            @click="_addCheckbox(item._id , $event)"
                                            :class="{'is-active' : checkBoxProduct.indexOf(item._id) >= 0}" >
                                                <td class="td-checkbox"><input type="checkbox" v-model="checkBoxProduct" :value="item._id" /></td>
                                                <td class="td-index">{{(products.limit * (products.page - 1)) + index + 1}}</td>
                                                <td class="td-name">{{ _.has(item , 'VariantName')? item.VariantName : ''}}</td>
                                                <td class="td-category">{{ _.has(item , 'Category.name') ? item.Category.name : '' }}</td>

                                            </tr>
                                        </template>
                                        <template v-else>
                                            <tr>
                                                <td colspan="4" class="text-center pd-top-20 pd-bottom-20">
                                                    <h3>Không tìm thấy dữ liệu !</h3>
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="row">
                                <div class="col-xs-8 text-left" >
                                    <pagination :total="products.total" :current="products.page" :change="_changePage"></pagination>
                                </div>
                                <div class="col-xs-4 text-right">
                                    <a href="#" @click.stop.prevent="_save()" class="btn btn-primary" :disabled="!checkBoxProduct.length">
                                        <i class="far fa-check"></i>&nbsp;&nbsp;Thêm <strong v-if="checkBoxProduct.length">{{checkBoxProduct.length}}</strong> sản phẩm đã chọn
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props:{
        show : {
            required : true,
            type : Boolean
        }
    },

    data : function(){
        return {
            tab : 'config',
            checkBoxProduct : [],
            checkBox : [],
            checkBoxSource : [],
            checkBoxGroup : [],
            products : {
                data : [],
                limit : 10,
                total : 0,
                page : 1,
                keyword : '',
                category_id : 'all',
                loading : false,
                timeout : null,
            },
            groups : [],
            loading : true,
            categories : [],
            data : [],
            keyword : '',
            category_id : '',
            filter : {
                keyword : '',
                category_id : 'all',
                processing : 'all'
            },
            processings: [
                {_id : 'all' , name : 'Tất cả'},
                {_id : 'true' , name : 'Có chế biến'},
                {_id : 'false' , name : 'Không chế biến'},
            ],
            warehouses : [],
            sources : [],
            group_keys : [],
            users : {
                loading : false,
                data : [],
                type : [
                    { _id : 'cashier'  , name : 'Thu ngân'},
                    { _id : 'chief'  , name : 'Bếp'},
                    { _id : 'manager'  , name : 'Quản lý'},
                ]
            },
            config : {},
        }
    },
    methods : {
        _changeTab : function(tab){
            if(this.tab != tab){
                switch(tab) {
                    case 'product': 
                        this.tab = tab;
                        this._loadAllowPosProduct();
                        break;
                    case 'group': 
                        this.tab = tab;
                        this._loadListGroup();
                        break;
                    case 'source': 
                        this.tab = tab;
                        this._loadListSource();
                        break;
                    case 'user': 
                        this.tab = tab;
                        this._loadListUsers();
                        break;
                    default:
                        this.tab = tab;
                        break;
                }
            }
        },
        _load:  function( page,  callback){
            this.products.loading  = true;
            $.post("/admin/sales/pos/postLoadProductForSaleSource", {
                page : page,
                limit : this.products.limit,
                keyword : this.products.keyword,
                category_id : this.products.category_id == 'all' ? '' : this.products.category_id,
            },  (res) => {
                console.log(res);
                if (res.status == 403) return;
                if (res.error == false) {
                    this.products.data = res.products;
                    this.products.limit= res.limit;
                    this.products.page= res.page;
                    this.products.total = res.total;
                    if( typeof callback == 'function'){
                        callback();
                    }
                }
            }).fail(function () {}).always( ()=>{
                this.products.loading  = false;
            });
        },
        _changePage : function(page){
            console.log(page);
            if(this.products.loading) return;
            this._load(page );
        },
        _showModalProducts : function(){
            this._load( 1 , ()=>{
                $(this.$refs.modalProduct).modal('show');
                 $(this.$refs.modalSetting).removeClass('in');
            });
        },
        _addCheckbox : function(id , $event){
            var tags = $event.target.tagName.toLowerCase();
            if( tags != 'a' && tags != 'i' && tags != 'span' && tags != 'input' ){
                var index = this.checkBoxProduct.indexOf(id);
                if( index == -1 ){
                    this.checkBoxProduct.push(id);
                }else{
                    this.checkBoxProduct.splice(index, 1);
                }
            }
        },
        _save : function(){
            this.$root.showLoader();
            $.post("/admin/sales/pos/postChangeProductAllowPOS", {
                product_ids : this.checkBoxProduct
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    if( res.error == false){
                        res.products.forEach((item)=>{
                            this.data.push(item);
                        })
                        $(this.$refs.modalProduct).modal('hide');
                    }
                }
            }).fail(function () {}).always( ()=>{
                this.$root.closeLoader();
            });
        },
        _loadConfig : function(){
            
            this.loading  = true;
            $.post("/admin/sales/pos/postLoadSettingPos", {},  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    this.config = res.data;
                }
            }).fail(function () {}).always( ()=>{
                this.loading  = false;
            });
        },
        _loadAllowPosProduct : function(callback){
            this.loading  = true;
            $.post("/admin/sales/pos/postLoadProductAllowPOS", {},  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    this.data = res.products;
                    res.categories.unshift({
                        _id : 'all',
                        name : 'Tất cả'
                    })
                    this.categories = res.categories;
                    if( typeof callback == 'function'){
                        callback();
                    }
                }
            }).fail(function () {}).always( ()=>{
                this.loading  = false;
            });
        },
        _loadListGroup : function(callback){
            this.loading  = true;
            $.post("/admin/sales/pos/postLoadSaleGroupSource", {},  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    this.groups = res.sale_group_source;
                    this.warehouses = res.warehouses;
                    if( typeof callback == 'function'){
                        callback();
                    }
                }
            }).fail(function () {}).always( ()=>{
                this.loading  = false;
            });
        },
        _loadListSource : function(callback){
            this.loading  = true;
            $.post("/admin/sales/pos/postLoadSaleSource", {},  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    this.sources = res.sale_source;
                    this.group_keys = res.sale_group_source;
                    if( typeof callback == 'function'){
                        callback();
                    }
                }
            }).fail(function () {}).always( ()=>{
                this.loading  = false;
            });
        },
        _loadListUsers : function(callback){
            this.loading  = true;
            $.post("/admin/sales/pos/postLoadUserPos", {},  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    this.users.data = res.users;
                    if( typeof callback == 'function'){
                        callback();
                    }
                }
            }).fail(function () {}).always( ()=>{
                this.loading  = false;
            });
        },
        _removeAll : function(){
            this.$root.comfirm('Thông báo !', 'Bạn có muốn xóa những sản phẩm đã chọn khỏi POS ?', {
                save: {
                    text: 'Xác nhận',
                    btnClass: 'btn-success',
                    keys: ['enter'],
                    action:  ()=> {
                        this.$root.showLoader();
                        $.post("/admin/sales/pos/postRemoveAllowPOS", {
                            product_ids : this.checkBox
                        },  (res) => {
                            if (res.status == 403) return;
                            if (res.error == false) {
                                this.data = this.data.filter((item)=>{
                                    return this.checkBox.indexOf(item._id) == -1;
                                });
                                this.checkBox = [];
                            }
                        }).fail(function () {}).always( ()=>{
                            this.$root.closeLoader();
                        });
                    }
                },
                close: {
                    text: 'Đóng',
                    btnClass: 'btn-default',
                    keys: ['esc'],
                }
            });
        },
        _changeState : function(type){
            var message = '';
            if( type == true){
                message = 'Bạn có muốn áp dụng chế biến cho những sản phẩm đã chọn ?';
            }else{
                message = 'Bạn có muốn áp dụng không chế biến cho những sản phẩm đã chọn ?';
            }
            this.$root.comfirm('Thông báo !', message , {
                save: {
                    text: 'Xác nhận',
                    btnClass: 'btn-success',
                    keys: ['enter'],
                    action:  ()=> {
                        this.$root.showLoader();
                        $.post("/admin/sales/pos/postChangeProcessing", {
                            product_ids : this.checkBox,
                            processing : type,
                        },  (res) => {
                            if (res.status == 403) return;
                            if (res.error == false) {
                                this.data = this.data.map((item)=>{
                                    if( this.checkBox.indexOf(item._id) >= 0 ){
                                        item.processing = type ;
                                    }
                                    return item;
                                });
                                helper.dialog(res.message , 'check' , 'success' , 1000);
                                socket.emit('pos_user_update_config' , {});
                            }
                        }).fail(function () {}).always( ()=>{
                            this.$root.closeLoader();
                        });
                    }
                },
                close: {
                    text: 'Đóng',
                    btnClass: 'btn-default',
                    keys: ['esc'],
                }
            });
        },
        _onClick : function(item){
            $.post("/admin/sales/pos/postChangeProcessing", {
                product_ids : [item._id],
                processing : !item.processing,
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    item.processing = !item.processing;
                }
            }).fail(function () {}).always( ()=>{
                this.$root.closeLoader();
            });
        },
        _onRemove : function(id){
            this.$root.comfirm('Thông báo !', 'Bạn có muốn xóa sản phẩm đã chọn khỏi POS ?', {
                save: {
                    text: 'Xác nhận',
                    btnClass: 'btn-success',
                    keys: ['enter'],
                    action:  ()=> {
                        this.$root.showLoader();
                        $.post("/admin/sales/pos/postRemoveAllowPOS", {
                            product_ids : [id]
                        },  (res) => {
                            if (res.status == 403) return;
                            if (res.error == false) {
                                this.data = this.data.filter((item)=>{
                                    return item._id != id;
                                });
                            }
                        }).fail(function () {}).always( ()=>{
                            this.$root.closeLoader();
                        });
                    }
                },
                close: {
                    text: 'Đóng',
                    btnClass: 'btn-default',
                    keys: ['esc'],
                }
            });
        },
        _onEditGroup: function(index){
            if( index < 0) return;
            var vm = this;
            var dismiss = true;
            var jc = $.confirm({
                title : 'Cập nhật ',
                content : `
                    <form id="form-edit-group" @submit.stop.prevent="onSubmit">
                        <div class="form-group mg-bottom-10">
                            <label>Tên khu vực</label>
                            <input ref="name" type="text" v-model="name" placeholder="Nhập tên khu vực" class="name form-control" required />
                        </div>
                        <div class="form-group">
                            <label>Chi nhánh</label>
                            <select2 class="form-control" :options="warehouses" v-model="warehouse_id" placeholder="Chọn chi nhánh"></select2>
                        </div>
                    </form>
                `,
                type : 'green',
                backgroundDismiss : function(){
                    return 'backdrop';
                },
                buttons :{
                    backdrop : {
                        isHidden : true,
                        action : ()=>{return dismiss}
                    },
                    save : {
                        text : 'Xác nhận',
                        btnClass : 'btn-success',
                        action : ()=>{
                            var name = createGroup.name;
                            var warehouse_id = createGroup.warehouse_id;
                            if( name == ''){
                                $.dialog('Chưa nhập tên khu vực !');
                                return false;
                            }
                            if( warehouse_id == ''){
                                $.dialog('Chưa chọn kho hàng !');
                                return false;
                            }
                            dismiss = false;
                            jc.showLoading(true);
                            return new Promise((resolve, reject)=>{
                                $.post("/admin/sales/pos/postUpdateSaleGroupSource", {
                                    _id : vm.groups[index]._id,
                                    name : name,
                                    warehouse_id : warehouse_id,
                                },  (res) => {
                                    if (res.status == 403) return;
                                    if (res.error == false) {
                                        this.$set(this.groups , index, res.group);
                                        resolve(true);
                                    }
                                }).fail(function () {resolve(false);}).always( ()=>{
                                    
                                });
                            }) 

                        }
                    },
                    close : {
                        text : 'Đóng',
                        btnClass : 'btn-default',
                    }
                },
                onOpenBefore: function () {
                    jc.showLoading( );
                },
                onContentReady: function () {
                    createGroup =  new Vue({
                        el : '#form-edit-group',
                        data : {
                            name : vm.groups[index].name,
                            warehouse_id : vm.groups[index].warehouse_id,
                            warehouses : vm.warehouses,
                        },
                        methods:{
                            onSubmit : function(){
                                jc.$$save.trigger('click'); 
                            }
                        },
                        mounted : function(){
                            jc.hideLoading( );
                            $(this.$refs.name).select();

                        }
                    });
                }
            })
        },
        _onEditSource: function(index){
            if( index < 0) return;
            var vm = this;
            var dismiss = true;
            var jc = $.confirm({
                title : 'Cập nhật !',
                content : `
                    <form id="form-create-source" @submit.stop.prevent="onSubmit">
                        <div class="form-group mg-bottom-10">
                            <label>Tên bàn</label>
                            <input ref="name" type="text" v-model="name" placeholder="Nhập tên bàn" class="name form-control" required />
                        </div>
                        <div class="form-group">
                            <label>Chi khu vực</label>
                            <select2 class="form-control" :options="groups" v-model="group_id" placeholder="Chọn khu vực"></select2>
                        </div>
                    </form>
                `,
                type : 'green',
                buttons :{
                    save : {
                        text : 'Xác nhận',
                        btnClass : 'btn-success',
                        action : ()=>{
                            var name = createSource.name;
                            var group_id = createSource.group_id;
                            if( name == ''){
                                $.dialog('Chưa nhập tên bàn !');
                                return false;
                            }
                            if( group_id == ''){
                                $.dialog('Chưa chọn khu vực !');
                                return false;
                            }
                            this.$root.showLoader();
                            return new Promise((resolve, reject)=>{
                                $.post("/admin/sales/pos/postUpdateSaleSource", {
                                    _id : this.sources[index]._id,
                                    name : name,
                                    group_id : group_id,
                                },  (res) => {
                                    if (res.status == 403) return;
                                    if (res.error == false) {
                                        this.$set(this.sources , index, res.source);
                                        resolve(true);
                                    }
                                }).fail(function () {}).always( ()=>{
                                    this.$root.closeLoader();
                                });
                            }) 

                        }
                    },
                    close : {
                        text : 'Đóng',
                        btnClass : 'btn-default',
                    }
                },
                onOpenBefore: function () {
                    jc.showLoading( );
                },
                onContentReady: function () {
                    createSource =  new Vue({
                        el : '#form-create-source',
                        data : {
                            name : vm.sources[index].name,
                            group_id : vm.sources[index].group_id,
                            groups : vm.group_keys,
                        },
                        methods:{
                            onSubmit : function(){
                                jc.$$save.trigger('click'); 
                            }
                        },
                        mounted : function(){
                            jc.hideLoading( );
                            $(this.$refs.name).focus();
                        }
                    });
                }
            })
        },
        _onGroupChangeStatus : function(index , status){
            var dismiss = true;
            var message = '';
            var color = '';
            if( status == 'publish'){
                message = 'Bạn có muốn khôi phục khu vực này ?';
                color = 'green';
            }else if( status == 'trash'){
                message = 'Bạn có muốn xóa khu vực này ?';
                color = 'red';
            }else{
                return;
            }
            var jc = $.confirm({
                title : 'Xác nhận ',
                content : message,
                type : color,
                backgroundDismiss : function(){
                    return 'backdrop';
                },
                buttons :{
                    backdrop : {
                        isHidden : true,
                        action : ()=>{return dismiss}
                    },
                    save : {
                        text : 'Xác nhận',
                        btnClass : 'btn-success',
                        action : ()=>{
                            dismiss = false;
                            jc.showLoading(true);
                            return new Promise((resolve, reject)=>{
                                $.post("/admin/sales/pos/postChangeStatusSaleGroupSource", {
                                    group_ids: [this.groups[index]._id],
                                    status: status,
                                },  (res) => {
                                    if (res.status == 403) return;
                                    if (res.error == false) {
                                        this.groups[index].status = status;
                                        resolve(true);
                                    }
                                }).fail(function () {}).always( ()=>{
                                    
                                });
                            }) 
                        }
                    },
                    close : {
                        text : 'Đóng',
                        btnClass : 'btn-default',
                    }
                },
            })
        },
        _onSourceChangeStatus : function(index , status){
            var dismiss = true;
            var message = '';
            var color = '';
            if( status == 'publish'){
                message = 'Bạn có muốn khôi phục bàn này ?';
                color = 'green';
            }else if( status == 'trash'){
                message = 'Bạn có muốn xóa bàn này ?';
                color = 'red';
            }else{
                return;
            }
            var jc = $.confirm({
                title : 'Xác nhận ',
                content : message,
                type : color,
                backgroundDismiss : function(){
                    return 'backdrop';
                },
                buttons :{
                    backdrop : {
                        isHidden : true,
                        action : ()=>{return dismiss}
                    },
                    save : {
                        text : 'Xác nhận',
                        btnClass : 'btn-success',
                        action : ()=>{
                            dismiss = false;
                            jc.showLoading(true);
                            return new Promise((resolve, reject)=>{
                                $.post("/admin/sales/pos/postChangeStatusSaleSource", {
                                    source_ids: [this.sources[index]._id],
                                    status: status,
                                },  (res) => {
                                    if (res.status == 403) return;
                                    if (res.error == false) {
                                        this.sources[index].status = status;
                                        resolve(true);
                                    }
                                }).fail(function () {}).always( ()=>{
                                    
                                });
                            }) 
                        }
                    },
                    close : {
                        text : 'Đóng',
                        btnClass : 'btn-default',
                    }
                },
            })
        },
        _showModalCreateGroup: function(){
            var vm = this;
            var createGroup = null ;
            var jc = $.confirm({
                title : 'Tạo mới !',
                content : `
                    <form id="form-create-group" @submit.stop.prevent="onSubmit">
                        <div class="form-group mg-bottom-10">
                            <label>Tên khu vực</label>
                            <input ref="name" type="text" v-model="name" placeholder="Nhập tên khu vực" class="name form-control" required />
                        </div>
                        <div class="form-group">
                            <label>Chi nhánh</label>
                            <select2 class="form-control" :options="warehouses" v-model="warehouse_id" placeholder="Chọn chi nhánh"></select2>
                        </div>
                    </form>
                `,
                type : 'green',
                buttons :{
                    save : {
                        text : 'Xác nhận',
                        btnClass : 'btn-success',
                        action : ()=>{
                            var name = createGroup.name;
                            var warehouse_id = createGroup.warehouse_id;
                            if( name == ''){
                                $.dialog('Chưa nhập tên khu vực !');
                                return false;
                            }
                            if( warehouse_id == ''){
                                $.dialog('Chưa chọn kho hàng !');
                                return false;
                            }
                            this.$root.showLoader();
                            return new Promise((resolve, reject)=>{
                                $.post("/admin/sales/pos/postAddSaleGroupSource", {
                                    name : name,
                                    warehouse_id : warehouse_id,
                                },  (res) => {
                                    if (res.status == 403) return;
                                    if (res.error == false) {
                                        this.groups.push(res.data);
                                        resolve(true);
                                    }
                                }).fail(function () {}).always( ()=>{
                                    this.$root.closeLoader();
                                });
                            }) 

                        }
                    },
                    close : {
                        text : 'Đóng',
                        btnClass : 'btn-default',
                    }
                },
                onOpenBefore: function () {
                    jc.showLoading( );
                },
                onContentReady: function () {
                    createGroup =  new Vue({
                        el : '#form-create-group',
                        data : {
                            name : '',
                            warehouse_id : '',
                            warehouses : vm.warehouses,
                        },
                        methods:{
                            onSubmit : function(){
                                jc.$$save.trigger('click'); 
                            }
                        },
                        mounted : function(){
                            jc.hideLoading( );
                            $(this.$refs.name).focus();
                        }
                    });
                }
            })
        },
        _showModalCreateSource: function(){
            var vm = this;
            var createSource = null ;
            var jc = $.confirm({
                title : 'Tạo mới !',
                content : `
                    <form id="form-create-source" @submit.stop.prevent="onSubmit">
                        <div class="form-group mg-bottom-10">
                            <label>Tên bàn</label>
                            <input ref="name" type="text" v-model="name" placeholder="Nhập tên bàn" class="name form-control" required />
                        </div>
                        <div class="form-group">
                            <label>Chi khu vực</label>
                            <select2 class="form-control" :options="groups" v-model="group_id" placeholder="Chọn khu vực"></select2>
                        </div>
                    </form>
                `,
                type : 'green',
                buttons :{
                    save : {
                        text : 'Xác nhận',
                        btnClass : 'btn-success',
                        action : ()=>{
                            var name = createSource.name;
                            var group_id = createSource.group_id;
                            if( name == ''){
                                $.dialog('Chưa nhập tên bàn !');
                                return false;
                            }
                            if( group_id == ''){
                                $.dialog('Chưa chọn khu vực !');
                                return false;
                            }
                            this.$root.showLoader();
                            return new Promise((resolve, reject)=>{
                                $.post("/admin/sales/pos/postAddSaleSource", {
                                    name : name,
                                    group_id : group_id,
                                },  (res) => {
                                    if (res.status == 403) return;
                                    if (res.error == false) {
                                        this.sources.push(res.data);
                                        resolve(true);
                                    }
                                }).fail(function () {}).always( ()=>{
                                    this.$root.closeLoader();
                                });
                            }) 

                        }
                    },
                    close : {
                        text : 'Đóng',
                        btnClass : 'btn-default',
                    }
                },
                onOpenBefore: function () {
                    jc.showLoading( );
                },
                onContentReady: function () {
                    createSource =  new Vue({
                        el : '#form-create-source',
                        data : {
                            name : '',
                            group_id : '',
                            groups : vm.group_keys,
                        },
                        methods:{
                            onSubmit : function(){
                                jc.$$save.trigger('click'); 
                            }
                        },
                        mounted : function(){
                            jc.hideLoading( );
                            $(this.$refs.name).focus();
                        }
                    });
                }
            })
        },
        _changeStatusSelectedGroup : function(status){
            if(this.checkBoxGroup.length){
                var dismiss = true;
                var message = '';
                var color = '';
                if( status == 'publish'){
                    message = 'Bạn có muốn khôi phục tất cả khu vực đã chọn ?';
                    color = 'green';
                }else if( status == 'trash'){
                    message = 'Bạn có muốn xóa tất cả xóa đã chọn ?';
                    color = 'red';
                }else{
                    return;
                }
                var jc = $.confirm({
                    title : 'Xác nhận ',
                    content : message,
                    type : color,
                    backgroundDismiss : function(){
                        return 'backdrop';
                    },
                    buttons :{
                        backdrop : {
                            isHidden : true,
                            action : ()=>{return dismiss}
                        },
                        save : {
                            text : 'Xác nhận',
                            btnClass : 'btn-success',
                            action : ()=>{
                                dismiss = false;
                                jc.showLoading(true);
                                return new Promise((resolve, reject)=>{
                                    $.post("/admin/sales/pos/postChangeStatusSaleGroupSource", {
                                        group_ids: this.checkBoxGroup,
                                        status: status,
                                    },  (res) => {
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            this.groups = this.groups.map((item)=>{
                                                if( this.checkBoxGroup.indexOf(item._id) >= 0){
                                                    item.status = status;
                                                }
                                                return item;
                                            })
                                            resolve(true);
                                        }
                                    }).fail(function () {}).always( ()=>{
                                        
                                    });
                                }) 
                            }
                        },
                        close : {
                            text : 'Đóng',
                            btnClass : 'btn-default',
                        }
                    },
                })
            }
        },
        _changeStatusSelectedSource : function(status){
            if(this.checkBoxSource.length){
                var dismiss = true;
                var message = '';
                var color = '';
                if( status == 'publish'){
                    message = 'Bạn có muốn khôi phục tất cả bàn đã chọn ?';
                    color = 'green';
                }else if( status == 'trash'){
                    message = 'Bạn có muốn xóa tất cả bàn đã chọn ?';
                    color = 'red';
                }else{
                    return;
                }
                var jc = $.confirm({
                    title : 'Xác nhận ',
                    content : message,
                    type : color,
                    backgroundDismiss : function(){
                        return 'backdrop';
                    },
                    buttons :{
                        backdrop : {
                            isHidden : true,
                            action : ()=>{return dismiss}
                        },
                        save : {
                            text : 'Xác nhận',
                            btnClass : 'btn-success',
                            action : ()=>{
                                dismiss = false;
                                jc.showLoading(true);
                                return new Promise((resolve, reject)=>{
                                    $.post("/admin/sales/pos/postChangeStatusSaleSource", {
                                        source_ids: this.checkBoxSource,
                                        status: status,
                                    },  (res) => {
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            // this.groups[index].status = status;
                                            this.sources = this.sources.map((item)=>{
                                                if( this.checkBoxSource.indexOf(item._id) >= 0){
                                                    item.status = status;
                                                }
                                                return item;
                                            })
                                            resolve(true);
                                        }
                                    }).fail(function () {}).always( ()=>{
                                        
                                    });
                                }) 
                            }
                        },
                        close : {
                            text : 'Đóng',
                            btnClass : 'btn-default',
                        }
                    },
                })
            }
        },
        _saveListUser: function(){
            this.$root.showLoader();
            var users = this.users.data.map(function(item){
                var object = {
                    _id : item._id,
                    type_pos : item.type_pos
                }
                return object;
            })
            $.post("/admin/sales/pos/postUpdateUserPos", {
                users: users,
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    helper.dialog(res.message , 'check' , 'success', 2000);
                }
            }).fail(function () {}).always( ()=>{
                this.$root.closeLoader(300);
            });
        },
        _onSaveConfig: function(){
            this.$root.showLoader();
            $.post("/admin/sales/pos/postUpdateSettingPos", {
                setting: this.config,
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    helper.dialog(res.message , 'check' , 'success', 2000);
                    socket.emit('pos_user_update_config' , {});
                }
            }).fail(function () {}).always( ()=>{
                this.$root.closeLoader(300);
            });
        }

    },
    computed : {
        selectAllProduct: {
            get: function () {
                var vm = this;
                if( this.products.data.length ){
                    var check = true;
                    this.products.data.forEach(function(item){
                        if( vm.checkBoxProduct.indexOf(item._id) == -1){
                            check = false;
                        }
                    })

                    return check;
                }
                return false;
            },
            set: function (value) {
                var vm = this;
                if (value) {
                    this.products.data.forEach(function (item) {
                        if( vm.checkBoxProduct.indexOf(item._id) == -1){
                            vm.checkBoxProduct.push(item._id);
                        }
                    });
                }else{
                    this.products.data.forEach(function (item) {
                        var index = vm.checkBoxProduct.indexOf(item._id);
                        if( index >= 0){
                            vm.checkBoxProduct.splice(index, 1);
                        }
                    });
                }
            }
        },
        selectAll: {
            get: function () {
                var vm = this;
                if( this.data.length ){
                    var check = true;
                    this.data.forEach(function(item){
                        if( vm.checkBox.indexOf(item._id) == -1){
                            check = false;
                        }
                    })

                    return check;
                }
                return false;
            },
            set: function (value) {
                var vm = this;
                if (value) {
                    this.data.forEach(function (item) {
                        if( vm.checkBox.indexOf(item._id) == -1){
                            vm.checkBox.push(item._id);
                        }
                    });
                }else{
                    this.data.forEach(function (item) {
                        var index = vm.checkBox.indexOf(item._id);
                        if( index >= 0){
                            vm.checkBox.splice(index, 1);
                        }
                    });
                }
            }
        },
        selectAllSource: {
            get: function () {
                var vm = this;
                if( this.sources.length ){
                    var check = true;
                    this.sources.forEach(function(item){
                        if( vm.checkBoxSource.indexOf(item._id) == -1){
                            check = false;
                        }
                    })

                    return check;
                }
                return false;
            },
            set: function (value) {
                var vm = this;
                if (value) {
                    this.sources.forEach(function (item) {
                        if( vm.checkBoxSource.indexOf(item._id) == -1){
                            vm.checkBoxSource.push(item._id);
                        }
                    });
                }else{
                    this.sources.forEach(function (item) {
                        var index = vm.checkBoxSource.indexOf(item._id);
                        if( index >= 0){
                            vm.checkBoxSource.splice(index, 1);
                        }
                    });
                }
            }
        },
        selectAllGroup: {
            get: function () {
                var vm = this;
                if( this.groups.length ){
                    var check = true;
                    this.groups.forEach(function(item){
                        if( vm.checkBoxGroup.indexOf(item._id) == -1){
                            check = false;
                        }
                    })

                    return check;
                }
                return false;
            },
            set: function (value) {
                var vm = this;
                if (value) {
                    this.groups.forEach(function (item) {
                        if( vm.checkBoxGroup.indexOf(item._id) == -1){
                            vm.checkBoxGroup.push(item._id);
                        }
                    });
                }else{
                    this.groups.forEach(function (item) {
                        var index = vm.checkBoxGroup.indexOf(item._id);
                        if( index >= 0){
                            vm.checkBoxGroup.splice(index, 1);
                        }
                    });
                }
            }
        },
        listData : function(){
            return this.data.filter( (item)=>{
                var category = true;
                var keyword = true;
                var chief = true;
                if( this.filter.keyword.trim() != '' ){
                    var text =  helper.convertCharacters(this.filter.keyword.trim().toLowerCase());
                    var name = helper.convertCharacters(item.name.trim().toLowerCase());
                    if( name.indexOf(text) == -1){
                        keyword = false;
                    }
                }
                if( this.filter.category_id != 'all'){
                    if( item.category_id != this.filter.category_id){
                        category = false;
                    }
                }
                if( this.filter.processing != 'all'){
                    if( this.filter.processing == 'true' ){
                        if( item.processing == false ){
                            chief = false;
                        }
                    }else {
                        if( item.processing == true){
                            chief = false;
                        }
                    }
                }
                return category && keyword && chief ;
            });
        }
    },
    watch :{
        'products.keyword' : function(value){
            clearTimeout(this.products.timeout);
            this.products.timeout = setTimeout(()=>{
                this._load(this.products.page);
            }, 1000);
        },
        'products.category_id' : function(value){
            this._load(this.products.page);
        },
    },
    mounted : function(){
        $(this.$refs.modalSetting).modal('show');
        $(this.$refs.modalSetting).on('hidden.bs.modal', (event)=>{
            this.$emit('update:show' , false);
            $.confirm({
                title : 'Thông báo !',
                content : 'Bạn có muốn tải lại trang để cập nhật cấu hình mới ?',
                buttons : {
                    save : {
                        text: 'Đồng ý',
                        btnClass : 'btn-success',
                        action : function(){
                            document.location.reload();
                        }
                    },
                    close : {
                        text :'Đóng',
                        btnClass: 'btn-default',
                    }
                }
            })
        });
        $(this.$refs.modalProduct).on('hidden.bs.modal' , (event)=>{
            $(this.$refs.modalSetting).addClass('in');
            $('body').addClass('modal-open');
        });
        this._loadConfig();
        
    }
})
Vue.component('list-tables' ,{
    template : `
        <div class="box-list-sources">
            <div class="box-list-sources-head">
                <div class="list-sources-navbar" >
                    <ul class="nav nav-groups" >
                        <li :class="{ active : options.group == 'all'}">
                            <a @click.stop.prevent="changeGroup('all')">Tất cả</a>
                        </li>
                        <li v-for="item in groups" :class="{ active : options.group ==  item._id}">
                            <a @click.stop.prevent="changeGroup(item._id)">{{item.name}}</a>
                        </li>
                    </ul>
                </div>
                <div class="form-search-wrap">
                    <div class="form-search">
                        <i class="fas fa-search"></i>
                        <input type="text" class="form-control" placeholder="Nhập từ khóa cần tìm ..." v-model.trim="options.keywordSource">
                    </div>
                    <div class="form-search-status">
                        Sử dụng : <span>{{list.active}}</span> / {{list.total}} bàn
                    </div>
                </div>
            </div>
            <div class="box-list-sources-body">
                <template  v-if="data.length">
                    <div class="box-list-sources-body-wrapper">
                        <div class="box-list-sources-body-tab" :class="{'is-active' : options.tableView == 'grid'}">
                            <template v-if="list.data.length">
                                <div  class="list-wrap" style="overflow: hidden auto">
                                    <div class="list-sources">
                                        <template v-for="(item, index) in list.data">
                                            <item-table :index="index" :user="user" :table.sync="item"  :data.sync="data" :options.sync="options"></item-table>
                                        </template>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div  class="list-empty" >
                                    <div class="text-center">
                                        <h3 class="text-danger">Không tìm thấy dữ liệu</h3>
                                    </div>
                                </div>
                            </template>
                            
                        </div>
                        <div class="box-list-sources-body-tab" :class="{'is-active' : options.tableView == 'list'}">
                            <div class="list-wrap" >
                                <div class="table table-sources">
                                    <div class="table-head">
                                        <div class="row">
                                            <div class="col index">#</div>
                                            <div class="col center">
                                                <div class="col name">Tên bàn</div>
                                                <div class="col group">Khu vực</div>
                                                <div class="col state">Trạng thái</div>
                                                <div class="col products">Chi tiết</div>
                                                <div class="col user">Nhân viên</div>
                                            </div>
                                            <div class="col actions">Tác vụ</div>
                                        </div>
                                    </div>
                                    <template v-if="list.data.length">
                                        <div class="table-body" >
                                            <template v-for="(item, index) in list.data">
                                                <item-table :index="index" :user="user" :table.sync="item"  :data.sync="data" :options.sync="options"></item-table>
                                            </template>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div  class="table-body">
                                            <div class="text-center">
                                                <h3 class="text-danger">Không tìm thấy dữ liệu</h3>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="list-empty" >
                        <div class="text-center">
                            <i class="fas fa-exclamation-triangle"></i>
                            <strong>Chưa có bàn !</strong>
                        </div>
                    </div>
                </template>
            </div>
            <div class="box-list-sources-foot">
                <div class="view-type">
                    <a :class="{'is-active' : options.tableView =='grid'}" @click.stop.prevent="options.tableView = 'grid'" ><i class="material-icons">view_module</i></a>
                    <a :class="{'is-active' : options.tableView =='list'}" @click.stop.prevent="options.tableView = 'list'" ><i class="material-icons">view_list</i></a>
                </div>
                <div class="view-filter">
                    <label><input type="checkbox" v-model="options.allowOpen"> Mở thực đơn khi chọn bàn</label>
                </div>
                <div class="view-sort">
                    <select2 :options="states" v-model="options.state"></select2>
                </div>
            </div>
        </div>

    `,
    props:{
        data : {},
        options : {},
        groups: {} ,
        user : {}
    },
    data : function(){
        return {
            states : [
                {_id : 'all' , name : 'Tất cả' },
                {_id : 'empty' , name : 'Chưa sử dụng' },
                {_id : 'booked' , name : 'Đang sử dụng' },
            ],
            navbar : 'auto',
        }
    },
    methods:{
        changeGroup: function (item) {
            if (this.options.group != item) {
                this.options.group = item;
            }
        },
    },
    computed : {
        list: function () {
            var vm = this;
            var keyword = helper.convertCharacters(this.options.keywordSource.toLowerCase());
            var active = 0;
            var arr = vm.data.filter(function (item) {
                var checkGroup = true;
                var checkKeyword = true;
                var checkState = true;
                if( item.state == 'booked'){
                    active++;
                }
                if (vm.options.state == 'booked' || vm.options.state == 'wait') {
                    checkState = (item.state == vm.options.state) ? true : false;
                } else if (vm.options.state == 'empty' || vm.options.state == '') {
                    checkState = (item.state == '' || item.state == 'empty') ? true : false;
                }
                if (vm.options.group != 'all') {
                    checkGroup = item.group_id == vm.options.group ? true : false;
                }
                if (keyword != '') {
                    checkKeyword = item.name_search.indexOf(keyword) >= 0 ? true : false;
                }
                return (checkGroup && checkKeyword && checkState);
            });
            return {
                data : arr,
                active : active,
                total : vm.data.length,
            }
        },
    },
    mounted : function(){
        // this.$refs.scrollbar.scrollAreaWidth = this.$refs.navbar.scrollWidth;
        // this.navbar = this.$refs.navbar.scrollWidth + 'px';
    }
})
Vue.component('item-table', {
    template : `
        <div v-if="options.tableView =='grid'" class="item-source" :class="_class()">
            <img :src="$root.images.square" class="item-source-grid" />
            <div class="item-source-wrap" @click="_onClick($event)">
                <div class="item-source-header">
                    <template v-if="table.hasOwnProperty('current_user') && table.current_user != '' && table.relation_id =='' ">
                        <div class="item-source-user" ><i class="fas fa-user"></i>{{ table.current_user  | username}}</div>
                    </template>
                    <div class="item-source-dropdown">
                        <template v-if="_show()">
                            <div class="dropdown" >
                                <a class="dropdown-toggle" data-toggle="dropdown"><i
                                        class="fa fa-ellipsis-v"></i></a>
                                <ul class="dropdown-menu">
                                    <li><a @click="$root.showModalSwitchTable(table._id )">Chuyển bàn</a></li>
                                    <li><a @click="$root.showModalJoinTable(table._id )">Ghép/gộp bàn</a></li>
                                    <li><a @click="$root.clearTable(table._id)">Hủy bàn</a></li>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="item-source-icon">
                    <img :src="$root.images.table"/>
                </div>
                <div class="item-source-name">{{table.name}}</div>
                <template v-if="table.state == 'booked'">
                    <div class="item-source-info text-center"  v-html="info"></div>
                </template>
            </div>
        </div>
        <div v-else class="row">
            <div class="col index">{{index + 1}}</div>
            <div class="col center">
                <div class="col name">{{table.name}}</div>
                <div class="col group">{{groupName}}</div>
                <div class="col state">
                    <template v-if="table.state =='empty' || table.state == ''">
                        - - -
                    </template>
                    <template v-else-if="table.state == 'booked' ">
                        <span class="status success" v-if="table.relation_id == ''">
                            Đang sử dụng
                        </span>
                        <span class="status warning" v-else>
                            Đang ghép bàn
                        </span>
                    </template>
                    <template v-else>
                        <span class="status success" v-if="table.state == 'booked'">
                            Đang sử dụng
                        </span>
                    </template>
                </div>
                <div class="col">
                    <span v-if="table.state == 'booked'" v-html="info"></span>
                    <span v-else>- - -</span>
                </div>
                <div class="col user">
                    <template v-if="table.hasOwnProperty('current_user') && table.current_user != '' && table.relation_id =='' ">
                        {{ table.current_user  | username}}
                    </template>
                    <template v-else>- - -</template>
                </div>
            </div>
            <div class="col actions">
                <a href="#" class="text-primary"  @click.stop.prevent="_onClick($event)">
                    <i class="material-icons">info</i>
                </a>
                <div class="btn-group" >
                    <a  data-toggle="dropdown"  :class="{'is-active' : _show()}">
                        <i class="material-icons text-darl">more_vert</i>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-right" v-if="_show()">
                        <li><a @click="$root.showModalSwitchTable(table._id )">Chuyển bàn</a></li>
                        <li><a @click="$root.showModalJoinTable(table._id )">Ghép/gộp bàn</a></li>
                        <li><a @click="$root.clearTable(table._id)">Hủy bàn</a></li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    props:{
        table : {},
        data : {},
        options :{},
        user : {},
        index: {}
    },
    data : function(){
        return {
            
        }
    },
    methods :{
        _class : function(){
            if( this.table.relation_id != '' && this.table.relation_id != null) return 'is-relation';
            else {
                if( this.options.activeTable == this.table._id){
                    return 'is-active';
                }else{
                    if( this.table.state == 'booked') return 'booked';
                    else if(this.table.state == 'wait') return 'wait';
                }
            }                                                
        },
        _onClick: function (event) {
            var vm = this;
            var id = this.table._id
            if( id == vm.options.activeTable) return ;
            if (event != undefined && $(event.target).is('.dropdown , .dropdown *')) return;
            if( vm.table.relation_id != '' && vm.table.relation_id != null){
                if(vm.options.activeTable == vm.table.relation_id) return ;
                if(vm.user._id == vm.table.current_user || vm.user.type_pos  == 'admin' || vm.user.type_pos  == 'manager'){
                    if (vm.options.allowOpen) {
                        vm.$root.showLoader();
                        vm.options.activeTable = vm.table.relation_id;
                        vm.$nextTick(function () {
                            vm.$root.closeLoader(300 , function(){
                                vm.options.tab = 'products';
                            });
                            
                        })
                    } else {
                        vm.options.activeTable = vm.table.relation_id;
                    }
                }else{
                    $.dialog('Không được phép truy cập bàn này ' );
                }
                return ;
            }
            if (vm.table.state == 'empty' || vm.table.state == '') {
                $.post("/admin/sales/pos/postConfirmAccessTableCustomer", {
                    _id: vm.table._id,
                }, function (res) {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        var message = res.hasOwnProperty('message') ? res.message : '';
                        vm.$root.comfirm('Thông báo !', message, {
                            save: {
                                text: 'Xác nhận',
                                btnClass: 'btn-success',
                                keys: ['enter'],
                                action: function () {
                                    vm.$root.showLoader();
                                    $.post("/admin/sales/pos/postTableAccessCustomer", {
                                        _id: vm.table._id,
                                    }, function (res) {
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            vm.$root.updateSource({ source : res.data});
                                            vm.options.activeTable = vm.table._id;
                                            if (vm.options.allowOpen) {
                                                vm.options.tab = 'products';
                                            }
                                            helper.dialog(res.message, 'check', 'success', 1000);
                                        } else {
                                            helper.dialog(res.message, 'warning',  'warning', 1000);
                                        }
                                    }).fail(function () {}).always(function () {
                                        vm.$root.closeLoader(500);
                                    });
                                }
                            },
                            close: {
                                text: 'Đóng',
                                btnClass: 'btn-default',
                                keys: ['esc'],
                            }
                        });
                    } else {
                        helper.dialog(res.message, 'warning',  'warning', 1000);
                    }
                }).fail(function () {}).always(function () {
                    
                });
                
            } else {
                // if(vm.user._id == vm.table.current_user || vm.user.type_pos  == 'admin' || vm.user.type_pos  == 'manager'){
                    if (vm.options.allowOpen) {
                        vm.$root.showLoader();
                        vm.options.activeTable = vm.table._id;
                        vm.$nextTick(function () {
                            vm.$root.closeLoader(300 , function(){
                                vm.options.tab = 'products';
                            });
                        })
                    } else {
                        vm.options.activeTable = vm.table._id;
                    }
                // }else{
                //     $.dialog('Không được phép truy cập bàn này ' );
                // }
            }
        },
        _show:  function(){
            return this.table.state == 'booked' 
            && (this.$root.user._id == this.table.current_user || (this.user.type_pos  == 'manager' || this.user.type_pos  == 'admin')) 
            && (this.table.relation_id == '' || this.table.relation_id == null );
        },
        _isActive : function(id , name){
            var item = _.find(this.$root.users, {table : id});
            if( item == undefined){
                if( name ){
                    return false;
                }
                return '';
            }else{
                if( name ){
                    return true;
                }
                return item.user_name;
            }
        },
    },
    computed :{
        info : function(){
            var request_quantity = 0;
            var recive_quantity = 0;
            if( this.table.hasOwnProperty('relation_id') &&  this.table.relation_id != ''){
                var item = _.find(this.data , { _id : this.table.relation_id});
                if( item != undefined){
                    return '<div> Ghép với <strong>' + item.name + '</strong></div>';
                }
                return '';
            }
            if(this.table.hasOwnProperty('products')) {
                if(  _.isArray(this.table.products)  && this.table.products.length){
                    this.table.products.forEach(function (el) {
                        request_quantity += el.request_quantity;
                        recive_quantity += el.recive_quantity;
                    });
                    return '<strong>' + recive_quantity + '</strong>/' + request_quantity + ' món';
                }
            }
            return 'Chưa chọn món';
        },
        groupName: function(){
            var group = _.find(this.$root.groups ,{_id : this.table.group_id});
            if( group == undefined){
                return '';
            }
            return group.name;
        }
    }
})
Vue.component('list-products' , {
    template : `
        <div class="box-list-products">
            <div class="box-list-products-head">
                <ul class="nav nav-groups">
                    <li :class="{ active : options.category == 'all'}">
                        <a @click.stop.prevent="changeCategory('all')">Tất cả</a>
                    </li>
                    <li v-for="item in categories" :class="{ active : options.category ==  item._id}">
                        <a @click.stop.prevent="changeCategory(item._id)">{{item.name}}</a>
                    </li>
                </ul>
                <div class="form-search-wrap">
                    <div class="form-search">
                        <i class="fas fa-search"></i>
                        <input type="text" class="form-control" placeholder="Nhập từ khóa cần tìm ..." v-model.trim="options.keywordProduct">
                    </div>
                    <div class="form-search-status">
                        Số món : <span>{{list.active}}</span> / {{list.total}} 
                    </div>
                </div>
            </div>
            <div class="box-list-products-body">
                <template v-if="data.length">
                    <div class="box-list-sources-body-wrapper">
                        <div class="box-list-sources-body-tab" :class="{'is-active' : options.productView == 'grid'}">
                            <template v-if="list.data.length">
                                <div class="list-wrap" style="overflow: hidden scroll">
                                   
                                        <div class="list-products" >
                                            <div class="item-product" v-for="(item, index) in list.data" @click.stop.prevent="_onClick(item)">
                                                <div class="item-product-wrap">
                                                    <div class="item-product-quantity" v-if="item.manage_inventory">
                                                        <div class="badge">{{item.available_quantity}}</div>
                                                    </div>
                                                    <div class="item-product-image">
                                                        <img :src="$root.images.square" class="item-product-grid" />
                                                        <template v-if="_.has(item ,'image.path')">
                                                            <div class="item-product-image-wrap">
                                                                <img :src="'/'+item.image.path" class="img-responsive" />
                                                            </div>
                                                        </template>
                                                        <template v-else>
                                                            <div class="item-product-image-wrap empty">
                                                                <i class="material-icons">
                                                                    camera
                                                                </i>
                                                            </div>
                                                        </template>
                                                    </div>
                                                    <div class="item-product-title">
                                                        {{item.name}}
                                                    </div>
                                                    <div class="item-product-price">
                                                        {{item.price_sale | money}}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </template>
                            <template v-else>
                                <div  class="list-empty" >
                                    <div class="text-center">
                                        <h3 class="text-danger">Không tìm thấy dữ liệu</h3>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="box-list-sources-body-tab" :class="{'is-active' : options.productView == 'list'}">
                            <div class="list-wrap">
                                <div class="table table-products">
                                    <div class="table-head">
                                        <div class="row">
                                            <div class="col index">#</div>
                                            <div class="col center">
                                                <div class="col name">Sản phẩm</div>
                                                <div class="col category">Danh mục</div>
                                                <div class="col quantity">Số lượng</div>
                                                <div class="col price">Đơn giá</div>
                                            </div>
                                            <div class="col actions">Tác vụ</div>
                                        </div>
                                    </div>
                                    <template v-if="list.data.length">
                                        <div class="table-body" >
                                   
                                                <template v-for="(item, index) in list.data">
                                                    <div class="row">
                                                        <div class="col index">{{index + 1}}</div>
                                                        <div class="col center">
                                                            <div class="col name">{{item.name}}</div>
                                                            <div class="col category">
                                                                {{_.has(item , 'category.name') ? item.category.name : ''}}
                                                            </div>
                                                            <div class="col quantity">
                                                                <template v-if="item.manage_inventory">{{item.available_quantity}}</template>
                                                                <template v-else>- - -</template>
                                                                
                                                            </div>
                                                            <div class="col price">{{item.price_sale | money}}</div>
                                                        </div>
                                                        <div class="col actions">
                                                            <a @click.stop.prevent="_onClick(item )" class="text-success"><i class="material-icons">add_box</i></a>
                                                        </div>
                                                    </div>
                                                </template>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div  class="table-body">
                                            <div class="text-center">
                                                <h3 class="text-danger">Không tìm thấy dữ liệu</h3>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="list-empty" >
                        <div class="text-center">
                            <i class="fas fa-exclamation-triangle"></i>
                            <strong>Chưa có sản phẩm !</strong>
                        </div>
                    </div>
                </template>
            </div>
            <div class="box-list-products-foot">
                <div class="view-type">
                    <a :class="{'is-active' : options.productView =='grid'}" @click.stop.prevent="options.productView = 'grid'" ><i class="material-icons">view_module</i></a>
                    <a :class="{'is-active' : options.productView =='list'}" @click.stop.prevent="options.productView = 'list'" ><i class="material-icons">view_list</i></a>
                </div>
                <div class="view-filter">
                    <label>
                        <input type="checkbox" v-model="options.autoHideProduct"> Tự động ẩn khi hết món
                    </label>
                    &nbsp;&nbsp;
                    <label>
                        <input type="checkbox" v-model="options.chooseNumber"> Cho phép nhập số lượng
                    </label>
                </div>
                <div class="view-sort hide">
                    <select2 class="form-control" :options="states" v-model="options.productState"></select2>
                </div>
            </div>
        </div>
    `,
    props : {
        data : {},
        options: {},
        categories:{}
    },
    data : function(){
        return {
            states : [
                {_id : 'all' , text : 'Tất cả'},
                {_id : 'processing' , text : 'Có chế biến'},
                {_id : 'nonprocessing' , text : 'Không chế biến'},
                {_id : 'quantity' , text : 'Còn hàng'},
                {_id : 'nonquantity' , text : 'Hết hàng'}
            ]
        }
    },
    methods :{
        changeCategory: function (item) {
            if (this.options.category != item) {
                this.options.category = item;
            }
        },
        _onClick : function(item){
            var vm = this;
            vm.loading = true;
            if( vm.options.loadingAddProduct) return;
            if (vm.options.activeTable == ''){
                $.dialog('<strong>Vui lòng chọn bàn trước khi thêm sản phẩm !</strong>');
                return;
            }
            if(item.manage_inventory == true && item.available_quantity <= 0) {
                $.dialog('<strong>Sản phẩm  này đang hết hàng !</strong>');
                return;
            };
            var tableIndex = _.findIndex(vm.$root.sources, {
                _id: vm.options.activeTable
            });
            if (tableIndex == -1) return;
            if( vm.options.chooseNumber ){
                vm.$root.$refs.keyboard.show('',  (quantity) => {
                    var num = parseInt(quantity);
                    if (num != '' && num > 0) {
                        vm.options.loadingAddProduct = true;
                        $.post("/admin/sales/pos/postAddProductToTable", {
                            source_id: vm.$root.sources[tableIndex]._id,
                            product_id: item._id,
                            quantity: num,
                        }, function (res) {
                            vm.loading = false;
                            if (res.status == 403) return;
                            if (res.error == false) {
                                var productIndex = _.findIndex(vm.$root.sources[tableIndex].products , { _id : res.data._id});
                                if( productIndex >= 0){
                                    vm.$set(vm.$root.sources[tableIndex].products ,productIndex , res.data);
                                }else{
                                    vm.$root.sources[tableIndex].products.push(res.data);
                                }
                                vm.$nextTick(function(){
                                    vm.$root.activeItemProduct(res.data._id , true);
                                })
                                if( res.hasOwnProperty('inventory')){
                                    vm.$root.updateProductQuantity(res.inventory);
                                    socket.emit('pos_user_update_product_quantity' , res.inventory);
                                }

                            }else{
                                $.dialog(res.message);
                            }
                        }).fail(function () {
                            vm.loading = false;
                        }).always(function () {
                            vm.options.loadingAddProduct = false;
                        });
                    }
                });
            }else{
                vm.options.loadingAddProduct = true;
                $.post("/admin/sales/pos/postAddProductToTable", {
                    source_id: vm.$root.sources[tableIndex]._id,
                    product_id: item._id,
                    quantity: 1,
                }, function (res) {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        var productIndex = _.findIndex(vm.$root.sources[tableIndex].products , { _id : res.data._id});
                        if( productIndex >= 0){
                            vm.$set(vm.$root.sources[tableIndex].products ,productIndex , res.data);
                        }else{
                            vm.$root.sources[tableIndex].products.push(res.data);
                        }
                        vm.$nextTick(function(){
                            vm.$root.activeItemProduct(res.data._id , true);
                        })

                        if( res.hasOwnProperty('inventory')){
                            vm.$root.updateProductQuantity(res.inventory);
                            socket.emit('pos_user_update_product_quantity' , res.inventory);
                        }
                        
                    }
                }).fail(function () {}).always(function () {
                    vm.options.loadingAddProduct = false;
                });
            }
        }
    },
    computed : {
        list: function () {
            var vm = this;
            var keyword = helper.convertCharacters(this.options.keywordProduct);
            var active = 0;
            var arr = vm.data.filter(function (item) {
                var checkGroup = true;
                var checkKeyword = true;
                var checkEmpty = true;
                var checkState = true;
                
                if (vm.options.category != 'all') {
                    checkGroup = item.category_id == vm.options.category ? true : false;
                }
                if (vm.options.autoHideProduct) {
                    if (item.available_quantity <= 0 && item.manage_inventory == true) {
                        checkEmpty = false;
                    }
                }
                if (item.available_quantity > 0 || item.manage_inventory == false) {
                    active++;
                }
                if( keyword != ''){
                    var name = helper.convertCharacters(item.name.toLowerCase());
                    checkKeyword = name.indexOf(keyword) >= 0 ? true : false;
                }
                switch(vm.options.state){
                    case 'processing':
                        if( item.processing == false){
                            checkState = false;
                        }
                        break;
                    
                    case  'nonprocessing':
                        if( item.processing == true){
                            checkState = false;
                        }
                        break;
                    
                    case 'quantity':
                        if( item.manage_inventory == true){
                            if( item.available_quantity  == 0){
                                checkState = false;
                            }
                        }
                        break;
                    
                    case 'nonquantity':
                        if( item.manage_inventory == true){
                            if( item.available_quantity  > 0){
                                checkState = false;
                            }
                        }
                        break;
                    
                }
                return checkGroup && checkEmpty && checkKeyword;
            });
            return {
                data : arr,
                active : active,
                total : vm.data.length
            }
        }
    }
})
Vue.component('tab-chiefs' ,{
    template : `
    <div class="box-chief">
        <div class="box-chief-left">
            <div class="box">
                <div class="box-header">
                    <div class="head-title">Bếp đã chế biến xong</div>
                </div>
                <div class="box-body">
                   <div v-if="listChiefs.length" class="list-waiting-chief" style="overflow: hidden auto">
                        <ul class="list-group" >
                            <li class="list-group-item item-chief" v-for="(item , index) in  listChiefs">
                                <div class="item-image">
                                    <template v-if="item.image == ''">
                                        <img src="/resources/images/table/product.jpg">
                                    </template>
                                    <template v-else>
                                        <img :src="item.image" alt="" class="img-responsive">
                                    </template>
                                    
                                </div>
                                <div class="item-info">
                                    <div class="item-title"><strong>{{item.product_name }}</strong></div>
                                    <div class="item-info-row">
                                        <span class="icon">
                                            <img src="/resources/images/table/table3.png" alt="">
                                        </span>
                                        <span class="value">{{ item.source_name}}</span>
                                    </div>
                                    
                                    <div class="item-info-row">
                                        <span class="icon">
                                            <i class="far fa-clock"></i>
                                        </span>
                                        <timeago class="value" :time="item.updated_at"></timeago>
                                    </div>
                                </div>
                                <div class="item-quantity">
                                    <div class="mg-bottom-5">
                                        <div class="status success">Đã làm :  <strong>{{ item.quantity}}</strong></div>
                                    </div>
                                    <div v-if="item.status == 'clear'">
                                        <div class="status danger">Đã hủy bàn</div>
                                    </div>
                                    <div v-else>
                                        <div v-if="item.recive_quantity > 0" class="mg-bottom-5">
                                            <div class="status warning">Đã cung ứng :<strong>{{ item.recive_quantity}}</strong></div>
                                        </div>
                                        <div v-if="item.hasOwnProperty('has_cancel') && item.has_cancel > 0">
                                            <div class="status danger">Đã hủy : <strong>{{ item.has_cancel}}</strong></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item-actions">
                                    <template v-if="(item.quantity - item.recive_quantity) <= item.has_cancel">
                                        <a class="btn btn-default btn-remove" @click.stop.prevent="removeItem(item._id , 'success')">
                                            <i class="material-icons text-danger">delete</i>
                                        </a>
                                    </template>
                                    <template v-else>
                                        <a  class="btn  btn-success" @click.stop.prevent="_increase(item._id )">
                                            <i class="fas fa-chevron-right"></i>
                                        </a>
                                        <a  class="btn  btn-success" @click.stop.prevent="_increase(item._id , item.make_success - item.recive_quantity)">
                                            <i class="fas fa-chevron-double-right"></i>
                                        </a>
                                    </template>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-else class="box-empty" >
                        <div class="box-empty-wrap">
                            <p><i class="material-icons">shopping_basket</i></p> 
                            <p>Chưa có sản phẩm nào</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="box-chief-right">
            <div class="box">
                <div class="box-header">
                    <div class="head-title">Nơi cung ứng</div>
                    <div class="head-nav" >
                        <ul class="nav nav-groups" >
                            <li :class="{ active : group == 'all'}">
                                <a @click.stop.prevent="_changeGroup('all')">Tất cả</a>
                            </li>
                            <li v-for="item in groups" :class="{ active : group ==  item._id}">
                                <a @click.stop.prevent="_changeGroup(item._id)">{{item.name}}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="head-form-search">
                        <div class="form-group">
                            <input type="text" class="form-control" v-model.trim="keyword" placeholder="Nhập từ khóa cần tìm ..." />
                        </div>
                    </div>
                </div>
                <div class="box-body">
                   <div class="list-table-chiefs"  style="overflow: hidden auto">
                     
                            <div class="list-table-chiefs-wrap">
                                <template v-for="(item , index ) in listSources">
                                    <table-chief :active.sync="active" :table="item"></table-chief>
                                </template>
                            </div>
                            
                   </div>
                </div>
            </div>
        </div>
    </div>  
    `,
    props: {
        sources: {},
        data : {},
        options :{},
        user : {},
        groups: {}
    },
    data : function(){
        return {
            loading  : false,
            active : '',
            group: 'all',
            navbar : 'auto',
            keyword : '',
        }
    },
    methods :{
        _changeGroup: function(group){
            if( this.group != group ){
                this.group =group;
            }
        },
        _increase : function(id , quan){
            if( id == undefined   || this.loading ) return;
            var index = _.findIndex( this.data , { _id : id } );
            if( index ==  -1) return;
            var quantity =  quan == undefined ? 1 : quan;
            if(quantity  <= 0 ) return;
            $.post("/admin/sales/pos/postSuccessSupply", {
                _id: id ,
                quantity: quantity ,
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    var index = _.findIndex(this.data , { _id : res.chief._id});
                    if( index >= 0){
                        this.$set(this.data , index , res.chief);
                    }
                    if( res.hasOwnProperty('source_detail')){
                        this.$root.updateProductInSource(res.source_detail);
                    }
                    socket.emit('pos_user_supply',{
                        user : this.user,
                        chief : {
                            _id : res.chief._id,
                            recive_quantity : res.chief.recive_quantity,
                            updated_at : res.chief.updated_at,
                        }
                    })
                }
            }).fail(function () {}).always( () => {  this.loading = false});
        },
    },
    computed :{
        listChiefs :  function(){
            var vm = this, request = [] , waiting = [] , success = [];
            vm.data.forEach(function(item){
            
                var itemRequest = JSON.parse(JSON.stringify(item));
                var itemWaiting  = JSON.parse(JSON.stringify(item));
                var itemSuccess = JSON.parse(JSON.stringify(item));
                if( item.cancel_quantity == 0 ){
                    itemRequest['has_cancel'] = 0;
                    itemWaiting['has_cancel'] = 0;
                    itemSuccess['has_cancel'] = 0;
                    if( item.make_success == 0){
                        if( item.waiting_make == 0){
                            itemRequest['quantity'] = item.request_quantity;
                            request.push(itemRequest);
                        }else{
                            if( item.request_quantity >  item.waiting_make ){
                                itemRequest['quantity'] = item.request_quantity -  item.waiting_make;
                                request.push(itemRequest);
                            }
                            itemWaiting['quantity'] =item.waiting_make;
                            waiting.push(itemWaiting);
                        }
                    }else{
                        if( item.request_quantity >  item.waiting_make ){
                            itemRequest['quantity'] = item.request_quantity -  item.waiting_make;
                            request.push(itemRequest);
                        }
                        if( item.waiting_make > item.make_success ){
                            itemWaiting['quantity'] = item.waiting_make - item.make_success;
                            waiting.push(itemWaiting);
                        }
                        itemSuccess['quantity'] = item.make_success;
                        success.push(itemSuccess);
                    }
                }else{
                    itemRequest['has_cancel'] = 0;
                    itemWaiting['has_cancel'] = 0;
                    itemSuccess['has_cancel'] = 0;
                    itemSuccess['quantity'] = item.make_success;
                    if( item.make_success == 0){
                        if( item.waiting_make == 0){
                            itemRequest['quantity'] = item.request_quantity;
                            itemRequest['has_cancel'] = item.cancel_quantity;
                            request.push(itemRequest);
                        }else{
                            var quantity = item.request_quantity - item.waiting_make;
                            if( quantity > 0){
                                if( quantity  == item.cancel_quantity){
                                    itemRequest['quantity'] = quantity;
                                    itemRequest['has_cancel'] = quantity;
                                    request.push(itemRequest);
                                    itemWaiting['has_cancel'] = 0;
                                    itemWaiting['quantity'] = item.waiting_make;
                                    waiting.push(itemWaiting);

                                }else if( quantity > item.cancel_quantity){
                                    itemRequest['quantity'] = quantity;
                                    itemRequest['has_cancel'] = item.cancel_quantity;
                                    request.push(itemRequest);

                                    itemWaiting['quantity'] = item.waiting_make;
                                    itemWaiting['has_cancel'] = 0;
                                    waiting.push(itemWaiting);
                                }else{
                                    itemRequest['quantity'] = quantity;
                                    itemRequest['has_cancel'] = quantity;
                                    request.push(itemRequest);

                                    itemWaiting['quantity'] = item.waiting_make;
                                    itemWaiting['has_cancel'] = item.cancel_quantity - quantity;
                                    waiting.push(itemWaiting);
                                }   
                            }else{
                                itemWaiting['quantity'] = item.waiting_make;
                                itemWaiting['has_cancel'] = item.cancel_quantity;
                                waiting.push(itemWaiting);
                            }
                        }
                    }else{
                        var quantity = item.request_quantity - item.waiting_make;
                        if( quantity == 0){
                            itemWaiting['quantity'] = item.waiting_make - item.make_success;
                            if( item.cancel_quantity == item.waiting_make - item.make_success ){
                                itemWaiting['has_cancel'] = item.cancel_quantity;
                            }else if( item.cancel_quantity > item.waiting_make - item.make_success){
                                itemWaiting['has_cancel'] = item.waiting_make - item.make_success;
                                itemSuccess['has_cancel'] = item.cancel_quantity - (item.waiting_make - item.make_success);
                            }else{
                                // itemWaiting['has_cancel'] = item.waiting_make - item.make_success - item.cancel_quantity;
                                itemWaiting['has_cancel'] =  item.cancel_quantity;
                            }
                            if( itemWaiting['quantity'] > 0){
                                waiting.push(itemWaiting);
                            }
                            
                            success.push(itemSuccess);
                        }else{
                            itemRequest['quantity'] = item.request_quantity - item.waiting_make;
                            
                            if( item.cancel_quantity >= item.request_quantity - item.waiting_make ){
                                itemRequest['has_cancel'] = item.request_quantity - item.waiting_make;
                            }else{
                                itemRequest['has_cancel'] =  item.cancel_quantity;
                            }
                            request.push(itemRequest);
                            itemWaiting['quantity'] = item.waiting_make - item.make_success;
                            if( itemRequest['has_cancel'] < item.cancel_quantity){
                                var cancel = item.cancel_quantity - itemRequest['has_cancel'];
                                if( (item.waiting_make - item.make_success) >=  cancel){
                                    itemWaiting['has_cancel'] = cancel;
                                }else{
                                    itemWaiting['has_cancel'] = item.waiting_make - item.make_success;
                                    itemSuccess['has_cancel'] = cancel - itemWaiting['has_cancel'];
                                }
                            }
                            waiting.push(itemWaiting);
                            success.push(itemSuccess);
                        }
                        
                    }
                    return;
                    
                }
            });
            success = success.filter(function(item){
                var check = true;
                if( vm.active != ''){
                    if( item.source_id != vm.active){
                        check = false;
                    }
                }
                return( (item.quantity - item.recive_quantity) > item.has_cancel ) && check;
            })
            return success;
        },
        listSources : function(){
            var keyword = helper.convertCharacters(this.keyword.toLowerCase());
            return this.sources.filter((item)=>{
                var group = true;
                var user = true;
                var relation = true;
                var search = true;
                if( item.current_user != this.user._id ){
                    user = false;
                }
                if( item.relation_id != ''){
                    relation = false;
                }
                if( this.group != 'all'){
                    if( this.group != item.group_id){
                        group = false;
                    }
                }
                if( keyword != ''){
                    if( item.name_search.indexOf(keyword) == -1){
                        search = false;
                    }
                }
                return user && relation && search && group;
            })
        }
    },
    mounted : function(){
        
    }
})
Vue.component('table-chief' ,{
    template : `
        <div class="item-table " :class="{ 'is-active' : active == table._id}" >
            <div class="item-table-wrap" @click.stop.prevent="_onClick()">
                <div class="item-table-name">{{table.name}}</div>
                 <div class="item-table-icon">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAeCAYAAABe3VzdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZGE4MmIxMi0zZDhiLTkwNGUtOGQ5NC1mNWExYzBiNTZmZDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk3RjY2OUFDMTQ4MTFFODlBMTdEMTkzMkIzMTlBMUEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDk2ZjdiZTctZTljNi01NTQyLWIxNWItYTI4YTEwNDg1YjE4IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA5LTI2VDExOjU2OjU5KzA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wOS0yNlQxMTo1OTo1OSswNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wOS0yNlQxMTo1OTo1OSswNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjEzNzVmZWNlLWNjMTEtYjg0MC04MDllLWRkMjBkMDM5OTZmYiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2ZGE4MmIxMi0zZDhiLTkwNGUtOGQ5NC1mNWExYzBiNTZmZDUiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDk2ZjdiZTctZTljNi01NTQyLWIxNWItYTI4YTEwNDg1YjE4IiBzdEV2dDp3aGVuPSIyMDE4LTA5LTI2VDExOjU5OjU5KzA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pji//kwAAAEYSURBVFiF7ZWxSgNBEIa/EwmoTTwhRQQJmCoPk2aew0p8CkmlrzGND5PKQBC0EAx2Qpq1uF2Uc+9uj73gFvs1uxzD/h+7x0xhjCFljv5boIssGEsWjCV5weP6BxF5BcbAHjDACCgOkG1sRmEzPlX1slMQmNr19ABSdc5+7b15PsElcAI8ABPgFtgObQbMgBXwDtwAX76ioj5JRMRtn4Fr4ALYhaaqalCdiJTAB7BR1XlTXZPgCFhbwac+gj0oqV5rAyxUde8r8j2xw5kvBxZryvHSJuha0D3wNpjOD1Pgjo5W1yboWssj8BKa2uMfvKISbG1hIY36PCixP0HnJj9JsmAsWTCWLBjLn1mcGsnfYBaMJQvGkrzgN8iBNj3ZMh1GAAAAAElFTkSuQmCC"/>
                </div>
                <template v-if="table.state == 'booked'">
                    <div class="item-table-info text-center" v-html="info"></div>
                </template>
            </div>
        </div>
    `,
    props:{
        table : {},
        active : {}
    },
    methods:{
        _onClick : function(){
            if( this.active != this.table._id){
                this.$emit('update:active' , this.table._id);
            }else{
                this.$emit('update:active' , '');
            }
        },
        
    },
    computed :{
        info : function(){
            var request_quantity = 0;
            var recive_quantity = 0;
            if (this.table.products.length) {
                this.table.products.forEach(function (el) {
                    request_quantity += el.request_quantity;
                    recive_quantity += el.recive_quantity;
                });
                return '<strong>' + recive_quantity + '</strong>/' + request_quantity + ' món';
            }
            return 'Chưa chọn món';
        },
    }
})
Vue.component('tab-booking' ,{
    template : `
        <div class="table-order-container-full table-order-booking">
            <template v-if="loader">
                <div class="box">
                    <div class="box-loading" style="height:100%">
                        <svg class="circular" viewBox="25 25 50 50">
                            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                        </svg>
                    </div>
                </div>
            </template>
            <transition name="fade">
                <div  v-if="!loader" class="box ">
                    <div class="box-header">
                        <div class="box-header-left">
                            <ul class="nav nav-groups">
                                <li :class="{'active' : pagination.booking_status == 'all'}">
                                    <a @click.stop.prevent="pagination.booking_status = 'all'">Tất cả</a>
                                </li>
                                <li :class="{'active' : pagination.booking_status == 'wait'}">
                                    <a @click.stop.prevent="pagination.booking_status = 'wait'">Chưa nhận bàn</a>
                                </li>
                                <li :class="{'active' : pagination.booking_status == 'received'}">
                                    <a @click.stop.prevent="pagination.booking_status = 'received'">Đã nhận bàn</a>
                                </li>
                                <li :class="{'active' : pagination.booking_status == 'cancel'}">
                                    <a @click.stop.prevent="pagination.booking_status = 'cancel'">Đã hủy</a>
                                </li>
                            </ul>
                        </div>
                        <div class="box-header-right">
                            <a @click.stop.prevent="_showModalCreate()" class="btn btn-success btn-block"><i class="fas fa-plus"></i>&nbsp; Thêm mới</a>
                        </div>
                    </div>
                    <div class="box-body">
                        <div class="list-booking">
                            <div class="list-booking-head">
                                <div class="row">
                                    <div class="col-xs-12 text-right">
                                        <div class="inline-block inline-title">
                                            <p>Tìm thấy <strong>{{pagination.total_records}}</strong> phiếu đặt bàn theo yêu cầu .</p>
                                        </div>
                                        <div class="inline-block">
                                            <div class="keyword">
                                                <input type="text" v-model.trim="pagination.keyword" class="form-control" placeholder="Nhập từ khóa cần tìm ..." />
                                            </div>
                                        </div>
                                        <div class="inline-block">
                                            <time-picker v-model="pagination.day"></time-picker>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="list-booking-body">
                                <div class="table table-booking">
                                    <div class="table-head">
                                        <div class="row">
                                            <div class="col index">#</div>
                                            <div class="col center">
                                                <div class="col customer">Khách hàng</div>
                                                <div class="col phone">Số điện thoại</div>
                                                <div class="col time">Giờ đặt</div>
                                                <div class="col number-customer">SL khách</div>
                                                <div class="col quantity">SL món</div>
                                                <div class="col detail">Chi tiết</div>
                                                <div class="col state">Trạng thái</div>
                                                <div class="col user">Nhân viên</div>
                                            </div>
                                            <div class="col actions"></div>
                                        </div>
                                    </div>
                                    <div class="table-body">
                                        
                                            <template v-if="loading">
                                                <div class="box-loading" style="height:300px">
                                                    <svg class="circular" viewBox="25 25 50 50">
                                                        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                                                    </svg>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <template v-if="pagination.data.length">
                                                    <div class="row" v-for="(item , index) in pagination.data">
                                                        <div class="col index">{{(pagination.limit * (pagination.page - 1)) + index + 1}}</div>
                                                        <div class="col center">
                                                            <div class="col customer">{{item.customer_name}}</div>
                                                            <div class="col phone">{{item.customer_phone}}</div>
                                                            <div class="col time">{{item.set_time  | full-time}}</div>
                                                            <div class="col number-customer">
                                                                <span  class="status success">{{item.customer_quantity | money}} khách</span>
                                                            </div>
                                                            <div class="col quantity">
                                                                <span  class="status success">{{item.products.length | money}} món</span>
                                                            </div>
                                                            <div class="col detail">
                                                                <template v-if="item.sources_name.length">
                                                                    <span v-for="(s , i) in item.sources_name">
                                                                    {{s}}<template v-if="i < item.sources_name.length -1 ">, </template>
                                                                    </span>
                                                                </template>
                                                                <template v-else>Chưa chọn bàn</template>
                                                            </div>
                                                            <div class="col state">
                                                                <span v-if="item.booking_status == 'wait'"  class="status warning">Chờ nhận bàn</span>
                                                                <span v-else-if="item.booking_status == 'cancel'"  class="status danger">Đã hủy bàn</span>
                                                                <span v-else-if="item.booking_status == 'received'"  class="status success">Đã nhận bàn</span>
                                                            </div>
                                                            <div class="col user">{{item.user_name}}</div>
                                                        </div>
                                                        <div class="col actions ">
                                                            <template v-if="item.booking_status == 'cancel' || item.booking_status == 'received'">
                                                                <a  title="Thông tin đặt bàn" class="text-primary" @click.stop.prevent="_viewInfo(item._id)">
                                                                    <i class="material-icons">info</i>
                                                                </a>
                                                            </template>
                                                            <template v-else>
                                                                <a  title="Thông tin đặt bàn" class="text-primary" @click.stop.prevent="_edit(item._id)">
                                                                    <i class="material-icons">info</i>
                                                                </a>
                                                                <a  title="Hủy đặt bàn" class="text-danger" @click.stop.prevent="_remove(item._id)">
                                                                    <i class="material-icons">delete</i>
                                                                </a>
                                                                <a  title="Xác nhận khách nhận bạn" class="text-success" @click.stop.prevent="_confirmBooking(item)">
                                                                    <i class="material-icons">check_box</i>
                                                                </a>
                                                            </template>
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <h3 class="text-center pd-30 text-danger no-mg">Không tìm thấy dữ liệu</h3>
                                                </template>
                                            </template>
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="list-booking-foot"></div>
                        </div>
                        
                    </div>
                    <div class="box-footer">
                        <div class="limit-block">
                            <select2 class="form-control" :options="limits" v-model="pagination.limit"></select2>
                        </div>
                        <div class="pagination-block">
                            <pagination :total="pagination.total" :current="pagination.page" :change="_changePage"></pagination>
                        </div>
                    </div>
                </div>
            </transition>
            <template v-if="show">
                <div class="modal fade modal-booking"  ref="modal">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header ">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            </div>
                            <div class="modal-body" >
                                <ul class="nav nav-tabs hide">
                                    <li :class="{'active' : create.tab == 'info'}">
                                        <a @click.stop.prevent="create.tab ='info'" >Thông tin</a>
                                    </li>
                                    <li :class="{'active' : create.tab == 'product'}">
                                        <a @click.stop.prevent="create.tab ='product'" >Sản phẩm</a>
                                    </li>
                                </ul>
                                <ul class="stepy-header form-wizard-step">
                                    <li @click.stop.prevent="_prevStep()" :disabled="step == 'info'" class="stepy-btn ">
                                        <div><i class="material-icons">arrow_back</i></div>
                                        <span>Quay lại</span>
                                    </li>
                                    <li @click.stop.prevent="_changeStep('info')" class="stepy-item  stepy-first" :class="{ 'stepy-active' : step == 'info'}">
                                        <div>1</div>
                                        <span>Thông tin chung</span>
                                    </li>
                                    <li @click.stop.prevent="_changeStep('product')" class="stepy-item" :class="{ 'stepy-active' : step == 'product'}">
                                        <div>2</div>
                                        <span>Sản phẩm</span>
                                    </li>
                                    <li @click.stop.prevent="_changeStep('complete')" class="stepy-item stepy-last" >
                                        <div><i class="material-icons">done</i></div>
                                        <span>Hoàn tất</span>
                                    </li>
                                    <li @click.stop.prevent="_nextStep()" class="stepy-btn">
                                        <div><i class="material-icons">arrow_forward</i></div>
                                        <span>Tiếp theo</span>
                                    </li>
                                </ul>
                                <div class="stepy-content">
                                    <vue-form class="form-horizontal" :state="create.state" @submit.stop.prevent="_onSubmit()" v-if="step == 'info'">
                                        <div class="form-group">
                                            <label  class="col-sm-4 control-label">Thông tin KN <span class="text-danger">*</span></label>
                                            <div class="col-sm-8 form-search-customer">
                                                <div class="form-search-customer-wrap" ref="form_search_customer">
                                                    
                                                    <template v-if="_.has(create.customer , '_id')">
                                                        <div class="item-customer">
                                                            <strong>{{create.customer.name | name}} - {{ create.customer.phone}}</strong>
                                                            <a href="#" @click.stop.prevent="_removeCustomer()">chọn lại</a>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <suggestion 
                                                            v-model="create.keywordCustomer" 
                                                            :options="{debounce: 500  ,inputClass: 'form-control' ,'placeholder' : 'Tìm khách hàng'}"
                                                            :change="_changeCustomerSearch" 
                                                            :select="_selectCustomerSearch"
                                                            class="customer-search-results" >
                                                            <template slot="item" scope="data" >
                                                                {{data.data.name | name}} - {{data.data.phone}}
                                                            </template>
                                                        </suggestion>
                                                        <div class="customer-search-btn">
                                                            <button class="btn btn-success" @click.stop.prevent="_createCustomer()">
                                                                <i class="fal fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </template>
                                                    <template v-if="!_.has(create.customer , '_id') && _.has(create.state , '$submitted')">
                                                        <code v-if="create.state.$submitted ==  true">
                                                            Chưa nhập tên khách hàng
                                                        </code>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label  class="col-sm-4 control-label">Ngày đặt lịch : <span class="text-danger">*</span></label>
                                            <div class="col-sm-8">
                                                <time-picker :timepicker="true" name="set_time" v-model="create.set_time" placeholder="Chọn ngày đặt" ></time-picker>
                                                <validate name="set_time" >
                                                    <input required v-model="create.set_time" name="set_time" hidden class="hide" />
                                                </validate>
                                                <field-messages name="set_time" show="$dirty || $submitted">
                                                    <code slot="required">Chưa chọn ngày đặt</code>
                                                </field-messages>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label  class="col-sm-4 control-label">Bàn đặt :</label>
                                            <div class="col-sm-8">
                                                <select2 :multiple="true" placeholder="Chọn bàn"  :options="sources" v-model="create.sources" class="form-control"> </select2>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label  class="col-sm-4 control-label">Số lượng khách : </label>
                                            <div class="col-sm-8">
                                                <input-spinner class="input-group-spinner" v-model="create.customer_quantity" :min="1"></input-spinner>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label  class="col-sm-4 control-label">Tiền tạm ứng : </label>
                                            <div class="col-sm-8">
                                                <item-keyboard class="form-control" v-model="create.deposit_cost"></item-keyboard>
                                            </div>
                                        </div>
                                    </vue-form>
                                    <div class="form-horizontal"  v-if="step == 'product'">
                                        <div class="text-right mg-bottom-20">
                                            <button @click.stop.prevent="_chooseProduct()" class="btn btn-primary">Thêm sản phẩm</button>
                                        </div>
                                        <div class="item-table item-table-choose-product">
                                            <div class="item-table-header">
                                                <div class="item-row">
                                                    <div class="item-col item-index">#</div>
                                                    <div class="item-col item-name">Sản phẩm</div>
                                                    <div class="item-col item-quantity">Số lượng</div>
                                                    <div class="item-col"></div>
                                                </div>
                                            </div>
                                            <div class="item-table-body">
                                                <template v-if="create.products.length">
                                                    <div class="item-row" v-for="(item , index) in create.products">
                                                        <div class="item-col item-index">{{index + 1}}</div>
                                                        <div class="item-col item-name">{{item.name}}</div>
                                                        <div class="item-col item-quantity">
                                                            <input-spinner v-model="item.quantity" :min="1"></input-spinner>
                                                        </div>
                                                        <div class="item-col item-action">
                                                            <a href="#" class="text-danger" @click.stop.prevent="create.products.splice(index, 1)">
                                                                <i class="material-icons">delete</i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div class="pd-20">
                                                        <h4 class="text-danger text-center"> Chưa có sản phẩm !</h4>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade modal-booking"  ref="modalChooseProduct">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            </div>
                            <div class="modal-body">
                                <div class="row mg-bottom-20">
                                    <div class="col-xs-6">
                                        <label>Danh mục sản phẩm</label>
                                        <select2 v-model="filter.category" class="form-control" :options="filter.categories"></select2>
                                    </div>
                                    <div class="col-xs-6">
                                        <label>Từ khóa</label>
                                        <div class="form-search">
                                            <input type="text" class="form-control" v-model="filter.keyword" placeholder="Nhập từ khóa ..." />
                                        </div>
                                    </div>
                                </div>
                                <div class="table table-modal-choose-product ">
                                    <div class="table-head">
                                        <div class="row">
                                            <div class="col checked">&nbsp;</div>
                                            <div class="col index">#</div>
                                            <div class="col name">Sản phẩm</div>
                                            <div class="col quantity">Số lượng</div>
                                        </div>
                                    </div>
                                    <div class="table-body"  >
                                        
                                            <div class="row" :class="{'is-active' : checkBox.indexOf(item._id) >= 0}" v-for="(item , index) in listProducts" @click="_onClickItem(item._id , $event )">
                                                <div class="col checked">
                                                    <input v-model="checkBox" type="checkbox" :value="item._id" />
                                                </div>
                                                <div class="col index">{{index + 1}}</div>
                                                <div class="col name">{{item.name}}</div>
                                                <div class="col quantity">
                                                    {{item.onhand_quantity}}
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div class="text-right mg-top-20 mg-bottom-10">
                                    <a @click.stop.prevent="_onPushProduct()" class="btn btn-primary" :disabled="!checkBox.length">
                                        <i class="far fa-check"></i>&nbsp;&nbsp;Thêm <strong v-if="checkBox.length">{{checkBox.length}}</strong> sản phẩm đã chọn
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="view.show">
                <div class="modal fade modal-booking"  ref="modalViewInfo">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header ">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            </div>
                            <div class="modal-body" >
                                <div class="form-horizontal" >
                                    <div class="form-group">
                                        <label  class="col-sm-4 control-label">Thông tin KN </label>
                                        <div class="col-sm-8 form-search-customer">
                                            <div class="form-search-customer-wrap" >
                                                <div class="item-customer">
                                                    <strong>{{view.customer.name | name}} - {{ view.customer.phone}}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label  class="col-sm-4 control-label">Ngày đặt lịch :</label>
                                        <div class="col-sm-8">
                                            <input   class="form-control" v-model="view.set_time"  readonly/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label  class="col-sm-4 control-label">Bàn đặt : </label>
                                        <div class="col-sm-8">
                                            <select2 :disabled="true" :multiple="true" placeholder="Chưa chọn bàn"  :options="sources" v-model="view.sources" class="form-control"> </select2>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label  class="col-sm-4 control-label">Số lượng khách : </label>
                                        <div class="col-sm-8">
                                            <input   class="form-control" v-model="view.customer_quantity"  readonly/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label  class="col-sm-4 control-label">Tiền tạm ứng : </label>
                                        <div class="col-sm-8">
                                            <input   class="form-control" v-model="view.deposit_cost"  readonly/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label  class="col-sm-4 control-label">Lý do hủy bàn : </label>
                                        <div class="col-sm-8">
                                            <textarea v-model="view.reason_cancel"  class="form-control" readonly ></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="item-table item-table-choose-product" v-if="view.products.length">
                                            <div class="item-table-header">
                                                <div class="item-row">
                                                    <div class="item-col item-index">#</div>
                                                    <div class="item-col item-name">Sản phẩm</div>
                                                    <div class="item-col item-quantity">Số lượng</div>
                                                    <div class="item-col"></div>
                                                </div>
                                            </div>
                                            <div class="item-table-body">
                                                <template v-if="view.products.length">
                                                    <div class="item-row" v-for="(item , index) in view.products">
                                                        <div class="item-col item-index">{{index + 1}}</div>
                                                        <div class="item-col item-name">{{item.name}}</div>
                                                        <div class="item-col item-quantity">
                                                            <span class="status success">{{item.quantity}}</span>
                                                        </div>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="confirm.show">
                <modal-confirm-booking  :confirm.sync="confirm" :reload="_load" ></modal-confirm-booking>
            </template>
        </div>
    `,
    props:{
        options : {},
        products: {},
        sources : {},
        categories : {}
    },
    data : function(){
        return {
            limits: [
                {id : 10 , text : 10},
                {id : 20 , text : 20},
                {id : 30 , text : 30},
                {id : 50 , text : 50},
                {id : 100 , text : 100},
            ],
            pagination :{
                
                limit : 10,
                page: 1,
                data : [],
                booking_status : 'all',
                status : 'publish',
                total : 0,
                total_records : 0,
                day: parseInt(new Date().getTime() / 1000),
                keyword : '',
            },
            show: false,
            create :{
                keywordCustomer: '',
                state: {},
                customer : '',
                tab : 'info',
                name : '', 
                phone : '', 
                set_time : '',
                customer_quantity : 1,
                deposit_cost : '',
                products : [],
                sources : [],
                mode : 'create'
            },
            view  : {
                customer : '', 
                set_time : '',
                customer_quantity : '',
                deposit_cost : '',
                products : '',
                sources : '',
                reason_cancel : '',
                show : false,
            },
            confirm: {
                show : false,
                _id : '',
                sources : [],
                selected : [],
            },
            loadingConfirm : false,
            loading : false,
            loader: true,
            step : 'info',
            checkBox : [],
            timeout : null ,
            filter :{
                category : '',
                keyword : '',
                categories : [],
            }
        }
    },
    methods :{
        _load : function(){
            if( this.loading) return;
            this.loading = true;
            $.post("/admin/sales/pos/postLoadBookList", {
                page : this.pagination.page,
                status : this.pagination.status,
                booking_status : this.pagination.booking_status,
                keyword : this.pagination.keyword,
                day : this.pagination.day,
                limit : this.pagination.limit,
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                   this.pagination.data = res.data;
                   this.pagination.limit = res.limit;
                   this.pagination.total = res.total;
                   this.pagination.total_records = res.total_records;
                   if( this.loader){
                        this.loader = false;
                   }
                }
            }).fail(function () {}).always( ()=>{
                this.loading = false;
            });
        },
        _changePage : function(value){
            this.pagination.page = value;
            this._load();
        },
        _viewInfo : function(id){
            $.post("/admin/sales/pos/getUpdateBookingTable", {
                _id :id, 
            },  (res) => {
                console.log(res);
                if (res.status == 403) return;
                if (res.error == false) {
                    var  time = moment(new Date(res.booking.set_time * 1000)).format('HH:mm DD/MM/YYYY')
                    this.view = {
                        customer : res.booking.customer, 
                        set_time : time,
                        customer_quantity : res.booking.customer_quantity,
                        deposit_cost : res.booking.deposit_cost,
                        products : res.booking.products,
                        sources : res.booking.sources,
                        reason_cancel: res.booking.reason_cancel,
                        show : true,
                    };
                    this.$nextTick(function(){
                        $(this.$refs.modalViewInfo).modal('show');
                        $(this.$refs.modalViewInfo).on('hidden.bs.modal',()=>{
                            this.view  = {
                                customer : '', 
                                set_time : '',
                                customer_quantity : '',
                                deposit_cost : '',
                                products : '',
                                sources : '',
                                reason_cancel : '',
                                show : false,
                            }
                        });
                    });
                    
                }
            }).fail(function () {}).always( ()=>{
                
            });
        },
        _edit : function(id){
            $.post("/admin/sales/pos/getUpdateBookingTable", {
                _id :id, 
            },  (res) => {
                console.log(res);
                if (res.status == 403) return;
                if (res.error == false) {
                    
                    this.create = {
                        state: {},
                        keywordCustomer: '',
                        _id : id,
                        customer : res.booking.customer, 
                        set_time : res.booking.set_time,
                        customer_quantity : res.booking.customer_quantity,
                        deposit_cost : res.booking.deposit_cost,
                        products : res.booking.products,
                        sources : res.booking.sources,
                        mode : 'edit'
                    };
                    this.show = true;
                    this.$nextTick(function(){
                        $(this.$refs.modal).modal('show');
                        $(this.$refs.modal).on('hidden.bs.modal',()=>{
                            this.create  = {
                                state: {},
                                keywordCustomer: '',
                                tab : 'info',
                                customer : '', 
                                set_time : '',
                                customer_quantity : 1,
                                deposit_cost : '',
                                products : [],
                                sources : [],
                                mode : 'create'
                            }
                            this.show = false;
                        });
                        $(this.$refs.modalChooseProduct).on('hidden.bs.modal' ,()=>{
                            $(this.$refs.modal).addClass('in');
                            $('body').addClass('modal-open');
                        })
                    });
                }
            }).fail(function () {}).always( ()=>{
                
            });
        },
        _remove : function( id ){
            var dismiss = true;
            var jc = $.confirm({
                title: '',
                content: `
                    <form >
                        <div class="text-center "><h4 class="mg-top-0 mg-bottom-10">Hủy bàn đã đặt</h4></div>
                        <label>Lý do</label>
                        <textarea class="form-control" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
                    </form>
                `,
                type : 'green',
                backgroundDismiss : function(){
                    return 'backdrop';
                },
                buttons: {
                    backdrop : {
                        isHidden : true,
                        action : ()=>{return dismiss}
                    },
                    formSubmit : {
                        text : 'Đồng ý',
                        btnClass : 'btn-success',
                        action : ()=>{
                            var reason = jc.$content.find('textarea').val().trim();
                            if( reason ==''){
                                $.dialog('Chưa nhập lý do hủy bàn');
                                return false;
                            }
                            dismiss = false;
                            jc.showLoading(true);
                            return new Promise((resolve, reject)=>{
                                $.post("/admin/sales/pos/postCancelBookingList", {
                                    _id : id,
                                    reason : reason
                                },  (res) => {
                                    if (res.status == 403) return;
                                    if (res.error == false) {
                                        this._load();
                                        resolve(true);
                                    }
                                }).fail(function () {resolve(false);}).always( ()=>{
                                    
                                });
                            })
                        }
                    },
                    close : {
                        text : 'Đóng',
                        btnClass : 'btn-default',
                    }
                },
                onContentReady: function () {
                    this.$content.find('form').on('submit',  (e)=>{
                        e.preventDefault();
                        this.$$formSubmit.trigger('click'); 
                    });
                    this.$content.find('textarea').focus();
                }
            });
        },
        _confirmBooking : function(item){
            $.post("/admin/sales/pos/getUpdateBookingTable", {
                _id :item._id, 
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    this.confirm = {
                        _id: res.booking._id,
                        sources : [],
                        selected : [],
                        products : res.booking.products,
                        customer : res.booking.customer,
                        show : true,
                    }
                    var valid = true;
                    var temp = [];
                    var sources = (res.booking.sources == '' || res.booking.sources == null ) ? [] : res.booking.sources;
                    this.sources.forEach((table)=>{
                        if( sources.indexOf(table._id) >= 0   ) {
                            this.confirm.sources.push(table);
                            if(table.state == 'booked' || (table.relation_id != null && table.relation_id != '')){
                                valid = false;
                                temp.push(table);
                            }
                        }
                    });
                    if( valid == false){
                        var message = 'Hiện tại ';
                        temp.forEach(function(e , index){
                            if(index > 0){
                                message += ', '+e.name;
                            }else{
                                message += e.name ;
                            }
                        })
                        message  += ' đang có khách . Vui lòng thanh toán hoặc chọn bàn khác !';
                    }else{
                        if( this.confirm.sources.length){
                            this.confirm.selected = JSON.parse(JSON.stringify(this.confirm.sources));
                        }
                    }
                    this.$nextTick(function(){
                        if( valid == false){
                            setTimeout(function() {
                                $.dialog(message);
                            }, 500);
                        }
                        
                        
                    })
                    
                }
            }).fail(function () {}).always( ()=>{
                
            });
            
        },
        
        _showModalCreate : function(){
            this.show = true;
            this.$nextTick(function(){
                $(this.$refs.modal).modal('show');
                $(this.$refs.modal).on('hidden.bs.modal',()=>{
                    this.step = 'info';
                    this.show = false;
                    this.create = {
                        state: {},
                        keywordCustomer: '',
                        customer : '',
                        set_time : '',
                        customer_quantity : 1,
                        deposit_cost : '',
                        products : [],
                        sources : [],
                        mode : 'create'
                    };
                });
                $(this.$refs.modalChooseProduct).on('hidden.bs.modal' ,()=>{
                    $(this.$refs.modal).addClass('in');
                    $('body').addClass('modal-open');
                })
            });
        },
        _changeCustomerSearch: function (query) {
            if (query.trim().length === 0) {
                return null
            }
            query = helper.convertCharacters(query);
            query = query.toLowerCase();
            return new Promise((resolve)=>{
                $.post("/admin/sales/pos/postFindCustomersByPhoneOrName", {
                    keyword: query,
                }, (res)=> {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        resolve(res.data);
                    }
                }).fail(()=>{}).always(()=>{});
                
            });
        },
        _selectCustomerSearch: function (item) {
            this.create.customer = item;

        },
        _createCustomer : function(){
            this.$root.createCustomer((res)=>{
                this._selectCustomerSearch(res);
            })
        },
        _removeCustomer: function () {
            this.create.customer = null;
            this.$nextTick(function(){
                $(this.$refs.form_search_customer).find('input').select();
            })
        },
        _onSubmit: function(){
            if( this.create.$valid  ){

            }
        },
        _nextStep : function(){
            if( this.step == 'info'){
                this._validate().then( res =>{
                    if( res == true){
                        this.step = 'product';
                    }
                })
            }else if( this.step =='product'){
                this._validate().then( res =>{
                    if( res == true){
                        this._complete();
                    }
                })
            }
        },
        _validate: function(){
            return new Promise((resolve , reject)=>{
                this.create.state.$submitted = true;
                if(this.create.state.$valid && _.has(this.create , 'customer._id')){
                    resolve(true);
                }else{
                    resolve(false);
                }
            })
        },
        _prevStep : function(){
            if( this.step =='product'){
                this.step = 'info';
            }
        },
        _changeStep : function(item){
            if( item == 'info'){
                this.step = 'info';
            }else if( item =='product'){
                this._validate().then( res =>{
                    if( res == true){
                        this.step = 'product';
                    }
                })
            }else if(item =='complete'){
                this._validate().then( res =>{
                    if( res == true){
                        this._complete();
                    }
                })
            }   
        },
        _complete : function(){
            this._validate().then( resolve =>{
                if( resolve == true){
                    var message = '';
                    var url = '';
                    var info = {
                        customer_id : this.create.customer._id, 
                        set_time : this.create.set_time,
                        customer_quantity : this.create.customer_quantity,
                        sources : this.create.sources,
                        deposit_cost : this.create.deposit_cost,
                        products : this.create.products,
                        warehouse_id : this.$root.warehouse_id,
                    }
                    if( this.create.mode == 'edit'){
                        info['_id'] = this.create._id;
                        url = '/admin/sales/pos/postUpdateBookingTable';
                        message = '<h4>Bạn có muốn cập nhật phiếu đặt bàn  ?</h4>';
                    }else{
                        message  = '<h4>Bạn có muốn tạo phiếu đặt bàn  ?</h4>';
                        url = '/admin/sales/pos/postCreateBookingTable';
                    }
                    
                    $.confirm({
                        title: '',
                        content: message,
                        buttons: {
                            save : {
                                text : 'Đồng ý',
                                btnClass : 'btn-success',
                                action : ()=>{
                                    this.$root.showLoader();

                                    $.post(url,info, (res) => {
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            this._load();
                                           $(this.$refs.modal).modal('hide');
                                        }
                                    }).fail(function () {}).always( ()=>{
                                        this.$root.closeLoader(500);
                                    });
                                }
                            },
                            close : {
                                text : 'Đóng',
                                btnClass : 'btn-default',
                            }
                        },
                    });
                    
                }
            })
        },
        checkDate : function(value){
            return (value == '' || value == null) ? true : false;
        },
        _chooseProduct: function(){
            this.checkBox = [];
            $(this.$refs.modal).removeClass('in');
            $(this.$refs.modalChooseProduct).modal('show');
            
        },
        _onPushProduct: function(){
            if( this.checkBox.length ){
                this.products.forEach((item)=>{
                    var id = item._id;
                    if( this.checkBox.indexOf(id) >= 0){
                        var index = _.findIndex(this.create.products , { _id : id });
                        if(index == - 1){
                            this.create.products.push({
                                _id : item._id,
                                quantity : 1,
                                name : item.name
                            })
                        }
                    }
                })
                $(this.$refs.modalChooseProduct).modal('hide');
            }
        },
        _onClickItem : function(id , $event){
            var tags = $event.target.tagName.toLowerCase();
            if( tags != 'a' && tags != 'i' && tags != 'span' && tags != 'input' ){
                var index = this.checkBox.indexOf(id);
                if( index == -1 ){
                    this.checkBox.push(id);
                }else{
                    this.checkBox.splice(index, 1);
                }
            }
        },
        
    },
    watch :{
        'pagination.keyword' : function(value){
            clearTimeout(this.timeout);
            this.timeout =  setTimeout(()=>{
                if( this.pagination.page != 1){
                    this.pagination.page = 1;
                }
                this._load();
            }, 1000);
        },
        'pagination.day' : function(value){
            if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
        },
        'pagination.limit' : function(value){
            if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
        },
        'pagination.status' : function(value){
            if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
        },
        'pagination.booking_status' : function(value){
            if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
        }
    },
    computed : {
        listProducts : function(){
            var keyword = helper.convertCharacters(_.trim(this.filter.keyword)).toLowerCase();

            return this.products.filter((item)=>{
                var checkKeyword = true;
                var checkCate = true;
                if( keyword != ''){
                    var name = helper.convertCharacters(_.trim(item.name)).toLowerCase();
                    if( name.indexOf(keyword) == -1){
                        checkKeyword = false;
                    }
                }
                if( this.filter.category != 'all' && this.filter.category != '' && this.filter.category != null ){
                    if( item.category_id != this.filter.category){
                        checkCate = false;
                    }
                }
                return checkKeyword && checkCate;
            });
        },

    },
    created : function(){
        this.filter.categories = JSON.parse(JSON.stringify(this.categories));
        this.filter.categories.unshift({
            _id : 'all',
            text : 'Tất cả danh mục'
        })
    },
    mounted : function(){
        this._load();
    }
})
Vue.component('input-spinner', {
    template : `
        <div class="input-group">
            <span class="input-group-btn">
                <button @click.stop.prevent="_decrease()" class="btn btn-default" type="button"><i class="fal fa-minus"></i></button>
            </span>
            <div class="form-control"  @click.stop.prevent="_onkeyboard()">
                {{num | money}}
            </div>
            <span class="input-group-btn">
                <button  @click.stop.prevent="_increase()" class="btn btn-default" type="button"><i class="fal fa-plus"></i></button>
            </span>
        </div>
    `,
    props:{
        value :{},
        max : {
            default : 999999999999,
        },
        min : {
            default : 0,
        }
    },
    data : function(){
        return {
            num : this.value,
        }
    },
    methods:{
        _increase : function(){
            if( this.num < this.max){
                this.num += 1;
            }
        },
        _decrease : function(){
            if( this.num > this.min){
                this.num -= 1;
            }
        },
        _onkeyboard : function(){
            this.$root.$refs.keyboard.show(this.num,  (res) => {
                if (parseInt(res) > this.min) { 
                    this.num = parseInt(res);
                }
            }, this.max);
        },
    },
    watch : {
        'num' : function(value){
            this.$emit('input' , value);
        },
        value : function(value){
            if( this.num != value){
                this.num = value;
            }
        }
    }
})
Vue.component('item-keyboard' ,{
    template : '<span @click.stop.prevent="_onClick">{{value | money}}</span>',
    props:{
        value :{}
    },
    data : function(){
        return {

        }
    },
    methods:{
        _onClick : function(){
            this.$root.$refs.keyboard.show(this.value , (res)=>{
                if( parseInt(res) > 0){
                    this.$emit('input' , res);
                }
            })
        }
    },
})
Vue.component('modal-confirm-booking',{
    template : `
        <div class="modal fade modal-confirm-booking"  >
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body" >
                        <div class="box">
                            <template v-if="filter.tab == 'source'">
                                <div class="box-head">
                                    <div class="box-head-left">
                                        <ul class="nav nav-groups" >
                                            <li :class="{ active : filter.group == 'all'}">
                                                <a @click.stop.prevent="changeGroup('all')">Tất cả</a>
                                            </li>
                                            <li v-for="item in $root.groups" :class="{ active : filter.group ==  item._id}">
                                                <a @click.stop.prevent="changeGroup(item._id)">{{item.name}}</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="box-head-right">
                                        <div class="form-search">
                                            <input type="text" class="form-control" placeholder="Nhập từ khóa cần tìm" v-model.trim="filter.keywordSource" />
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="list-tables-wrapper" >
                                        <template v-if="filterSources.length">
                                            <template v-for="(table, index) in filterSources">
                                                <div class="item_table" :class="_class(table)" @click.stop.prevent="_onClick(table)">
                                                    <div class="item_table_wrap">
                                                        <img :src="$root.images.square" class="item_table_grid" />
                                                        <div class="item_table_name">{{table.name}}</div>
                                                    </div>
                                                </div>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <div class="text-center pd-50">
                                                <h3>Không tìm thấy dữ liệu </h3>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                            <template v-else-if="filter.tab == 'product'">
                                <div class="box-body-product">
                                    <div class="box-body-product-left">
                                        <div class="panel">
                                            <div class="panel-head">
                                                <ul class="nav nav-groups" >
                                                    <li :class="{ active : filter.category == 'all'}">
                                                        <a @click.stop.prevent="changeCategory('all')">Tất cả</a>
                                                    </li>
                                                    <li v-for="item in $root.categories" :class="{ active : filter.category ==  item._id}">
                                                        <a @click.stop.prevent="changeCategory(item._id)">{{item.name}}</a>
                                                    </li>
                                                </ul>
                                                <div class="form-search">
                                                    <input type="text" class="form-control" v-model.trim="filter.keywordProduct" placeholder="Nhập từ khóa cần tìm .."/>
                                                </div>
                                            </div>
                                            <div class="panel-body">
                                                <div class="list-wrap" style="overflow: hidden auto">
                                                    <div class="list-products" v-if="filterProducts.length">
                                                        <div class="item-product" v-for="(item, index) in filterProducts" >
                                                            <div class="item-product-wrap" @click.stop.prevent="_add(item._id)">
                                                                <div class="item-product-quantity" v-if="item.manage_inventory">
                                                                    <div class="badge">{{item.available_quantity}}</div>
                                                                </div>
                                                                <div class="item-product-image">
                                                                    <img :src="$root.images.square" class="item-product-grid" />
                                                                    <template v-if="_.has(item ,'image.path')">
                                                                        <div class="item-product-image-wrap">
                                                                            <img :src="'/'+item.image.path" class="img-responsive" />
                                                                        </div>
                                                                    </template>
                                                                    <template v-else>
                                                                        <div class="item-product-image-wrap empty">
                                                                            <i class="material-icons">
                                                                                camera
                                                                            </i>
                                                                        </div>
                                                                    </template>
                                                                </div>
                                                                <div class="item-product-title">
                                                                    {{item.name}}
                                                                </div>
                                                                <div class="item-product-price">
                                                                    {{item.price_sale | money}}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="box-empty" v-else>
                                                        <div class="box-empty-wrap">
                                                            <p><i class="material-icons">shopping_basket</i></p> 
                                                            <p>Chưa có sản phẩm nào</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="box-body-product-right">
                                        <div class="panel">
                                            <div class="panel-head">
                                                <div class="panel-head-left">
                                                    Sản phẩm đã chọn {{confirm.products.length}}
                                                </div>
                                                <div class="panel-head-right">
                                                    <div class="form-search">
                                                        <input type="text" class="form-control" v-model="filter.keywordProduct2" placeholder="Nhập từ khóa cần tìm ..."/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="panel-body">
                                                <div class="table-box-scroll"  style="overflow: hidden auto">
                                                    <template v-if="listProductSelected.length">
                                                        <table class="table">
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Tên món</th>
                                                                    <th>Số lượng</th>
                                                                    <th class="text-nowrap">Thành tiền</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="(item, index) in listProductSelected">
                                                                    <td><code>{{ index+1 }}</code></td>
                                                                    <td>{{ item.name }}</td>
                                                                    <td>
                                                                        <item-spinner :id="item._id" v-model="item.quantity"></item-spinner>
                                                                        <template v-if="_.has(item , 'product._id')">
                                                                            <span v-if="item.product.manage_inventory && item.quantity > item.product.onhand_quantity"  class="status warning" >
                                                                                Không đủ số lượng
                                                                            </span>
                                                                        </template>
                                                                    </td>
                                                                    <td>{{ item.product.price_sale*item.quantity | money }}</td>
                                                                    <td><a @click.stop.prevent="_remove(item._id)"><i class="material-icons text-danger">close</i></a></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </template>
                                                    <template v-else>
                                                        <div class="box-empty">
                                                            <div class="box-empty-wrap">
                                                                <p><i class="material-icons">shopping_basket</i></p> 
                                                                <p>Chưa có sản phẩm nào</p>
                                                            </div>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <div class="box-foot">
                                <div class="box-foot-left">
                                    <div class="customer" >
                                        <label>khách hàng</label>
                                        <span  >
                                            <template v-if="_.has(confirm , 'customer.name')">
                                                {{confirm.customer.name}}
                                            </template>
                                            - 
                                            <template v-if="_.has(confirm , 'customer.phone')">
                                                {{confirm.customer.phone}}
                                            </template>
                                        </span>
                                        <template v-if="confirm.selected.length">
                                            <button v-for="item  in confirm.selected" class="btn btn-success">{{item.name}}</button>
                                        </template>
                                        <a  v-if="filter.tab == 'product'" @click.stop.prevent="filter.tab ='source'">
                                            Chọn lại
                                        </a>
                                    </div>
                                </div>
                                <div class="box-foot-right">
                                    <a class="btn btn-primary" v-if="filter.tab == 'source'" @click.stop.prevent="filter.tab ='product'">
                                        Chọn món
                                    </a>
                                    <a  class="btn btn-success" @click.stop.prevent="_save()">
                                        Xác nhận khách vào bàn
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props :{
        confirm :{},
        reload : {},
    },
    data(){
        return {
            loading : false,
            filter : {
                group : 'all',
                keywordSource: '',
                keywordProduct: '',
                keywordProduct2 : '',
                category : 'all',
                tab : 'source',
            },
            products: [],
        }
    },
    methods: {
        _class : function(table){
            if( table.relation_id != '' && table.relation_id != null) return 'booked';
            else {
                var index = _.findIndex(this.confirm.selected , {_id : table._id});
                if( index >= 0){
                    return 'is-active';
                }else{
                    if( table.state == 'booked') return 'booked';
                    else if(table.state == 'wait') return 'wait';
                }
            }                                                
        },
        _onClick : function(table){
            if( table.state == 'booked') {
                return;
            }
            if( table.relation_id  != null && table.relation_id != ''){
                return ;
            }
            var index = _.findIndex(this.confirm.selected , {_id : table._id});
            if( index >= 0){
                this.confirm.selected.splice(index, 1);
            }else{
                this.confirm.selected.push(table);
            }
        },
        _save: function () {
            if( this.confirm.selected.length == 0){
                $.dialog('Chưa chọn bàn !');
                return;
            }
            this.$root.comfirm('Xác nhận !', 'Xác nhận khách nhận bàn ?', {
                save: {
                    text: 'Xác nhận',
                    btnClass: 'btn-success',
                    keys: ['enter'],
                    action:  () => {
                        this.$root.showLoader();
                        $.post("/admin/sales/pos/postConfirmBookingList", {
                            booking_id :this.confirm._id, 
                            sources :this.confirm.selected, 
                            products :this.confirm.products, 
                        }, (res) => {
                            if (res.status == 403) return;
                            if (res.error == false) {
                                if( res.hasOwnProperty('data_merge')){
                                    if( res.data_merge.hasOwnProperty('source') ){
                                        var source = res.data_merge.source;
                                        var inventory = {};
                                        var relation = []
                                        if( res.hasOwnProperty('data_inventory')){
                                            if( res.data_inventory.length ){
                                                res.data_inventory.forEach((item)=>{
                                                    if( item.hasOwnProperty('detail')){
                                                        source.products.push(item.detail);
                                                    }
                                                    if( item.hasOwnProperty('inventory')){
                                                        for (var key in item.inventory) {
                                                            inventory[key] = item.inventory[key];
                                                        }
                                                    }
                                                });
                                                
                                                this.$root.updateProductQuantity(inventory);
                                                socket.emit('pos_user_update_product_quantity' , inventory);
                                            }
                                        }
                                        if(res.data_merge.hasOwnProperty('target')){
                                            if( res.data_merge.target.length ){
                                                res.data_merge.target.forEach((item)=>{
                                                    relation.push(item._id);
                                                })
                                            }
                                        }
                                        this.$root.updateSource({
                                            source : source,
                                            relation : relation,
                                            update_product_quantity : inventory
                                        })
                                    }
                                }
                                $(this.$el).modal('hide');
                                if( typeof this.reload == 'function'){
                                    this.reload();
                                }
                            } else {
                                helper.dialog(res.message, 'warning',  'warning', 1000);
                            }
                        }).fail(function () {}).always( () =>{
                            this.$root.closeLoader(500);
                        });
                    }
                },
                close: {
                    text: 'Đóng',
                    btnClass: 'btn-default',
                    keys: ['esc'],
                }
            });
        },
        changeGroup: function(item){
            if( this.filter.group != item){
                this.filter.group = item;
            }
        },
        changeCategory: function(item){
            if( this.filter.category != item){
                this.filter.category = item;
            }
        },
        _add: function(id){
            var index = _.findIndex(this.confirm.products, {_id : id});
            if( index >= 0){
                this.confirm.products[index].quantity = this.confirm.products[index].quantity+1;
            }else{
                var index = _.findIndex(this.$root.products, {_id : id});
                if( index >= 0){
                    this.confirm.products.push({
                        _id: this.$root.products[index]._id,
                        name: this.$root.products[index].name,
                        image: this.$root.products[index].image!='' ? this.$root.products[index].image.path : '',
                        quantity: 1,
                        product: this.$root.products[index]
                    });
                }
            }
        },
        _remove : function(id){
            $.confirm({
                title : 'Xác nhận',
                content : 'Bạn có muốn hủy món này ?',
                buttons :{
                    save : {
                        text : 'Đồng ý',
                        btnClass :'btn-success',
                        action : ()=>{
                            var index = _.findIndex(this.confirm.products, {_id : id});
                            if( index >= 0){
                                this.confirm.products.splice(index , 1);
                            }
                        }
                    },
                    close:{
                        text : 'Đóng',
                        btnClass :'btn-default',
                    }
                }
            })
        }
    },
    computed: {
        filterSources : function(){
            var keyword = helper.convertCharacters(_.trim(this.filter.keywordSource.toLowerCase()));
            return this.$root.sources.filter((item)=>{
                var checkKeyword = true;
                var checkGroup = true;
                if( this.filter.group != 'all'){
                    if( item.group_id != this.filter.group){
                        checkGroup = false;
                    }
                }
                if (keyword != '') {
                    checkKeyword = item.name_search.indexOf(keyword) >= 0 ? true : false;
                }
                return (item.state == '' || item.state =='empty') && checkKeyword && checkGroup;
            })
        },
        filterProducts : function(){
            var keyword = helper.convertCharacters(_.trim(this.filter.keywordProduct.toLowerCase()));
            return this.$root.products.filter((item)=>{
                var checkKeyword = true;
                var checkCate = true;
                if( this.filter.category != 'all'){
                    if( item.category_id != this.filter.category){
                        checkCate = false;
                    }
                }
                if (keyword != '') {
                    var name = helper.convertCharacters(_.trim(item.name.toLowerCase()))
                    checkKeyword = name.indexOf(keyword) >= 0 ? true : false;
                }
                return checkKeyword && checkCate;
            })
        },
        listProductSelected : function(){
            var keyword = helper.convertCharacters(_.trim(this.filter.keywordProduct2.toLowerCase()));
            return this.confirm.products.filter((item)=>{
                var checkKeyword = true;
                if (keyword != '') {
                    var name = helper.convertCharacters(_.trim(item.name.toLowerCase()))
                    checkKeyword = name.indexOf(keyword) >= 0 ? true : false;
                }
                return checkKeyword ;
            })
        }
    },
    components :{
        'item-spinner': {
            template : `
                <div class="item-spinner">
                    <button class="btn btn-default" type="button" @click.stop.prevent="_decrease()">-</button>
                    <span class="form-control">{{value}}</span>
                    <button class="btn btn-default" type="button" @click.stop.prevent="_increase()">+</button>
                </div>
            `,
            props:{
                value :{},
                id : {},
            },
            data : function(){
                return {
                    min : 1,
                    max : 999999,
                }
            },
            methods:{
                _increase: function(){
                    if( this.value < this.max ){
                        this.$emit('input' , this.value + 1);
                    }
                },
                _decrease : function(){
                    if( this.value > this.min ){
                        this.$emit('input' , this.value - 1);
                    }
                }
            },
            created : function(){
                var item = _.find(this.$root.products , {_id : this.id});
                if( item != undefined){
                    this.max = item.onhand_quantity;
                }
            }
        }
    },
    created(){
        this.confirm.products = this.confirm.products.map((item)=>{
            item['product'] = _.find(this.$root.products , { _id : item._id});
            return item;
        });
    },
    watch: {
        'confirm.products': {
            deep: true,
            handler: function(newval){
                $.post("/admin/sale/pos/postUpdateQuantityProductFromBooking",{_id: this.confirm._id, products: newval}, function(result){});
            }
        }
    },
    mounted(){
        $(this.$el).modal('show');
        $(this.$el).on('hidden.bs.modal',()=>{
            this.$emit('update:confirm',{
                _id: '',
                sources : [],
                show : false,
                selected : [],
            })
        });
    }
})
Vue.component('source-detail', {
    template : `
        <div class="source-detail">
            <div class="source-detail-head">
                <div class="head-title">
                    <strong>{{name}}</strong>
                </div>
                <div class="head-btn-groups">
                    <div class="btn-group">
                        <button type="button" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-right">
                            <li><a @click="$root.showModalSwitchTable(data._id)">Chuyển bàn</a></li>
                            <li><a @click="$root.showModalJoinTable(data._id)">Gộp bàn</a></li>
                            <li><a @click="$root.clearTable(data._id)">Hủy bàn</a></li>
                            <li><a @click="$root.config.activeTable = ''">Đóng</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="source-detail-body" :class="{ 'has-alert' : tables.alert && options.use_bartender }" >
                <div class="list-product-order" style="overflow: hidden scroll">
                    <div class="list-product-order-wrap " id="listProductSources" ref="list" >
                        <template v-for="(item , index) in data.products" >
                            <item-product :id="item._id" :options="options" :source="data" :item.sync="item" :index="index"></item-product>
                        </template>
                    </div>
                    <div class="list-product-order-empty" v-if="!data.products.length">
                        <i class="fas fa-shopping-basket"></i>
                        <span>Chưa có sản phẩm nào</span>
                    </div>
                </div>
                <template v-if="tables.alert && options.use_bartender ">
                    <div class="item-alert" role="alert">
                        <i class="material-icons">notifications_active</i>Bạn vừa cập nhật thêm đơn hàng !. Click <strong>"Báo bếp"</strong> để đồng bộ đơn hàng với bếp !
                    </div>
                </template>
            </div>
            <div class="source-detail-foot">
                <div class="customer">
                    <div class="customer-search">
                        <template v-if="_.has(data , 'customer._id')">
                            <div class="item-customer">
                                <a href="#" @click.stop.prevent="_removeCustomer()"><i class="fal fa-times"></i></a>
                                {{data.customer.name | name }} - {{data.customer.phone }}
                            </div>
                        </template>
                        <template v-else>
                            <suggestion 
                                ref="inputCustomer"
                                v-model="keywordCustomer" 
                                :options="{debounce: 500  ,inputClass: 'form-control' ,'placeholder' : 'Tìm khách hàng'}"
                                :change="_changeCustomerSearch" 
                                :select="_selectCustomerSearch"
                                class="customer-search-results" >
                                <template slot="item" scope="data" >
                                    {{data.data.name | name}} - {{data.data.phone}}
                                </template>
                            </suggestion>
                        </template>
                        <a @click.stop.prevent="_onSubmitCreateCustomer()" class="btn btn-success btn-create-customer"><i class="fas fa-plus"></i></a>
                    </div>
                    <div class="customer-note">
                        <a href="#" @click.stop.prevent="_showNote()">
                            <i class="material-icons">edit</i>&nbsp;Ghi chú <span v-if="data.note != ''"> : {{data.note}}</span> 
                        </a> 
                    </div>
                    
                </div>
                <div class="order-info">
                    <div class="summary">
                        <div class="row">
                            <div class="col-xs-12 summary-title">
                                Tổng cộng
                            </div>
                            <div class="col-xs-12 summary-value">
                                <span>{{tables.summary | money}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="discount">
                        <div class="row">
                            <div class="col-xs-12 discount-title">
                                Giảm giá
                            </div>
                            <div class="col-xs-12 discount-value">
                                <money  class="form-control form-control-discount" :max="tables.summary"  v-model="data.discount_value"></money>
                            </div>
                        </div>
                    </div>
                    <div class="total">
                        <div class="row">
                            <div class="col-xs-12 total-title">
                                Thành tiền
                            </div>
                            <div class="col-xs-12 total-value">
                                <span>{{tables.total | money}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="btn-groups">
                        <button v-if="options.use_bartender" :class="{ 'disabled' : !tables.alert }" class="btn btn-warning btn-big" @click.stop.prevent="_notifications()">
                            <i class="fas fa-bell"></i>&nbsp; Báo bếp (F9)
                        </button>
                        <button :class="{ 'disabled' : !tables.payment || options.loadingAddProduct }" class="btn btn-success btn-big" @click.stop.prevent="_showPayment()">
                            <i class="fas fa-check"></i>&nbsp; Thanh toán (F10)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        data : {
            required : true,
        },
        options: {},
    },
    data: function () {
        return {
            keywordCustomer: '',
            loading: false,
            sendIndex : 0,
            timeout : null,
        }
    },
    methods: {
        _changeCustomerSearch: function (query) {
            if (query.trim().length === 0) {
                return null
            }
            query = helper.convertCharacters(query);
            query = query.toLowerCase();
            return new Promise((resolve)=>{
                $.post("/admin/sales/pos/postFindCustomersByPhoneOrName", {
                    keyword: query,
                }, (res)=> {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        resolve(res.data);
                    }
                }).fail(()=>{}).always(()=>{});
                
            });
        },
        _selectCustomerSearch: function (item) {
            this.$set(this.data, 'customer_id', item._id);
            this.$set(this.data, 'customer', item);
        },
        _removeCustomer: function () {
            this.keywordCustomer = '';
            this.data.customer_id = '';
            this.data.customer = null;
        },
        _updateNoteTable: function (note) {
            return new Promise(( resolve , rej)=>{
                $.post("/admin/sales/pos/postUpdateNoteTable", {
                    _id: this.data._id,
                    note: note,
                }, (res)=> {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        this.data.note = note;
                        resolve(true);
                    }
                }).fail( ()=>{} ).always( ()=>{});
            })
        },
        _showNote : function(){
            var vm = this;
            var dismiss = true;
            var jc =  $.confirm({
                title: 'Thêm ghi chú',
                content : `
                    <form action="" class="form-note">
                        <div class="form-group">
                            <textarea type="text"  placeholder="Nhập ghi chú " class="name form-control" >${vm.data.note}</textarea>
                        </div>
                    </form>
                `,
                type : 'green',
                backgroundDismiss : function(){
                    return 'backdrop';
                },

                closeIcon : true,
                buttons: {
                    backdrop : {
                        isHidden : true,
                        action : ()=>{return dismiss}
                    },
                    save: {
                        text: 'Xác nhận',
                        btnClass: 'btn-success',
                        action:  function(){
                            dismiss = false;
                            jc.showLoading(true);
                            return vm._updateNoteTable(this.$content.find('textarea').val());
                        }
                    },
                    close: {
                        text: 'Đóng',
                        btnClass: 'btn-default',
                    },
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('textarea').focus().val('').val(vm.data.note);
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$save.trigger('click'); 
                    });
                }
            });
        },
        _showPayment: function () {
            var customer = {};
            if( this.data.products.length  == 0) return;
            this.$root.payment = this.data;
        },
        _notifications: function(){
            $.post("/admin/sales/pos/postUpdateProductToChief", {
                _id : this.data._id,
            },(res)=>{
                if( res.status == 403) return;
                if( res.error == false){
                    this.data.products.map((item)=>{
                        if( item.hasOwnProperty('processing') && item['processing'] == true){
                            item['chief_quantity'] = item.request_quantity;
                        }
                        return item;
                    })
                    socket.emit('pos_user_alert_to_chief' ,{
                        user : this.$root.user,
                        source: this.data.name,
                        data :  res.data
                    });
                    // helper.dialog(res.message , 'notifications_active' , 'success' , 1000 );
                }else{
                    helper.dialog(res.message , 'notifications' , 'warning' , 10000 );
                }
            })
        },
        _onSubmitCreateCustomer: function ($event) {
            this.$root.createCustomer((res)=>{
                this._selectCustomerSearch(res);
            })
        },
    },
    computed: {
        tables : function(){
            var vm = this;
            var result = [];
            var summary = 0;
            var total = 0;
            var alert = false;
            var payment = false;
            if( vm.data != undefined && vm.data != null){
                var arr = {};
                if( vm.data.products.length){
                    payment = true;
                    vm.data.products.forEach(function(item){
                        if( item.request_quantity > item.chief_quantity  && item.processing == true){
                            alert = true;
                        }
                        summary += item.request_quantity * item.price_sale;
                    });
                }
            }
            return {
                summary : summary,
                total : (summary - vm.data.discount_value),
                alert : alert ,
                payment : payment
            };
        },
        name : function(){
            var name = '';
            if( this.data != undefined){
                name = this.data.name;
                var group = _.find(this.$root.groups, {
                    _id: this.data.group_id
                });
                if (group != undefined) {
                    name += " - " + group.name;
                }
                if( this.data.hasOwnProperty('relation') && this.data['relation'].length){
                    name += ' ( Ghép với ';
                    this.data.relation.forEach(function(item , index){
                        
                        if( index == 0){
                            name += item.name;
                        }else{
                            name += ' , ' +item.name;
                        }
                    })
                    name += ' )';
                }
            }
            return name;
        },
    },
    watch : {
        'data.products' : {
            handler : function(value){
                clearTimeout(this.timeout);
                this.timeout = setTimeout(()=>{
                    socket.emit("pos_user_update_table" , {
                        source : this.data,
                    });
                },1000);
                
            },
            deep : true
        }
    },
    created: function () {
        

    },
    mounted: function () {
       
    }
})
Vue.component('item-product' , {
    template : `
        <div class="item-product-order detail_source_product">
            <div class="item-product-index">
                {{index + 1}}
            </div>
            <div class="item-product-action">
                <a class="btn-item-remove" @click.stop.prevent="_remove()">
                    <i class="material-icons text-danger">close</i>
                </a>
                <template v-if="item.processing && options.use_bartender">
                    <a class="btn-item-notification" @click.stop.prevent="_notification()" :class="{ disabled : item.request_quantity <= item.chief_quantity }">
                        <i class="material-icons text-warning">notifications</i>
                    </a>
                </template>
            </div>
            <div class="item-product-info">
                <div class="item-product-name">
                    <span class="item-name" :class="status">{{item.product_name}}</span>
                </div>
                
                <div class="item-product-note" @click.stop.prevent="_showNote()">
                    <a v-if=" item.note == '' " class="btn-note"><i class="material-icons">edit</i> Ghi chú</a>
                    <a v-else class="btn-note"><i class="material-icons">edit</i> {{item.note}}</a>
                </div>
            </div>
            <div class="item-product-quantity">
                <div class="item-quantity-btn">
                    <span class="btn-increase" @click.stop.prevent="_decrease()"><i class="material-icons">remove</i></span>
                    <span class="btn-quantity" >{{item.request_quantity}}</span>
                    <span class="btn-decrease" @click.stop.prevent="_increase()"><i class="material-icons">add</i></span>
                </div>
                <div class="item-quantity-info" v-if="item.chief_quantity > 0 &&  item.processing ">
                    <span class="make-success">{{item.recive_quantity}}</span>/<span class="chief-quantity">{{item.chief_quantity}}</span>
                </div>
            </div>
            <div class="item-product-price">
                <span class="item-price">{{item.price_sale | money}}</span>
            </div>
            <div class="item-product-total">
                <span class="item-total">{{item.price_sale * item.request_quantity  | money}}</span>
            </div>
            <div class="mask-item-product" v-if="loading"></div>
        </div>
    `,
    props:{
        item: {
            required : true
        },
        index : {
            required : true
        },
        source: {
            required : true
        },
        options : {}
    },
    data : function(){
        return {
            timeout : null ,
            loading : false,
        }
    },
    methods:{
        _increase : function(){
            if( this.loading) return;
            
            this._updateQuantity( this.item.request_quantity + 1 , ()=>{
                this.item.request_quantity += 1;
                this.$root.activeItemProduct(this.item._id , false);
            });
        },
        _decrease : function(){
            if( this.loading) return;
            if( this.item.request_quantity > 1 ){
                if( this.item.request_quantity > this.item.chief_quantity){
                    this._updateQuantity(this.item.request_quantity - 1 ,()=>{
                        this.item.request_quantity -= 1;
                        this.$root.activeItemProduct(this.item._id , false);
                    })
                }else{
                    this._showKeyboard();
                }
            }else{
                this._remove();
            }
            return;
            if( this.item.request_quantity > this.item.recive_quantity){
                if( this.item.request_quantity > 1 ){
                    if( this.item.request_quantity > this.item.chief_quantity){
                        
                        this._updateQuantity(this.item.request_quantity - 1 ,()=>{
                            this.item.request_quantity -= 1;
                            this.$root.activeItemProduct(this.item._id , false);
                        })
                    }else{
                        this._showKeyboard();
                    }
                }else{
                    this._remove();
                }
            }else{
                $.dialog('Sản phẩm không cho phép xóa !');
            }
        },
        _showKeyboard : function(){
            this.$root.$refs.keyboard.show('',  (quantity) => {
                if (quantity != '' && quantity > 0) {
                    if (quantity == this.item.request_quantity) {
                        this._remove();
                    } else {
                        this._comfirmBeforeDescrease(quantity);
                        this.$root.activeItemProduct(this.item._id , false);
                    }
                }
            }, this.item.request_quantity);
        },
        _comfirmBeforeDescrease : function(quantity){
            $.post('/admin/sales/pos/postConfirmRemoveProduct', {
                source_id: this.source._id,
                product_id: this.item.product_id,
                quantity: quantity,
            },  (res) => {
                console.log(res);
                if (res.status == 403) return;
                if (res.error == false) {
                    var message  =  res.hasOwnProperty('message') ? res.message : '';
                    this.$root.comfirm('Thông báo !', message, {
                        save: {
                            text: 'Xác nhận',
                            btnClass: 'btn-success',
                            keys: ['enter'],
                            action: ()=>{
                                $.post('/admin/sales/pos/postRemoveProductFromTable', {
                                    source_id: this.source._id,
                                    product_id: this.item.product_id,
                                    quantity: quantity,
                                },  (res) => {
                                    console.log(res);
                                    if (res.status == 403) return;
                                    if (res.error == false) {
                                        this.item.request_quantity = res.data.request_quantity;
                                        this.item.chief_quantity = res.data.chief_quantity;
                                        var emit = {
                                            user : this.$root.user,
                                            source: this.source.name,
                                            data :  res.data_chief.data
                                        }
                                        this.$root.activeItemProduct(this.item._id , false);
                                        if( res.hasOwnProperty('inventory')){
                                            this.$root.updateProductQuantity(res.inventory);
                                            emit['update_product_quantity'] =res.inventory;
                                        }
                                        socket.emit('pos_user_alert_to_chief' , emit);
                                    }
                                }).fail(function () {}).always(function () {});
                            }
                        },
                        close: {
                            text: 'Đóng',
                            btnClass: 'btn-default',
                            keys: ['esc'],
                        }
                    });
                }else{
                    $.dialog(res.hasOwnProperty('message') ? res.message : '');
                }
            }).fail(function () {}).always(function () {});
        },
        _remove: function(){
            $.post('/admin/sales/pos/postConfirmRemoveProduct', {
                source_id: this.source._id,
                product_id: this.item.product_id,
                quantity: this.item.request_quantity,
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    this.$root.comfirm('Thông báo !', res.hasOwnProperty('message') ? res.message : '', {
                        save: {
                            text: 'Xác nhận',
                            btnClass: 'btn-success',
                            keys: ['enter'],
                            action: ()=>{
                                this.loading = true;
                                $.post("/admin/sales/pos/postUpdateQuantityProductFromTable", {
                                    source_id: this.source._id,
                                    product_id: this.item.product_id,
                                    quantity: 0 ,
                                }, (res)=> {
                                    this.loading = false;
                                    if (res.status == 403) return;
                                    if (res.error == false) {
                                        this.source.products.splice(this.index, 1);
                                        var emit = {
                                            user : this.$root.user,
                                            source: this.source.name,
                                            data :  res.data_chief.data,
                                        }
                                        if( res.hasOwnProperty('inventory')){
                                            this.$root.updateProductQuantity(res.inventory);
                                            emit['update_product_quantity'] = res.inventory;
                                        }
                                        socket.emit('pos_user_alert_to_chief' ,emit);
                                    }
                                }).fail(function () {
                                    this.loading = false;
                                }).always(function () {});
                            }
                        },
                        close: {
                            text: 'Đóng',
                            btnClass: 'btn-default',
                            keys: ['esc'],
                        }
                    });
                }else{
                    $.dialog(res.hasOwnProperty('message') ? res.message : '');
                }
            }).fail(function () {}).always(function () {});
            return;
            if(  this.item.recive_quantity > 0){
                $.dialog('Sản phẩm không cho phép xóa !');
                return ;
            }
            this.$root.comfirm('Thông báo !', 'Bạn có muốn xóa sản phẩm khỏi bàn ?', {
                save: {
                    text: 'Xác nhận',
                    btnClass: 'btn-success',
                    keys: ['enter'],
                    action: ()=>{
                        this.loading = true;
                        $.post("/admin/sales/pos/postUpdateQuantityProductFromTable", {
                            source_id: this.source._id,
                            product_id: this.item.product_id,
                            quantity: 0 ,
                        }, (res)=> {
                            this.loading = false;
                            if (res.status == 403) return;
                            if (res.error == false) {
                                this.source.products.splice(this.index, 1);
                                var emit = {
                                    user : this.$root.user,
                                    source: this.source.name,
                                    data :  res.data_chief.data,
                                }
                                if( res.hasOwnProperty('inventory')){
                                    this.$root.updateProductQuantity(res.inventory);
                                    emit['update_product_quantity'] = res.inventory;
                                }
                                socket.emit('pos_user_alert_to_chief' ,emit);
                            }
                        }).fail(function () {
                            this.loading = false;
                        }).always(function () {});
                    }
                },
                close: {
                    text: 'Đóng',
                    btnClass: 'btn-default',
                    keys: ['esc'],
                }
            });
        },
        _updateQuantity : function(number , callback){
            this.loading = true;
            $.post("/admin/sales/pos/postUpdateQuantityProductFromTable", {
                source_id: this.source._id,
                product_id: this.item.product_id,
                quantity: number,
            }, (res)=> {
                this.loading = false;
                if (res.status == 403) return;
                if (res.error == false) {
                    if( typeof callback == 'function'){
                        callback();
                    }
                    if( res.hasOwnProperty('inventory')){
                        this.$root.updateProductQuantity(res.inventory);
                        socket.emit('pos_user_update_product_quantity' , res.inventory);
                    }
                }
            }).fail(function () {
                this.loading = false;
            }).always( ()=>{
                this.loading = false
            });
        },
        _showNote: function(){
            var vm = this;
            var dismiss = true;
            var jc =  $.confirm({
                title: 'Thêm ghi chú',
                content : `
                    <form action="" class="form-note">
                        <div class="form-group">
                            <textarea type="text"  placeholder="Nhập ghi chú " class="name form-control" >${vm.item.note}</textarea>
                        </div>
                    </form>
                `,
                closeIcon : true,
                type : 'green',
                backgroundDismiss : function(){
                    return 'backdrop';
                },
                buttons: {
                    backdrop : {
                        isHidden : true,
                        action : ()=>{return dismiss}
                    },
                    save: {
                        text: 'Xác nhận',
                        btnClass: 'btn-success',
                        action:  function(){
                            dismiss = false;
                            jc.showLoading(true);
                            return vm._updateNote(this.$content.find('textarea').val());
                        }
                    },
                    close: {
                        text: 'Đóng',
                        btnClass: 'btn-default',
                    },
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('textarea').focus().val('').val(vm.item.note);
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$save.trigger('click'); 
                    });
                }
            });
        },
        _updateNote : function(value){
            return new Promise(( resolve , rej)=>{
                $.post("/admin/sales/pos/postUpdateNoteProduct", {
                    _id: this.item.product_id,
                    source_id  : this.source._id,
                    note: value,
                }, (res) => {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        resolve(true);
                        this.item.note = value;
                        socket.emit('pos_user_update_note_to_chief' ,{
                            user : this.$root.user,
                            source_id: this.source._id,
                            data :  res.data
                        });
                    }
                }).fail(function () {}).always(function () {});
            })
        },
        _notification : function(){
            if( this.item.chief_quantity < this.item.request_quantity){
                $.post("/admin/sales/pos/postUpdateSingleProductToChief", {
                    _id : this.source._id,
                    product_id : this.item.product_id,
                },(res)=>{
                    if( res.status == 403) return;
                    if( res.error == false){
                        this.item.chief_quantity = this.item.request_quantity;
                        socket.emit('pos_user_alert_to_chief' ,{
                            user : this.$root.user,
                            data :  res.data
                        });
                    }
                })
            }
        }
    },
    computed: {
        status : function(){
            if( this.item.chief_quantity > 0 ){
                if( this.item.recive_quantity == this.item.chief_quantity){
                    return 'success';
                }
                return 'danger';
            }
            return '';
        }
    },
    watch :{
        // 'item' : {
        //     handler : function(value){
        //         if( _.isEqual(value, this.source)){
        //             socket.emit("pos_user_update_table" , {
        //                 source : this.source,
        //             });
        //         }
                
        //     },
        //     deep : true
        // }
    }
})
Vue.component('logs' , {
    template : `
        <div class="modal fade modal-logs" >
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Lịch sử</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                                
                            <div class="col-xs-6 mg-bottom-10">
                                <label>Bàn</label>
                                <select2 class="form-control" v-model="pagination.source_id" :options="listSources"></select2>
                            </div>  
                            <div class="col-xs-6 mg-bottom-10">
                                <label>Nhân viên</label>
                                <select2 class="form-control" v-model="pagination.user_id" :options="listUsers"></select2>
                            </div>  
                            <div class="col-xs-12 mg-bottom-10">
                                <label>Thời gian</label>
                                <daterange-picker v-model="pagination.range"></daterange-picker>
                            </div>
                        </div>
                        <div class="table table-logs">
                            <div class="table-head">
                                <div class="row">
                                    <div class="col index">#</div>
                                    <div class="col message">Hành động</div>
                                    <div class="col source">Bàn</div>
                                    <div class="col user">Nhân viên</div>
                                    <div class="col created">Thời gian</div>
                                </div>
                            </div>
                            <div class="table-body" >
                                
                                    <template v-if="loading">
                                        <div class="box-loading" style="height:300px">
                                            <svg class="circular" viewBox="25 25 50 50">
                                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                                            </svg>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <template v-if="pagination.data.length">
                                            <div class="row" v-for="(item, index) in pagination.data">
                                                <div class="col index">
                                                    {{(pagination.limit * (pagination.page - 1)) + index + 1}}
                                                </div>
                                                <div class="col message">
                                                    {{ item.message }}
                                                </div>
                                                <div class="col source">
                                                    <template v-if="_.has(item , 'source.name')">
                                                        {{item.source.name}}
                                                    </template>
                                                </div>
                                                <div class="col user">
                                                    <template v-if="_.has(item , 'user.name')">
                                                        {{item.user.name}}
                                                    </template>
                                                </div>
                                                <div class="col created">
                                                    {{ item.created_at | full-time}}
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="box-loading" style="height:300px">
                                                <div class="text-center text-danger"><h3>Không tìm thấy dữ liệu</h3></div>
                                            </div>
                                        </template>
                                    </template>
                                
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="row">
                            <div class="col-xs-6 text-left">
                                <div class="inline-block inline-limit">
                                    <select2 :options="limits" v-model="pagination.limit"></select2>
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <div class="text-right">
                                    <pagination :total="pagination.total" :current="pagination.page" :change="_changePage"></pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props : {
        show : {},
        users : {},
        options : {},
        sources : {}
    },
    data : function(){
        return {
            loading : false,
            pagination :{
                data : [],
                limit : 10,
                page : 1,
                total: 0,
                user_id: '',
                source_id: '',
                range : {
                    startDate : parseInt(moment().startOf('day').valueOf() / 1000),
                    endDate : parseInt(moment().endOf('day').valueOf() / 1000),
                }
            },
            limits : [
                {_id : 10 ,text : 10},
                {_id : 20 ,text : 20},
                {_id : 50 ,text : 50},
                {_id : 100 ,text : 100}
            ],
            listUsers :[],
            listSources : [],
        }
    },
    methods :{
        _load : function(){
            this.loading = true;
            var data = {
                limit : this.pagination.limit,
                page: this.pagination.page,
            }
            if(this.pagination.user_id != 'all'){
                data['user_id'] = this.pagination.user_id;
            }
            if(this.pagination.source_id != 'all'){
                data['source_id'] = this.pagination.source_id;
            }
            if(this.pagination.range.startDate != '' && this.pagination.range.endDate != ''){
                data['startDate'] = this.pagination.range.startDate;
                data['endDate'] = this.pagination.range.endDate;
            }
            $.post("/admin/sales/pos/postLoadPosLogs", data ,  (res)=>{
                if (res.status == 403) return;
                if (res.error == false) {
                    this.pagination.data = res.data;
                    this.pagination.page = res.page;
                    this.pagination.total = res.total;
                } else {
                    helper.dialog(res.message, 'warning',  'warning', 1000);
                }
            }).fail(function () {}).always( () => {
                this.loading = false;
            });
        },
        _changePage: function(page){
            this.pagination.page = page;
            this._load();
        }
    },
    watch :{
        'pagination.limit' : function(){
            if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
        },
        'pagination.user_id' : function(){
            if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
        },
        'pagination.source_id' : function(){
            if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
        },
        'pagination.range' : {
            handler :  function(){
                if( this.pagination.page != 1){
                    this.pagination.page = 1;
                }
                this._load();
            },
            deep : true,
        }
    },
    created : function(){
        this.listSources = JSON.parse(JSON.stringify(this.sources));
        this.listSources.unshift({_id : 'all', text : 'Tất cả'});
        this.listUsers.push({_id : 'all', text : 'Tất cả'});
        for( var key in this.users){
            if(this.users.hasOwnProperty(key)){
                this.listUsers.push({_id : key , text : this.users[key]});
            }
        }
    },
    mounted : function(){
        $(this.$el).modal('show');
        $(this.$el).on('hidden.bs.modal', ()=>{
            this.$emit('update:show' , false);
        });
        this._load();
    }
})
Vue.component('report', {
    template : `
        <div>
            <div ref="modalReport" class="modal fade modal-setting" role="dialog" >
                <div class="modal-dialog " role="document" >
                    <div class="modal-content" >
                        <div class="modal-header">
                            <h4><b>Báo cáo kết quả hoạt động kinh doanh</b>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            </h4>
                        </div>
                        <div class="modal-body">
                            <ul class="nav nav-tabs" role="tablist">
                                <li :class="{ 'active' : tab == 'overview'}">
                                    <a @click.stop.prevent="_changeTab('overview')" >Tổng quan</a>
                                </li>
                                <li :class="{ 'active' : tab == 'cashier'}">
                                    <a @click.stop.prevent="_changeTab('cashier')" >Theo ngày</a>
                                </li>
                                <li :class="{ 'active' : tab == 'product'}">
                                    <a @click.stop.prevent="_changeTab('product')" >Sản phẩm</a>
                                </li>
                            </ul>
                            <div class="tab-content">
                                <template v-if="loading">
                                    <div class="box-loading">
                                        <div class="box-loading-icon">
                                            <svg class="circular" viewBox="25 25 50 50">
                                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                                            </svg>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="tab-pane active fade in" v-if="tab == 'overview'">
                                        <div class="row">
                                            <div class="col-xs-6">
                                                <daterange-picker :classname="'form-control text-center'" v-model="daterange"></daterange-picker>
                                            </div>
                                        </div>
                                        <div class="row mg-top-15">
                                            <div class="col-xs-12">
                                                <table class="table">
                                                    <tbody>
                                                        <tr>
                                                            <td>Doanh thu bán hàng (1 = 1.1+1.2)</td>
                                                            <td><b>{{ data.SaleOrdersResult.total_price+data.SaleOrdersResult.total_delivery_cost | money }}</b></td>
                                                        </tr>
                                                        <tr>
                                                            <td class="pd-left-30">Doanh thu hóa đơn (1.1)</td>
                                                            <td>{{ data.SaleOrdersResult.total_price | money }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td class="pd-left-30">Doanh thu phụ thu giao hàng (1.2)</td>
                                                            <td>{{ data.SaleOrdersResult.total_delivery_cost | money }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Chiết khấu trên hóa đơn (2)</td>
                                                            <td><b>{{ data.SaleOrdersResult.total_discount_value | money }}</b></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Doanh thu thuần (3 = 1-2)</td>
                                                            <td><b>{{ data.SaleOrdersResult.total_price+data.SaleOrdersResult.total_delivery_cost-data.SaleOrdersResult.total_discount_value | money }}</b></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Giá vốn sản phẩm (4)</td>
                                                            <td><b>{{ data.SaleOrdersResult.total_cost_of_capital | money }}</b></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Lợi nhuận gộp về bán hàng (5 = 3-4)</td>
                                                            <td><b>{{ data.SaleOrdersResult.total_price+data.SaleOrdersResult.total_delivery_cost-data.SaleOrdersResult.total_discount_value - data.SaleOrdersResult.total_cost_of_capital | money }}</b></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane active fade in" v-if="tab == 'cashier'">
                                        <div class="row">
                                            <div class="col-xs-6">
                                                <daterange-picker :classname="'form-control text-center'" v-model="daterange"></daterange-picker>
                                            </div>
                                        </div>
                                        <div class="row mg-top-15">
                                            <div class="col-xs-12">
                                                <table class="table">
                                                    <tbody>
                                                        <template v-for="(item, index) in data.days">
                                                            <tr class="bg-info">
                                                                <td colspan="2"><b>Ngày {{ index | only-day }}</b></td>
                                                                <td>Doanh thu hóa đơn</td>
                                                                <td>Doanh thu phụ phí</td>
                                                                <td>Chiết khấu hóa đơn</td>
                                                                <td>Doanh thu thuần</td>
                                                            </tr>
                                                            <tr v-for="(user_item, user_index) in item.users">
                                                                <td>{{ user_item.index }}</td>
                                                                <td>{{ user_item.name }}</td>
                                                                <td>{{ user_item.total_price | money }}</td>
                                                                <td>{{ user_item.total_delivery_cost | money }}</td>
                                                                <td>{{ user_item.total_discount_value | money }}</td>
                                                                <td>{{ user_item.total_price-user_item.total_discount_value+user_item.total_delivery_cost | money }}</td>
                                                            </tr>
                                                            <tr>
                                                                <th colspan="2" class="text-right">TỔNG CỘNG</th>
                                                                <th>{{ item.total_price | money }}</th>
                                                                <th>{{ item.total_delivery_cost | money }}</th>
                                                                <th>{{ item.total_discount_value | money }}</th>
                                                                <th>{{ item.total_price-item.total_discount_value+item.total_delivery_cost | money }}</th>
                                                            </tr>
                                                        </template>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane active fade in" v-if="tab == 'product'">
                                        <div class="row">
                                            <div class="col-xs-6">
                                                <daterange-picker :classname="'form-control text-center'" v-model="daterange"></daterange-picker>
                                            </div>
                                        </div>
                                        <div class="row mg-top-15">
                                            <div class="col-xs-12">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Hàng hóa / sản phẩm</th>
                                                            <th>Số lượng tiêu thụ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <template v-for="(item, index) in data.products_sale">
                                                            <tr>
                                                                <td>{{ index+1 }}</td>
                                                                <td>{{ item.name }}</td>
                                                                <td>{{ item.TotalQuantity | money }}</td>
                                                            </tr>
                                                        </template>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="modal-footer">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props:{
        show : {
            required : true,
            type : Boolean
        }
    },

    data : function(){
        return {
            tab : 'overview',
            loading : true,
            data : {
                days: {},
                SaleOrdersResult: {},
                products: {},
                products_sale: {}
            },
            keyword : '',
            category_id : '',
            warehouses : [],
            daterange: {
                startDate : '',
                endDate : ''
            }
        }
    },
    methods : {
        _changeTab : function(tab){
            if(this.tab != tab){
                switch(tab) {
                    case 'overview': 
                        this.tab = tab;
                        break;
                    case 'cashier': 
                        this.tab = tab;
                        break;
                    case 'product': 
                        this.tab = tab;
                        break;
                }
            }
        },
        _load:  function(){
            this.loading  = true;
            $.post("/admin/sales/pos/postLoadDataReport", {
                start: this.daterange.startDate,
                end: this.daterange.endDate
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    this.data.SaleOrdersResult = res.data.SaleOrdersResult;
                    this.data.days = res.data.days;
                    this.data.products_sale = res.data.products_sale;
                    if(this.daterange.startDate==''){
                        this.daterange.startDate = res.data.startDate;
                        this.daterange.endDate = res.data.endDate;
                    }
                }
            }).fail(function () {}).always( ()=>{
                this.loading  = false;
            });
        }
    },
    computed : {
        
    },
    watch :{
        'daterange': function(newval, oldval){
            this._load();
        }
    },
    mounted : function(){
        $(this.$refs.modalReport).modal('show');
        $(this.$refs.modalReport).on('hidden.bs.modal', (event)=>{
            this.$emit('update:show' , false);
        });
        this._load();
    },
    created: function(){

    }
});

function AppTableOrders(element) {
    if (!$(element).length) return;
    var timeoutCustomer = null;
    
    
    var Store = {
        local: window.localStorage,
        set: function (key, value) {
            this.local.setItem(key, JSON.stringify(value));
            $(document).trigger('storage', ['set', key, value]);
        },
        get: function (key) {
            return JSON.parse(this.local.getItem(key));
        },
        key: function (index) {
            return this.local.key(index);
        },
        remove: function (key) {
            this.local.removeItem(key);
            $(document).trigger('storage', ['remove', key]);
        },
        clear: function () {
            return this.local.clear();
            $(document).trigger('storage', ['clear']);
        },
        keys: function () {
            var res = [];
            for (var i = 0; i < this.local.length; i++) {
                res.push(this.local.key(i));
            };
            return res;
        }
    };
    var ListUserObject = {};
    var ListUserArray  =  $(element).data('users');
    ListUserArray.forEach(function(item){
        ListUserObject[item._id] = item.name;
    })
    Vue.filter('username' , function(value){
        if( ListUserObject.hasOwnProperty(value)){
            return ListUserObject[value];
        }
        return '';
    })
    var productTimeOut = {
        timeout : null ,
        quantity : 0,
    };
    var vm = new Vue({
        el: element,
        data: {
            mask: false,
            report: false,
            loader: false,
            warehouse_id :  '',
            groups: [],
            categories: [],
            products: [],
            warehouses: [],
            sources: [],
            ProductNames: {},
            provinces: [],
            user: null,
            users : {},
            listUsersOnline: [],
            createGroup: null,
            createTable: null,
            switchTable: null,
            joinTable: null ,
            group: 'all',
            config: {
                tab: 'table',
                group: 'all',
                category: 'all',
                keywordSource: '',
                keywordProduct: '',
                keywordCustomer: '',
                tableView: 'grid',
                productView: 'grid',
                productState : 'all',
                state: 'all',
                activeTable: '',
                activeIndexTable: -1,
                loadingTabProduct: false,
                loadingAddProduct: false,
                isFullScreen: false,
                showPayment: false,
                userType:  '',
                chooseNumber : false,
                allowOpen: false,
                autoHideProduct: false,
                use_takeaway : false,
                use_bartender : false,
                use_booked : false,
                allow_print: false,
                time_book_notify : false,
                allow_ringtone : true,
            },
            customers: [],
            detail: null,
            loading: {
                update: false,
                table: false,
                customer: false,
                remove : false,
            },
            payment: null,
            schedule :{},
            chiefs : [],
            order: false,
            setting : false,
            logs : false,
            images : {},
            audio : null,
        },
        created: function () {
            var vm = this;
            var groups =  $(element).data('groups');
            var sources =  $(element).data('sources');
            var categories =  $(element).data('categories');
            var warehouses =  $(element).data('warehouses');
            var products =  $(element).data('products');
            var provinces =  $(element).data('provinces');
            var ProductName =  {};
            var user  =  $(element).data('user');
            var DefaultWarehouse  =  $(element).data('warehouse-id');
            var bartender   =  $(element).data('bartender');
            var users  =  $(element).data('users');
            var setting  =  $(element).data('setting');
            var listUsers  =  {};
            var usersObject = {};
            users.forEach(function(item){
                usersObject[item._id] = item.name;
            })
            this.warehouse_id =  DefaultWarehouse;
            this.groups= groups.map(function (item) {
                return {
                    _id: item._id,
                    name: item.name,
                }
            });
            this.categories= categories.map(function (item) {
                return {
                    _id: item._id,
                    name: item.name,
                }
            })
    
            this.products= products;
            this.warehouses= warehouses.map(function (item) {
                return {
                    _id: item._id,
                    name: item.name,
                }
            });
            this.sources= sources;
            this.ProductNames= ProductName;
            this.provinces= provinces.map(function (item) {
                var id = DefaultWarehouse;
                return {
                    _id: item._id,
                    name: item.name,
                    districts : item.districts.map(function(el){
                        var fee = 0;
                        if( el.hasOwnProperty('price_warehouses')  ){
                            if(el.price_warehouses.hasOwnProperty(id) ){
                                fee = el.price_warehouses[id].price_default;
                            }
                        }
                        return {
                            _id : el._id,
                            name : el.name,
                            fee :  fee,
                        }
                    })
                }
            });
            this.user= {
                _id : user._id,
                name : user.name,
                type_pos : user.type_pos
            }
            this.users = usersObject;
            this.config.userType =   user['type_pos'],
            this.config.chooseNumber  =  setting['allow_import_quantity'],
            this.config.allowOpen =  setting['open_menu'],
            this.config.autoHideProduct =  setting['auto_hide_product'],
            this.config.use_takeaway  =  setting['allow_takeaway'],
            this.config.use_bartender  =  setting['notify_chief'],
            this.config.use_booked  =  setting['allow_book'],
            this.config.allow_print =  setting['allow_print'],
            this.config.time_book_notify  =  setting['time_book_notify'],
            this.config.allow_ringtone  =  true,
            this.config.allSetting  =  setting
            this.images = {
                table : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAeCAYAAABe3VzdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZGE4MmIxMi0zZDhiLTkwNGUtOGQ5NC1mNWExYzBiNTZmZDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk3RjY2OUFDMTQ4MTFFODlBMTdEMTkzMkIzMTlBMUEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDk2ZjdiZTctZTljNi01NTQyLWIxNWItYTI4YTEwNDg1YjE4IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA5LTI2VDExOjU2OjU5KzA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wOS0yNlQxMTo1OTo1OSswNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wOS0yNlQxMTo1OTo1OSswNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjEzNzVmZWNlLWNjMTEtYjg0MC04MDllLWRkMjBkMDM5OTZmYiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2ZGE4MmIxMi0zZDhiLTkwNGUtOGQ5NC1mNWExYzBiNTZmZDUiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDk2ZjdiZTctZTljNi01NTQyLWIxNWItYTI4YTEwNDg1YjE4IiBzdEV2dDp3aGVuPSIyMDE4LTA5LTI2VDExOjU5OjU5KzA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pji//kwAAAEYSURBVFiF7ZWxSgNBEIa/EwmoTTwhRQQJmCoPk2aew0p8CkmlrzGND5PKQBC0EAx2Qpq1uF2Uc+9uj73gFvs1uxzD/h+7x0xhjCFljv5boIssGEsWjCV5weP6BxF5BcbAHjDACCgOkG1sRmEzPlX1slMQmNr19ABSdc5+7b15PsElcAI8ABPgFtgObQbMgBXwDtwAX76ioj5JRMRtn4Fr4ALYhaaqalCdiJTAB7BR1XlTXZPgCFhbwac+gj0oqV5rAyxUde8r8j2xw5kvBxZryvHSJuha0D3wNpjOD1Pgjo5W1yboWssj8BKa2uMfvKISbG1hIY36PCixP0HnJj9JsmAsWTCWLBjLn1mcGsnfYBaMJQvGkrzgN8iBNj3ZMh1GAAAAAElFTkSuQmCC',
                square : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2Qzc1QTQ0QkU0OTIxMUU4OUEwRkY1RkE1ODA1QzQwNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2Qzc1QTQ0Q0U0OTIxMUU4OUEwRkY1RkE1ODA1QzQwNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZDNzVBNDQ5RTQ5MjExRTg5QTBGRjVGQTU4MDVDNDA0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZDNzVBNDRBRTQ5MjExRTg5QTBGRjVGQTU4MDVDNDA0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ufrPzAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=',
            }
        },
        methods: {
            sound : function(){
                var vm = this;
                if( vm.config.allow_ringtone ){
                    var frm =   document.getElementById('iframe');
                    frm.src = "/resources/audio/file-sounds-1101-plucky.ogg";
                    setTimeout(function(){
                        frm.src = '';
                    },500);
                }
            },
            getTime : function(){
                return parseInt( new Date().getTime() / 1000);
            },
            changeView: function (item) {
                if (this.config.view != item) {
                    this.config.view = item;
                }
            },
            changeTab: function (item) {
                if (this.config.tab != item) {
                    
                    switch(item) {
                        case 'wait': 
                            this.getListSuccessChief();
                            break;
                        default:
                            this.config.tab = item;
                            break;
                    }
                }
            },
            addProduct: function (item , quantity) {
                var vm = this;
                vm.mask = true;
                if (vm.config.activeTable == ''){
                    helper.dialog('Chưa chọn bàn !' , 'warning'  ,'warning', 1000);
                    return;
                }
                if(item.manage_inventory == true && item.available_quantity <= 0) {
                    helper.dialog('Sản phẩm hết hàng !'  ,'warning'  ,'warning', 1000);
                    return;
                };
                var index = _.findIndex(vm.sources, {
                    _id: vm.config.activeTable
                });
                if (index == -1) return;
                $.post("/admin/sales/pos/postAddProductToTable", {
                    source_id: vm.sources[index]._id,
                    product_id: item._id,
                    quantity: quantity,
                }, function (res) {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        var productIndex = _.findIndex(vm.sources[index].products , { _id : res.data._id});
                        if( productIndex >= 0){
                            vm.$set(vm.sources[index].products , productIndex , res.data);
                        }else{
                            vm.sources[index].products.push(res.data);
                        }
                        vm.$nextTick(function(){
                            vm.activeItemProduct(res.data._id , true);
                        })
                        if( res.hasOwnProperty('inventory')){
                            vm.updateProductQuantity(res.inventory);
                            socket.emit('pos_user_update_product_quantity' , res.inventory);
                        }
                        vm.mask = false;
                    }
                }).fail(function () {
                    vm.mask = false;
                }).always(function () {});
            },
            removeProduct : function(product_id , quantity){
                var vm = this;
                vm.mask = true;
                vm.loading.remove = true;
                vm.showLoader();
                var tableIndex = _.findIndex(vm.sources , { _id : vm.config.activeTable});
                if( tableIndex == -1) return;
                $.post('/admin/sales/pos/postRemoveProductFromTable', {
                    source_id: vm.config.activeTable,
                    product_id: product_id,
                    quantity: quantity,
                }, function (res) {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        var data = res.data;
                        var productIndex = _.findIndex(vm.sources[tableIndex].products , { _id : res.data._id});
                        if(productIndex >= 0){
                            vm.sources[tableIndex].products[productIndex]['updated_at'] = res.data.updated_at;
                            vm.sources[tableIndex].products[productIndex]['request_quantity'] = res.data.request_quantity;
                        }
                        socket.emit('pos_user_alert_to_chief' ,{
                            user : vm.user,
                            data :  res.data_chief.data
                        });
                        if( res.hasOwnProperty('inventory')){
                            for (var i = 0; i < vm.data.length; i++) {
                                var id = vm.data[i]._id
                                if( res.inventory.hasOwnProperty(id) ){
                                    vm.data[i].available_quantity = res.inventory[id];
                                }
                            }
                            socket.emit('pos_user_update_product_quantity' , res.inventory);
                        }
                        vm.mask = false;
                    }
                }).fail(function () {
                    vm.mask = false;
                }).always(function () {
                    vm.closeLoader();
                    vm.loading.remove = false;
                });
            },
            onChooseProduct: function(item){
                var vm = this;
                if (vm.config.activeTable == ''){
                    helper.dialog('Chưa chọn bàn !'  , 'warning', 'warning', 1000);
                    return;
                }
                if(item.manage_inventory == true && item.available_quantity <= 0) {
                    helper.dialog('Sản phẩm hết hàng !','warning'  ,'warning', 1000);
                    return;
                };
                if( vm.config.chooseNumber){
                    vm.$refs.keyboard.show(1, function (res) {
                        if (res >= 0) { 
                            vm.addProduct(item, res);
                        }
                    })
                }else{
                    vm.addProduct(item, 1);
                }
            },
            getListSuccessChief : function(){
                var vm = this;
                if( vm.loader) return;
                vm.loader = true;
                $.get( "/admin/sales/pos/getSuccessChief" , function(res){
                    if( res.error == false){
                        vm.chiefs = res.data;
                        vm.config.tab = 'wait';
                    }
                }).fail(function () {}).always(function () {
                    vm.loader = false;
                });
            },
            showModalSwitchTable: function (id, state) {
                var vm = this;
                var current = _.find(this.sources, {
                    _id: id
                });
                var source = _.filter(this.sources, function (item) {
                    var checkEmpty = true;
                    if (item.state != 'empty' && item.state != '') {
                        checkEmpty = false;
                    }
                    return item._id != id && checkEmpty;
                });
                var dismiss = true;
                var create = null ;
                var jc = $.confirm({
                    title : 'Chuyển bàn '+  current.name,
                    content : `
                        <form id="form-switch-table" @submit.stop.prevent="onSubmit">
                            <div class="form-group mg-bottom-10">
                                <label>Chọn bàn chuyển đến</label>
                                <select2 name="target" required placeholder="Chọn bàn muốn chuyển đến" :options="source" v-model="target" class="form-control"> </select2>
                            </div>
                        </form>
                    `,
                    type : 'green',
                    backgroundDismiss : function(){
                        return 'backdrop';
                    },
                    buttons :{
                        backdrop : {
                            isHidden : true,
                            action : ()=>{return dismiss}
                        },
                        save : {
                            text : 'Xác nhận',
                            btnClass : 'btn-success',
                            action : ()=>{
                                var target = create.target;
                                if( target == ''){
                                    $.dialog('Chưa chọn bàn chuyển đến !');
                                    return false;
                                }
                                dismiss = false;
                                jc.showLoading(true);
                                return new Promise((resolve, reject)=>{
                                    $.post("/admin/sales/pos/postTransferSaleSource", {
                                        id_source: id,
                                        id_target: target,
                                    }, function (res) {
                                        console.log(res);
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            resolve(true);
                                            var source = res.data.target;
                                            if( vm.config.activeTable == id){
                                                vm.config.activeTable = target;
                                            }
                                            var relation = [];
                                            if( source.hasOwnProperty('relation') && _.isArray(source['relation'])){
                                                source.relation.forEach(function(item){
                                                    relation.push(item._id);
                                                })
                                            }
                                            vm.updateSource({
                                                source : source,
                                                relation : relation ,
                                                replace :  res.data.source
                                            });
                                            $(vm.$refs.modalSwitchTable).modal('hide');
                                            helper.dialog(res.message, 'check',  'success', 1000);
                                        } else {
                                            helper.dialog(res.message, 'warning' , 'warning', 1000);
                                        }
                                    }).fail(function () {}).always(function () {
                                        
                                    });
                                }) 

                            }
                        },
                        close : {
                            text : 'Đóng',
                            btnClass : 'btn-default',
                        }
                    },
                    onOpenBefore: function () {
                        jc.showLoading( );
                    },
                    onContentReady: function () {
                        create =  new Vue({
                            el : '#form-switch-table',
                            data : {
                                target : '',
                                source : source,
                            },
                            methods:{
                                onSubmit : function(){
                                    jc.$$save.trigger('click'); 
                                }
                            },
                            mounted : function(){
                                jc.hideLoading( );
                            }
                        });
                    }
                })
                return;
            },
            showModalJoinTable : function(id){
                var vm = this;
                var current = _.find(this.sources, {
                    _id: id
                });
                if( current == undefined) return;
                
                var relation = [];
                if( current.hasOwnProperty('relation') && current['relation'] != '' && current['relation'] != null){
                    relation = current.relation.map(function(item){
                        return item._id;
                    });
                }
                var tables = _.filter(this.sources, function (item) {
                    var checkEmpty = true;
                    if (item.state != 'empty' && item.state != '') {
                        checkEmpty = false;
                    }
                    if( relation.indexOf(item._id) >= 0 ){
                        checkEmpty = true;
                    }
                    return item._id != id && checkEmpty;
                });
                var dismiss = true;
                var create = null ;
                var jc = $.confirm({
                    title : 'Chuyển bàn '+  current.name,
                    content : `
                        <form id="form-switch-table" @submit.stop.prevent="onSubmit">
                            <div class="form-group mg-bottom-10">
                                <label>Chọn bàn cần gộp </label>
                                <select2 :multiple="true" name="relation"  placeholder="Chọn bàn gộp" :options="tables"
                            v-model="relation" class="form-control"> </select2>
                            </div>
                        </form>
                    `,
                    type : 'green',
                    backgroundDismiss : function(){
                        return 'backdrop';
                    },
                    buttons :{
                        backdrop : {
                            isHidden : true,
                            action : ()=>{return dismiss}
                        },
                        save : {
                            text : 'Xác nhận',
                            btnClass : 'btn-success',
                            action : ()=>{
                                var target = create.relation;
                                // if( target  == null || target.length == 0){
                                //     $.dialog('Chưa chọn bàn cần gộp !');
                                //     return false;
                                // }
                                dismiss = false;
                                jc.showLoading(true);
                                return new Promise((resolve, reject)=>{
                                    $.post("/admin/sales/pos/postMergeSaleSource", {
                                        id_source: id,
                                        id_target: target,
                                    }, function (res) {
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            resolve(true);
                                            var relation = res.data.target.map(function(el){
                                                return el._id;
                                            })
                                            vm.updateSource({
                                                source : res.data.source,
                                                relation : relation,
                                                unrelation : res.data.unrelation
                                            });
                                            $(vm.$refs.modalJoinTable).modal('hide');
                                            helper.dialog(res.message, 'check',  'success', 1000);
                                        } else {
                                            helper.dialog(res.message, 'warning' , 'warning', 1000);
                                        }
                                    }).fail(function () {}).always(function () {

                                    });
                                }) 

                            }
                        },
                        close : {
                            text : 'Đóng',
                            btnClass : 'btn-default',
                        }
                    },
                    onOpenBefore: function () {
                        jc.showLoading( );
                    },
                    onContentReady: function () {
                        create =  new Vue({
                            el : '#form-switch-table',
                            data : {
                                tables : tables,
                                relation : relation,
                            },
                            methods:{
                                onSubmit : function(){
                                    jc.$$save.trigger('click'); 
                                }
                            },
                            mounted : function(){
                                jc.hideLoading( );
                            }
                        });
                    }
                })
                return;
            },
            showModalConfig : function(){
                this.setting = true;
            },
            showModalReport: function(){
                this.report = true;
            },
            clearTable: function (id) {
                var vm = this;
                vm.comfirm('Thông báo !', 'Xác nhận hủy bàn  ?', {
                    save: {
                        text: 'Xác nhận',
                        btnClass: 'btn-success',
                        keys: ['enter'],
                        action: function () {
                            vm.showLoader();
                            $.post("/admin/sales/pos/postCancelTable", {
                                _id: id,
                            }, function (res) {
                                if (res.status == 403) return;
                                if (res.error == false) {
                                    vm.config.tab = 'table';
                                    vm.config.activeTable = '';
                                    var object = {
                                        source : res.data,
                                        unrelation : res.unrelation,
                                        clear : id,
                                    }
                                    if( res.hasOwnProperty('inventory')){
                                        object['update_product_quantity'] = res.inventory;
                                    }
                                    vm.updateSource(object)
                                    helper.dialog(res.message,'check', 'success', 1000);
                                } else {
                                    helper.dialog(res.message, 'warning','warning', 1000);
                                }
                            }).fail(function () {}).always(function () {
                                vm.closeLoader();
                            });
                        }
                    },
                    close: {
                        text: 'Đóng',
                        btnClass: 'btn-default',
                        keys: ['esc'],
                    }
                });
            },
            comfirm: function (title, content, button) {
                var jc = $.confirm({
                    title: title == undefined ? '' : title,
                    content: content == undefined ? '' : content,
                    buttons: button,
                });
            },
            fullScreen: function () {
                if ((document.fullScreenElement && document.fullScreenElement !== null) ||
                    (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                    if (document.documentElement.requestFullScreen) {
                        document.documentElement.requestFullScreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullScreen) {
                        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                    this.config.isFullScreen = true;
                } else {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                    this.config.isFullScreen = false;
                }
            },
            showLoader: function () {
                this.loader = true;
            },
            closeLoader: function (timeout , callback) {
                if (timeout == undefined) {
                    timeout = 500;
                }
                var vm = this;
                setTimeout(function () {
                    vm.loader = false;
                    if( typeof callback == 'function'){
                        callback();
                    }
                }, timeout);
            },
            updateProductQuantity : function(inventory){
                for (var i = 0; i < this.products.length; i++) {
                    var id = this.products[i]._id
                    if( inventory.hasOwnProperty(id) ){
                        this.products[i].available_quantity = inventory[id];
                    }
                }
            },
            updateSource : function(res){
                if( res == undefined) return;
                if( !res.hasOwnProperty('source')) return;
                var source = res.source;
                var relation = [] , unrelation = [];
                if( res.hasOwnProperty('relation')){
                    relation = res.relation;
                }
                if( res.hasOwnProperty('unrelation')){
                    unrelation = res.unrelation;
                }
                var data = {};
                var index = _.findIndex(this.sources , {_id : source._id});
                if( index >= 0){
                    this.$set(this.sources , index , source);
                }
                data['source'] = source;

                if( _.isArray(relation) && relation.length ){
                    relation.forEach((id)=>{
                        var i = _.findIndex(this.sources , {_id : id});
                        if( i >= 0){
                            this.$set(this.sources[i] , 'current_user' , source.current_user);
                            this.$set(this.sources[i] , 'state' , 'booked');
                            this.$set(this.sources[i] , 'relation_id' , source._id);
                        }
                    });
                    data['relation'] = relation;
                }
                if(_.isArray(unrelation) && unrelation.length){
                    unrelation.forEach((id)=>{
                        var i = _.findIndex(this.sources , {_id : id});
                        if( i >= 0){
                            this.$set(this.sources[i] , 'current_user' , '');
                            this.$set(this.sources[i] , 'state' , 'empty');
                            this.$set(this.sources[i] , 'relation_id' , '');
                        }
                    });
                    data['unrelation'] = unrelation;
                }
                if( res.hasOwnProperty('replace')){
                    var i = _.findIndex(this.sources , {_id : res.replace._id});
                    if( i >= 0){
                        this.$set(this.sources , i , res.replace);
                    }
                    data['replace'] = res.replace;
                }
                if( res.hasOwnProperty('update_product_quantity')){
                    data['update_product_quantity'] = res.update_product_quantity;
                    for (var i = 0; i < this.products.length; i++) {
                        var id = this.products[i]._id;
                        if( res.update_product_quantity.hasOwnProperty(id) ){
                            this.products[i].available_quantity = res.update_product_quantity[id];
                            this.products[i].onhand_quantity = res.update_product_quantity[id];
                        }
                    }
                }
                if( res.hasOwnProperty('clear')){
                    data['clear'] = res.clear;
                }
                if( res.hasOwnProperty('payment')){
                    data['payment'] = res.payment;
                }
                socket.emit("pos_user_update_table" , data);
            },
            updateProductInSource: function(detail){
                var source = _.findIndex(this.sources, {_id : detail.source_id});
                if( source >= 0){
                    var index = _.findIndex(this.sources[source].products , {_id : detail._id});
                    if( index >= 0){
                        this.$set(this.sources[source].products , index  , detail);
                        socket.emit("pos_user_update_table" , {
                            source : this.sources[source],
                        });
                    }
                }
            },
            createCustomer : function(callback){
                var vm = this;
                var dismiss = true;
                var create = null ;
                var jc = $.confirm({
                    title : 'Tạo mới khách hàng',
                    content : `
                        <form id="form-create-customer" @submit.stop.prevent="onSubmit">
                            <div class="form-group mg-bottom-10">
                                <label>Tên khách hàng</label>
                                <input v-model="name"  type="text" class="form-control" placeholder="Nhập tên khách hàng " />
                            </div>
                            <div class="form-group mg-bottom-10">
                                <label>Số điện thoại</label>
                                <input v-model="phone" type="number" class="form-control" placeholder="Nhập số điện thoại" />
                            </div>
                        </form>
                    `,
                    type : 'green',
                    backgroundDismiss : function(){
                        return 'backdrop';
                    },
                    buttons :{
                        backdrop : {
                            isHidden : true,
                            action : ()=>{return dismiss}
                        },
                        save : {
                            text : 'Xác nhận',
                            btnClass : 'btn-success',
                            action : ()=>{
                                var name = create.name.trim();
                                var phone = create.phone.trim();
                                if( name  == ''){
                                    $.dialog('Chưa nhập tên khách hàng !');
                                    return false;
                                }
                                if( phone  == ''){
                                    $.dialog('Chưa nhập số điện thoại !');
                                    return false;
                                }
                                if(phone.length<10 || phone.length>11){
                                    $.dialog('Số điện thoại không hợp lệ !');
                                    return false;
                                }
                                dismiss = false;
                                jc.showLoading(true);

                                return new Promise((resolve, reject)=>{
                                    $.post("/admin/sales/pos/postCreateCustomer", {
                                        name: name,
                                        phone: phone,
                                    }, function (res) {
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            
                                            if(typeof callback == 'function'){
                                                callback(res.data);
                                            }
                                            resolve(true);
                                            helper.dialog(res.message, 'check','success', 1000);
                                        } else {
                                            helper.dialog(res.message, 'warning', 'warning', 1000);
                                        }
                                    }).fail(function () {}).always(function () {});
                                }) 

                            }
                        },
                        close : {
                            text : 'Đóng',
                            btnClass : 'btn-default',
                        }
                    },
                    onOpenBefore: function () {
                        jc.showLoading( );
                    },
                    onContentReady: function () {
                        create =  new Vue({
                            el : '#form-create-customer',
                            data : {
                                name : '',
                                phone : '',
                            },
                            methods:{
                                onSubmit : function(){
                                    jc.$$save.trigger('click'); 
                                }
                            },
                            mounted : function(){
                                jc.hideLoading( );
                            }
                        });
                    }
                })
                return;
            },
            activeItemProduct : function(id , sroll){
                var detail  = this.$refs.SourceDetail;
                if( detail == undefined) return;
                var element = '#'+id;
                $('.detail_source_product').not($(element)).removeClass('is-active');
                $(element).addClass('is-active');
                if(sroll == true){
                    var list = detail.$refs.list;
                    if( list != undefined){
                        $(list).scrollToElement(element , 500);
                    }
                }
                
            },
            initKeyCode : function(){
                var vm = this;
                $(document).unbind('keydown').bind('keydown', function(event){
                    var code = (event.keyCode ? event.keyCode : event.which);
                    switch( code ){
                        case 122 :{
                            event.preventDefault();
                            console.log('F11');
                            var payment = vm.$refs.modal_payment;
                            if( payment != undefined){
                                payment.printItem();
                            }
                            break;
                        }
                        case 13 :{
                            console.log('enter');
                            var payment = vm.$refs.modal_payment;
                            if( payment != undefined){
                                payment.send();
                            }
                            break;
                        }
                        case 112 :{
                            event.preventDefault();
                            event.stopPropagation();
                            console.log('F1');

                            break;
                        }
                        case 113 :{
                            event.preventDefault();
                            event.stopPropagation();
                            console.log('F2');
                            vm.changeTab('table');
                            break;
                        }
                        case 114 :{
                            event.preventDefault();
                            event.stopPropagation();
                            console.log('F3');
                            vm.changeTab('products');
                            break;
                        }
                        case 115 :{
                            event.preventDefault();
                            event.stopPropagation();
                            console.log('F4');
                            vm.changeTab('wait');
                            break;
                        }
                        case 117 :{
                            event.preventDefault();
                            event.stopPropagation();
                            console.log('F6');
                            vm.changeTab('booked');
                            break;
                        }
                        case 118 :{
                            event.preventDefault();
                            event.stopPropagation();
                            console.log('F7');
                            vm.changeTab('order');
                            break;
                        }
                        case 119 :{
                            event.preventDefault();
                            event.stopPropagation();
                            var sourceDetail = vm.$refs.SourceDetail;
                            if( sourceDetail != undefined){
                                var customer = sourceDetail.$refs.inputCustomer;
                                console.log(customer);
                                if( customer != undefined){
                                    customer.setFocus();
                                }
                            }
                            break;
                        }
                        case 120 :{
                            event.preventDefault();
                            event.stopPropagation();
                            console.log('F9');
                            var sourceDetail = vm.$refs.SourceDetail;
                            if( sourceDetail != undefined){
                                sourceDetail._notifications();
                            }
                            break;
                        }
                        case 121 :{
                            event.preventDefault();
                            event.stopPropagation();
                            var sourceDetail = vm.$refs.SourceDetail;
                            if( sourceDetail != undefined){
                                sourceDetail._showPayment();
                            }
                            break;
                        }
                    }
                })
            }
        },
        computed: {
            
        },
        watch: {
            'config.activeTable' : function(id){
                if( id != ''){
                    this.config.activeIndexTable = _.findIndex(this.sources , {_id : id});
                }else{
                    this.config.activeIndexTable = -1;
                }
            }
        },
        
        mounted: function () {
            var vm = this;
            this.initKeyCode();
            $(vm.$refs.modalProductNote).on('hidden.bs.modal', function () {
                vm.ProductNote = null;
            });
            $(vm.$refs.modalProductNote).on('shown.bs.modal', function () {
                $(vm.$refs.ProductNoteInput).focus();
            });
            $(vm.$refs.modalPayment).on('hidden.bs.modal', function () {
                vm.payment = null;
            });
            $(vm.$refs.modalCalc).modal('show');
           
            setTimeout(() => {
                $('.page-loader').fadeOut(function(){
                    $(this).remove();
                });
            }, 1000);
            
            
            var user = $('#app').data('user');
            var host = $('#app').data('host');
            socket.emit("pos_user_connected" , {
                hostname: host,
                user_id : user._id,
                user_name : user.name,
                type : 'cashier',
            });

            socket.on('reconnect_func', function(){
                socket.on('pos_connect' ,function(){
                    socket.emit("pos_user_connected" , {
                        hostname: host,
                        user_id : user._id,
                        user_name : user.name,
                        type : 'cashier',
                    });
                })
            })
            socket.on('pos_on_admin_update_config' , function(){
                $.confirm({
                    title  : 'Thông báo',
                    content : 'Quản lý vừa cập nhật hệ thông !',
                    type : 'orange',
                    buttons: {
                        save : {
                            text : 'Tải lại trang',
                            btnClass : 'btn-success'
                        }
                    },
                    onClose: function () {
                        window.location.reload();
                    },
                })
            })
            socket.on('pos_user_connect_room', function(res){
                console.log(res.email +' connected');
            });
            socket.on('post_user_disconnect', function(res){
                console.log(res.email +' disconnected');
            });
            socket.on('pos_on_update_table', function(res){
                
                if(res.hasOwnProperty('relation') && res['relation'].length){
                    res.relation.forEach(function(id){
                        var i = _.findIndex(vm.sources , { _id : id});
                        if( i >= 0) {
                            vm.sources[i].current_user = res.source.current_user;
                            vm.sources[i]['relation_id'] = res.source._id;
                            vm.sources[i].state = 'booked';
                        }
                        if( vm.config.activeTable == id){
                            vm.config.activeTable = '';
                        }
                    })
                }
                if(res.hasOwnProperty('unrelation') && res['unrelation'].length){
                    res.unrelation.forEach(function(id){
                        var i = _.findIndex(vm.sources , { _id : id});
                        if( i >= 0) {
                            vm.sources[i].current_user = '';
                            vm.sources[i]['relation_id'] = '';
                            vm.sources[i].state = 'empty';
                        }
                        if( vm.config.activeTable == id){
                            vm.config.activeTable = '';
                        }
                    })
                }
                if( res.hasOwnProperty('replace')){
                    var index = _.findIndex(vm.sources , { _id : res.replace._id});
                    if( index >= 0){
                        Vue.set(vm.sources ,index , res.replace);
                    }
                    if( res.source.hasOwnProperty('relation')&& res.source['relation'].length){
                        res.source.relation.forEach(function(item){
                            var i = _.findIndex(vm.sources , { _id : item._id});
                            if( i >= 0) {
                                vm.sources[i].relation_id = res.source._id;
                            }
                        })
                    }
                    if( vm.config.activeTable == res.replace._id){
                        vm.config.activeTable = '';
                    }
                }
                if( res.source.hasOwnProperty('_id')){
                    var index = _.findIndex(vm.sources , { _id : res.source._id});
                    
                    if( index >= 0) {
                        Vue.set(vm.sources , index , res.source);
                    }
                    if(res.source.state == 'booked' || ( res.source.relation_id != null && res.source.relation_id != '') ){
                        if( vm.config.tab == 'booked'){
                            if( vm.$refs.tab_booking.confirm.show == true){
                                var index = _.findIndex(vm.$refs.tab_booking.confirm.selected ,  {_id : res.source._id});
                                if( index >= 0){
                                    $.dialog(res.source.name +' đã có khách vào !');
                                    vm.$refs.tab_booking.confirm.selected.splice(index, 1);
                                }
                            }
                        }
                    }
                    if(res.hasOwnProperty('clear')){
                        if( vm.config.activeTable == res.clear){
                            vm.config.activeTable = '';
                            $.dialog(res.source.name + ' đã bị hủy bởi quản lý !');
                        }
                    }
                }
            });

            socket.on('pos_user_online', function(res){
                var temp = [];
                for (var key in res) {
                    if (res.hasOwnProperty(key) && res[key].type == 'cashier') {
                        temp.push(res[key].user_id);
                    }
                }
                vm.listUsersOnline = temp;
            });

            socket.on('pos_on_send_success', function(res){
                if( vm.config.tab == 'wait'){
                    var index = _.findIndex(vm.chiefs , {_id : res.data._id});
                    if( index >= 0){
                        vm.$set(vm.chiefs , index  , res.data);
                    }else{
                        vm.chiefs.push(res.data);
                    }
                }
            });
            socket.on('pos_on_update_product_quantity', function(res){
                for (var i = 0; i < vm.products.length; i++) {
                    var id = vm.products[i]._id
                    if( res.hasOwnProperty(id) ){
                        vm.products[i].available_quantity = res[id];
                    }
                }
            })
            socket.on('pos_on_notification', function(res){
                if( vm.user._id == res.user_id){
                    vm.sound();
                    $.notify(
                    {
                        icon: 'notifications_active',
                        message: res.message,
                    }, 
                    {
                        type: 'info',
                        timer: 5000,
                        delay: 500,
                        dismissonclick:true,
                        newest_on_top: false,
                        placement : { from: "bottom",align: "right"},
                        offset : 70,
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutRight'
                        },
                    }
                );
                }
            });

            socket.on('pos_on_payment_success' , function(res){
                if( res.hasOwnProperty('source')){
                    var index = _.findIndex(vm.sources , { _id : res.source._id});
                    if( index >= 0) {
                        Vue.set(vm.sources , index , res.source);
                    }
                }
                if(res.hasOwnProperty('unrelation') && res['unrelation'].length){
                    res.unrelation.forEach(function(id){
                        var i = _.findIndex(vm.sources , { _id : id});
                        if( i >= 0) {
                            vm.sources[i].current_user = '';
                            vm.sources[i]['relation_id'] = '';
                            vm.sources[i].state = 'empty';
                        }
                    })
                }
            })
        }
    });
    return vm;
}
var app = new AppTableOrders('#app');
$(window).scannerDetection({
    timeBeforeScanTest: 200,
    startChar: [120],
    endChar: [13],
    ignoreIfFocusOn: ['input', 'textarea'],
    avgTimeByChar: 40,
    minLength:2,
    onError: function(string, qty){
        
    },
    onComplete: function (barcode , qty) {
        if( app.config.activeTable != ''){
            var item = _.find(app.products , { barcode : barcode});
            if( item != undefined){
                app.addProduct(item , 1);
            }
        }
    }
});