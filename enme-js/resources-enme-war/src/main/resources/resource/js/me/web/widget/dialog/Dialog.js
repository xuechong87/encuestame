define([
         "dojo/_base/declare",
         "dijit/Dialog",
         "me/core/main_widgets/EnmeMainLayoutWidget",
         "dojo/Deferred",
         "dojo/_base/fx",
         "me/core/enme"],
        function(
                declare,
                dialog,
                main_widget,
                Deferred,
                fx,
                _ENME) {
            return declare([dialog], {

          draggable : false,

          style : "width: 200px; height: 200px;",

          destroy_after_hide : true,

          //post create
          postCreate : function(){
              this.inherited(arguments);
          },

          onHide : function() {
              //something before hide.
          },

          /*
           *
           */
          _afterHide : function() {
              if( this.destroy_after_hide) {
                  console.info("after hide");
                  //this.destroy();
              }
          },


          hide: function() {
              // summary:
              //		Hide the dialog
              // returns: dojo.Deferred
              //		Deferred object that resolves when the hide animation is complete

              // if we haven't been initialized yet then we aren't showing and we can just return
              if (!this._alreadyInitialized) {
                  return;
              }

              if (this._fadeInDeferred) {
                  this._fadeInDeferred.cancel();
              }
              //TODO: review the Deferred support.
              //http://dojotoolkit.org/reference-guide/1.8/dojo/Deferred.html
              this._fadeOutDeferred = new Deferred(dojo.hitch(this, function(){
                  fadeOut.stop();
                  delete this._fadeOutDeferred;
              }));

              // fade-in Animation object, setup below
              var fadeOut = fx.fadeOut({
                  node: this.domNode,
                  duration: this.duration,
                  onEnd: dojo.hitch(this, function(){
                      this.domNode.style.display = "none";
                      dijit._DialogLevelManager.hide(this);
                      this.onHide();
                      this._fadeOutDeferred.callback(true);
                      delete this._fadeOutDeferred;
                  })
               }).play();

              if (this._scrollConnected) {
                  this._scrollConnected = false;
              }

              dojo.forEach(this._modalconnects, dojo.disconnect);
              this._modalconnects = [];

              if (this._relativePosition) {
                  delete this._relativePosition;
              }

              this._set("open", false);
              this._afterHide();
              return this._fadeOutDeferred;
          }

    });
});

//dojo.provide("encuestame.org.core.commons.dialog.Dialog");
//
//dojo.require("dijit.Dialog");
//
//dojo.declare(
//    "encuestame.org.core.commons.dialog.Dialog",
//    [dijit.Dialog],{
//        //disable drag support.

//});
//
