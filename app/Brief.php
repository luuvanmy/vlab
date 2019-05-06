<?php 
namespace App;
use Validator;
use Illuminate\Database\Eloquent\Model;

class Brief extends Model {
	protected $collection = "brief";
	protected $connection = 'mysql';
    protected $fillable = [
        'id',
    	'name',
        'page_num',
        'num',
        'status',
        'district',
        'note',
        'ward',
        'code',  
        'created_at',
        'updated_at',
    ];

    public $response = array('error'=>false,'error_list'=>array(),'data'=>array(),'message'=>'');
    
    public $timestamps = false;

    public function add($data = []){
        
        $data['id'] = rand(10,100000).time();
        $data['code'] = $data['id'];
        $data['status'] = 'in_process';
        $rules = [
            'id'    =>  'required',
            'code' => 'required',
            'name'  =>  'required',
            'page_num'    =>  'required',
            'num'  =>  'required',
            'status'    =>  'required',
            'district'  =>  'required',
            'ward'    =>  'required',
            'created_at'  =>  'required',
            'updated_at'  =>  'required',
        ];
        $messages = [
           
            'id.required'   =>  'Chưa tự động phát sinh mã!',
            'code.required'   =>  'Chưa tự động phát sinh mã!',
            'name.required'   =>  'Tên chủ hộ không được để trống!',
            'page_num.required'   =>  'số tờ không được để trống!',
            'num.required'   =>  'Số thửa không được để trống!',
            'status.required'   =>  'Trạng thái không được để trống!',
            'district.required'   =>  'Quận không được để trống!',
            'ward.required'   =>  'Phường không được để trống!',

        ];
        $data['created_at'] = time();
        $data['updated_at'] = time();
        $validation = Validator::make($data, $rules, $messages);
        if ($validation->fails()) {
            $error = $validation->messages()->getMessages();
            $this->response['error'] = true;
            $this->response['error_list'] = $error;
            foreach($error as $key => $err) {
                $msg = $err[0];
            }
            $this->response['message'] = $msg;
            return $this->response;
        }
        
        $add =  $this::create($data);
        if($add){

            $this->response['error'] = false;
            $this->response['message'] = 'Tạo hồ sơ thành công!';
            $this->response['data'] =  $add;
        }else{
            $this->response['error'] = true;
            $this->response['message'] = 'Có lỗi trong quá trình tạo!';
        }
        return $this->response;
    }
}
