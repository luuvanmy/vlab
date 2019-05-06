
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
    var defaultData = {
        groups: $(element).data('groups'),
        sources: $(element).data('sources'),
        categories: $(element).data('categories'),
        warehouses: $(element).data('warehouses'),
        products: $(element).data('products'),
        provinces: $(element).data('provinces'),
        ProductName: {},
        user : $(element).data('user'),
        DefaultWarehouse : $(element).data('warehouse-id'),
        bartender  : $(element).data('bartender'),
        users : $(element).data('users'),
        setting : $(element).data('setting'),
        listUsers : {},
    }
    defaultData.groups = defaultData.groups.map(function (item) {
        return {
            _id: item._id,
            name: item.name,
        }
    });
    defaultData.warehouses = defaultData.warehouses.map(function (item) {
        return {
            _id: item._id,
            name: item.name,
        }
    });
    defaultData.provinces = defaultData.provinces.map(function (item) {
        var id = defaultData.DefaultWarehouse;
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
    var usersObject = {};
    defaultData.users.forEach(function(item){
        usersObject[item._id] = item.name;
    })
    defaultData.user = {
        _id : defaultData.user._id,
        name : defaultData.user.name,
        type_pos : defaultData.user.type_pos
    }
    defaultData.categories = defaultData.categories.map(function (item) {
        return {
            _id: item._id,
            name: item.name,
        }
    })
    
    Vue.filter('username' , function(value){
        if( usersObject.hasOwnProperty(value)){
            return usersObject[value];
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
            defaultData: defaultData,
            loader: false,
            warehouse_id :  defaultData['DefaultWarehouse'],
            groups: defaultData['groups'],
            categories: defaultData['categories'],
            products: defaultData['products'],
            warehouses: defaultData['warehouses'],
            sources: defaultData['sources'],
            ProductNames: defaultData['ProductName'],
            provinces: defaultData['provinces'],
            user: defaultData['user'],
            users : usersObject,
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
                userType:  defaultData['user']['type_pos'],
                chooseNumber : defaultData['setting']['allow_import_quantity'],
                allowOpen: defaultData['setting']['open_menu'],
                autoHideProduct: defaultData['setting']['auto_hide_product'],
                use_takeaway : defaultData['setting']['allow_takeaway'],
                use_bartender : defaultData['setting']['notify_chief'],
                use_booked : defaultData['setting']['allow_book'],
                allow_print: defaultData['setting']['allow_print'],
                time_book_notify : defaultData['setting']['time_book_notify'],
                allow_ringtone : true,
                allSetting : defaultData['setting']
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
        methods: {
            sound : function(){
                // if( this.config.allow_ringtone ){
                //     $(this.$refs.sound).trigger('play');
                // }
                
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
                    source_id: vm.sources[tableIndex]._id,
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
                    }
                }).fail(function () {}).always(function () {});
            },
            removeProduct : function(product_id , quantity){
                var vm = this;
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
                    }
                }).fail(function () {}).always(function () {
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
                                <input v-model="phone"  type="tel" class="form-control" placeholder="Nhập số điện thoại" />
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
                                var name = create.name;
                                var phone = create.phone;
                                if( name  == ''){
                                    $.dialog('Chưa nhập tên khách hàng !');
                                    return false;
                                }
                                if( phone  == ''){
                                    $.dialog('Chưa nhập số điện thoại !');
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
                    console.log(code);
                    switch( code ){
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
                            console.log('F8');
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
                            console.log('F10');
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
        created: function () {
            var vm = this;
            this.images = {
                table : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAeCAYAAABe3VzdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZGE4MmIxMi0zZDhiLTkwNGUtOGQ5NC1mNWExYzBiNTZmZDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk3RjY2OUFDMTQ4MTFFODlBMTdEMTkzMkIzMTlBMUEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDk2ZjdiZTctZTljNi01NTQyLWIxNWItYTI4YTEwNDg1YjE4IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA5LTI2VDExOjU2OjU5KzA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wOS0yNlQxMTo1OTo1OSswNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wOS0yNlQxMTo1OTo1OSswNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjEzNzVmZWNlLWNjMTEtYjg0MC04MDllLWRkMjBkMDM5OTZmYiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2ZGE4MmIxMi0zZDhiLTkwNGUtOGQ5NC1mNWExYzBiNTZmZDUiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDk2ZjdiZTctZTljNi01NTQyLWIxNWItYTI4YTEwNDg1YjE4IiBzdEV2dDp3aGVuPSIyMDE4LTA5LTI2VDExOjU5OjU5KzA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pji//kwAAAEYSURBVFiF7ZWxSgNBEIa/EwmoTTwhRQQJmCoPk2aew0p8CkmlrzGND5PKQBC0EAx2Qpq1uF2Uc+9uj73gFvs1uxzD/h+7x0xhjCFljv5boIssGEsWjCV5weP6BxF5BcbAHjDACCgOkG1sRmEzPlX1slMQmNr19ABSdc5+7b15PsElcAI8ABPgFtgObQbMgBXwDtwAX76ioj5JRMRtn4Fr4ALYhaaqalCdiJTAB7BR1XlTXZPgCFhbwac+gj0oqV5rAyxUde8r8j2xw5kvBxZryvHSJuha0D3wNpjOD1Pgjo5W1yboWssj8BKa2uMfvKISbG1hIY36PCixP0HnJj9JsmAsWTCWLBjLn1mcGsnfYBaMJQvGkrzgN8iBNj3ZMh1GAAAAAElFTkSuQmCC',
                square : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2Qzc1QTQ0QkU0OTIxMUU4OUEwRkY1RkE1ODA1QzQwNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2Qzc1QTQ0Q0U0OTIxMUU4OUEwRkY1RkE1ODA1QzQwNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZDNzVBNDQ5RTQ5MjExRTg5QTBGRjVGQTU4MDVDNDA0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZDNzVBNDRBRTQ5MjExRTg5QTBGRjVGQTU4MDVDNDA0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ufrPzAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=',
            }
        },
        mounted: function () {
            var vm = this;
            this.initKeyCode();
            $(this.$refs.sound).trigger('load');
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
            
            delete defaultData;
            
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
            console.log(item);
            if( item != undefined){
                app.addProduct(item , 1);
            }
        }
    }
});
