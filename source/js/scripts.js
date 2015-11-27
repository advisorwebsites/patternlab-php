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
    var $body = $('body');
    function confirmClose($modal) {
      var $body = $body || $('body');
      $modal.on('aw.confirmCloseModal', function(e){
        var $revealModalBg = $revealModalBg || $body.children('.reveal-modal-bg');
        $body.addClass('confirm-modal');
        $revealModalBg
          .on('transitionend mstransitionend webkitTransitionEnd oTransitionEnd', function () {
            $body.removeClass('confirm-modal');
          })
          var r = window.confirm('Are you sure you want to lose all your changes?');
          if (r === true) {
            $modal.foundation('reveal', 'close');
          }
      });
      $modal.one('opened.fndtn.reveal', function () {
        var $revealModalBg = $body.children('.reveal-modal-bg');
        $revealModalBg.on('click', function(e){
          $modal.trigger('aw.confirmCloseModal');
        });
      });
      
      $modal.find('.close-reveal-modal').on('click', function(e){
        $modal.trigger('aw.confirmCloseModal');
        e.stopPropagation();
      });
    }
    var $modals = $('[data-reveal]');
    $modals.each(function(){
      var $this = $(this);
      var $closeModal = $this.find('.close');
      $closeModal.on('click', function(){
        $this.foundation('reveal', 'close');
      });
      if ($this.hasClass('modal-confirm')) {
        confirmClose($this);
      }
    })
  })(); // Execute Modals

  (function select2(){
    jQuery.cachedScript('../../bower_components/select2/dist/js/select2.full.min.js').done(function(){
      $.fn.select2.defaults.set('theme', 'aw-content-library');
      var $select = $(document).find('select.select2').removeClass('select2');
      if ($select.length) {
        $select.select2();
        $(window).on('resize', Foundation.utils.throttle(function(){
          $select.select2();
        }, 300));
      }
      $('select.select2-tags').removeClass('select2-tags').select2({
        tags: true,
        tokenSeparators: [',', ' ']
      })
    });
  })(); // Execute Select2

  (function pikaday(){
    jQuery.cachedScript('../../bower_components/Pikaday/pikaday.js').done(function(){
      jQuery.cachedScript('../../bower_components/Pikaday/plugins/pikaday.jquery.js').done(function(){
        function calendarWeekDisplayer($calendar) {
          var array, frequency;
          var $editPublishBasis = $('#edit-publish-basis');
          var $editPublishDays = $('#edit-publish-days--wrapper').hide();
          $(document).on('aw.updateCalendar' , function(){
            frequency = $editPublishBasis.val();
            var array = [];
            $editPublishDays.find('.form-checkbox').each(function(i){
              if(this.checked) {
                array.push($(this).val());
              } // endif
            })
            if (frequency === 'weekly') {
              $('.pika-table tbody tr td').removeClass('is-selected');
              jQuery.each(array, function(i, item){
                $('.pika-table tbody tr td:nth-of-type(' + item +')').addClass('is-selected'); 
              });
              $editPublishDays.show();
            } else {
              $editPublishDays.hide();
            }
          });
          $(document).on('change' , '#edit-publish-basis' , function(){
            $(document).trigger('aw.updateCalendar');
          });
          $(document).on('change' , '#edit-publish-days .form-checkbox' , function(){
            $(document).trigger('aw.updateCalendar');
          });
        }
        var $datePicker = $('.datepicker');
        if ($datePicker.length) {
          $datePicker = $('.datepicker').pikaday({ 
            firstDay: 0,
            bound: false,
            container: $('.calendar')[0]
          }).pikaday('show');
        }
        calendarWeekDisplayer($datePicker);
      });
    });
  })(); // Execute pikaday()

  (function showHideNext(){
    $('[data-showhidenext]').on('click', function(){
      $(this).next().toggle(250);
    });
  })();
  (function awSidebar(){
    function onHoverAction(){
      $('body').addClass('sidebar-hover');
    }
    function offHoverAction(){
      $('body').removeClass('sidebar-hover');
    }
    $(context).find('#block-aw-dashboard-main-menu').hoverIntent(onHoverAction, offHoverAction);
    $(context).find('#img-logo').hoverIntent(onHoverAction, offHoverAction);
  });
  (function algolia(){

    function searchCallback(err, content) {
      var $qResults = $qResults || $('#q-results');
      var $qInput = $qInput || $('#q-input');
      var $qEmpty = $qEmpty || $qResults.find('.empty');
      if (err) {
        // error
        return;
      }
      if (content.query !== $qInput.val()) {
        // do not take out-dated answers into account
        return;
      }
      if (content.hits.length === 0) {
        // no results
        $qResults.html($qEmpty);
        return;
      }
      var html = '';
      // Scan all hits and display them
      for (var i = 0; i < content.hits.length; ++i) {
        var hit = content.hits[i];
        html += '<li class="hit">';
        // for (var attribute in hit._highlightResult) {
        //   html += '<div class="attribute">' +
        //     '<span>' + attribute + ': </span>' +
        //     hit._highlightResult[attribute].value +
        //     '</div>';
        // }
        html += '<a href="' + hit.path + '">';
        html += hit._highlightResult.name.value;
        html += '</a>';
        html += '</li>';
      }
      $qResults.html(html);
    }
    
    $(document).ready(function() {
      var $qButton = $qButton || $('#q-button');
      var $qResults = $qResults || $('#q-results');
      var $qEmpty = $qResults.find('.empty');
      var $qInput = $qInput || $('#q-input');
      var client = algoliasearch('XXM5C67T6N', '47ce44b6372ab071d847e9c521744b48');
      var index = client.initIndex('dev_dashboard');
      $qInput.keyup(function() {
        index.search($qInput.val(), searchCallback);
      }).focus().closest('form').on('submit', function() {
        // on form submit, store the query string in the anchor
        location.replace('#q=' + encodeURIComponent($qInput.val()));
        return false;
      });
      // check if there is a query in the anchor: http://example.org/#q=my+query
      if (location.hash && location.hash.indexOf('#q=') === 0) {
        var q = decodeURIComponent(location.hash.substring(3));
        $qInput.val(q).trigger('keyup');
      }
      $qButton.on('click', function(e) {
        e.preventDefault();
        Foundation.libs.dropdown.open($qResults, $qInput);
        $qResults.focus();
        e.stopPropagation();
      });
    });
  })();
})();