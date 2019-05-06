<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>

        <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/theme/vendor/c3/c3.min.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/theme/css/bootstrap.min.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/vendor/animate/animate.min.css') }}"/>
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/theme/vendor/spinkit/spinkit.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/vendor/ionicons/css/ionicons.min.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/vendor/daterangepicker/daterangepicker.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/vendor/jquery-ui/jquery-ui.min.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/vendor/jquery-ui/jquery-ui.theme.min.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/vendor/datepicker/datepicker.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/vendor/jquery-confirm/jquery-confirm.min.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/vendor/select2/css/select2.min.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/vendor/cropperjs-master/dist/cropper.min.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/theme/vendor/nestable/jquery.nestable.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/theme/css/core.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/theme/css/components.css') }}"/>
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/theme/css/icons.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/theme/css/pages.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/theme/css/responsive.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/theme/css/theme.css') }}" />
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/css/module.css') }}?v=<?php echo strtotime("now"), "\n"; ?>">
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/css/styles.css') }}">
       <link rel="stylesheet" type="text/css" href="{{ asset('/public/resources/css/custom.css') }}?v={{rand()}}">

          <script src="{{ asset('/public/resources/theme/js/jquery.min.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/jquery-ui/jquery-ui.min.js') }}"></script>
       <script src="{{ asset('/public/resources/theme/js/bootstrap.min.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/vue/lodash.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/vue/vue.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/vue/vue-form.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/vue/v-money.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/vue/vue-sortable.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/vue/vue-draggable.min.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/vue/vue-timepicker.js') }}"></script>
        <script src="{{ asset('/public/resources/vendor/moment/moment.min.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/moment/vi.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/daterangepicker/daterangepicker.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/jquery-confirm/jquery-confirm.min.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/notification/bootstrap-notify.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/select2/js/select2.full.min.js') }}"></script>
       <script src="{{ asset('/public/resources/vendor/cropperjs-master/dist/cropper.min.js') }}"></script>
       <script src="{{ asset('/public/resources/theme/vendor/nestable/jquery.nestable.js') }}?v=<?php echo strtotime("now"), "\n"; ?>"></script>
       <script src="{{ asset('/public/resources/vendor/jquery-scanner/jquery.scannerdetection.js') }}"></script>
       <script src="{{ asset('/public/resources/js/helper.js') }}?v=<?php echo strtotime("now"), "\n"; ?>"></script>
       <script src="{{ asset('/public/resources/vendor/ckeditor492/ckeditor.js') }}"></script>

        <script src="{{ asset('/public/resources/js/components.js') }}?v=<?php echo strtotime("now"), "\n"; ?>"></script>
    </head>
    <body>
      <div class="content" id="app_admin">
        <div class="card-box">
        <h2>Xin chào @{{user.name}}<a href="/labV/logout">Thoát</a></h2>
          <div class="inline-block mg-bottom-5 block-daterange width-50 hidden-xs hidden-sm">
            <input type="text" v-model="keyword" placeholder="Mã hồ sơ ... " class="form-control"></div>
          <div class="inline-block mg-bottom-5 block-daterange width-50 hidden-xs hidden-sm">
            <select class="form-control" v-model="status">
              <option value="all">Tất cả</option>
              <option value="in_process">Đang thụ lý</option>
              <option value="watting_approval">Chờ duyệt</option>
              <option value="approval">Đã có kết quả</option>
              <option value="cancel">Chờ duyệt lại/Kiểm tra lại</option>
            </select>
          </div>
          <div class="view-list list-order">
             <table class="table table-bordered mg-top-20" >
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Mã hồ sơ</th>
                  <th scope="col">Tên chủ hộ</th>
                  <th scope="col">Số tờ</th>
                  <th scope="col">Số thửa</th>
                  <th> Ghi chú</th>
                  <th scope="col">Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list_brief">
                <th scope="row">@{{index+1}}</th>
                <td>@{{item.code}}</td>
                <td>@{{item.name}}</td>
                <td>@{{item.page_num}}</td>
                <td>@{{item.num}}</td>
                <td>@{{item.note}}</td>
                  <td>
                      <span v-if="item.status == 'in_process' || (item.status != 'watting_approval' && item.status != 'approval' && item.status != 'cancel')">Đang thụ lý</span>
                      <span v-if="item.status == 'watting_approval'">Chờ duyệt</span>
                      <span v-if="item.status == 'approval'">Đã có kết quả</span>
                      <span v-if="item.status == 'cancel'">Chờ duyệt lại/kiểm tra lại</span>
                    
                  </td>
                  <td>
                      <button type="button" v-if="user.type_user == 'manager'" class="btn btn-default" @click="approval(item)">Duyệt</button>
                      <button type="button" v-if="user.type_user == 'manager'" class="btn btn-default" @click="cancel(item)">Hủy hồ sơ</button>
                    <a v-if="item.status != 'watting_approval' && item.status != 'approval' && user && user.type_user == 'staff'" data-toggle="modal" @click="openModal(item)" data-target="#myModal" title="" data-original-title="Xem thông tin đơn hàng"><i class="material-icons text-primary">info</i></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>  
          <div id="myModal" class="modal fade" role="dialog">
              <div class="modal-dialog">
            
                <!-- Modal content-->
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Hồ sơ </h4>
                  </div>
                  <div class="modal-body">
                    <label>Ghi chú:</label>
                    <textarea class="form-control" v-model="note">

                    </textarea>
                    {{-- <select class="form-control">
                        <option value="in_process">Đang thụ lý</option>
                        <option value="watting_approval">Chờ duyệt</option>
                        <option value="approval" v-if="user.type_user == 'manager'">Đã có kết quả</option>
                        <option value="cancel" v-if="user.type_user == 'manager'">Chờ duyệt lại/Kiểm tra lại</option>
                    </select> --}}
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-default" @click="sendToManager()">Gửi lên trưởng phòng</button>
                  </div>
                </div>
            
              </div>        
        </div>
      </div></div>
      <script>
          function AppAdmin(element) {
            var timeout = null;
            new Vue({
              el: element,
              data:{
                user:{},
                list_brief:{},
                status:'all',
                keyword:'',
                current_brief:{},
                note:'',
                
              },
              methods:{
                approval:function(item){
                  var _this = this;
                  alert(34)
                  $.post('/labV/admin/admin/changeStatus',{id:item,status:'approval',_token: "{{ csrf_token() }}",},function(res){
                    _this.loadList();
                  })
                },
                cancel:function(item){
                  var _this = this;
                  $.post('/labV/admin/admin/changeStatus',{id:item,status:'cancel',_token: "{{ csrf_token() }}",},function(res){
                    _this.loadList();
                  })
                }
                ,
                sendToManager:function(){
                  var _this = this;
                  $.post('/labV/admin/admin/updateBrief',{id:this.current_brief.id,note:this.note,_token: "{{ csrf_token() }}",},function(res){
                      if(res.error == false){

                        _this.loadList();
                        $('#myModal').modal('hide')
                      }
                  })
                },
                openModal:function(item){
                  this.current_brief = {};
                  this.current_brief = item;
                },
                loadList:function(){

                  var send_data = {
                    _token: "{{ csrf_token() }}",
                    keyword:this.keyword,
                    status:this.status
                  };
                  var _this = this;
                  $.post('/labV/admin/admin/postListBrief',send_data,function(res){

                    _this.user = res.user;
                    _this.list_brief = res.data;
                  });
                }
              },
              created:function(){
                this.loadList();
              },
              watch:{
                'keyword':function(){

                  this.loadList();
                },
                'status':function(){
                  this.loadList();
                }
              }
            })
          }
          var app = new AppAdmin('#app_admin');
</script>
    </body>
</html>
