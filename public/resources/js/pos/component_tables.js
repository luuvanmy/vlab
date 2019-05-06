
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
                if(vm.user._id == vm.table.current_user || vm.user.type_pos  == 'admin' || vm.user.type_pos  == 'manager'){
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
                }else{
                    $.dialog('Không được phép truy cập bàn này ' );
                }
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