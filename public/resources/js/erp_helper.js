
erpComponent();
erpDirective();
var helper = new erpHelper();

/*
   import helper function for callback
*/
function erpHelper() {
   this.showNotification = function(message , icon = null , type = 'info' , time = 5000){
      jQuery.notify({
         icon: icon,
         message: message
      },{
         type: type,
         timer: time,
         delay: 500,
      });
   }
   this.createId = function() {
      var idStrLen = 32;
      var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
      idStr += (new Date()).getTime().toString(36) + "_";
      do {
         idStr += (Math.floor((Math.random() * 35))).toString(36);
      } while (idStr.length < idStrLen);

      return (idStr);
   }
   this._token = function() {
      if ($('meta[name=_token]').length) {
         var _token = $('meta[name=_token]').attr('content');
         return (_token === undefined) ? null : _token;
      }
      return null;
   }
   this.get = (url , timeout = 15000)=>{
      var formData = new FormData;
      formData.append('_token',this._token());
      var promise = $.ajax({
         type: 'GET',
         data: formData,
         url: url,
         contentType: false,
         processData: false,
         timeout: timeout,
      })
      .done(function (responseData, status, xhr) {})
      .fail(function (xhr, status, err) {});
      return promise;
   }
   this.post = (url , data , timeout = 15000)=>{
      data.append('_token',this._token());
      var promise = $.ajax({
         type: 'POST',
         data: data,
         url: url,
         contentType: false,
         processData: false,
         timeout: timeout,
      })
      .done(function (response, status, xhr) {})
      .fail(function (xhr, status, err) {});
      return promise;
   }
   return this;
}

/*
   import all  component for Vue Application
*/
function erpComponent(){

}
/*
   import all  component for Vue Application
*/
function erpDirective(){

}
