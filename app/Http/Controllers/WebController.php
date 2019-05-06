<?php
namespace App\Http\Controllers;
use App\Brief;
use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use Auth;
class WebController extends Controller{

	public function __construct()
    {
    	$this->request = array_merge($_POST,$_GET,$_FILES);
    }
	public function index(){
		// $b = new Brief();
		// $data = [
		// 	'name'=>'Luu van my',
		// 	'page_num'=>234,
		// 	'num'=>456,
		// 	'status'=>'wait',
		// 	'district'=>'dt',
		// 	'ward'=>'er',
		// ];
		// return $b->add($data);
		return view('welcome');
	}

	public function search(){

		$key = isset($this->request['keyword'])?$this->request['keyword']:'';
		$this->response['data'] = Brief::where('code','like','%'.trim($key).'%')->orWhere('id','like','%'.trim($key).'%')->get();
		return $this->response;
	}
	public function addBrief(){

		$b = new Brief();
		return $b->add($this->request);
	}
	public function admin(){

		return view('admin.index');
	}

	public function addUser(){

		$u = new User();
		$u->add();
	}
	public function login(){

		return view('admin.login');
	}

	public function postLogin(){

		$data_request = $this->request;
		$data_request = [

			'email'=>$data_request['email'],
			'password'=>$data_request['password']
		];
		if(Auth::attempt($data_request)) {
			
			$this->response['success']   =  true;
			$this->response['link']   =  'index';
			return $this->response;
		}else{

			$this->response['success']   =  false;
			$this->response['message']   =  'Mât khẩu hoặc email không đúng';
			return $this->response;
		}

	}
}