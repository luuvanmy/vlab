Vue.component('tab-chiefs' ,{
	template : `
	<div class="box-chief">
		<div class="box-chief-left">
            <div class="box">
                <div class="box-header"></div>
                <div class="box-body">
                   <div v-if="listChiefs.length" class="list-waiting-chief" style="overflow: hidden auto">
                        <ul class="list-group" >
                            <li class="list-group-item item-chief" v-for="(item , index) in  listChiefs">
                                <div class="item-image">
                                    <template v-if="item.image == ''">
                                        <img src="/resources/images/table/product.jpg">
                                    </template>
                                    <template v-else>
                                        <img :src="item.image" alt="" class="img-responsive">
                                    </template>
                                    
                                </div>
                                <div class="item-info">
                                    <div class="item-title"><strong>{{item.product_name }}</strong></div>
                                    <div class="item-info-row">
                                        <span class="icon">
                                            <img src="/resources/images/table/table3.png" alt="">
                                        </span>
                                        <span class="value">{{ item.source_name}}</span>
                                    </div>
                                    
                                    <div class="item-info-row">
                                        <span class="icon">
                                            <i class="far fa-clock"></i>
                                        </span>
                                        <timeago class="value" :time="item.updated_at"></timeago>
                                    </div>
                                </div>
                                <div class="item-quantity">
                                    <div class="mg-bottom-5">
                                        <div class="status success">Đã làm :  <strong>{{ item.quantity}}</strong></div>
                                    </div>
                                    <div v-if="item.status == 'clear'">
                                        <div class="status danger">Đã hủy bàn</div>
                                    </div>
                                    <div v-else>
                                        <div v-if="item.recive_quantity > 0" class="mg-bottom-5">
                                            <div class="status warning">Đã cung ứng :<strong>{{ item.recive_quantity}}</strong></div>
                                        </div>
                                        <div v-if="item.hasOwnProperty('has_cancel') && item.has_cancel > 0">
                                            <div class="status danger">Đã hủy : <strong>{{ item.has_cancel}}</strong></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item-actions">
                                    <template v-if="(item.quantity - item.recive_quantity) <= item.has_cancel">
                                        <a class="btn btn-default btn-remove" @click.stop.prevent="removeItem(item._id , 'success')">
                                            <i class="material-icons text-danger">delete</i>
                                        </a>
                                    </template>
                                    <template v-else>
                                        <a  class="btn  btn-success" @click.stop.prevent="_increase(item._id )">
                                            <i class="fas fa-chevron-right"></i>
                                        </a>
                                        <a  class="btn  btn-success" @click.stop.prevent="_increase(item._id , item.make_success - item.recive_quantity)">
                                            <i class="fas fa-chevron-double-right"></i>
                                        </a>
                                    </template>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-else class="box-empty" >
                        <div class="box-empty-wrap">
                            <p><i class="material-icons">shopping_basket</i></p> 
                            <p>Chưa có sản phẩm nào</p>
                        </div>
                    </div>
                </div>
                <div class="box-footer"></div>
            </div>
        </div>
        <div class="box-chief-right">
            <div class="box">
                <div class="box-header">
                    <div class="head-title">Nơi cung ứng</div>
                    <div class="head-nav" >
                        <ul class="nav nav-groups" >
                            <li :class="{ active : group == 'all'}">
                                <a @click.stop.prevent="_changeGroup('all')">Tất cả</a>
                            </li>
                            <li v-for="item in groups" :class="{ active : group ==  item._id}">
                                <a @click.stop.prevent="_changeGroup(item._id)">{{item.name}}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="head-form-search">
                        <div class="form-group">
                            <input type="text" class="form-control" v-model.trim="keyword" placeholder="Nhập từ khóa cần tìm ..." />
                        </div>
                    </div>
                </div>
                <div class="box-body">
                   <div class="list-table-chiefs"  style="overflow: hidden auto">
                     
                            <div class="list-table-chiefs-wrap">
                                <template v-for="(item , index ) in listSources">
                                    <table-chief :active.sync="active" :table="item"></table-chief>
                                </template>
                            </div>
                            
                   </div>
                </div>
                <div class="box-footer"></div>
            </div>
        </div>
	</div>	
	`,
	props: {
        sources: {},
		data : {},
        options :{},
        user : {},
        groups: {}
	},
	data : function(){
		return {
			loading  : false,
            active : '',
            group: 'all',
            navbar : 'auto',
            keyword : '',
		}
	},
	methods :{
        _changeGroup: function(group){
            if( this.group != group ){
                this.group =group;
            }
        },
		_increase : function(id , quan){
            if( id == undefined   || this.loading ) return;
            var index = _.findIndex( this.data , { _id : id } );
            if( index ==  -1) return;
            var quantity =  quan == undefined ? 1 : quan;
            if(quantity  <= 0 ) return;
            $.post("/admin/sales/pos/postSuccessSupply", {
                _id: id ,
                quantity: quantity ,
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                    var index = _.findIndex(this.data , { _id : res.chief._id});
                    if( index >= 0){
                        this.$set(this.data , index , res.chief);
                    }
                    if( res.hasOwnProperty('source_detail')){
                        this.$root.updateProductInSource(res.source_detail);
                    }
                    socket.emit('pos_user_supply',{
                        user : this.user,
                        chief : {
                            _id : res.chief._id,
                            recive_quantity : res.chief.recive_quantity,
                            updated_at : res.chief.updated_at,
                        }
                    })
                }
            }).fail(function () {}).always( () => {  this.loading = false});
        },
	},
	computed :{
		listChiefs :  function(){
            var vm = this, request = [] , waiting = [] , success = [];
            vm.data.forEach(function(item){
            
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
            success = success.filter(function(item){
                var check = true;
                if( vm.active != ''){
                    if( item.source_id != vm.active){
                        check = false;
                    }
                }
                return( (item.quantity - item.recive_quantity) > item.has_cancel ) && check;
            })
            return success;
        },
        listSources : function(){
            var keyword = helper.convertCharacters(this.keyword.toLowerCase());
            return this.sources.filter((item)=>{
                var group = true;
                var user = true;
                var relation = true;
                var search = true;
                if( item.current_user != this.user._id ){
                    user = false;
                }
                if( item.relation_id != ''){
                    relation = false;
                }
                if( this.group != 'all'){
                    if( this.group != item.group_id){
                        group = false;
                    }
                }
                if( keyword != ''){
                    if( item.name_search.indexOf(keyword) == -1){
                        search = false;
                    }
                }
                return user && relation && search && group;
            })
        }
	},
    mounted : function(){
        
    }
})
Vue.component('table-chief' ,{
    template : `
        <div class="item-table " :class="{ 'is-active' : active == table._id}" >
            <div class="item-table-wrap" @click.stop.prevent="_onClick()">
                <div class="item-table-name">{{table.name}}</div>
                 <div class="item-table-icon">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAeCAYAAABe3VzdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZGE4MmIxMi0zZDhiLTkwNGUtOGQ5NC1mNWExYzBiNTZmZDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk3RjY2OUFDMTQ4MTFFODlBMTdEMTkzMkIzMTlBMUEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDk2ZjdiZTctZTljNi01NTQyLWIxNWItYTI4YTEwNDg1YjE4IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA5LTI2VDExOjU2OjU5KzA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wOS0yNlQxMTo1OTo1OSswNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wOS0yNlQxMTo1OTo1OSswNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjEzNzVmZWNlLWNjMTEtYjg0MC04MDllLWRkMjBkMDM5OTZmYiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2ZGE4MmIxMi0zZDhiLTkwNGUtOGQ5NC1mNWExYzBiNTZmZDUiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDk2ZjdiZTctZTljNi01NTQyLWIxNWItYTI4YTEwNDg1YjE4IiBzdEV2dDp3aGVuPSIyMDE4LTA5LTI2VDExOjU5OjU5KzA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pji//kwAAAEYSURBVFiF7ZWxSgNBEIa/EwmoTTwhRQQJmCoPk2aew0p8CkmlrzGND5PKQBC0EAx2Qpq1uF2Uc+9uj73gFvs1uxzD/h+7x0xhjCFljv5boIssGEsWjCV5weP6BxF5BcbAHjDACCgOkG1sRmEzPlX1slMQmNr19ABSdc5+7b15PsElcAI8ABPgFtgObQbMgBXwDtwAX76ioj5JRMRtn4Fr4ALYhaaqalCdiJTAB7BR1XlTXZPgCFhbwac+gj0oqV5rAyxUde8r8j2xw5kvBxZryvHSJuha0D3wNpjOD1Pgjo5W1yboWssj8BKa2uMfvKISbG1hIY36PCixP0HnJj9JsmAsWTCWLBjLn1mcGsnfYBaMJQvGkrzgN8iBNj3ZMh1GAAAAAElFTkSuQmCC"/>
                </div>
                <template v-if="table.state == 'booked'">
                    <div class="item-table-info text-center" v-html="info"></div>
                </template>
            </div>
        </div>
    `,
    props:{
        table : {},
        active : {}
    },
    methods:{
        _onClick : function(){
            if( this.active != this.table._id){
                this.$emit('update:active' , this.table._id);
            }else{
                this.$emit('update:active' , '');
            }
        },
        
    },
    computed :{
        info : function(){
            var request_quantity = 0;
            var recive_quantity = 0;
            if (this.table.products.length) {
                this.table.products.forEach(function (el) {
                    request_quantity += el.request_quantity;
                    recive_quantity += el.recive_quantity;
                });
                return '<strong>' + recive_quantity + '</strong>/' + request_quantity + ' món';
            }
            return 'Chưa chọn món';
        },
    }
})