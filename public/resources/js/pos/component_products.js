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
                        }).fail(function () {}).always(function () {
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

