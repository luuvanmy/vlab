/*socket*/
var uri = "http://192.168.1.250:3001/?client_id=" + window.location.hostname;
let domain = (window.location.hostname + "").split(".").join("_");
const socket_cafe = io(uri);
if( ! window.hasOwnProperty(domain) ){
    window[domain] = {};
}
socket_cafe.on("update_item_sale_source",function(data){
    if(window[domain].hasOwnProperty("app")){
        if(window[domain].app.active_main_tab == 'sale' ){
            window[domain].app._loadSaleSource();
            window[domain].app.$forceUpdate();
        }
    }
});

/*end socket*/
$( document ).ajaxComplete(function(event, xhr, settings) {
    if(settings.type == "POST"){
        if(xhr.responseJSON && xhr.responseJSON.refresh){

            if( xhr.responseJSON.hasOwnProperty("type")){
                if(xhr.responseJSON.type =="products"){
                    socket_cafe.emit("update_products");
                }else{
                    socket_cafe.emit("update_item_" + xhr.responseJSON.type,xhr.responseJSON.data );
                }
            }

        }
    };
});


function AppCafe(element) {
    if (!$(element).length) return;
    var timeout = null;
    var vm = new Vue({
        el: element,
        data: {
            configFile: {
                size: 3,
                extension: ['xls', 'xlsx'],
            },
            active_main_tab: 'config',
            print_config:false,
            print:_print,
            loading: false,
            config: {
                allow_print_after_order: config.allow_print_after_order,
                allow_order_by_qrcode: config.allow_order_by_qrcode,
                allow_sound_after_order: config.allow_sound_after_order,
                shop_title: config.shop_title,
                edit_shop_title: false,
                btn_save: false
            },
            data_sale:{
                warehouse_id: typeof warehouses[0]!='undefined' ? warehouses[0]._id : '',
                data:[],
                loading:false,
            },
            products : {
                data : [],
                limit : 10,
                total : 0,
                page : 1,
                keyword : '',
                category_id : 'all',
                loading : false,
                timeout : null,
                remove_id_loading: 0,
                edit_id_loading: 0,
                edit_item: {
                    _id: '',
                    sku: '',
                    category_id: '',
                    price_sale: 0,
                    name: '',
                    primary_image: null,
                    unit_product:''
                },
                btn_save: false,
                isUploading: false,
                data_import: []
            },
            sale_orders:{
                pagination:{
                    page:1,
                    current:1,
                    total:0,
                    limit:10,
                    total_records:0
                },
                data:[],
                keyword:'',
                loading:false,
                date:{
                    startDate : parseInt(moment().startOf('month').valueOf() / 1000),
                    endDate : parseInt(moment().endOf('month').valueOf() / 1000),
                }
            },
            sale_order_details:{
                show:false,
                data:[],
                so:{}
            },
            groups : {
                print_data: [],
                data: [],
                limit : 10,
                total : 0,
                page : 1,
                current : 1,
                keyword : '',
                warehouse_id : 'all',
                loading : false,
                remove_id_loading: 0,
                remove_id_loading: 0,
                edit_id_loading: 0,
                edit_item: {
                    _id: '',
                    warehouse_id: '',
                    name: ''
                },
                btn_save: false,

            },
            table : {
                data: [],
                print_data: [],
                limit : 10,
                total : 0,
                page : 1,
                current : 1,
                print_keyword : '',
                print_warehouse_id : typeof warehouses[0]!='undefined' ? warehouses[0]._id : 'all',
                print_group_id : 'all',
                keyword : '',
                warehouse_id : 'all',
                group_id : 'all',
                loading : false,
                print_loading : false,
                remove_id_loading: 0,
                remove_id_loading: 0,
                edit_id_loading: 0,
                edit_item: {
                    _id: '',
                    warehouse_id: '',
                    group_id: '',
                    name: ''
                },
                btn_save: false,
                print_qr: [],
                open_print_loading: false,
                print_btn_save: false
            },
            accounts : {
                data: [],
                limit : 10,
                total : 0,
                page : 1,
                current : 1,
                keyword : '',
                warehouse_id : 'all',
                loading : false,
                remove_id_loading: 0,
                remove_id_loading: 0,
                edit_id_loading: 0,
                edit_item: {
                    _id: '',
                    warehouse_id: '',
                    name: '',
                    email: '',
                    phone: '',
                    cafe_allow_order: false,
                    cafe_allow_payment: false,
                    cafe_active : false
                },
                btn_save: false
            },
            data_warehouses:{
                data: [],
                limit : 10,
                total : 0,
                page : 1,
                current : 1,
                keyword : '',
                loading : false,
                remove_id_loading: 0,
                remove_id_loading: 0,
                edit_id_loading: 0,
                edit_item: {
                    _id: '',
                    code: '',
                    name: '',
                    city_id:'',
                    district_id:'',
                    ward_id:'',
                    address:'',

                },
                btn_save: false,
                open_print_loading:false,
                print_btn_save:false,
                print_data:[],
                print_keyword:''
            },
            categories : [],
            warehouses : warehouses,
            units : [],
            upload_image:{
                src: '',
                complete: 0,
                btn_save: false
            },
            loading_page: false,
            loading_create_product:false,
            create_cate:{
                name:'',
                code:'',
                parent_id:''
            },
            create_unit:{
                name:'',
                group:'normal',
                type:'product'
            },
            formstate1:{},
            formstate2:{},
            loading_category:false
        },
        created: function () {
            var uri = (window.location.href + "").split("#");
            if( uri.length > 1 ){
                this.active_main_tab = uri[1];
            }
        },
        methods: {
            'checkSku': function(value){
                for (var i = 0; i < value.length; i++) {
                    if (value.charCodeAt(i) > 127) return false;
                }
                return true;
            },
            showModalCreateCate: function(){
                console.log(1);
                $("#createCategoryIn").modal('show');
            },
            createCategory: function(){
                if(this.formstate1.$valid){
                    var vm = this;
                    $.post("/admin/sale/cafe/postCreateCategory",{data:vm.create_cate}, function(result){
                        vm.loading = false;
                        if(!result.error){
                            vm.categories.push(result.category);
                            vm.products.edit_item.category_id = result.category._id;
                            vm.create_cate = {
                                name:'',
                                code:'',
                                parent_id:''
                            };
                            vm.formstate1.$submitted = false;
                            $("#createCategoryIn").modal('hide');
                        }else{
                            alert(result.message);
                        }
                        
                    });
                }
            },
            showModalCreateUnit: function(){
                $("#createUnitIn").modal('show');
            },
            createUnit: function(){
                if(this.formstate2.$valid){
                    var vm = this;
                    $.post("/admin/sale/cafe/postCreateUnit",{data:vm.create_unit}, function(result){
                        console.log(result);
                        vm.loading = false;
                        if(result.hasOwnProperty('error') && !result.error){
                            vm.units.push(result.unit);
                            vm.products.edit_item.unit_product = result.unit._id;
                            vm.create_unit.name = "";
                            vm.formstate2.$submitted = false;
                            $("#createUnitIn").modal('hide');
                        }else{
                            alert(result.message);
                        }
                        
                    });
                }
            },
            abcdef: function(){
                $.get("http://192.168.1.250:3001/api/cafe/refresh-server-data",()=>{

                })
            },
            _reviewPrintFile: function(type){
                var vm = this;
                var ifr = document.createElement('iframe');
                ifr.style='height: 0px; width: 0px; position: absolute'
                document.body.appendChild(ifr);
                if(type == 'table'){
                    vm.table.print_btn_save = true;
                    $(".qr-print-data").clone().appendTo(ifr.contentDocument.body);
                }else{
                    vm.data_warehouses.print_btn_save = true;
                    $(".qr-print-data-warehouse").clone().appendTo(ifr.contentDocument.body);
                }



                var style = document.createElement("style");
                style.type = "text/css";
                style.rel = 'stylesheet';
                var style_code = '';
                style_code +=`.text-center{text-align: center}
                p{margin: 0;}
                .title{font-size: 10px;}
                .card-qr{
                   width: 180px;
                   background: #fff;
                   border: solid 1px #555;
                   margin-right: 3px;
                   margin-bottom: 3px;
                   float: left;
                   max-height: 192px;
                }
                .card-qr .qr-header{
                  margin-top: 10px;
                	font-weight: bold;
                	font-size: 18px;
                	margin-bottom: 0;
                }
                .qr-content {
                	text-align: center;
                	position: relative;
                	float: left;
                	width: 100%;
                }
                .qr-content .qr-container {
                   float: left;
                   width: 147px;
                }
                .qr-content .qr-code{
                	position: relative;
                	width: fit-content;
                	margin: auto;
                }
                .qr-content .qr-container .link{
                   font-weight: bold;
                   font-size: 10px;
                   margin-top: -6px;
                   position: relative;
                   z-index: 1;
                }
                .qr-content .rotate{
                   right: 0;
                   top: 50%;
                   transform: rotate(-90deg) translate(60%, 26px);
                   position: relative;
                   line-height: 14px;
                   text-align: left;
                   float: right;
                   height: 27px;
                   width: 123px;
                   font-size: 10px;
                }`;
                // style_code += '.col-xs-4{width: 33.33333333%;float:left;min-height: 1px;position:relative;}';
                // style_code += '.item-qrcode{background:#fff;border: 1px solid #666;margin-bottom:30px;overflow:hidden;margin:15px 15px 0px 15px;}';
                // style_code += '.item-qrcode .qr-title{font-size:18px;font-weight: bold;text-align: center;padding:5px 0px;margin-top:10px;color: #007fff;}';
                // style_code += '.item-qrcode .qr-small-title{text-align: center;font-size:12px;padding:0px 10px;display:block;margin-bottom:10px;color:#000;}';
                // style_code += '.item-qrcode .qr-content{overflow:hidden;}';
                // style_code += '.item-qrcode .qr-content .qr-container{width: 60%;margin:5px auto 25px auto;text-align:center;border-radius:5px;border:1px solid #007fff;padding:10px;}';
                // style_code += '.item-qrcode .qr-content .qr-container .qr-header{font-size:20px;font-weight:bold;color:#000;}';
                // style_code += '.item-qrcode .qr-content p{margin-bottom:15px;font-size:12px;text-align:center;}';
                // style_code += '.item-qrcode .qr-footer{background-color: #0080ff;color:#fff;text-align:center;padding: 5px 0px;height:30px;overflow:hidden;}';
                // style_code += '.item-qrcode .qr-footer img{height:35px;float:left}';
                // style_code += '.item-qrcode .qr-footer p{font-size:10px;display:inline-block;border-left:1px solid #61b0ff;padding:0x;padding-left:10px;}';
                style.innerHTML = style_code;
                ifr.contentDocument.body.appendChild(style);
                setTimeout(function(){
                    vm.table.print_btn_save = false;
                    vm.data_warehouses.print_btn_save = false;
                    ifr.contentWindow.print();
                    ifr.parentElement.removeChild(ifr);
                },1000);
            },
            _showModalQR: function(){
                var vm = this;
                vm.table.open_print_loading = true;
                $.post("/admin/sale/cafe/postLoadSource",{
                    page:1,
                    limit: 500,
                    warehouse_id: vm.table.print_warehouse_id
                }, function(result){
                    vm.table.print_data = result.table;
                    vm.groups.print_data = result.groups;
                    vm.table.open_print_loading = false;
                    $(vm.$refs.modalPrintQR).modal('show');
                });
            },
            _showModalQRWarehouse: function(){
                var vm = this;
                vm.data_warehouses.open_print_loading = true;
                $.post("/admin/sale/cafe/postLoadWarehouses",{
                    page : 1,
                    limit : 500,
                    keyword : vm.data_warehouses.keyword,
                }, function(result){
                    vm.data_warehouses.print_data = result.warehouses;
                    vm.data_warehouses.open_print_loading = false;
                    $(vm.$refs.modalPrintQRWarehouse).modal('show');
                });
            },
            _showModalCreateAccount: function(){
                var vm = this;
                var createSource = null ;
                var jc = $.confirm({
                    title : 'Tạo mới tài khoản',
                    content : `
                        <form id="form-create-source" @submit.stop.prevent="onSubmit">
                            <div class="form-group mg-bottom-10">
                                <label>Họ tên</label>
                                <input ref="name" type="text" v-model="name" placeholder="Nhập họ tên" class="name form-control" required />
                            </div>
                            <div class="form-group mg-bottom-10">
                                <label>Số điện thoại</label>
                                <input ref="phone" type="text" v-model="phone" placeholder="Nhập số điện thoại" class="form-control" required />
                            </div>
                            <div class="form-group mg-bottom-10">
                                <label>Email</label>
                                <input ref="email" type="text" v-model="email" placeholder="Nhập email đăng nhập" class="form-control" required />
                            </div>
                            <div class="form-group mg-bottom-10">
                                <label>Mật khẩu</label>
                                <input ref="password" type="password" v-model="password" placeholder="Nhập mật khẩu" class="form-control" required />
                            </div>
                            <div class="form-group">
                                <label>Chi nhánh làm việc</label>
                                <select class="form-control" v-model="warehouse_id">
                                    <option value="">Chọn chi nhánh</option>
                                    <option :value="item._id" v-for="item in warehouses">{{ item.name }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" class="form-control" v-model="cafe_allow_order" />
                                    Được phép order
                                </label>
                            </div>
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" class="form-control" v-model="cafe_allow_payment" />
                                    Được phép thanh toán
                                </label>
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
                                var phone = createSource.phone;
                                var warehouse_id = createSource.warehouse_id;
                                var email = createSource.email;
                                var password = createSource.password;
                                var cafe_allow_order = createSource.cafe_allow_order;
                                var cafe_allow_payment = createSource.cafe_allow_payment;

                                if( name == ''){
                                    $.dialog('Chưa nhập tên tài khoản !');
                                    return false;
                                }
                                if( phone == ''){
                                    $.dialog('Chưa nhập số điện thoại !');
                                    return false;
                                }
                                if( warehouse_id == ''){
                                    $.dialog('Chưa chọn chi nhánh làm việc !');
                                    return false;
                                }
                                if( email == ''){
                                    $.dialog('Chưa nhập email đăng nhập !');
                                    return false;
                                }
                                if( password == ''){
                                    $.dialog('Chưa nhập mật khẩu !');
                                    return false;
                                }
                                return new Promise((resolve, reject)=>{
                                    $.post("/admin/sale/cafe/postAddAccount", {
                                        name : name,
                                        warehouse_id : warehouse_id,
                                        email : email,
                                        password : password,
                                        phone : phone,
                                        cafe_allow_order: cafe_allow_order,
                                        cafe_allow_payment: cafe_allow_payment
                                    },  (res) => {
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            vm._loadAccount(1);
                                            resolve(true);
                                        }else{
                                            alert(res.message);
                                        }
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
                                email : '',
                                password: '',
                                phone: '',
                                warehouse_id: vm.warehouses.length>0 ? vm.warehouses[0]._id : '',
                                warehouses : vm.warehouses,
                                cafe_allow_payment: false,
                                cafe_allow_order: true
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
            _onChangePassword: function(item){
                var user = item;
                var vm = this;
                var createSource = null ;
                var jc = $.confirm({
                    title : 'Thay đổi mật khẩu',
                    content : `
                        <form id="form-change-pass" @submit.stop.prevent="onSubmit">
                            <div class="form-group mg-bottom-10">
                                <label>Mật khẩu mới</label>
                                <input ref="new_pass" type="password" v-model="new_password" placeholder="Nhập mật khẩu mới" class="form-control" required />
                            </div>
                            <div class="form-group mg-bottom-10">
                                <label>Nhập lại mật khẩu</label>
                                <input ref="re_pass" type="password" v-model="re_password" placeholder="Nhập lại mật khẩu" class="form-control" required />
                            </div>
                        </form>
                    `,
                    type : 'green',
                    buttons :{
                        save : {
                            text : 'Xác nhận',
                            btnClass : 'btn-success',
                            action : ()=>{
                                var old_password = createSource.old_password;
                                var new_password = createSource.new_password;
                                var re_password = createSource.re_password;
                                var _id = createSource.use_id;

                                if( new_password == ''){
                                    $.dialog('Chưa nhập mật khẩu mới !');
                                    return false;
                                }
                                if( new_password.length <6){
                                    $.dialog('Mật khẩu mới chứa ít nhất 6 ký tự !');
                                    return false;
                                }
                                if( new_password != re_password){
                                    $.dialog('Mật khẩu không trùng nhau !');
                                    return false;
                                }

                                return new Promise((resolve, reject)=>{
                                    $.post("/admin/sale/cafe/postChangePassword", {
                                        _id : _id,
                                        old_password : old_password,
                                        new_password : new_password,
                                    },  (res) => {
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            resolve(true);
                                        }else{
                                            $.dialog(res.message);
                                            resolve(false);
                                        }
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
                            el : '#form-change-pass',
                            data : {
                                new_password:'',
                                old_password:'',
                                re_password:'',
                                use_id:user._id
                            },
                            methods:{
                                onSubmit : function(){
                                    jc.$$save.trigger('click');
                                }
                            },
                            mounted : function(){
                                jc.hideLoading( );
                                $(this.$refs.old_pass).focus();
                            }
                        });
                    }
                })
            },
            _showModalCreateSource: function(){
                var vm = this;
                var createSource = null ;
                var jc = $.confirm({
                    title : 'Tạo mới bàn',
                    content : `
                        <form id="form-create-source" @submit.stop.prevent="onSubmit">
                            <div class="form-group">
                                <label>Chi nhánh</label>
                                <select class="form-control" v-model="warehouse_id">
                                    <option value="">Chọn chi nhánh</option>
                                    <option :value="item._id" v-for="item in warehouses">{{ item.name }}</option>
                                </select>
                            </div>
                            <div class="form-group mg-bottom-10">
                                <label>Tên bàn</label>
                                <input ref="name" type="text" v-model="name" placeholder="Nhập tên bàn" class="name form-control" required />
                            </div>
                            <div class="form-group">
                                <label>Khu vực</label>
                                <select class="form-control" v-model="group_id">
                                    <option value="">Chọn khu vực</option>
                                    <option :value="item._id" v-for="item in groups" v-if="item.warehouse_id==warehouse_id">{{ item.name }}</option>
                                </select>
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
                                return new Promise((resolve, reject)=>{
                                    $.post("/admin/sale/cafe/postAddSaleSource", {
                                        name : name,
                                        group_id : group_id,
                                    },  (res) => {
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            vm._loadTable(1);
                                            resolve(true);
                                        }else{
                                            alert(res.message);
                                        }
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
                                warehouse_id: vm.warehouses.length>0 ? vm.warehouses[0]._id : '',
                                groups : vm.groups.data,
                                warehouses : vm.warehouses
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
            _showModalCreateGroup: function(){
                var vm = this;
                var createGroup = null ;
                var jc = $.confirm({
                    title : 'Tạo mới khu vực',
                    content : `
                        <form id="form-create-group" @submit.stop.prevent="onSubmit">
                            <div class="form-group mg-bottom-10">
                                <label>Tên khu vực</label>
                                <input ref="name" type="text" v-model="name" placeholder="Nhập tên khu vực" class="name form-control" required />
                            </div>
                            <div class="form-group">
                                <label>Chi nhánh</label>
                                <select class="form-control" v-model="warehouse_id">
                                    <option value="">Chọn chi nhánh</option>
                                    <option :value="item._id" v-for="item in warehouses">{{ item.name }}</option>
                                </select>
                            </div>
                        </form>
                    `,
                    type : 'green',
                    buttons :{
                        save : {
                            text : 'Xác nhận',
                            btnClass : 'btn-success',
                            action : function(){
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
                                return new Promise((resolve, reject)=>{
                                    $.post("/admin/sale/cafe/postAddSaleGroupSource", {
                                        name : name,
                                        warehouse_id : warehouse_id,
                                    },  (res) => {
                                        if (res.status == 403) return;
                                        if (res.error == false) {
                                            vm._loadGroup(1);
                                            resolve(true);
                                        }
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
                        jc.showLoading();
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
            uploadLogo: function(){
                $('#file_logo').click()
            },
            _changeLogo: function(event){
                var vm = this;
                var files = event.target.files || event.dataTransfer.files ;
                if( files.length ){
                    if( /^image\/\w+/.test(files[0].type)  ){
                        var reader = new FileReader();
                        reader.onload = function(e){
                            vm.upload_image.src = e.target.result;
                            var formData = new FormData();
                            formData.append('file', vm.upload_image.src);
                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', "/admin/sale/cafe/postUploadImageSimple", true);
                            xhr.upload.onprogress = function(e) {

                            };
                            xhr.onload = function() {
                                var res = JSON.parse(this.response);
                                if (this.status == 200) {
                                    vm.print.logo = res.data;
                                    vm.upload_image.src = '';
                                }else{
                                    alert("Tải ảnh lên thất bại");
                                }
                            };
                            xhr.send(formData);
                        };
                        reader.readAsDataURL(files[0]);
                    }else{
                        var msg = files[0].name +' - định dạng này không hợp lệ .';
                        alert(msg);
                    }
                }
                $(event.target).val('');
            },
            settingPrint: function(){
                var vm = this;
                if(vm.print.loading){
                    return;
                }else{
                    vm.print.loading = true;
                }

                $.post("/admin/sale/cafe/postUpdateSettingPrint",{ data: vm.print }, function(result){
                    vm.print.loading = false;
                    if(result.hasOwnProperty('error') && !result.error){
                        helper.dialog(result.message , 'check' , 'success' , 1000);
                    }else{
                        alert(result.message);
                    }

                });
            },
            _changeImage: function(event){
                var vm = this;
                var files = event.target.files || event.dataTransfer.files ;
                if( files.length ){
                    if( /^image\/\w+/.test(files[0].type)  ){
                        var reader = new FileReader();
                        reader.onload = function(e){
                            vm.upload_image.src = e.target.result;
                            $(vm.$refs.modalChangeImage).modal("show");
                        };
                        reader.readAsDataURL(files[0]);
                    }else{
                        var msg = files[0].name +' - định dạng này không hợp lệ .';
                        alert(msg);
                    }
                }
                $(event.target).val('');
            },
            _sendUploadImage: function(){
                if(this.upload_image.src!=''){
                    var vm = this;
                    vm.upload_image.btn_save = true;
                    var formData = new FormData();
                    formData.append('file', vm.upload_image.src);
                    formData.append('_id', vm.products.edit_item._id);
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', "/admin/sale/cafe/postUploadImage", true);
                    xhr.upload.onprogress = function(e) {
                        if (e.lengthComputable) {
                            var percentValue = (e.loaded / e.total) * 100;
                            vm.upload_image.complete = percentValue;
                        }
                    };
                    xhr.onload = function() {
                        if (this.status == 200) {
                            $(vm.$refs.modalChangeImage).modal("hide");
                            vm.upload_image.btn_save = false;
                            vm.products.edit_item = {
                                _id: '',
                                sku: '',
                                category_id: '',
                                price_sale: 0,
                                name: '',
                                primary_image: '',
                                unit_product: ''
                            };
                            vm._load(vm.products.page);
                            vm.upload_image.src = '';
                        }else{
                            vm.upload_image.btn_save = false;
                            alert("Tải ảnh lên thất bại");
                        }
                    };
                    xhr.send(formData);
                }
            },
            _showGallery:function(item) {
                var vm = this;
                if(typeof item!='undefined'){
                    vm.products.edit_item.category_id = item.category_id;
                    vm.products.edit_item.name = item.VariantName;
                    vm.products.edit_item.price_sale = item.price_sale;
                    vm.products.edit_item._id = item._id;
                    vm.products.edit_item.primary_image = item.primary_image;
                    vm.products.edit_item.unit_product = item.unit_product;
                    vm.products.edit_item.sku = item.sku;
                }
                document.getElementById("file_change").click();
            },
            _updateProduct: function(){
                var vm = this;
                vm.products.btn_save = true;
                $.post("/admin/sale/cafe/postUpdateProduct",vm.products.edit_item, function(result){
                    vm.products.edit_id_loading = 0;
                    if(!result.error){
                        vm.upload_image.btn_save = false;
                        vm.products.edit_item = {
                            _id: '',
                            sku: '',
                            category_id: '',
                            price_sale: 0,
                            name: '',
                            primary_image: '',
                            unit_product: ''
                        };
                        vm.products.btn_save = false;
                        vm._load(vm.products.page);
                    }else{
                        alert(result.message);
                    }

                });
            },
            _onEditProduct: function(item){
                var vm = this;
                vm.products.edit_id_loading = item._id;
                vm.products.edit_item.category_id = item.category_id;
                vm.products.edit_item.name = item.VariantName;
                vm.products.edit_item.price_sale = item.price_sale;
                vm.products.edit_item._id = item._id;
                vm.products.edit_item.primary_image = item.primary_image;
                vm.products.edit_item.unit_product = item.unit_product;
                vm.products.edit_item.sku = item.sku;
            },
            _onRemoveProduct: function(id){
                var vm = this;
                vm.products.remove_id_loading = id;
                $.post("/admin/sale/cafe/postRemoveProduct",{id: id}, function(result){
                    vm.products.remove_id_loading = 0;
                    vm._load(vm.products.page);
                });
            },
            _onRemoveWarehouse: function(id){
                var vm = this;
                vm.products.remove_id_loading = id;
                $.post("/admin/sale/cafe/postRemoveWarehouse",{id: id}, function(result){
                    vm.data_warehouses.remove_id_loading = 0;
                    vm._loadWarehouse(vm.data_warehouses.page);
                });
            },
            _onEditAccount: function(item){
                var vm = this;
                vm.accounts.edit_id_loading = item._id;
                vm.accounts.edit_item.warehouse_id = item.warehouses.map(function(item){
                    return item._id;
                });
                vm.accounts.edit_item.name = item.name;
                vm.accounts.edit_item.email = item.email;
                vm.accounts.edit_item.cafe_allow_payment = typeof item.cafe_allow_payment!='undefined' ? item.cafe_allow_payment : false;
                vm.accounts.edit_item.cafe_allow_order = typeof item.cafe_allow_order!='undefined' ? item.cafe_allow_order : false;
                vm.accounts.edit_item.cafe_active = typeof item.cafe_active!='undefined' ? item.cafe_active : false;
                vm.accounts.edit_item._id = item._id;
            },
            _updateAccount: function(){
                var vm = this;
                vm.accounts.btn_save = true;
                $.post("/admin/sale/cafe/postUpdateAccount",vm.accounts.edit_item, function(result){
                    if(!result.error){
                        vm.accounts.edit_id_loading = 0;
                        vm.accounts.edit_item = {
                            _id: '',
                            warehouse_id: '',
                            cafe_allow_order: false,
                            cafe_allow_payment: false,
                            name: ''
                        };
                        /** thông báo sự thay đổi của tài khoản đến sockect */
                        socket_cafe.emit("change_user_account", result.data);
                        /** end  */
                        vm._loadAccount(vm.accounts.page);
                    }else{
                        alert(result.message);
                    }
                    vm.accounts.btn_save = false;
                });
            },
            _updateGroup: function(){
                var vm = this;
                vm.groups.btn_save = true;
                $.post("/admin/sale/cafe/postUpdateGroupSource",vm.groups.edit_item, function(result){
                    vm.groups.edit_id_loading = 0;
                    if(!result.error){
                        vm.groups.edit_item = {
                            _id: '',
                            warehouse_id: '',
                            name: ''
                        };
                        vm.groups.btn_save = false;
                        vm._loadGroup(vm.groups.page);
                    }else{
                        alert(result.message);
                    }

                });
            },
            _onEditGroup: function(item){
                var vm = this;
                vm.groups.edit_id_loading = item._id;
                vm.groups.edit_item.warehouse_id = item.warehouse_id;
                vm.groups.edit_item.name = item.name;
                vm.groups.edit_item._id = item._id;
            },
            _updateSource: function(){
                var vm = this;
                vm.table.btn_save = true;
                $.post("/admin/sale/cafe/postUpdateSource",vm.table.edit_item, function(result){
                    vm.table.edit_id_loading = 0;
                    if(!result.error){
                        vm.table.edit_item = {
                            _id: '',
                            group_id: '',
                            warehouse_id: '',
                            name: ''
                        };
                        vm.table.btn_save = false;
                        vm._loadTable(vm.table.page);
                    }else{
                        alert(result.message);
                    }

                });
            },
            _onEditSource: function(item){
                var vm = this;
                vm.table.edit_id_loading = item._id;
                vm.table.edit_item.warehouse_id = item.warehouse_id;
                vm.table.edit_item.group_id = item.group_id;
                vm.table.edit_item.name = item.name;
                vm.table.edit_item._id = item._id;
            },
            _onRemoveGroup: function(id){
                var vm = this;
                vm.groups.remove_id_loading = id;
                $.post("/admin/sale/cafe/postRemoveGroupSource",{id: id}, function(result){
                    vm.groups.remove_id_loading = 0;
                    vm._loadGroup(vm.groups.page);
                });
            },
            _onRemoveSource: function(id){
                var vm = this;
                vm.table.remove_id_loading = id;
                $.post("/admin/sale/cafe/postRemoveSource",{id: id}, function(result){
                    vm.table.remove_id_loading = 0;
                    vm._loadTable(vm.table.page);
                });
            },
            _onRemoveAccount: function(id){
                var vm = this;
                vm.accounts.remove_id_loading = id;
                $.post("/admin/sale/cafe/postRemoveAccount",{id: id}, function(result){
                    vm.accounts.remove_id_loading = 0;
                    vm._loadAccount(vm.accounts.page);
                });
            },
            _onSaveConfig: function(){
                var vm = this;
                vm.config.btn_save = true;
                $.post("/admin/sale/cafe/postUpdateSettingPos", vm.config,function(result){
                    vm.config.btn_save = false;
                    vm.config.edit_shop_title = false;
                    if (result.status == 403) return;
                    if (result.error == false) {
                        helper.dialog(result.message , 'check' , 'success' , 1000);
                    }
                });
            },
            _showModalProducts : function(){
                this.data_import = [];
                this.products.isUploading = false;
                $(this.$refs.modalProduct).modal('show');
            },
            _showModalCreateProduct: function(){
                var vm = this;
                if(vm.loading_create_product){
                    return
                }else{
                    vm.loading_create_product = true;
                }
                $('#modalCreateProduct').html('');
                $('#modalCreateProduct').load('/admin/sale/cafe/getModalCreateProduct',function(){
                    vm.loading_create_product = false;
                });
            },
            _showModalCreateWarehouse: function(){
                $('#modalCreateWarehouse').html('');
                $('#modalCreateWarehouse').load('/admin/sale/cafe/getModalCreateWarehouse');
            },
            _onEditWarehouse: function(_id){
                $('#modalCreateWarehouse').html('');
                $('#modalCreateWarehouse').load('/admin/sale/cafe/getModalEditWarehouse?_id='+_id);
            },
            _load:  function( page,  callback){
                var vm = this;
                vm.products.loading  = true;
                $.post("/admin/sale/cafe/postLoadProduct", {
                    page : page,
                    limit : vm.products.limit,
                    keyword : vm.products.keyword,
                    category_id : vm.products.category_id == 'all' ? '' : vm.products.category_id,
                },  (res) => {
                    vm.products.loading  = false;
                    if (res.status == 403) return;
                    if (res.error == false) {
                        vm.products.data = res.products;
                        vm.categories = res.categories;
                        vm.units = res.units;
                        vm.products.limit= res.limit;
                        vm.products.page= res.page;
                        vm.products.total = res.total;
                        if( typeof callback == 'function'){
                            callback();
                        }
                    }
                }).fail(function () {}).always( ()=>{
                    vm.products.loading  = false;
                });
            },
            _loadGroup:  function( page,  callback){
                var vm = this;
                vm.groups.loading  = true;
                $.post("/admin/sale/cafe/postLoadGroupSource", {
                    page : page,
                    limit : vm.groups.limit,
                    keyword : vm.groups.keyword,
                    warehouse_id : vm.groups.warehouse_id == 'all' ? '' : vm.groups.warehouse_id,
                },  (res) => {
                    vm.groups.loading  = false;
                    if (res.status == 403) return;
                    if (res.error == false) {
                        vm.groups.data = res.groups;
                        vm.groups.limit= res.limit;
                        vm.groups.page= res.page;
                        vm.groups.total = res.total;
                        if( typeof callback == 'function'){
                            callback();
                        }
                    }
                }).fail(function () {}).always( ()=>{
                    vm.groups.loading  = false;
                });
            },
            _loadTable:  function( page,  callback){
                var vm = this;
                vm.table.loading  = true;
                $.post("/admin/sale/cafe/postLoadSource", {
                    page : page,
                    limit : vm.table.limit,
                    keyword : vm.table.keyword,
                    warehouse_id : vm.table.warehouse_id == 'all' ? '' : vm.table.warehouse_id,
                },  (res) => {
                    vm.table.loading  = false;
                    if (res.status == 403) return;
                    if (res.error == false) {
                        vm.table.data = res.table;
                        vm.table.limit= res.limit;
                        vm.table.page= res.page;
                        vm.table.total = res.total;
                        vm.groups.data = res.groups;
                        if( typeof callback == 'function'){
                            callback();
                        }
                    }
                }).fail(function () {}).always( ()=>{
                    vm.table.loading  = false;
                });
            },
            _loadPrintTable:  function(){
                var vm = this;
                vm.table.print_loading  = true;
                $.post("/admin/sale/cafe/postLoadSource", {
                    page : 1,
                    limit : 500,
                    keyword : vm.table.print_keyword,
                    warehouse_id : vm.table.print_warehouse_id == 'all' ? '' : vm.table.print_warehouse_id,
                    group_id : vm.table.print_group_id == 'all' ? '' : vm.table.print_group_id,
                },  function(res){
                    vm.table.print_loading  = false;
                    if (res.status == 403) return;
                    if (res.error == false) {
                        vm.table.print_data = res.table;
                        vm.groups.print_data = res.groups;
                        if( typeof callback == 'function'){
                            callback();
                        }
                    }
                }).fail(function() {}).always( function(){
                    vm.table.print_loading  = false;
                });
            },
            _loadSaleSource: function(){
                var vm = this;
                vm.data_sale.loading  = true;
                var uri = window.location.protocol + "//192.168.1.250:3001/api/cafe/sale-sources";

                $.get(uri, {
                    warehouse_id : vm.data_sale.warehouse_id,
                },  function(res){
                    vm.data_sale.loading  = false;
                    if (res.status == 403) return;
                    if (res.success == true) {
                        vm.data_sale.data = res.data;

                    }
                }).fail(function() {}).always( function(){
                    vm.data_sale.loading  = false;
                });

            },
            _reloadSaleOrders:function(){
                if(this.sale_orders.pagination.page == 1){
                    this._loadSaleOrders();
                }else{
                    this.sale_orders.pagination.page = 1;
                }
            },
            _loadSaleOrders: function(){
                var vm = this;
                vm.sale_orders.loading  = true;
                $.post("/admin/sale/cafe/postLoadSaleOrders", {
                    page : vm.sale_orders.pagination.page,
                    limit : vm.sale_orders.pagination.limit,
                    keyword : vm.sale_orders.keyword,
                    warehouse_id : vm.data_sale.warehouse_id,
                    startDate : vm.sale_orders.date.startDate,
                    endDate : vm.sale_orders.date.endDate,
                },  (res) => {
                    vm.sale_orders.loading  = false;
                    if (res.status == 403) return;
                    if (res.error == false) {
                        vm.sale_orders.data = res.data;
                        vm.sale_orders.pagination = res.pagination;
                    }
                }).fail(function () {}).always( ()=>{
                    vm.sale_orders.loading  = false;
                });

            },
            showDetail: function(item){
                var vm = this;
                vm.sale_order_details.show  = true;
                vm.sale_order_details.so = {
                    code : item.code,
                    warehouse_name : item.warehouse ? item.warehouse.name : '' ,
                    user_name : item.user ? item.user.name : '' ,
                    created_at : item.created_at,
                    so_status_class_name : item.so_status_class_name,
                    so_status_name : item.so_status_name
                }
                $.post("/admin/sale/cafe/postLoadSaleOrderDetails",{ so_id : item._id },  (res) => {
                    if (res.status == 403) return;
                    if (res.error == false) {
                        vm.sale_order_details.data = res.data;
                    }
                }).fail(function () {}).always( ()=>{

                });
            },
            _loadAccount:  function( page,  callback){
                var vm = this;
                vm.accounts.loading  = true;
                $.post("/admin/sale/cafe/postLoadAccount", {
                    page : page,
                    limit : vm.accounts.limit,
                    keyword : vm.accounts.keyword,
                    warehouse_id : vm.accounts.warehouse_id == 'all' ? '' : vm.accounts.warehouse_id,
                },  (res) => {
                    vm.accounts.loading  = false;
                    if (res.status == 403) return;
                    if (res.error == false) {
                        vm.accounts.data = res.accounts;
                        vm.accounts.limit= res.limit;
                        vm.accounts.page= res.page;
                        vm.accounts.total = res.total;
                        if( typeof callback == 'function'){
                            callback();
                        }
                    }
                }).fail(function () {}).always( ()=>{
                    vm.accounts.loading  = false;
                });
            },
            _loadWarehouse:  function( page,  callback){
                var vm = this;
                vm.data_warehouses.loading  = true;
                $.post("/admin/sale/cafe/postLoadWarehouses", {
                    page : page,
                    limit : vm.data_warehouses.limit,
                    keyword : vm.data_warehouses.keyword,
                },  (res) => {
                    vm.data_warehouses.loading  = false;
                    if (res.status == 403) return;
                    if (res.error == false) {
                        vm.data_warehouses.data = res.warehouses;
                        vm.data_warehouses.limit= res.limit;
                        vm.data_warehouses.page= res.page;
                        vm.data_warehouses.total = res.total;
                        if( typeof callback == 'function'){
                            callback();
                        }
                    }
                }).fail(function () {}).always( ()=>{
                    vm.data_warehouses.loading  = false;
                });
            },

            _importProduct: function(){
                var vm = this;
                vm.products.btn_save = true;
                $.post("/admin/sale/cafe/postImportProduct",{data: JSON.stringify(vm.data_import)}, function(result){
                    vm.products.btn_save = false;
                    if(result.error){
                        alert(result.message);
                    }else{
                        $(vm.$refs.modalProduct).modal('hide');
                        vm.products.data_import = [];
                        vm.products.isUploading = false;
                        vm._load();
                    }
                });
            },
            'onFileChange': function(){
                var _this = this;
                var file = event.target.files[0];
                _this.handleFile(file);
                $(event.target).val('');
            },
            'handleFile': function(file){
                var vm = this;
                var ext = file.name.split('.').pop();
                if($.inArray(ext, vm.configFile.extension) == -1) {
                    var msg = "Chỉ cho phép tải file có định dạng: xls, xlsx!"
                    alert(msg);
                    return false;
                }
                if(file.size > 1024*1024*(vm.configFile.extension)) {
                    var msg = "Chỉ cho phép tải file có dung lượng nhỏ hơn hoặc bằng 3MB!"
                    alert(msg);
                    return false;
                }
                vm.file = file;
                var formData = new FormData();
                formData.append('file', vm.file);
                $.ajax({
                    url: '/admin/sale/cafe/readFileExcelImported',
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    timeout: 80000,
                    beforeSend: function () {
                        vm.products.isUploading = true;
                    },
                    error: function (x, t, m) {
                        var m = "Sai tập tin mẫu hoặc có lỗi trong quá trình đọc tập tin!";
                        alert(m);
                        vm.products.isUploading = false;
                    },
                    success: function (res){
                        vm.products.isUploading = false;
                        if(!res.error){
                            vm.products.data_import = res.data;
                        }else{
                            alert(res.message);
                        }
                    }
                });
            },
            warehouse_name: function(warehouses){
                var message = "";
                warehouses.forEach(function(item,index){
                    message += item.name;
                    if(index != (warehouses.length -1)){
                        message += ", "
                    }else{
                        message += ' ';
                    }
                });
                return message;
            },
            ClassTable:function(item){
                var class_name="";
                if(item.state == "booked"){
                    if(item.request_quantity == item.recieve_quantity){
                        class_name = "bg bg-success-light";
                    }else{
                        class_name = "bg bg-warning-light";
                    }
                }
                return class_name;
            }
        },
        computed: {
            print_warehouse: function(){
                if(this.data_warehouses.print_keyword == ""){
                    return this.data_warehouses.print_data;
                }else{
                    var keyword = helper.convertCharacters(this.data_warehouses.print_keyword.toLowerCase());
                    return this.data_warehouses.print_data.filter(function(item){
                        var name = helper.convertCharacters(item.name.toLowerCase());
                        return name.indexOf(keyword) >= 0;
                    })
                }
            },
            total_detail: function(){
                var quantity = 0;
                var price = 0;
                this.sale_order_details.data.forEach(function(item){
                    quantity += item.quantity - item.return_quantity;
                    price += item.total_price;
                })
                return {
                    quantity : quantity,
                    price : price,
                };
            }
        },
        watch: {
            'active_main_tab': function(newval, oldval){
                if(newval=='product'){
                    this._load(1);
                }
                if(newval=='area'){
                    this._loadGroup(1);
                }
                if(newval=='table'){
                    this._loadTable(1);
                }
                if(newval=='account'){
                    this._loadAccount(1);
                }
                if(newval=='warehouse'){
                    this._loadWarehouse(1);
                }
                if(newval=='sale'){
                    this._loadSaleSource(1);
                    this._loadSaleOrders();
                }
            },
            'sale_orders.keyword':function(){
                var vm = this;
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    vm._reloadSaleOrders();
                }, 500);
            },
            'sale_orders.pagination.page' :function(){
                this._loadSaleOrders();
            },
            'sale_orders.pagination.limit' :function(){
                this._reloadSaleOrders();
            },
            'sale_orders.date':{
                handler : function(){
                    this._reloadSaleOrders();
                },
                deep : true,
            },
            'print.select_logo': function(newval){
                if(!newval){
                    this.print.logo = {};
                }
            },
            'data_sale.warehouse_id':function(){
                this._loadSaleSource(1);
                this._loadSaleOrders();
            },
            'products.page': function(newval, oldval){
                if(newval != oldval){
                    this._load(newval);
                }
            },
            'products.category_id': function(newval, oldval){
                if(newval != oldval){
                    this._load(1);
                }
            },
            'products.keyword': function (newval, oldval) {
                var vm = this;
                if( newval != oldval){
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        vm._load(1);
                    }, 500);
                }
            },
            'groups.page': function(newval, oldval){
                if(newval != oldval){
                    this._loadGroup(newval);
                }
            },
            'groups.warehouse_id': function(newval, oldval){
                if(newval != oldval){
                    this._loadGroup(1);
                }
            },
            'groups.keyword': function (newval, oldval) {
                var vm = this;
                if( newval != oldval){
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        vm._loadGroup(1);
                    }, 500);
                }
            },
            'table.page': function(newval, oldval){
                if(newval != oldval){
                    this._loadTable(newval);
                }
            },
            'table.warehouse_id': function(newval, oldval){
                if(newval != oldval){
                    this._loadTable(1);
                }
            },
            'table.keyword': function (newval, oldval) {
                var vm = this;
                if( newval != oldval){
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        vm._loadTable(1);
                    }, 500);
                }
            },
            'accounts.page': function(newval, oldval){
                if(newval != oldval){
                    this._loadAccount(newval);
                }
            },
            'accounts.warehouse_id': function(newval, oldval){
                if(newval != oldval){
                    this._loadAccount(1);
                }
            },
            'accounts.keyword': function (newval, oldval) {
                var vm = this;
                if( newval != oldval){
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        vm._loadAccount(1);
                    }, 500);
                }
            },
            'data_warehouses.keyword': function (newval, oldval) {
                var vm = this;
                if( newval != oldval){
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        vm._loadWarehouse(1);
                    }, 500);
                }
            },

            'table.print_warehouse_id': function(newval, oldval){
                if(newval != oldval){
                    this._loadPrintTable();
                }
            },
            'table.print_group_id': function(newval, oldval){
                if(newval != oldval){
                    this._loadPrintTable();
                }
            },
            'table.print_keyword': function (newval, oldval) {
                var vm = this;
                if( newval != oldval){
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        vm._loadPrintTable();
                    }, 500);
                }
            }
        },
        mounted: function () {
            
        }
    });
    return vm;
}
window[domain].app = new AppCafe('#AppCafe');
