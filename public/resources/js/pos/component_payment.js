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
                                    <button class="btn btn-success btn-payment" @click.stop.prevent="send()">
                                        Xác nhận (Enter)
                                    </button>
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
            
            $.post("/admin/sales/saleorder/getPrintOrder", {
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
        vm.loader = true;
    },
})