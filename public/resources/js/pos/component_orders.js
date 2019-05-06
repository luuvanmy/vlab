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
            $.post("/admin/sales/saleorder/getPrintOrder", {
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