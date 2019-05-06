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
            <div class="source-detail-body" :class="{ 'has-alert' : tables.alert }" >
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
                        <i class="material-icons">notifications_active</i>&nbsp;Bạn vừa cập nhật thêm đơn hàng !. Click <strong>"Báo bếp"</strong> để đồng bộ đơn hàng với bếp !
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
                console.log(res);
                if (res.status == 403) return;
                if (res.error == false) {
                    this.$root.comfirm('Thông báo !', res.hasOwnProperty('message') ? res.message : '', {
                        save: {
                            text: 'Xác nhận',
                            btnClass: 'btn-success',
                            keys: ['enter'],
                            action: ()=>{
                                $.post("/admin/sales/pos/postUpdateQuantityProductFromTable", {
                                    source_id: this.source._id,
                                    product_id: this.item.product_id,
                                    quantity: 0 ,
                                }, (res)=> {
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
                        $.post("/admin/sales/pos/postUpdateQuantityProductFromTable", {
                            source_id: this.source._id,
                            product_id: this.item.product_id,
                            quantity: 0 ,
                        }, (res)=> {
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
                        }).fail(function () {}).always(function () {});
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
            }).fail(function () {}).always( ()=>{this.loading = false});
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
                            source: this.source.name,
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





