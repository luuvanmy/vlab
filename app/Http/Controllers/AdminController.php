<?php
namespace App\Http\Controllers;
use App\Brief;
use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use Auth;
class AdminController extends Controller{

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
    public function logout(){
        Auth::logout();
    }
    public function changeStatus(){
        if(!empty($this->request['id'])){
            $this->request['status'] = isset($this->request['status'])?$this->request['status']:'cancel';
            $brief = Brief::where('id',$this->request['id'])->first();
            if($brief){

                $brief->status = $this->request['status'];
                $update = $brief->save();
                if($update){

                    $this->response['error'] = false;
                    $this->response['message'] = 'Cập nhật trạng thái thành công!!';
                }else{
                    $this->response['error'] = true;
                    $this->response['message'] = 'Có lỗi trong quá trình cập nhật!!';
                }
            }else{
                $this->response['error'] = true;
                $this->response['message'] = 'Hồ sơ không còn tồn tại';

            }
        }else{
            $this->response['error'] = true;
            $this->response['message'] = 'Vui lòng truyền id hồ sơ';
        }
    }
    public function updateBrief(){
        if(!empty($this->request['id'])){
            $this->request['note'] = isset($this->request['note'])?$this->request['note']:'';
            $brief = Brief::where('id',$this->request['id'])->first();
            if($brief){
                $brief->note = $this->request['note'];
                $brief->status = 'watting_approval';
                $update = $brief->save();
                if($update){

                    $this->response['error'] = false;
                    $this->response['message'] = 'Gửi lên cho trưởng phòng thành công!!';
                }else{
                    $this->response['error'] = true;
                    $this->response['message'] = 'Có lỗi trong quá trình gửi!!';
                }


            }else{
                $this->response['error'] = true;
                $this->response['message'] = 'Hồ sơ không còn tồn tại';

            }

        }else{
            $this->response['error'] = true;
            $this->response['message'] = 'Vui lòng truyền id hồ sơ';
        }
        return $this->response;
    }
    public function postListBrief(){
 
        $data = Brief::where('id','!=','');
        if(!empty($this->request['status']) && $this->request['status'] != 'all'){

            $data = $data->where('status',$this->request['status']);
        }
        if(Auth::user()->type_user == 'manager'){

            $data = $data->where(function($q){
                return $q->orWhere('status','watting_approval')
                ->orWhere('status','approval');
            });
        }
        if(!empty($this->request['keyword'])){
            $key = $this->request['keyword'];
            $data = $data->where('code','like','%'.trim($key).'%');
        }
        $data = $data->get();
        $user = Auth::user();
        $this->response['data'] = $data;
        $this->response['user'] = $user;

		return $this->response;
    }
	public function postLogin(){
        
		$data_request = $this->request;
		$data_request = [

			'email'=>$data_request['email'],
			'password'=>$data_request['password']
		];
		if(Auth::attempt($data_request)) {
			
			$this->response['success']   =  true;
            $this->response['link']   =  'admin/admin/index';
            
		}else{

			$this->response['success']   =  false;
			$this->response['message']   =  'Mât khẩu hoặc email không đúng';
			
        }
        return $this->response;

	}
}