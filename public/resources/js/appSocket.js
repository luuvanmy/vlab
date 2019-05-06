// var socketIO = function(){
//     var socket = io.connect('http://192.168.1.11:3000');
//     var user = null ;
//     var self = this;
//     var color = {
//         success : '#4caf50',
//         warning : '#ffa91c',
//     }
//     var userInfo = JSON.parse(userData);
//     if (!sessionStorage.getItem("userInfo")) {
//         sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
//     }
//     socket.on('connect', function() {
//         self.socket_id = socket.id;
//         var user_data = {
//             user_id : userInfo._id,
//             user_name : userInfo.name,
//             socket_id : socket.id,
//         }
//         socket.emit('user connected', user_data);
//     });
//     socket.on('new user connected', function(data) {
//         // var msg =  data +' vừa đăng nhập !';
//         // $.toast({
//         //     heading: !1,
//         //     text: msg,
//         //     position: 'bottom-left',
//         //     bgColor: color.success,
//         //     icon: !1,
//         //     hideAfter: false,
//         //     stack: 1
//         // });
//     });
//     socket.on('list user connected', function(data) {
//         console.log(data);
//     });
    
   
//     socket.on('sendNotification', function (data) {
//         // console.log(data);
//         data =  JSON.parse(data);
//         if( data.hasOwnProperty('socket_id')){
//             if( data.socket_id == self.socket_id){
//                 return ;
//             }
//         }
//         var msg = (data.hasOwnProperty('message')) ? data.message : '';
//         var now = moment(new Date(parseInt(data.created_at)*1000)).format('h:mm:ss A DD-MM-YYYY ');
//         msg +=  '<div class="text-right mg-top-5">'+now+'</div>';
//         $.toast({
//             heading: !1,
//             text: msg,
//             position: 'bottom-left',
//             bgColor: color.success,
//             icon: !1,
//             hideAfter: false,
//             stack: 1
//         });
//         if( typeof IndexRoute  != undefined){
//             var controller = data.hasOwnProperty('controller') ? data.controller : null ;
//             if( controller != null){
//                 switch (controller) {
//                     case 'SaleOrderController':{
//                         if( typeof listOrder  != 'undefined' ){
//                             if(listOrder.hasOwnProperty('vm')){
//                                 listOrder.vm.load(1);
//                             }
//                         }
//                         break;
//                     }
                       
//                     case 'WarehouseImportController':{
//                         if( typeof listWarehouse   != 'undefined' ){
//                             if(listWarehouse .hasOwnProperty('vm')){
//                                 listWarehouse .vm.load(1);
//                             }
//                         }
//                         break;
//                     }
//                     case 'WarehouseExportController':{
//                         if( typeof listWarehouse   != 'undefined' ){
//                             if(listWarehouse .hasOwnProperty('vm')){
//                                 listWarehouse .vm.load(1);
//                             }
//                         }
//                         break;
//                     }
                       
                        
//                     default:break;
                        
//                 }
//             }
//         }
        
//         return ;
//     });

//     return this;
// }

// $(function(){
//     var appSocket =  new socketIO();
// })