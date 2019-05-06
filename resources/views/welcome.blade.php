
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Vlab</title>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Mukta:300,400,700"> 
    <link rel="stylesheet" href="{{ asset('/public/template/shopmax/fonts/icomoon/style.css')}}">

    <link rel="stylesheet" href="{{ asset('/public/template/shopmax/css/bootstrap.min.css')}}">
    <link rel="stylesheet" href="{{ asset('/public/template/shopmax/css/magnific-popup.css')}}">
    <link rel="stylesheet" href="{{ asset('/public/template/shopmax/css/jquery-ui.css')}}">
    <link rel="stylesheet" href="{{ asset('/public/template/shopmax/css/owl.carousel.min.css')}}">
    <link rel="stylesheet" href="{{ asset('/public/template/shopmax/css/owl.theme.default.min.css')}}">
    

    <link rel="stylesheet" href="{{ asset('/public/template/shopmax/css/aos.css')}}">

    <link rel="stylesheet" href="{{ asset('/public/template/shopmax/css/style.css')}}">
    <script src="{{ asset('/public/template/shopmax/js/jquery-3.3.1.min.js')}}"></script>
    <script src="{{ asset('/public/template/shopmax/js/jquery-ui.js')}}"></script>
    <script src="{{ asset('/public/template/shopmax/js/popper.min.js')}}"></script>
    <script src="{{ asset('/public/template/shopmax/js/bootstrap.min.js')}}"></script>
    <script src="{{ asset('/public/template/shopmax/js/owl.carousel.min.js')}}"></script>
    <script src="{{ asset('/public/template/shopmax/js/jquery.magnific-popup.min.js')}}"></script>
    <script src="{{ asset('/public/template/shopmax/js/aos.js')}}"></script>
    <script src="{{ asset('/public/resources/vendor/vue/vue.js') }}"></script>
     <script src="{{ asset('/public/resources/vendor/vue/vue-form.js') }}"></script>
     <script src="{{ asset('/public/resources/vendor/vue/v-money.js') }}"></script>
     <script src="{{ asset('/public/resources/vendor/vue/vue-sortable.js') }}"></script>
     <script src="{{ asset('/public/resources/vendor/vue/vue-draggable.min.js') }}"></script>
     <script src="{{ asset('/public/resources/vendor/vue/vue-timepicker.js') }}"></script>
      <script src="{{ asset('/public/resources/vendor/moment/moment.min.js') }}"></script>
     <script src="{{ asset('/public/resources/vendor/moment/vi.js') }}"></script>
      <script src="{{ asset('/public/resources/js/helper.js') }}?v=<?php echo strtotime("now"), "\n"; ?>"></script>
    <script src="{{ asset('/public/resources/vendor/ckeditor492/ckeditor.js') }}"></script>
  
    <script src="{{ asset('/public/resources/js/components.js') }}?v=<?php echo strtotime("now"), "\n"; ?>"></script>
  </head>
  <body>
  
  <div class="site-wrap" id="app_vlab">

    <div class="site-navbar bg-white py-2">

      <div class="search-wrap">
        <div class="container">
          <a href="#" class="search-close js-search-close"><span class="icon-close2"></span></a>
          <form action="#" method="post">
            <input type="text" class="form-control" placeholder="Search keyword and hit enter...">
          </form>  
        </div>
      </div>
      <div class="container">
        <div class="d-flex align-items-center justify-content-between">
          <div class="main-nav d-none d-lg-block">
            <nav class="site-navigation text-right text-md-center" role="navigation">
              <ul class="site-menu js-clone-nav d-none d-lg-block">
                <li class="has-children ">
                  <a href="index.html">Home</a>
                  <ul class="dropdown">
                    <li><a @click="page = 'create'">Tạo hồ sơ</a></li>
                    <li><a @click="page = 'list'">Tra cứu hồ sơ</a></li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
         
        </div>
      </div>
    </div>
   <!--  <div class="site-blocks-cover inner-page" style="background-image: url({{ asset('/public/template/shopmax/images/hero_2.jpg')}}); background-repeat: no-repeat; background-size: cover; background-position: center" data-aos="fade">
      <div class="container">
        <div class="row">
        
        </div>
      </div>
    </div> -->

    <div class="custom-border-bottom py-3">
      <div class="container">
        <div class="row" v-if="nextpage == false">
          <div class="col-md-12 mb-0"><a href="index.html">Home</a> <span class="mx-2 mb-0">/</span> 
            <strong class="text-black" v-if="page == 'create'">Tạo hồ sơ</strong>
            <strong class="text-black" v-else>Tra cứu hồ sơ</strong>
          </div>
        </div>
      </div>
    </div>


    <div class="site-section" v-if="page == 'create'">
      <div class="container" >
        <div class="row" v-if="nextpage == false">
          <div class="col-md-12">
            <h2 class="h3 mb-3 text-black">Thông tin hồ sơ</h2>
          </div>
          <div  class="col-md-12">

            <form  method="post">
              
              <div class="p-3 p-lg-5 border">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label for="c_email" class="text-black">Tên chủ hộ <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" v-model="form.name" name="name"  placeholder="Tên chủ hộ">
                    <div v-if="validate_form.data_error.name == true"  class="help-block text-danger animated fadeIn">
                        @{{validate_form.message.name}}
                    </div>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-md-6">
                    <label for="c_fname" class="text-black">Số tờ <span class="text-danger">*</span></label>
                    <input type="number" class="form-control"  v-model="form.page_num" placeholder="Số tờ">
                    <div v-if="validate_form.data_error.page_num == true"  class="help-block text-danger animated fadeIn">
                        @{{validate_form.message.page_num}}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="c_lname" class="text-black">Số thửa <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" v-model="form.num" placeholder="Số thửa" >
                    <div v-if="validate_form.data_error.num == true"  class="help-block text-danger animated fadeIn">
                        @{{validate_form.message.num}}
                    </div>
                  </div>
                </div>
               
                <div class="form-group row">
                  <div class="col-md-6">
                    <label for="c_subject" class="text-black">Phường </label>
                    <input type="text" class="form-control" v-model="form.district" placeholder="Phường">
                    <div v-if="validate_form.data_error.district == true"  class="help-block text-danger animated fadeIn">
                        @{{validate_form.message.district}}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="c_subject" class="text-black">Quận </label>
                    <input type="text" class="form-control" placeholder="Quận" v-model="form.ward">
                    <div v-if="validate_form.data_error.ward == true"  class="help-block text-danger animated fadeIn">
                        @{{validate_form.message.ward}}
                    </div>
                  </div>
                </div>

                
                <div class="form-group row">
                  <div class="col-lg-12">
                    <input type="button" :disabled="loading == true" class="btn btn-primary btn-lg btn-block" @click.stop.prevent="submitRegister()" value="Tạo hồ sơ">
                  </div>
                </div>
              </div>
            </form>
          </div>
         

         <!--  <div class="col-md-5 ml-auto">
            <div class="p-4 border mb-3">
              <span class="d-block text-primary h6 text-uppercase">New York</span>
              <p class="mb-0">203 Fake St. Mountain View, San Francisco, California, USA</p>
            </div>
            <div class="p-4 border mb-3">
              <span class="d-block text-primary h6 text-uppercase">London</span>
              <p class="mb-0">203 Fake St. Mountain View, San Francisco, California, USA</p>
            </div>
            <div class="p-4 border mb-3">
              <span class="d-block text-primary h6 text-uppercase">Canada</span>
              <p class="mb-0">203 Fake St. Mountain View, San Francisco, California, USA</p>
            </div>

          </div> -->
        </div>
        <div v-else class="row">
          <div class="col-md-12" style="text-align:center;font-size: 20px;color:red;">
          <strong>Tạo hồ sơ thành công với mã số là @{{id}}</strong>
          </div>
            
        </div>
      </div>
    </div>
    <div class="site-section" v-else>
      <div class="container" >
        <div class="row">
          <div class="col-md-12">
              <input v-model="keyword" class="form-control form-control-sm col-md-6" @keyup="search()" type="text" placeholder="Search" aria-label="Search">
          </div>
          <div class="col-md-12 " style="margin-top: 20px;">
              <table class="table">
                  <thead class="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Tên chủ hộ</th>
                      <th scope="col">Mã hồ sơ</th>
                      <th scope="col">Số tờ</th>
                      <th scope="col">Số thửa</th>
                      <th scope="col">Phường</th>
                      <th scope="col">Xã</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template  v-if="list_brief.length > 0">
                        <tr v-for="(item,index) in list_brief">
                            <th scope="row">@{{index+1}}</th>
                            <td>@{{item.name}}</td>
                              <td>@{{item.code}}</td>
                              <td>@{{item.page_num}}</td>
                              <td>@{{item.num}}</td>
                              <td>@{{item.district}}</td>
                              <td>@{{item.ward}}</td>
                              <td>
                                <span v-if="item.status == 'in_process' || (item.status != 'watting_approval' && item.status != 'approval' && item.status != 'cancel')">Đang thụ lý</span>
                                <span v-if="item.status == 'watting_approval'">Chờ duyệt</span>
                                <span v-if="item.status == 'approval'">Đã có kết quả</span>
                                <span v-if="item.status == 'cancel'">Chờ duyệt lại/kiểm tra lại</span>
                              </td>
                            </tr>
                    </template>
                   
                    <tr v-else>
                      <td colspan="8" style="text-align: center">Không tìm thấy hồ sơ nào!!</td>
                    </tr>
                   
                  </tbody>
                </table>
          </div>
        </div>
      </div>
            
        
    </div>

  </div>
    <script>
      function AppVlab(element) {
        var timeout = null;
        new Vue({
          el: element,
          data:{
            form:{
              name:'',
              page_num:0,
              num:0,
              district:'',
              ward:'',
              _token: "{{ csrf_token() }}",
            },
            page:'create',
            nextpage:false,
            loading:false,
            id:'',
            keyword:'',
            validate_form:{
              data_error:{
                name:false,
                page_num:false,
                num:false,
                district:false,
                ward:false,
              },
              message:{

                name:'Vui lòng nhập tên chủ hộ!',
                page_num:'Vui lòng nhập số tờ!',
                num:'Vui lòng nhập số thửa!',
                district:'Vui lòng nhập phường !',
                ward:'Vui lòng nhập quận!',
              },

            },
            list_brief:{},
          },
          methods:{
            search:function(){

              var _this = this;
              clearTimeout(timeout);
              timeout = setTimeout(function () {
                _this.listBrief();
              }, 1000);
            },
            listBrief:function(){
              var _this = this;
              this.list_brief = {};
              if(this.keyword != ''){
                var send_data = {
                  keyword:this.keyword,
                  _token: "{{ csrf_token() }}",
                };
                $.post('web/search',send_data,function(res){
                  
                  _this.list_brief = res.data;
                  console.log(_this.list_brief)
                })
              }
            },
            submitRegister:function(){
              
              var _this = this;
              this.id = '';
              _this.nextpage = false;
              this.validate_form.data_error = {
                name:false,
                page_num:false,
                num:false,
                district:false,
                ward:false,
              };
              var check_validate = false;
              if(this.form.name == ''){

                this.validate_form.data_error.name = true;
                check_validate = true;
              }
              if(this.form.page_num <= 0){

                this.validate_form.data_error.page_num = true;
                check_validate = true;
              }
              if(this.form.num <= 0){

                this.validate_form.data_error.num = true;
                check_validate = true;
              }
              if(this.form.district == ''){

              this.validate_form.data_error.district = true;
              check_validate = true;
              }
              if(this.form.ward == ''){

              this.validate_form.data_error.ward = true;
              check_validate = true;
              }
              if(check_validate == false){
                this.loading = true;
                $.post('web/addBrief',this.form,function(res){
                  _this.loading = false;
                  if(res.error == false){

                    _this.nextpage = true;
                    _this.id = res.data.code;
                  }
                })
              }else{

                console.log(this.validate_form)
              }
              
            },
          },
          created:function(){

            
          }
        });
      }
      var app = new AppVlab('#app_vlab');
    </script>
  </body>
</html>