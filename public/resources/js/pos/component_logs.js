Vue.component('logs' , {
	template : `
		<div class="modal fade modal-logs" >
		    <div class="modal-dialog modal-lg" role="document">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		                <h4 class="modal-title">Lịch sử</h4>
		            </div>
		            <div class="modal-body">
		            	<div class="row">
								
							<div class="col-xs-6 mg-bottom-10">
								<label>Bàn</label>
								<select2 class="form-control" v-model="pagination.source_id" :options="listSources"></select2>
							</div>	
							<div class="col-xs-6 mg-bottom-10">
								<label>Nhân viên</label>
								<select2 class="form-control" v-model="pagination.user_id" :options="listUsers"></select2>
							</div>	
							<div class="col-xs-12 mg-bottom-10">
								<label>Thời gian</label>
								<daterange-picker v-model="pagination.range"></daterange-picker>
							</div>
		            	</div>
		                <div class="table table-logs">
							<div class="table-head">
								<div class="row">
									<div class="col index">#</div>
									<div class="col message">Hành động</div>
									<div class="col source">Bàn</div>
									<div class="col user">Nhân viên</div>
									<div class="col created">Thời gian</div>
								</div>
							</div>
							<div class="table-body" >
								
									<template v-if="loading">
										<div class="box-loading" style="height:300px">
                                            <svg class="circular" viewBox="25 25 50 50">
                                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                                            </svg>
                                        </div>
									</template>
									<template v-else>
										<template v-if="pagination.data.length">
											<div class="row" v-for="(item, index) in pagination.data">
												<div class="col index">
													{{(pagination.limit * (pagination.page - 1)) + index + 1}}
												</div>
												<div class="col message">
													{{ item.message }}
												</div>
												<div class="col source">
													<template v-if="_.has(item , 'source.name')">
														{{item.source.name}}
													</template>
												</div>
												<div class="col user">
													<template v-if="_.has(item , 'user.name')">
														{{item.user.name}}
													</template>
												</div>
												<div class="col created">
													{{ item.created_at | full-time}}
												</div>
											</div>
										</template>
										<template v-else>
											<div class="box-loading" style="height:300px">
	                                            <div class="text-center text-danger"><h3>Không tìm thấy dữ liệu</h3></div>
	                                        </div>
										</template>
									</template>
								
							</div>
		                </div>
		            </div>
		            <div class="modal-footer">
		                <div class="row">
                            <div class="col-xs-6 text-left">
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
		    </div>
		</div>
	`,
	props : {
		show : {},
		users : {},
		options : {},
		sources : {}
	},
	data : function(){
		return {
			loading : false,
			pagination :{
				data : [],
				limit : 10,
				page : 1,
				total: 0,
				user_id: '',
				source_id: '',
				range : {
					startDate : parseInt(moment().startOf('day').valueOf() / 1000),
                    endDate : parseInt(moment().endOf('day').valueOf() / 1000),
				}
			},
			limits : [
				{_id : 10 ,text : 10},
				{_id : 20 ,text : 20},
				{_id : 50 ,text : 50},
				{_id : 100 ,text : 100}
			],
			listUsers :[],
			listSources : [],
		}
	},
	methods :{
		_load : function(){
			this.loading = true;
			var data = {
				limit : this.pagination.limit,
				page: this.pagination.page,
			}
			if(this.pagination.user_id != 'all'){
				data['user_id'] = this.pagination.user_id;
			}
			if(this.pagination.source_id != 'all'){
				data['source_id'] = this.pagination.source_id;
			}
			if(this.pagination.range.startDate != '' && this.pagination.range.endDate != ''){
				data['startDate'] = this.pagination.range.startDate;
				data['endDate'] = this.pagination.range.endDate;
			}
			$.post("/admin/sales/pos/postLoadPosLogs", data ,  (res)=>{
                if (res.status == 403) return;
                if (res.error == false) {
                    this.pagination.data = res.data;
                    this.pagination.page = res.page;
                    this.pagination.total = res.total;
                } else {
                    helper.dialog(res.message, 'warning',  'warning', 1000);
                }
            }).fail(function () {}).always( () => {
                this.loading = false;
            });
		},
		_changePage: function(page){
			this.pagination.page = page;
            this._load();
		}
	},
	watch :{
		'pagination.limit' : function(){
			if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
		},
		'pagination.user_id' : function(){
			if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
		},
		'pagination.source_id' : function(){
			if( this.pagination.page != 1){
                this.pagination.page = 1;
            }
            this._load();
		},
		'pagination.range' : {
			handler :  function(){
				if( this.pagination.page != 1){
	                this.pagination.page = 1;
	            }
	            this._load();
			},
			deep : true,
		}
	},
	created : function(){
		this.listSources = JSON.parse(JSON.stringify(this.sources));
		this.listSources.unshift({_id : 'all', text : 'Tất cả'});
		this.listUsers.push({_id : 'all', text : 'Tất cả'});
		for( var key in this.users){
			if(this.users.hasOwnProperty(key)){
				this.listUsers.push({_id : key , text : this.users[key]});
			}
		}
	},
	mounted : function(){
		$(this.$el).modal('show');
		$(this.$el).on('hidden.bs.modal', ()=>{
			this.$emit('update:show' , false);
		});
		this._load();
	}
})