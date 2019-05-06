function AppTableBartender(element){
    var defaultData = {
        categories: $(element).data('categories'),
        warehouses: $(element).data('warehouses'),
        data: $(element).data('data'),
        chief: $(element).data('data-chief'),
        users : $(element).data('users'),
        warehouse_id : $(element).data('warehouse-id'),
        products : {},
    }
    var user = $(element).data('user');

    defaultData.warehouses = defaultData.warehouses.map(function (item) {
        return {
            _id: item._id,
            name: item.name,
        }
    });
    defaultData.user = {
        _id : user._id,
        name : user.name,
    }
    
    
    var users = {};
    for (var key in defaultData.users ) {
        if(defaultData.users.hasOwnProperty(key)) {
            users[key] = defaultData.users[key].name;
        }
    }
    var vm = new Vue({
        el : element,
        data :{
            categories : defaultData['categories'],
            warehouses : defaultData['warehouses'],
            user : defaultData['user'],
            warehouse_id : defaultData['warehouse_id'],
            defaultData : defaultData,
            loader: false,
            config :{ 
                isFullScreen : false,
                allow_ringtone: true,
            },
            data : $(element).data('chiefs'),
            users: users,
            active_source: '',
            keyword:{
                request : '',
                waiting: '',
                success : '',
            }
        },
        methods:{
            sound : function(){
                var vm = this;
                if( vm.config.allow_ringtone ){
                    var frm =   document.getElementById('iframe');
                    frm.src = "/resources/audio/file-sounds-1101-plucky.ogg";
                    setTimeout(function(){
                        frm.src = '';
                    },1500);
                }
            },
            increaseWaiting : function(id , quan){
                var vm = this;
                if( id == undefined   || vm.loading ) return;
                var index = _.findIndex(vm.data , { _id : id});
                if( index ==  -1) return;
                var quantity =  quan == undefined ? 1 : quan;
                if(quantity  <= 0 ) return;
                vm.loading = true;
                $.post("/admin/sales/pos/postUpdateWaitingChief", {
                    _id: id ,
                    quantity: quantity ,
                }, function (res) {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        vm.$set(vm.data , index , res.data );
                        var message = quantity + ' ' + vm.data[index].product_name + ' của '+ vm.data[index].source_name +' đang được chế biến'  ;
                        socket.emit('pos_user_send_waiting' , {
                            user_id : res.data.user_id,
                            message : message
                        });
                    }else{
                        helper.dialog(res.message ,  'warning','warning' , 2000 ,{from: "bottom",align: "right"});
                    }
                }).fail(function () {}).always(function () {vm.loading = false;});
            },
            increaseSuccess : function(id , quan){
                var vm = this;
                if( id == undefined   || vm.loading ) return;
                var index = _.findIndex(vm.data , { _id : id});
                if( index ==  -1) return;
                var quantity =  quan == undefined ? 1 : quan;
                if(quantity  <= 0 ) return;
                vm.loading = true;
                $.post("/admin/sales/pos/postUpdateSuccessChief", {
                    _id: id ,
                    quantity: quantity ,
                }, function (res) {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        vm.$set(vm.data , index , res.data );
                        socket.emit('pos_user_send_success' , {
                            data : res.data
                        });
                    }else{
                        helper.dialog(res.message , 'warning', 'warning' , 2000 ,{from: "bottom",align: "right"});
                    }
                }).fail(function () {}).always(function () {vm.loading = false;});
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
            getImage : function(id){
                if( this.names.hasOwnProperty(id) ){
                    return '/'+this.names[id].image;
                }
                return id;
            },
            removeItem : function(id , type){
                var vm = this;
                $.post("/admin/sales/pos/postUpdateChiefStatus", {
                    _id: id ,
                    field: type ,
                }, function (res) {
                    if (res.status == 403) return;
                    var index =  _.findIndex(vm.data , { _id : id });
                    if( index >= 0 ){
                        if(  type == 'request' ){
                            vm.data[index].show_on_request = false;
                        }else if( type == 'waiting'){
                            vm.data[index].show_on_waiting = false;
                        }else if( type == 'success'){
                            vm.data[index].show_on_success = false;
                        }
                        
                    }
                }).fail(function () {}).always(function () {});
            },
            alertSuccessList: function(item , $event){
                var target = $($event.target);
                target = target.is('.btn-notification') ? target : target.parents('.btn-notification');
                if( target.hasClass('disabled')) return;
                target.addClass('disabled');
                setTimeout(()=>{
                   target.removeClass('disabled');
                }, 5000);
                var message = (item.quantity - item.recive_quantity) + ' ' + item.product_name + ' của '+ item.source_name +' đang chờ cung ứng !'  ;
                socket.emit('pos_user_send_notification' , {
                    user_id : item.user_id,
                    message : message
                });
            }
        },
        watch :{
            
        },
        computed : {
            list :  function(){
                var vm = this, request = [] , waiting = [] , success = [], source_ids = {};
                vm.data.forEach(function(item){
                    if(typeof source_ids[item.source_id] == 'undefined'){
                        source_ids[item.source_id] = {
                            name: item.source_name,
                            _id: item.source_id,
                            user_name: item.user_name,
                            request_quantity: item.request_quantity,
                            cancel_quantity: item.cancel_quantity,
                            make_success: item.make_success,
                            product_ids: [item.product_id],
                            created: item.created_at
                        };
                    }else{
                        source_ids[item.source_id].request_quantity += item.request_quantity;
                        source_ids[item.source_id].cancel_quantity += item.cancel_quantity;
                        source_ids[item.source_id].make_success += item.make_success;
                        if(source_ids[item.source_id].product_ids.indexOf(item.product_id)<0){
                            source_ids[item.source_id].product_ids.push(item.product_id);
                        }
                        if(source_ids[item.source_id].created_at>item.created_at){
                            source_ids[item.source_id].created_at = item.created_at;
                        }
                    }
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
                var keyword_request = helper.convertCharacters(this.keyword.request).toLowerCase();
                var keyword_waiting = helper.convertCharacters(this.keyword.waiting).toLowerCase();
                var keyword_success = helper.convertCharacters(this.keyword.success).toLowerCase();
                request = request.filter(function(item){
                    var name = helper.convertCharacters(item.product_name).toLowerCase();
                    var keyword = true;
                    if( keyword_request != ''){
                        keyword = name.indexOf(keyword_request) >= 0 ? true : false;
                    }
                    if(vm.active_source==''){
                        return item.show_on_request && item.quantity > 0 && keyword;
                    }else{
                        return item.show_on_request && item.quantity > 0 && keyword && item.source_id==vm.active_source;
                    }
                })
                waiting = waiting.filter(function(item){
                    var name = helper.convertCharacters(item.product_name).toLowerCase();
                    var keyword = true;
                    if( keyword_waiting != ''){
                        keyword = name.indexOf(keyword_waiting) >= 0 ? true : false;
                    }
                    if(vm.active_source==''){
                        return item.show_on_waiting && item.quantity > 0  && keyword;
                    }else{
                        return item.show_on_waiting && item.quantity > 0  && keyword && item.source_id==vm.active_source;
                    }
                })
                success = success.filter(function(item){
                    var name = helper.convertCharacters(item.product_name).toLowerCase();
                    var keyword = true;
                    if( keyword_success != ''){
                        keyword = name.indexOf(keyword_success) >= 0 ? true : false;
                    }
                    if(vm.active_source==''){
                        return item.show_on_success && item.quantity > 0  && keyword;
                    }else{
                        return item.show_on_success && item.quantity > 0  && keyword && item.source_id==vm.active_source;
                    }
                })
                return {
                    request : request,
                    waiting : waiting,
                    success : success,
                    sources: source_ids
                }
            }
        },
        created : function(){
            var vm = this;
        },
        mounted : function(){
            var vm = this;
            setTimeout(() => {
                $('.page-loader').fadeOut(function(){
                    $(this).remove();
                });
            }, 1000);
            delete defaultData;
            
            socket.on('reconnect_func', function(){
                console.log('init reconnect_func');
                socket.on('pos_connect' ,function(){
                    window.location.reload();
                })
            })
            socket.on('pos_user_online', function(res){
                app.users = res;
            });
            socket.on('pos_on_alert_to_chief' , function(res){
                vm.sound();
                $.notify({
                    icon: 'notifications_active',
                    message: res.source + ' vừa báo bếp ',
                }, 
                {
                    type: 'warning',
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
                });
                res.data.forEach(function(item){
                    if( item.type == 'push'){
                        vm.data.push(item.data);
                    }else if( item.type == 'cancel'){
                        for (var i = 0; i < item.data.length; i++) {
                            var index = _.findIndex(vm.data , { _id : item.data[i]._id});
                            vm.$set(vm.data , index  , item.data[i]);
                        }
                    }
                })
            });
            socket.on('pos_on_clear_table', function(res){
                vm.sound();
                for (var i = 0; i < vm.data.length; i++) {
                    if(vm.data[i].source_id == res){
                        vm.$set(vm.data[i] ,'cancel_quantity' , vm.data[i].request_quantity);
                        vm.$set(vm.data[i] ,'status' , 'clear');
                    }
                }
            })
            socket.on('pos_on_supply', function(res){
                vm.sound();
                var index = _.findIndex(vm.data , {_id : res.chief._id});
                if( index >= 0){
                    vm.$set(vm.data[index] ,'recive_quantity' , res.chief.recive_quantity);
                    vm.$set(vm.data[index] ,'updated_at' ,  res.chief.updated_at);
                }
            })
            socket.on('pos_on_payment_success' , function(res){
                vm.sound();
                vm.data = vm.data.filter(function(item){
                    return item.source_id != res;
                });

            })
            socket.on('pos_on_update_note_product' , function(res){
                vm.sound();
                for (var i = 0; i < vm.data.length; i++) {
                    if(vm.data[i].source_id==res.data.source_id && vm.data[i].product_id==res.data.product_id){
                        vm.data[i].note = res.data.note;
                    }
                }
            })
            
        }
    })
    return vm;
}
var appTableBartender = new AppTableBartender('#app');
var user = $('#app').data('user');
var host = $('#app').data('host');
socket.emit("pos_user_connected" , {
    hostname: host,
    user_id : user._id,
    user_name : user.name,
    type : 'chief',
    table : '',
});

