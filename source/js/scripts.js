(function(){ 

  jQuery.cachedScript = jQuery.cachedScript || function( url, options ) {
   
    // Allow user to set any option except for dataType, cache, and url
    options = $.extend( options || {}, {
      dataType: "script",
      cache: true,
      url: url
    });
   
    // Use $.ajax() since it is more flexible than $.getScript
    // Return the jqXHR object so we can chain callbacks
    return jQuery.ajax( options );
  };


  $(document).foundation();

  var $window = $(window);
  (function modals(){
    var $modals = $('[data-reveal]');
    $modals.each(function(){
      var $this = $(this);
      var $closeModal = $this.find('.close');
      $closeModal.on('click', function(){
        $this.foundation('reveal', 'close');
      })
    })
  })(); // Execute Modals

  (function select2(){
    jQuery.cachedScript('../../bower_components/select2/dist/js/select2.full.min.js').done(function(){
      $.fn.select2.defaults.set("theme", "aw-content-library");
      var $select = $('select.select2').removeClass('select2');
      $select.select2();
      $window.on('resize', Foundation.utils.throttle(function(e){
        $select.select2();
      }, 300));
      $("select.select2-tags").select2({
        tags: true,
        tokenSeparators: [',', ' ']
      })
    });
  })(); // Execute Select2

  (function pikaday(){
    jQuery.cachedScript('../../bower_components/Pikaday/pikaday.js').done(function(){
      jQuery.cachedScript('../../bower_components/Pikaday/plugins/pikaday.jquery.js').done(function(){
        var $datePicker = $('.datepicker').pikaday({ 
          firstDay: 1,
          bound: false,
          container: $('.calendar')[0]
        }).pikaday('show');
        var $pickaDay = $('.pickADay').pikaday({
          
        });
      });
    });
  })(); // Execute pikaday()

  (function showHideNext(){
    $('[data-showhidenext]').on('click', function(){
      $(this).next().toggle(250);
    });
  })();
})();