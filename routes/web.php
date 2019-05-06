<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/','WebController@index');
Route::get('/logout', 'LoginController@logout');

Route::group(['prefix' => 'admin'], function() {
  
   
    Route::get('/login','WebController@login');
    Route::any('/postLogin','WebController@postLogin');
    // Route::get('/index','AdminController@admin',function(){
    //     if(!Auth::check()) { Session::flush(); return redirect('login');}
    // });
    
   
    Route::any('/{controller}/{method}/{param?}', function($controller,$method, $param = null){

        if($method != 'postLogin'){

            if(!Auth::check()) { Session::flush(); return redirect('admin/login');}
        }
        
        $method = str_replace('.html','',$method);
        $controller = strtolower($controller);
        $arr_controllers = [

            'admin' => '\AdminController',
        ];

        if(isset($arr_controllers[$controller])){
            $namespace = "App\Http\Controllers";
            $class = $namespace.$arr_controllers[$controller];
            $class = new $class();
            if(method_exists($class, $method)){

                return call_user_func_array(array($class, $method),array($param));
            }
        }
        return "Not found controller '$controller' or method $method";
    });
        // dd(22);
        // $method = str_replace('.html','',$method);
        // $controller = strtolower($controller);
        // $arr_controllers = [

        //     'web' => '\WebController',
        // ];
        // dd($controller);
        // if(isset($arr_controllers[$controller])){
        //     $namespace = "App\Http\Controllers";
        //     $class = $namespace.$arr_controllers[$controller];
        //     $class = new $class();
        //     if(method_exists($class, $method)){

        //         return call_user_func_array(array($class, $method),array($param));
        //     }
        // }
        // return "Not found controller '$controller' or method $method";
    
});
Route::any('/{controller}/{method}/{param?}', function($controller,$method, $param = null){
    $method = str_replace('.html','',$method);
	$controller = strtolower($controller);
	$arr_controllers = [

        'web' => '\WebController',
    ];
    if(isset($arr_controllers[$controller])){
        $namespace = "App\Http\Controllers";
        $class = $namespace.$arr_controllers[$controller];
        $class = new $class();
        if(method_exists($class, $method)){

            return call_user_func_array(array($class, $method),array($param));
        }
    }
    return "Not found controller '$controller' or method $method";
});