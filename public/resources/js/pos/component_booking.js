Vue.component('tab-booking' ,{
	template : `
		<div class="table-order-container-full table-order-booking">
			<template v-if="loader">
				<div class="box">
					<div class="box-loading" style="height:100%">
	                    <svg class="circular" viewBox="25 25 50 50">
	                        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
	                    </svg>
	                </div>
				</div>
			</template>
			<transition name="fade">
	            <div  v-if="!loader" class="box ">
	                <div class="box-header">
	                    <div class="box-header-left">
	                        <ul class="nav nav-groups">
	                            <li :class="{'active' : pagination.booking_status == 'all'}">
	                                <a @click.stop.prevent="pagination.booking_status = 'all'">Tất cả</a>
	                            </li>
	                            <li :class="{'active' : pagination.booking_status == 'wait'}">
	                                <a @click.stop.prevent="pagination.booking_status = 'wait'">Chưa nhận bàn</a>
	                            </li>
	                            <li :class="{'active' : pagination.booking_status == 'received'}">
	                                <a @click.stop.prevent="pagination.booking_status = 'received'">Đã nhận bàn</a>
	                            </li>
	                            <li :class="{'active' : pagination.booking_status == 'cancel'}">
	                                <a @click.stop.prevent="pagination.booking_status = 'cancel'">Đã hủy</a>
	                            </li>
	                        </ul>
	                    </div>
	                    <div class="box-header-right">
	                        <a @click.stop.prevent="_showModalCreate()" class="btn btn-success btn-block"><i class="fas fa-plus"></i>&nbsp; Thêm mới</a>
	                    </div>
	                </div>
	                <div class="box-body">
	                	<div class="list-booking">
							<div class="list-booking-head">
								<div class="row">
									<div class="col-xs-12 text-right">
										<div class="inline-block inline-title">
											<p>Tìm thấy <strong>{{pagination.total_records}}</strong> phiếu đặt bàn theo yêu cầu .</p>
										</div>
										<div class="inline-block">
											<div class="keyword">
												<input type="text" v-model.trim="pagination.keyword" class="form-control" placeholder="Nhập từ khóa cần tìm ..." />
											</div>
										</div>
										<div class="inline-block">
											<time-picker v-model="pagination.day"></time-picker>
										</div>
									</div>
								</div>
							</div>
							<div class="list-booking-body">
								<div class="table table-booking">
									<div class="table-head">
										<div class="row">
											<div class="col index">#</div>
											<div class="col center">
												<div class="col customer">Khách hàng</div>
												<div class="col phone">Số điện thoại</div>
												<div class="col time">Giờ đặt</div>
												<div class="col number-customer">SL khách</div>
												<div class="col quantity">SL món</div>
												<div class="col detail">Chi tiết</div>
												<div class="col state">Trạng thái</div>
												<div class="col user">Nhân viên</div>
											</div>
											<div class="col actions"></div>
										</div>
									</div>
									<div class="table-body">
										
											<template v-if="loading">
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
															<div class="col customer">{{item.customer_name}}</div>
															<div class="col phone">{{item.customer_phone}}</div>
															<div class="col time">{{item.set_time  | full-time}}</div>
															<div class="col number-customer">
																<span  class="status success">{{item.customer_quantity | money}} khách</span>
															</div>
															<div class="col quantity">
																<span  class="status success">{{item.products.length | money}} món</span>
															</div>
															<div class="col detail">
																<template v-if="item.sources_name.length">
																	<span v-for="(s , i) in item.sources_name">
																	{{s}}<template v-if="i < item.sources_name.length -1 ">, </template>
																	</span>
																</template>
																<template v-else>Chưa chọn bàn</template>
															</div>
															<div class="col state">
																<span v-if="item.booking_status == 'wait'"  class="status warning">Chờ nhận bàn</span>
																<span v-else-if="item.booking_status == 'cancel'"  class="status danger">Đã hủy bàn</span>
																<span v-else-if="item.booking_status == 'received'"  class="status success">Đã nhận bàn</span>
															</div>
															<div class="col user">{{item.user_name}}</div>
														</div>
														<div class="col actions ">
															<template v-if="item.booking_status == 'cancel' || item.booking_status == 'received'">
																<a  title="Thông tin đặt bàn" class="text-primary" @click.stop.prevent="_viewInfo(item._id)">
																	<i class="material-icons">info</i>
																</a>
															</template>
															<template v-else>
																<a  title="Thông tin đặt bàn" class="text-primary" @click.stop.prevent="_edit(item._id)">
																	<i class="material-icons">info</i>
																</a>
																<a  title="Hủy đặt bàn" class="text-danger" @click.stop.prevent="_remove(item._id)">
																	<i class="material-icons">delete</i>
																</a>
																<a  title="Xác nhận khách nhận bạn" class="text-success" @click.stop.prevent="_confirmBooking(item)">
																	<i class="material-icons">check_box</i>
																</a>
															</template>
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
							<div class="list-booking-foot"></div>
	                	</div>
	                    
	                </div>
	                <div class="box-footer">
	                	<div class="limit-block">
							<select2 class="form-control" :options="limits" v-model="pagination.limit"></select2>
						</div>
						<div class="pagination-block">
							<pagination :total="pagination.total" :current="pagination.page" :change="_changePage"></pagination>
						</div>
	                </div>
	            </div>
            </transition>
            <template v-if="show">
	            <div class="modal fade modal-booking"  ref="modal">
				    <div class="modal-dialog" role="document">
				        <div class="modal-content">
				            <div class="modal-header ">
				                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				            </div>
				            <div class="modal-body" >
				            	<ul class="nav nav-tabs hide">
									<li :class="{'active' : create.tab == 'info'}">
										<a @click.stop.prevent="create.tab ='info'" >Thông tin</a>
									</li>
									<li :class="{'active' : create.tab == 'product'}">
										<a @click.stop.prevent="create.tab ='product'" >Sản phẩm</a>
									</li>
				            	</ul>
								<ul class="stepy-header form-wizard-step">
								    <li @click.stop.prevent="_prevStep()" :disabled="step == 'info'" class="stepy-btn ">
								        <div><i class="material-icons">arrow_back</i></div>
								        <span>Quay lại</span>
								    </li>
								    <li @click.stop.prevent="_changeStep('info')" class="stepy-item  stepy-first" :class="{ 'stepy-active' : step == 'info'}">
								        <div>1</div>
								        <span>Thông tin chung</span>
								    </li>
								    <li @click.stop.prevent="_changeStep('product')" class="stepy-item" :class="{ 'stepy-active' : step == 'product'}">
								        <div>2</div>
								        <span>Sản phẩm</span>
								    </li>
								    <li @click.stop.prevent="_changeStep('complete')" class="stepy-item stepy-last" >
								        <div><i class="material-icons">done</i></div>
								        <span>Hoàn tất</span>
								    </li>
								    <li @click.stop.prevent="_nextStep()" class="stepy-btn">
								        <div><i class="material-icons">arrow_forward</i></div>
								        <span>Tiếp theo</span>
								    </li>
								</ul>
								<div class="stepy-content">
					                <vue-form class="form-horizontal" :state="create.state" @submit.stop.prevent="_onSubmit()" v-if="step == 'info'">
										<div class="form-group">
											<label  class="col-sm-4 control-label">Thông tin KN <span class="text-danger">*</span></label>
											<div class="col-sm-8 form-search-customer">
												<div class="form-search-customer-wrap" ref="form_search_customer">
													
													<template v-if="_.has(create.customer , '_id')">
														<div class="item-customer">
															<strong>{{create.customer.name | name}} - {{ create.customer.phone}}</strong>
															<a href="#" @click.stop.prevent="_removeCustomer()">chọn lại</a>
														</div>
													</template>
													<template v-else>
														<suggestion 
					                                        v-model="create.keywordCustomer" 
					                                        :options="{debounce: 500  ,inputClass: 'form-control' ,'placeholder' : 'Tìm khách hàng'}"
					                                        :change="_changeCustomerSearch" 
					                                        :select="_selectCustomerSearch"
					                                        class="customer-search-results" >
					                                        <template slot="item" scope="data" >
					                                            {{data.data.name | name}} - {{data.data.phone}}
					                                        </template>
					                                    </suggestion>
					                                    <div class="customer-search-btn">
						                                    <button class="btn btn-success" @click.stop.prevent="_createCustomer()">
																<i class="fal fa-plus"></i>
															</button>
														</div>
													</template>
													<template v-if="!_.has(create.customer , '_id') && _.has(create.state , '$submitted')">
														<code v-if="create.state.$submitted ==  true">
															Chưa nhập tên khách hàng
														</code>
													</template>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label  class="col-sm-4 control-label">Ngày đặt lịch : <span class="text-danger">*</span></label>
											<div class="col-sm-8">
												<time-picker :timepicker="true" name="set_time" v-model="create.set_time" placeholder="Chọn ngày đặt" ></time-picker>
												<validate name="set_time" >
													<input required v-model="create.set_time" name="set_time" hidden class="hide" />
												</validate>
												<field-messages name="set_time" show="$dirty || $submitted">
													<code slot="required">Chưa chọn ngày đặt</code>
												</field-messages>
											</div>
										</div>
										<div class="form-group">
											<label  class="col-sm-4 control-label">Bàn đặt : <span class="text-danger">*</span></label>
											<div class="col-sm-8">
												<select2 :multiple="true" placeholder="Chọn bàn"  :options="sources" v-model="create.sources" class="form-control"> </select2>
											</div>
										</div>
										<div class="form-group">
											<label  class="col-sm-4 control-label">Số lượng khách : </label>
											<div class="col-sm-8">
												<input-spinner class="input-group-spinner" v-model="create.customer_quantity" :min="1"></input-spinner>
											</div>
										</div>
										<div class="form-group">
											<label  class="col-sm-4 control-label">Tiền tạm ứng : </label>
											<div class="col-sm-8">
												<item-keyboard class="form-control" v-model="create.deposit_cost"></item-keyboard>
											</div>
										</div>
					                </vue-form>
					                <div class="form-horizontal"  v-if="step == 'product'">
										<div class="text-right mg-bottom-20">
											<button @click.stop.prevent="_chooseProduct()" class="btn btn-primary">Thêm sản phẩm</button>
										</div>
										<div class="item-table item-table-choose-product">
											<div class="item-table-header">
												<div class="item-row">
													<div class="item-col item-index">#</div>
													<div class="item-col item-name">Sản phẩm</div>
													<div class="item-col item-quantity">Số lượng</div>
													<div class="item-col"></div>
												</div>
											</div>
											<div class="item-table-body">
												<template v-if="create.products.length">
													<div class="item-row" v-for="(item , index) in create.products">
														<div class="item-col item-index">{{index + 1}}</div>
														<div class="item-col item-name">{{item.name}}</div>
														<div class="item-col item-quantity">
															<input-spinner v-model="item.quantity" :min="1"></input-spinner>
														</div>
														<div class="item-col item-action">
															<a href="#" class="text-danger" @click.stop.prevent="create.products.splice(index, 1)">
																<i class="material-icons">delete</i>
															</a>
														</div>
													</div>
												</template>
												<template v-else>
													<div class="pd-20">
														<h4 class="text-danger text-center"> Chưa có sản phẩm !</h4>
													</div>
												</template>
											</div>
										</div>
					                </div>
					            </div>
				            </div>
				        </div>
				    </div>
				</div>
				<div class="modal fade modal-booking"  ref="modalChooseProduct">
				    <div class="modal-dialog" role="document">
				        <div class="modal-content">
				            <div class="modal-header">
				                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				                <h4 class="modal-title">Chọn sản phẩm</h4>
				            </div>
				            <div class="modal-body">
				            	<div class="row mg-bottom-20">
									<div class="col-xs-6">
										<label>Danh mục sản phẩm</label>
										<select2 v-model="filter.category" class="form-control" :options="filter.categories"></select2>
									</div>
									<div class="col-xs-6">
										<label>Từ khóa</label>
										<div class="form-search">
											<input type="text" class="form-control" v-model="filter.keyword" placeholder="Nhập từ khóa ..." />
										</div>
									</div>
				            	</div>
				            	<div class="table table-modal-choose-product ">
									<div class="table-head">
										<div class="row">
											<div class="col checked">&nbsp;</div>
											<div class="col index">#</div>
											<div class="col name">Sản phẩm</div>
											<div class="col quantity">Số lượng</div>
										</div>
									</div>
									<div class="table-body"  >
										
											<div class="row" :class="{'is-active' : checkBox.indexOf(item._id) >= 0}" v-for="(item , index) in listProducts" @click="_onClickItem(item._id , $event )">
												<div class="col checked">
													<input v-model="checkBox" type="checkbox" :value="item._id" />
												</div>
												<div class="col index">{{index + 1}}</div>
												<div class="col name">{{item.name}}</div>
												<div class="col quantity">
													{{item.onhand_quantity}}
												</div>
											</div>
									</div>
								</div>
								<div class="text-right mg-top-20 mg-bottom-10">
									<a @click.stop.prevent="_onPushProduct()" class="btn btn-primary" :disabled="!checkBox.length">
										<i class="far fa-check"></i>&nbsp;&nbsp;Thêm <strong v-if="checkBox.length">{{checkBox.length}}</strong> sản phẩm đã chọn
	                                </a>
								</div>
				            </div>
				        </div>
				    </div>
				</div>
			</template>
			<template v-if="view.show">
				<div class="modal fade modal-booking"  ref="modalViewInfo">
				    <div class="modal-dialog" role="document">
				        <div class="modal-content">
				            <div class="modal-header ">
				                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				            </div>
				            <div class="modal-body" >
				                <div class="form-horizontal" >
									<div class="form-group">
										<label  class="col-sm-4 control-label">Thông tin KN </label>
										<div class="col-sm-8 form-search-customer">
											<div class="form-search-customer-wrap" >
												<div class="item-customer">
													<strong>{{view.customer.name | name}} - {{ view.customer.phone}}</strong>
												</div>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label  class="col-sm-4 control-label">Ngày đặt lịch :</label>
										<div class="col-sm-8">
											<input   class="form-control" v-model="view.set_time"  readonly/>
										</div>
									</div>
									<div class="form-group">
										<label  class="col-sm-4 control-label">Bàn đặt : </label>
										<div class="col-sm-8">
											<select2 :disabled="true" :multiple="true" placeholder="Chưa chọn bàn"  :options="sources" v-model="view.sources" class="form-control"> </select2>
										</div>
									</div>
									<div class="form-group">
										<label  class="col-sm-4 control-label">Số lượng khách : </label>
										<div class="col-sm-8">
											<input   class="form-control" v-model="view.customer_quantity"  readonly/>
										</div>
									</div>
									<div class="form-group">
										<label  class="col-sm-4 control-label">Tiền tạm ứng : </label>
										<div class="col-sm-8">
											<input   class="form-control" v-model="view.deposit_cost"  readonly/>
										</div>
									</div>
									<div class="form-group">
										<label  class="col-sm-4 control-label">Lý do hủy bàn : </label>
										<div class="col-sm-8">
											<textarea v-model="view.reason_cancel"  class="form-control" readonly ></textarea>
										</div>
									</div>
									<div class="form-group">
										<div class="item-table item-table-choose-product" v-if="view.products.length">
											<div class="item-table-header">
												<div class="item-row">
													<div class="item-col item-index">#</div>
													<div class="item-col item-name">Sản phẩm</div>
													<div class="item-col item-quantity">Số lượng</div>
													<div class="item-col"></div>
												</div>
											</div>
											<div class="item-table-body">
												<template v-if="view.products.length">
													<div class="item-row" v-for="(item , index) in view.products">
														<div class="item-col item-index">{{index + 1}}</div>
														<div class="item-col item-name">{{item.name}}</div>
														<div class="item-col item-quantity">
															<span class="status success">{{item.quantity}}</span>
														</div>
													</div>
												</template>
											</div>
										</div>
									</div>
				                </div>
				            </div>
				        </div>
				    </div>
				</div>
			</template>
			<template v-if="confirm.show">
				<modal-confirm-booking  :confirm.sync="confirm" :reload="_load" ></modal-confirm-booking>
			</template>
        </div>
	`,
	props:{
		options : {},
		products: {},
		sources : {},
		categories : {}
	},
	data : function(){
		return {
			limits: [
				{id : 10 , text : 10},
				{id : 20 , text : 20},
				{id : 30 , text : 30},
				{id : 50 , text : 50},
				{id : 100 , text : 100},
			],
			pagination :{
				
				limit : 10,
				page: 1,
				data : [],
				booking_status : 'all',
				status : 'publish',
				total : 0,
				total_records : 0,
				day: parseInt(new Date().getTime() / 1000),
				keyword : '',
			},
			show: false,
			create :{
				keywordCustomer: '',
				state: {},
				customer : '',
				tab : 'info',
				name : '', 
				phone : '', 
				set_time : '',
				customer_quantity : 1,
				deposit_cost : '',
				products : [],
				sources : [],
				mode : 'create'
			},
			view  : {
				customer : '', 
				set_time : '',
				customer_quantity : '',
				deposit_cost : '',
				products : '',
				sources : '',
				reason_cancel : '',
				show : false,
			},
			confirm: {
				show : false,
				_id : '',
				sources : [],
				selected : [],
			},
			loadingConfirm : false,
			loading : false,
			loader: true,
			step : 'info',
			checkBox : [],
			timeout : null ,
			filter :{
				category : '',
				keyword : '',
				categories : [],
			}
		}
	},
	methods :{
		_load : function(){
			if( this.loading) return;
			this.loading = true;
			$.post("/admin/sales/pos/postLoadBookList", {
                page : this.pagination.page,
                status : this.pagination.status,
                booking_status : this.pagination.booking_status,
                keyword : this.pagination.keyword,
                day : this.pagination.day,
                limit : this.pagination.limit,
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                   this.pagination.data = res.data;
                   this.pagination.limit = res.limit;
                   this.pagination.total = res.total;
                   this.pagination.total_records = res.total_records;
                   if( this.loader){
                   		this.loader = false;
                   }
                }
            }).fail(function () {}).always( ()=>{
                this.loading = false;
            });
		},
		_changePage : function(value){
			this.pagination.page = value;
			this._load();
		},
		_viewInfo : function(id){
			$.post("/admin/sales/pos/getUpdateBookingTable", {
                _id :id, 
            },  (res) => {
            	console.log(res);
                if (res.status == 403) return;
                if (res.error == false) {
                	var  time = moment(new Date(res.booking.set_time * 1000)).format('HH:mm DD/MM/YYYY')
                	this.view = {
						customer : res.booking.customer, 
						set_time : time,
						customer_quantity : res.booking.customer_quantity,
						deposit_cost : res.booking.deposit_cost,
						products : res.booking.products,
						sources : res.booking.sources,
						reason_cancel: res.booking.reason_cancel,
						show : true,
					};
					this.$nextTick(function(){
						$(this.$refs.modalViewInfo).modal('show');
						$(this.$refs.modalViewInfo).on('hidden.bs.modal',()=>{
							this.view  = {
								customer : '', 
								set_time : '',
								customer_quantity : '',
								deposit_cost : '',
								products : '',
								sources : '',
								reason_cancel : '',
								show : false,
							}
						});
					});
                	
                }
            }).fail(function () {}).always( ()=>{
                
            });
		},
		_edit : function(id){
			$.post("/admin/sales/pos/getUpdateBookingTable", {
                _id :id, 
            },  (res) => {
            	console.log(res);
                if (res.status == 403) return;
                if (res.error == false) {
                	
                	this.create = {
						state: {},
						keywordCustomer: '',
						_id : id,
						customer : res.booking.customer, 
						set_time : res.booking.set_time,
						customer_quantity : res.booking.customer_quantity,
						deposit_cost : res.booking.deposit_cost,
						products : res.booking.products,
						sources : res.booking.sources,
						mode : 'edit'
					};
					this.show = true;
					this.$nextTick(function(){
						$(this.$refs.modal).modal('show');
						$(this.$refs.modal).on('hidden.bs.modal',()=>{
							this.create  = {
								state: {},
								keywordCustomer: '',
								tab : 'info',
								customer : '', 
								set_time : '',
								customer_quantity : 1,
								deposit_cost : '',
								products : [],
								sources : [],
								mode : 'create'
							}
							this.show = false;
						});
						$(this.$refs.modalChooseProduct).on('hidden.bs.modal' ,()=>{
							$(this.$refs.modal).addClass('in');
							$('body').addClass('modal-open');
						})
					});
                }
            }).fail(function () {}).always( ()=>{
                
            });
		},
		_remove : function( id ){
			var dismiss = true;
			var jc = $.confirm({
                title: '',
                content: `
					<form >
						<div class="text-center "><h4 class="mg-top-0 mg-bottom-10">Hủy bàn đã đặt</h4></div>
						<label>Lý do</label>
						<textarea class="form-control" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
					</form>
                `,
                type : 'green',
                backgroundDismiss : function(){
                    return 'backdrop';
                },
                buttons: {
                	backdrop : {
                        isHidden : true,
                        action : ()=>{return dismiss}
                    },
                	formSubmit : {
                		text : 'Đồng ý',
                		btnClass : 'btn-success',
                		action : ()=>{
                			var reason = jc.$content.find('textarea').val().trim();
                			if( reason ==''){
                				$.dialog('Chưa nhập lý do hủy bàn');
                				return false;
                			}
				            dismiss = false;
                            jc.showLoading(true);
                            return new Promise((resolve, reject)=>{
                                $.post("/admin/sales/pos/postCancelBookingList", {
                                    _id : id,
                					reason : reason
                                },  (res) => {
                                    if (res.status == 403) return;
                                    if (res.error == false) {
                                        this._load();
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
                onContentReady: function () {
			        this.$content.find('form').on('submit',  (e)=>{
			            e.preventDefault();
			            this.$$formSubmit.trigger('click'); 
			        });
			        this.$content.find('textarea').focus();
			    }
        	});
		},
		_confirmBooking : function(item){
			$.post("/admin/sales/pos/getUpdateBookingTable", {
                _id :item._id, 
            },  (res) => {
                if (res.status == 403) return;
                if (res.error == false) {
                	console.log(res);
                	this.confirm = {
						_id: res.booking._id,
						sources : [],
						selected : [],
						products : res.booking.products,
						customer : res.booking.customer,
						show : true,
					}
					var valid = true;
					var temp = [];
					var sources = (res.booking.sources == '' || res.booking.sources == null ) ? [] : res.booking.sources;
					this.sources.forEach((table)=>{
						if( sources.indexOf(table._id) >= 0   ) {
							this.confirm.sources.push(table);
							if(table.state == 'booked' || (table.relation_id != null && table.relation_id != '')){
								valid = false;
								temp.push(table);
							}
						}
					});
					if( valid == false){
						var message = 'Hiện tại ';
						temp.forEach(function(e , index){
							if(index > 0){
								message += ', '+e.name;
							}else{
								message += e.name ;
							}
						})
						message  += ' đang có khách . Vui lòng thanh toán hoặc chọn bàn khác !';
					}else{
						if( this.confirm.sources.length){
							this.confirm.selected = JSON.parse(JSON.stringify(this.confirm.sources));
						}
					}
					this.$nextTick(function(){
						if( valid == false){
							setTimeout(function() {
								$.dialog(message);
							}, 500);
						}
						
						
					})
                	
                }
            }).fail(function () {}).always( ()=>{
                
            });
			
		},
		
		_showModalCreate : function(){
			this.show = true;
			this.$nextTick(function(){
				$(this.$refs.modal).modal('show');
				$(this.$refs.modal).on('hidden.bs.modal',()=>{
					this.step = 'info';
					this.show = false;
					this.create = {
						state: {},
						keywordCustomer: '',
						customer : '',
						set_time : '',
						customer_quantity : 1,
						deposit_cost : '',
						products : [],
						sources : [],
						mode : 'create'
					};
				});
				$(this.$refs.modalChooseProduct).on('hidden.bs.modal' ,()=>{
					$(this.$refs.modal).addClass('in');
					$('body').addClass('modal-open');
				})
			});
		},
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
            this.create.customer = item;

        },
        _createCustomer : function(){
        	this.$root.createCustomer((res)=>{
        		this._selectCustomerSearch(res);
        	})
        },
        _removeCustomer: function () {
            this.create.customer = null;
            this.$nextTick(function(){
            	$(this.$refs.form_search_customer).find('input').select();
            })
        },
		_onSubmit: function(){
			if( this.create.$valid  ){

			}
		},
		_nextStep : function(){
			if( this.step == 'info'){
				this._validate().then( res =>{
					if( res == true){
						this.step = 'product';
					}
				})
			}else if( this.step =='product'){
				this._validate().then( res =>{
					if( res == true){
						this._complete();
					}
				})
			}
		},
		_validate: function(){
			return new Promise((resolve , reject)=>{
				this.create.state.$submitted = true;
				if(this.create.state.$valid && _.has(this.create , 'customer._id')){
					resolve(true);
				}else{
					resolve(false);
				}
			})
		},
		_prevStep : function(){
			if( this.step =='product'){
				this.step = 'info';
			}
		},
		_changeStep : function(item){
			if( item == 'info'){
				this.step = 'info';
			}else if( item =='product'){
				this._validate().then( res =>{
					if( res == true){
						this.step = 'product';
					}
				})
			}else if(item =='complete'){
				this._validate().then( res =>{
					if( res == true){
						this._complete();
					}
				})
			}	
		},
		_complete : function(){
			this._validate().then( resolve =>{
				if( resolve == true){
					var message = '';
					var url = '';
        			var info = {
						customer_id : this.create.customer._id, 
						set_time : this.create.set_time,
						customer_quantity : this.create.customer_quantity,
						sources : this.create.sources,
						deposit_cost : this.create.deposit_cost,
						products : this.create.products,
						warehouse_id : this.$root.warehouse_id,
        			}
        			if( this.create.mode == 'edit'){
        				info['_id'] = this.create._id;
        				url = '/admin/sales/pos/postUpdateBookingTable';
        				message = '<h4>Bạn có muốn cập nhật phiếu đặt bàn  ?</h4>';
        			}else{
        				message  = '<h4>Bạn có muốn tạo phiếu đặt bàn  ?</h4>';
        				url = '/admin/sales/pos/postCreateBookingTable';
        			}
        			
					$.confirm({
	                    title: '',
	                    content: message,
	                    buttons: {
	                    	save : {
	                    		text : 'Đồng ý',
	                    		btnClass : 'btn-success',
	                    		action : ()=>{
	                    			this.$root.showLoader();

	                    			$.post(url,info, (res) => {
						                if (res.status == 403) return;
						                if (res.error == false) {
						                	this._load();
						                   $(this.$refs.modal).modal('hide');
						                }
						            }).fail(function () {}).always( ()=>{
						                this.$root.closeLoader(500);
						            });
	                    		}
	                    	},
	                    	close : {
	                    		text : 'Đóng',
	                    		btnClass : 'btn-default',
	                    	}
	                    },
                	});
					
				}
			})
		},
		checkDate : function(value){
			return (value == '' || value == null) ? true : false;
		},
		_chooseProduct: function(){
			this.checkBox = [];
			$(this.$refs.modal).removeClass('in');
			$(this.$refs.modalChooseProduct).modal('show');
			
		},
		_onPushProduct: function(){
			if( this.checkBox.length ){
				this.products.forEach((item)=>{
					var id = item._id;
					if( this.checkBox.indexOf(id) >= 0){
						var index = _.findIndex(this.create.products , { _id : id });
						if(index == - 1){
							this.create.products.push({
								_id : item._id,
								quantity : 1,
								name : item.name
							})
						}
					}
				})
				$(this.$refs.modalChooseProduct).modal('hide');
			}
		},
		_onClickItem : function(id , $event){
			var tags = $event.target.tagName.toLowerCase();
            if( tags != 'a' && tags != 'i' && tags != 'span' && tags != 'input' ){
                var index = this.checkBox.indexOf(id);
                if( index == -1 ){
                    this.checkBox.push(id);
                }else{
                    this.checkBox.splice(index, 1);
                }
            }
		},
		
	},
	watch :{
		'pagination.keyword' : function(value){
			clearTimeout(this.timeout);
			this.timeout =  setTimeout(()=>{
				if( this.pagination.page != 1){
					this.pagination.page = 1;
				}
				this._load();
			}, 1000);
		},
		'pagination.day' : function(value){
			if( this.pagination.page != 1){
				this.pagination.page = 1;
			}
			this._load();
		},
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
		'pagination.booking_status' : function(value){
			if( this.pagination.page != 1){
				this.pagination.page = 1;
			}
			this._load();
		}
	},
	computed : {
		listProducts : function(){
			var keyword = helper.convertCharacters(_.trim(this.filter.keyword)).toLowerCase();

			return this.products.filter((item)=>{
				var checkKeyword = true;
				var checkCate = true;
				if( keyword != ''){
					var name = helper.convertCharacters(_.trim(item.name)).toLowerCase();
					if( name.indexOf(keyword) == -1){
						checkKeyword = false;
					}
				}
				if( this.filter.category != 'all' && this.filter.category != '' && this.filter.category != null ){
					if( item.category_id != this.filter.category){
						checkCate = false;
					}
				}
				return checkKeyword && checkCate;
			});
		},

	},
	created : function(){
		this.filter.categories = JSON.parse(JSON.stringify(this.categories));
		this.filter.categories.unshift({
			_id : 'all',
			text : 'Tất cả danh mục'
		})
	},
	mounted : function(){
		this._load();
	}
})
Vue.component('input-spinner', {
	template : `
		<div class="input-group">
			<span class="input-group-btn">
				<button @click.stop.prevent="_decrease()" class="btn btn-default" type="button"><i class="fal fa-minus"></i></button>
			</span>
			<div class="form-control"  @click.stop.prevent="_onkeyboard()">
				{{num | money}}
			</div>
			<span class="input-group-btn">
				<button  @click.stop.prevent="_increase()" class="btn btn-default" type="button"><i class="fal fa-plus"></i></button>
			</span>
		</div>
	`,
	props:{
		value :{},
		max : {
			default : 999999999999,
		},
		min : {
			default : 0,
		}
	},
	data : function(){
		return {
			num : this.value,
		}
	},
	methods:{
		_increase : function(){
			if( this.num < this.max){
				this.num += 1;
			}
		},
		_decrease : function(){
			if( this.num > this.min){
				this.num -= 1;
			}
		},
		_onkeyboard : function(){
			this.$root.$refs.keyboard.show(this.num,  (res) => {
                if (parseInt(res) > this.min) { 
                    this.num = parseInt(res);
                }
            }, this.max);
		},
	},
	watch : {
		'num' : function(value){
			this.$emit('input' , value);
		},
		value : function(value){
			if( this.num != value){
				this.num = value;
			}
		}
	}
})


Vue.component('item-keyboard' ,{
	template : '<span @click.stop.prevent="_onClick">{{value | money}}</span>',
	props:{
		value :{}
	},
	data : function(){
		return {

		}
	},
	methods:{
		_onClick : function(){
			this.$root.$refs.keyboard.show(this.value , (res)=>{
				if( parseInt(res) > 0){
					this.$emit('input' , res);
				}
			})
		}
	},
})

Vue.component('modal-confirm-booking',{
	template : `
		<div class="modal fade modal-confirm-booking"  >
		    <div class="modal-dialog" role="document">
		        <div class="modal-content">
		            <div class="modal-body" >
		            	<div class="box">
		            		<template v-if="filter.tab == 'source'">
								<div class="box-head">
									<div class="box-head-left">
										<ul class="nav nav-groups" >
					                        <li :class="{ active : filter.group == 'all'}">
					                            <a @click.stop.prevent="changeGroup('all')">Tất cả</a>
					                        </li>
					                        <li v-for="item in $root.groups" :class="{ active : filter.group ==  item._id}">
					                            <a @click.stop.prevent="changeGroup(item._id)">{{item.name}}</a>
					                        </li>
					                    </ul>
				                    </div>
				                    <div class="box-head-right">
										<div class="form-search">
											<input type="text" class="form-control" placeholder="Nhập từ khóa cần tìm" v-model.trim="filter.keywordSource" />
										</div>
				                    </div>
								</div>
								<div class="box-body">
									<div class="list-tables-wrapper" >
										<template v-if="filterSources.length">
											<template v-for="(table, index) in filterSources">
				                                <div class="item_table" :class="_class(table)" @click.stop.prevent="_onClick(table)">
													<div class="item_table_wrap">
														<img :src="$root.images.square" class="item_table_grid" />
														<div class="item_table_name">{{table.name}}</div>
													</div>
				                                </div>
				                            </template>
			                            </template>
			                            <template v-else>
											<div class="text-center pd-50">
												<h3>Không tìm thấy dữ liệu </h3>
											</div>
			                            </template>
				                	</div>
								</div>
							</template>
							<template v-else-if="filter.tab == 'product'">
								<div class="box-body-product">
									<div class="box-body-product-left">
										<div class="panel">
											<div class="panel-head">
												<ul class="nav nav-groups" >
							                        <li :class="{ active : filter.category == 'all'}">
							                            <a @click.stop.prevent="changeCategory('all')">Tất cả</a>
							                        </li>
							                        <li v-for="item in $root.categories" :class="{ active : filter.category ==  item._id}">
							                            <a @click.stop.prevent="changeCategory(item._id)">{{item.name}}</a>
							                        </li>
							                    </ul>
							                    <div class="form-search">
													<input type="text" class="form-control" v-model.trim="filter.keywordProduct" placeholder="Nhập từ khóa cần tìm .."/>
							                    </div>
											</div>
											<div class="panel-body">
												<div class="list-wrap"  style="overflow: hidden auto">
			                                        <div class="list-products" v-if="filterProducts.length">
			                                            <div class="item-product" v-for="(item, index) in filterProducts" >
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
			                                        <div class="box-empty" v-else>
														<div class="box-empty-wrap">
															<p><i class="material-icons">shopping_basket</i></p> 
															<p>Chưa có sản phẩm nào</p>
														</div>
													</div>
				                                </div>
											</div>
										</div>
									</div>
									<div class="box-body-product-right">
										<div class="panel">
											<div class="panel-head">
												<div class="panel-head-left">
													Sản phẩm đã chọn {{confirm.products.length}}
												</div>
												<div class="panel-head-right">
													<div class="form-search">
														<input type="text" class="form-control" v-model="filter.keywordProduct2" placeholder="Nhập từ khóa cần tìm ..."/>
													</div>
												</div>
											</div>
											<div class="panel-body">
												<div class="list-wrap"  style="overflow: hidden auto">
													<template v-if="listProductSelected.length">
														<div class="item-product-selected" v-for="(item, index) in listProductSelected" :key="item._id">
															<div class="item-info">
																<div class="item-image">
																	<template v-if="item.image != ''">
																		<img :src="'/'+item.image" />
																	</template>
																</div>
																<div class="item-content">
																	<strong>{{item.name}}</strong>
																	<template v-if="_.has(item , 'product._id')">
																		<p  v-if="item.product.manage_inventory">
																			Số lượng còn : {{item.product.onhand_quantity}}
																		</p>
																	</template>
																	<item-spinner :id="item._id" v-model="item.quantity"></item-spinner>
																</div>
															</div>
															<div class="item-info item-actions" >
																
																<span class="status info" v-once>
																	Đặt trước : {{item.quantity}}
																</span>
																<template v-if="_.has(item , 'product._id')">
																	<span v-if="item.product.manage_inventory && item.quantity > item.product.onhand_quantity"  class="status warning" >
																		Không đủ số lượng
																	</span>
																</template>
																<a @click.stop.prevent="_remove(item._id)" class="btn btn-danger">Hủy món</a>
																
															</div>
														</div>
													</template>
													<template v-else>
														<div class="box-empty">
															<div class="box-empty-wrap">
																<p><i class="material-icons">shopping_basket</i></p> 
																<p>Chưa có sản phẩm nào</p>
															</div>
														</div>
													</template>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<div class="box-foot">
								<div class="box-foot-left">
									<div class="customer" >
										<label>khách hàng</label>
										<span  >
											<template v-if="_.has(confirm , 'customer.name')">
												{{confirm.customer.name}}
											</template>
											- 
											<template v-if="_.has(confirm , 'customer.phone')">
												{{confirm.customer.phone}}
											</template>
										</span>
										<template v-if="confirm.selected.length">
											<button v-for="item  in confirm.selected" class="btn btn-success">{{item.name}}</button>
				                		</template>
				                		<a  v-if="filter.tab == 'product'" @click.stop.prevent="filter.tab ='source'">
											Chọn lại
										</a>
									</div>
								</div>
								<div class="box-foot-right">
									<a class="btn btn-primary" v-if="filter.tab == 'source'" @click.stop.prevent="filter.tab ='product'">
										Chọn món
									</a>
									<a  class="btn btn-success" @click.stop.prevent="_save()">
										Xác nhận khách vào bàn
									</a>
								</div>
							</div>
		            	</div>
		            </div>
		        </div>
		    </div>
		</div>
	`,
	props :{
		confirm :{},
		reload : {},
	},
	data(){
		return {
			loading : false,
			filter : {
				group : 'all',
				keywordSource: '',
				keywordProduct: '',
				keywordProduct2 : '',
				category : 'all',
				tab : 'source',
			},
			products: [],
		}
	},
	methods: {
		_class : function(table){
            if( table.relation_id != '' && table.relation_id != null) return 'booked';
            else {
            	var index = _.findIndex(this.confirm.selected , {_id : table._id});
                if( index >= 0){
                    return 'is-active';
                }else{
                    if( table.state == 'booked') return 'booked';
                    else if(table.state == 'wait') return 'wait';
                }
            }                                                
        },
        _onClick : function(table){
        	if( table.state == 'booked') {
        		return;
        	}
        	if( table.relation_id  != null && table.relation_id != ''){
        		return ;
        	}
        	var index = _.findIndex(this.confirm.selected , {_id : table._id});
        	if( index >= 0){
        		this.confirm.selected.splice(index, 1);
        	}else{
        		this.confirm.selected.push(table);
        	}
        },
		_save: function () {
			if( this.confirm.selected.length == 0){
				$.dialog('Chưa chọn bàn !');
				return;
			}
            this.$root.comfirm('Xác nhận !', 'Xác nhận khách nhận bàn ?', {
                save: {
                    text: 'Xác nhận',
                    btnClass: 'btn-success',
                    keys: ['enter'],
                    action:  () => {
                        this.$root.showLoader();
                        $.post("/admin/sales/pos/postConfirmBookingList", {
                            booking_id :this.confirm._id, 
			                sources :this.confirm.selected, 
			                products :this.confirm.products, 
                        }, (res) => {
                            if (res.status == 403) return;
                            if (res.error == false) {
                                if( res.hasOwnProperty('data_merge')){
			                		if( res.data_merge.hasOwnProperty('source') ){
			                			var source = res.data_merge.source;
			                			var inventory = {};
			                			var relation = []
			                			if( res.hasOwnProperty('data_inventory')){
			                				if( res.data_inventory.length ){
			                					res.data_inventory.forEach((item)=>{
				                					if( item.hasOwnProperty('detail')){
				                						source.products.push(item.detail);
				                					}
				                					if( item.hasOwnProperty('inventory')){
				                						for (var key in item.inventory) {
				                							inventory[key] = item.inventory[key];
				                						}
				                					}
				                				});
				                				
				                                this.$root.updateProductQuantity(inventory);
				                                socket.emit('pos_user_update_product_quantity' , inventory);
			                				}
			                			}
			                			if(res.data_merge.hasOwnProperty('target')){
			                				if( res.data_merge.target.length ){
			                					res.data_merge.target.forEach((item)=>{
			                						relation.push(item._id);
			                					})
			                				}
			                			}
			                			this.$root.updateSource({
			                				source : source,
			                				relation : relation,
			                				update_product_quantity : inventory
			                			})
			                		}
			                	}
			                	$(this.$el).modal('hide');
			                	if( typeof this.reload == 'function'){
			                		this.reload();
			                	}
                            } else {
                                helper.dialog(res.message, 'warning',  'warning', 1000);
                            }
                        }).fail(function () {}).always( () =>{
                            this.$root.closeLoader(500);
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
        changeGroup: function(item){
        	if( this.filter.group != item){
        		this.filter.group = item;
        	}
        },
        changeCategory: function(item){
        	if( this.filter.category != item){
        		this.filter.category = item;
        	}
        },
        _remove : function(id){
        	
        	$.confirm({
        		title : 'Xác nhận',
        		content : 'Bạn có muốn hủy món này ?',
        		buttons :{
        			save : {
        				text : 'Đồng ý',
        				btnClass :'btn-success',
        				action : ()=>{
        					var index = _.findIndex(this.confirm.products, {_id : id});
        					if( index >= 0){
        						this.confirm.products.splice(index , 1);
        					}
        				}
        			},
        			close:{
        				text : 'Đóng',
        				btnClass :'btn-default',
        			}
        		}
        	})
        }
	},
	computed: {
		filterSources : function(){
			var keyword = helper.convertCharacters(_.trim(this.filter.keywordSource.toLowerCase()));
			return this.$root.sources.filter((item)=>{
				var checkKeyword = true;
				var checkGroup = true;
				if( this.filter.group != 'all'){
					if( item.group_id != this.filter.group){
						checkGroup = false;
					}
				}
				if (keyword != '') {
                    checkKeyword = item.name_search.indexOf(keyword) >= 0 ? true : false;
                }
				return (item.state == '' || item.state =='empty') && checkKeyword && checkGroup;
			})
		},
		filterProducts : function(){
			var keyword = helper.convertCharacters(_.trim(this.filter.keywordProduct.toLowerCase()));
			return this.$root.products.filter((item)=>{
				var checkKeyword = true;
				var checkCate = true;
				if( this.filter.category != 'all'){
					if( item.category_id != this.filter.category){
						checkCate = false;
					}
				}
				if (keyword != '') {
                    var name = helper.convertCharacters(_.trim(item.name.toLowerCase()))
                    checkKeyword = name.indexOf(keyword) >= 0 ? true : false;
                }
				return checkKeyword && checkCate;
			})
		},
		listProductSelected : function(){
			var keyword = helper.convertCharacters(_.trim(this.filter.keywordProduct2.toLowerCase()));
			return this.confirm.products.filter((item)=>{
				var checkKeyword = true;
				if (keyword != '') {
					var name = helper.convertCharacters(_.trim(item.name.toLowerCase()))
                    checkKeyword = name.indexOf(keyword) >= 0 ? true : false;
                }
				return checkKeyword ;
			})
		}
	},
	components :{
		'item-spinner': {
			template : `
				<div class="item-spinner">
					<button class="btn btn-default" type="button" @click.stop.prevent="_decrease()">- a</button>
					<span class="form-control" >{{value}}</span>
					<button class="btn btn-default" type="button" @click.stop.prevent="_increase()">+</button>
				</div>
			`,
			props:{
				value :{},
				id : {},
			},
			data : function(){
				return {
					min : 1,
					max : 999999,
				}
			},
			methods:{
				_increase: function(){
					if( this.value < this.max ){
						this.$emit('input' , this.value + 1);
					}
				},
				_decrease : function(){
					if( this.value > this.min ){
						this.$emit('input' , this.value - 1);
					}
				}
			},
			created : function(){
				var item = _.find(this.$root.products , {_id : this.id});
				if( item != undefined){
					this.max = item.onhand_quantity;
				}
			}
		}
	},
	created(){
		this.confirm.products = this.confirm.products.map((item)=>{
			item['product'] = _.find(this.$root.products , { _id : item._id});
			return item;
		});
	},
	mounted(){
		$(this.$el).modal('show');
		$(this.$el).on('hidden.bs.modal',()=>{
			this.$emit('update:confirm',{
				_id: '',
				sources : [],
				show : false,
				selected : [],
			})
		});
	}
})