<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>
        <meta name="csrf-token" content="{{ csrf_token() }}" />

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
     
      <div class="content " id="app_login">
        
          <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-4" >
                <div class="container">
                    <div class="row justify-content-center align-items-center" style="height:auto">
                        <div class="col-4">
                            <div class="card">
                                <div class="card-body">
                                    <form action="" autocomplete="off">
                                        <div class="form-group">
                                            <input type="text" class="form-control"v-model="form.email" placeholder="Nhập email" name="username">
                                        </div>
                                        <div class="form-group">
                                            <input type="password" v-model="form.password" class="form-control" placeholder="Nhập password" name="password">
                                        </div>
                                        <button type="button" id="sendlogin" @click.stop.prevent="login()"  class="btn btn-primary">login</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
          </div>
       
    
      </div>
      <script type="text/javascript">
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    </script>
      <script>
          function AppLogin(element) {
            var timeout = null;
            new Vue({
              el: element,
              data:{
                form:{
                  email:'',
                  password:'',
                  _token: "{{ csrf_token() }}",
                }
              },
              methods:{
                login:function(){

                  $.post('admin/postLogin',this.form,function(res){

                    if(res.success){
                      window.location= res.link;
                    }
                  })
                }
              },
              created:function(){
                
              }
            })
          }
          var app = new AppLogin('#app_login');
          </script>
    </body>
</html>
