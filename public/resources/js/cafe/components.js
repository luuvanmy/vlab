String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
Vue.component('report', {
    template : `
        <div>
            <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-8">
                    <h4 class="title">Báo cáo</h4>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4 mg-top-10" >
                    <select class="form-control" v-model="warehouse_id">
                        <option value="">Tất cả kho hàng</option>
                        <option v-for="item in warehouses" :value="item._id">{{ item.name }}</option>
                    </select>
                </div>
            </div>
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
            <div class="tab-content no-pd mg-top-15">
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
                                <table class="table table-bordered">
                                    <tbody>
                                        <template v-if="data.days.length>0 || data.days">
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
                                        </template>
                                        <template v-if="data.days.length==0">
                                            <tr>
                                                <td colspan="6">
                                                    <div class="no-data">
                                                        <h4>KHÔNG TÌM THẤY DỮ LIỆU !!!</h4>
                                                        <p>Vui lòng, tạo mới dữ liệu hoặc thay đổi giá trị tìm kiếm nếu bạn đang thực hiện thao tác này</p>
                                                        <img src="/resources/images/product/img_data_not_found.png" class="img-responsive" alt="Không tìm thấy dữ liệu">
                                                    </div>
                                                </td>
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
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Hàng hóa / sản phẩm</th>
                                            <th>Số lượng tiêu thụ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-if="data.products_sale.length>0 || data.products_sale">
                                            <template v-for="(item, index) in data.products_sale">
                                                <tr>
                                                    <td>{{ index+1 }}</td>
                                                    <td>{{ item.name }}</td>
                                                    <td>{{ item.TotalQuantity | money }}</td>
                                                </tr>
                                            </template>
                                        </template>
                                        <template v-if="data.products_sale.length==0">
                                            <tr>
                                                <td colspan="6">
                                                    <div class="no-data">
                                                        <h4>KHÔNG TÌM THẤY DỮ LIỆU !!!</h4>
                                                        <p>Vui lòng, tạo mới dữ liệu hoặc thay đổi giá trị tìm kiếm nếu bạn đang thực hiện thao tác này</p>
                                                        <img src="/resources/images/product/img_data_not_found.png" class="img-responsive" alt="Không tìm thấy dữ liệu">
                                                    </div>
                                                </td>
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
    `,
    props:{},
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
            warehouses : warehouses,
            daterange: {
                startDate : '',
                endDate : ''
            },
            warehouse_id:''
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
            $.post("/admin/sale/cafe/postLoadDataReport", {
                start: this.daterange.startDate,
                end: this.daterange.endDate,
                warehouse_id: this.warehouse_id
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
        },
        warehouse_id: function(){
            this._load();
        }
    },
    mounted : function(){
        this._load();
    },
    created: function(){

    }
});

Vue.component('select2', {
    props: {
        value: {
            required: true,
        },
        options: {
            type: Array,
        },
        placeholder: {
            type: String,
        },
        notfound: {
            type: String,
            default: 'Không tìm thấy !',
        },
        search: {
            type: Boolean,
            default: false,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        change: {
            type: Function,
        },
        allowclear: {
            type: Boolean,
            default: false,
        },
        max: {
            type: Number,
            default: 10,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        position: {
            type: String,
            default: 'left'
        },
        icon: {
            type: String,
        },
        width: {
            type: String,
            default: 'resolve'
        },
        labels: {
            type: Array,
        }
    },
    template: '<select class="form-control" ></select>',
    created: function () {
        this.convert();

    },
    mounted: function () {
        var vm = this;
        var config = {
            disabled: this.disabled,
            multiple: this.multiple,
            minimumResultsForSearch: this.search ? 0 : -1,
            allowClear: this.allowclear,
            data: this.data,
            language: {
                noResults: function () {
                    return vm.notfound;
                }
            },
            escapeMarkup: function (markup) {
                return markup;
            }
        };
        if (this.placeholder != undefined) {
            config['placeholder'] = this.placeholder;
        }
        this.config = config;
        this.init();
    },

    data: function () {
        return {
            data: [],
            config: {},
            selected: this.value,
            select2: null,
        }
    },
    methods: {
        convert: function () {
            var vm = this;
            var data = [];
            if (_.isArray(vm.options)) {

                if (vm.labels != undefined && vm.labels.length == 2) {
                    data = vm.options.map(function (item) {
                        var el = {};
                        el['id'] = item[vm.labels[0]];
                        var text = '';
                        if (item.hasOwnProperty(vm.labels[1])) {
                            text = item[vm.labels[1]];
                        }
                        el['text'] = String(text).capitalize();
                        return el;
                    })
                } else {
                    data = vm.options.map(function (item) {
                        var el = {};
                        el['id'] = item.hasOwnProperty('id') ? item['id'] : (item.hasOwnProperty('_id') ? item['_id'] : '');
                        var text = '';
                        if (item.hasOwnProperty('text')) {
                            text = item['text'];
                        } else if (item.hasOwnProperty('name')) {
                            text = item['name'];
                        } else if (item.hasOwnProperty('code')) {
                            text = item['code'];
                        }
                        el['text'] = String(text).capitalize()
                        return el;
                    })
                }
            }
            vm.data = data;
        },
        init: function () {
            var vm = this;
            vm.config['data'] = vm.data;
            if (vm.placeholder != undefined && !vm.multiple) {
                $(vm.$el).append("<option></option>")
            }

            if (vm.multiple) {
                vm.select2 = $(vm.$el).select2(vm.config).on('change', function (e) {
                    vm.$emit('input', $(this).val());
                    if (vm.change != undefined && typeof vm.change == 'function') {
                        vm.change();
                    }
                });
            } else {
                vm.select2 = $(vm.$el).select2(vm.config).on({
                    'select2:select': function (e) {
                        vm.$emit('input', e.params.data.id);
                        if (vm.change != undefined && typeof vm.change == 'function') {
                            vm.change();
                        }
                    },'select2:unselecting' : function(e){
                        var data = e.params.data;  
                        $(this).data('state', 'unselected');
                        if( data == undefined){
                            vm.$emit('input', '');
                        }
                    },'select2:open' : function(e){
                        if ($(this).data('state') === 'unselected') {
                            $(this).removeData('state'); 
                            var self = $(this);
                            setTimeout(function() {
                                self.select2('close');
                            }, 1);
                        }  
                    }
                });

            }
            if (vm.value != undefined && vm.value != '') {
                vm.select2.val(vm.value).trigger("change.select2");
            } else {
                if (_.find(vm.data, {
                        id: vm.value
                    }) == undefined && !vm.multiple) {
                    vm.$emit('input', '');
                }
            }
        },
        destroy: function () {
            if ($(this.$el).data('select2')) {
                this.select2.select2('destroy');
                $(this.$el).empty();
                this.init();
            }
        }
    },
    watch: {
        options: {
            handler : function(){
                this.convert();
                this.destroy();
            },
            deep : true
        },
        'value': function (newval) {
            this.select2.val(newval).trigger('change.select2');
        },
        'disabled': function (newval) {
            $(this.$el).attr('disabled', newval);
        }
    },
    computed: {

    },
})
