// Region 
// ------

// Manage the visual regions of your composite application. See
// http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
Backbone.Marionette.AnimationRegion = Backbone.Marionette.Region.extend({

  //animation: 'dissolve',
  //has3d: (Modernizr.overflowscrolling && (typeof window.WebKitAnimationEvent != 'undefined') && ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix())),
  initialize: function(){
    this.animation = 'dissolve';
    //cssanimations csstransforms3d
    this.has3d = (Modernizr.cssanimations && Modernizr.csstransforms3d && Modernizr.positionfixed);
    //this.has3d = (Modernizr.overflowscrolling && (typeof window.WebKitAnimationEvent != 'undefined') && ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()));
  },

  open: function(view){

    if(!this.$el.children('div').length)
      view.$el.addClass('current');

    if(!this.$el.find('#'+view.el.id).length)
      this.$el.prepend(view.el);

    /*if(Modernizr.overflowscrolling === false){
        if(this.$el.children('div').length){
          if(this.wrapper)
            this.wrapper.destroy();
          this.$el.prepend(view.el);
          this.wrapper = new iScroll('main', { checkDOMChanges: true, scrollbarClass: 'scrollbar'});
        }
    }*/
  },

  show: function(view){

    this.ensureEl();
    //this.close();

    this.open(view);
    view.render();

    $('body').removeClass('enable-paysage');

    if (view.onShow) { view.onShow(); }
    view.trigger("show");

    if (this.onShow) { this.onShow(view); }
    this.trigger("view:show", view);

    //DO NAVIGATE HERE
    this.doNavigation((this.currentView) ? this.currentView.$el : [], view.$el, {name: this.animation });

    this.currentView = view;
    window.scrollTo(0, 0);

    this.animation= "dissolve";
  },

  doNavigation: function(fromPage, toPage, animation) {
    var self = this;
    // Error check for target page
    if (toPage.length === 0 || fromPage.length === 0) {
      return false;
    }

    // Error check for fromPage===toPage
    if (toPage.hasClass('current')) {
        return false;
    }

    // Collapse the keyboard
    $(':focus').trigger('blur');

    fromPage.trigger('pageAnimationStart', { direction: 'out' });
    toPage.trigger('pageAnimationStart', { direction: 'in' });

    if (this.has3d && animation.name) {

        // Reverse animation if need be
        var finalAnimationName = animation.name;

        // Bind internal "cleanup" callback
        fromPage.bind('webkitAnimationEnd animationend', navigationEndHandler);

        // Trigger animations
        //$('body').addClass('animating');

        //var lastScroll = window.pageYOffset;
        //var main = document.getElementById('main');
        //var lastScroll = main.scrollTop;
        //var lastScroll = 0;

        /*main.style.visibility = 'hidden';
        main.scrollTop = 0;
        fromPage.css('top', -lastScroll);
        main.style.visibility = 'visible';*/
        

        //toPage.css('top', lastScroll - (/*toPage.data('lastScroll') ||*/ 0));
        //$('#main').scrollTop(lastScroll - (toPage.data('lastScroll') || 0));
        
        toPage.addClass(finalAnimationName + ' in current');
        fromPage.addClass(finalAnimationName + ' out');

        //fromPage.data('lastScroll', lastScroll);

    } else {
        toPage.addClass('current in');
        navigationEndHandler();
    }

    // Private navigationEnd callback
    function navigationEndHandler(event) {

        var bufferTime = 100;

        if (self.has3d && finalAnimationName) {
            fromPage.unbind('webkitAnimationEnd animationend', navigationEndHandler);
            fromPage.removeClass('current ' + finalAnimationName + ' out');
            toPage.removeClass(finalAnimationName);
            //$('body').removeClass('animating');

            //var main = document.getElementById('main');
            //var lastScroll = /*toPage.data('lastScroll') ||*/ 0;

            //toPage.css('top', -lastScroll);
            //fromPage.css('top', 0);
            window.scrollTo(0, 0);
            /*setTimeout(function(){
                
                //main.scrollTop = lastScroll;

                
            }, 0);*/

        } else {
            fromPage.removeClass(finalAnimationName + ' out current');
            bufferTime += 260;
        }

        // In class is intentionally delayed, as it is our ghost click hack
        setTimeout(function(){
            toPage.removeClass('in');
        }, bufferTime);

        // Trigger custom events
        toPage.trigger('pageAnimationEnd', { direction:'in', animation: animation});
        fromPage.trigger('pageAnimationEnd', { direction:'out', animation: animation});

        fromPage.remove();
    }

    return true;
  }

});