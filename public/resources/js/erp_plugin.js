$(function() {
   $('input[name="daterange"]').daterangepicker({
      // "startDate": "11/08/2017",
      // "endDate": "11/14/2017"
   });
});



$(function(){
   $(window).on('resize load', function(event) {
      $('body .content').css('margin-top', $('.navbar-menu').height());
   });
   var isOpen = false;
   $('.navbar-menu .navbar-center >li').each(function(index, el) {
      if( $(this).find('ul').length ){
         $(this).find('>a').append('<span class="caret"></span>')
      }
   });
   $('.navbar-menu .navbar-center > li > a').on('click', '.caret', function(event) {
      event.preventDefault();
      if( $(this).parents('li').hasClass('open-submenu') ){
         $(this).parents('li').removeClass('open-submenu').find('>ul').slideUp();
      }else{
         $('.navbar-menu .navbar-center > li').each(function(index, el) {
            if($(this).hasClass('open-submenu')){
               $(this).removeClass('open-submenu').find('>ul').slideUp();
            }
         });
         $(this).parents('li').addClass('open-submenu').find('>ul').slideDown();
      }
   })
   $('.menu-toggle').on('click', function(event) {
      event.preventDefault();
      if(isOpen){
         $('.navbar-menu .navbar-center').removeClass('active');
         $('.navbar-menu .menu-toggle').removeClass('active');
         $('body').removeClass('menu-is-opened');
      }else{
         $('.navbar-menu .navbar-center').addClass('active');
         $('.navbar-menu .menu-toggle').addClass('active');
         $('body').addClass('menu-is-opened');
      }
      isOpen = !isOpen;
   });
   $('body').on('click', function(event) {
      if( !$(event.target).is('.navbar-center , .navbar-center * , .menu-toggle , .menu-toggle *') && isOpen ){
         isOpen = false ;
         $('.navbar-menu .navbar-center').removeClass('active');
         $('.navbar-menu .menu-toggle').removeClass('active');
         $('body').removeClass('menu-is-opened');
      }
   });
   function closeSubMenu(){
      $('.navbar-menu .navbar-center > li > ul ').slideUp();
   }

});
