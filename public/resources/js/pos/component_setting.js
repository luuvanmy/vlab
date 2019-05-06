Vue.component('setting', {
    template : `
        <div>
            <div ref="modalSetting" class="modal fade modal-setting" role="dialog" >
                <div class="modal-dialog " role="document" >
                    <div class="modal-content" >
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Cấu hình</h4>
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
                                            <div class="col-xs-12 mg-bottom-10 text-right">
                                                <a href="#" class="btn btn-success" @click.stop.prevent="_showModalProducts($event)">
                                                    <i class="far fa-plus"></i> &nbsp; Thêm sản phẩm
                                                </a>
                                            </div>
                                            <div class="col-xs-4">
                                                <label>Từ khóa</label>
                                                <div class="form-search">
                                                    <input v-model.trim="filter.keyword" type="text" class="form-control"  placeholder="Nhập từ khóa cần tìm "/>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <label>Ngành hàng</label>
                                                <select2 :options="categories" v-model="filter.category_id"></select2>
                                            </div>
                                            <div class="col-xs-4">
                                                <label>Chế biến</label>
                                                <select2 :options="processings" v-model="filter.processing"></select2>
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