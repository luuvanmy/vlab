<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Validator;
use Hash;
class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id','name', 'email', 'password','type_user'
    ];
    public $timestamps = false;
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $table = 'user';
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function add(){

        $data = [
            [
            'id'=>time(),
            'name'=>'Chuyên viên 001',
            'email'=>'chuyenvvien001@gmail.com',
            'password'=>Hash::make('123456'),
            'type_user'=>'staff',
            ],
            [
                'id'=>time()+1,
                'name'=>'Trưởng phòng',
                'email'=>'truongphong@gmail.com',
                'password'=>Hash::make('123456'),
                'type_user'=>'manager',
            ]
        ];
        foreach ($data as $item) {
        
            $this->create($item);
        }
        
    }
}
