define([
         "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/_base/json",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "me/core/main_widgets/EnmeMainLayoutWidget",
         "me/web/widget/support/Wipe",
         "me/web/widget/support/SearchMenu",
         "me/web/widget/support/OrderMenu",
         "me/web/widget/support/SocialFilterMenu",
         "me/web/widget/support/VotesFilterMenu",
         "me/core/enme",
         "dojo/text!me/web/widget/support/templates/filters.html" ],
        function(
                declare,
                _lang,
                _json,
                _WidgetBase,
                _TemplatedMixin,
                _WidgetsInTemplateMixin,
                main_widget,
                Wipe,
                SearchMenu,
                OrderMenu,
                SocialFilterMenu,
                VotesFilterMenu,
                _ENME,
                 template) {
            return declare([ _WidgetBase, _TemplatedMixin, main_widget, _WidgetsInTemplateMixin], {

           /*
            * template string.
            */
           templateString : template,

            /*
            * widgets.
            */
           optionsWidget : { search : null, filter : null, order : null, social : null, votes : null},

           /*
            * i18n message for this widget.
            */
           i18nMessage : {
               detail_manage_filters_advanced : _ENME.getMessage("detail_manage_filters_advanced"),
               detail_manage_filters_order : _ENME.getMessage("detail_manage_filters_order"),
               detail_manage_filters_social_network : _ENME.getMessage("detail_manage_filters_social_network"),
               detail_manage_filters_votes_options : _ENME.getMessage("detail_manage_filters_votes_options")
           },

           /*
            * options
            */
           _wipe : { duration : 100},

           /*
            * type support.
            */
           typeItem : "",

           /*
            *
            */
           wipe_group : "tp-options",

           /*
            *
            */
           postCreate : function() {
               // add filters to main search and execute it
               dojo.subscribe("/encuestame/filters/invoke", this, "_invokeSearchWithFilters");
               // hide all selected items
               dojo.subscribe("/encuestame/filters/selected/remove", this, "_hideAllSelected");
               dojo.connect(this._search, "onclick", dojo.hitch(this, this._openSearch));
               dojo.connect(this._order, "onclick", dojo.hitch(this, this._openOrder));
               dojo.connect(this._social, "onclick", dojo.hitch(this, this._openSocial));
               dojo.connect(this._votes, "onclick", dojo.hitch(this, this._openVotes));
               this.optionsWidget.search = new Wipe(this._search_o, this._wipe.duration, 210, this.wipe_group, "1");
               //FUTURE: disabled
               //this.optionsWidget.order = new encuestame.org.core.commons.support.Wipe(this._order_o, this._wipe.duration, 140, "tp-options", "3");
               this.optionsWidget.social = new Wipe(this._social_o, this._wipe.duration, 180, this.wipe_group, "4");
               //FUTURE: disabled
               //this.optionsWidget.votes = new encuestame.org.core.commons.support.Wipe(this._votes_o, this._wipe.duration, 140, "tp-options", "5");
               this.prepareData();
           },


           /*
            * Clean the filter data.
            */
           cleanFilterData : function () {
                  _ENME.removeItem(this._searchWidget._key_save);
                  _ENME.removeItem(this._socialWidget._key_save);
                  this._searchWidget.clean();
                  this._socialWidget.clean();
                  dojo.publish("/encuestame/wipe/close/group", "tp-options");
                  dojo.publish("/encuestame/filters/selected/remove");
           },

           /*
            * Get stored filter data.
            */
           prepareData : function() {
               // restore search widget information
                var search_data = _ENME.restoreItem(this._searchWidget._key_save);
                if (search_data === null) {
                     _ENME.storeItem(this._searchWidget._key_save, this._searchWidget._status);
                }
           },


           /*
            * Get stored filter data.
            */
           getFilterData : function() {
               // restore search widget information
               var params = _json.fromJson(
                   _ENME.restoreItem(
                         this._searchWidget._key_save
                    )
                );
                // fixed params
                _lang.mixin(params,
                  _json.fromJson(
                    _ENME.restoreItem(this._socialWidget._key_save))
                );
                return params;
           },

            /*
             * Invoke the search with filters
             */
           _invokeSearchWithFilters : function() {
                dojo.publish('/encuestame/tweetpoll/list/search', [this.getFilterData()]);
           },

           /*
            *
            */
           _openSearch : function(event) {
               dojo.publish("/encuestame/wipe/close", [this.optionsWidget.search.id, "tp-options"]);
               this._hideAllSelected();
               this.optionsWidget.search.togglePanel(this._search);
               dojo.addClass(this, "selected");
            },

            /*
             *
             */
            _hideAllSelected : function() {
                dojo.query('.web-filters-options nav a').forEach(function(node, index, arr){
                    dojo.removeClass(node, "selected");
                });
            },

           /*
            *
            */
           _openFilter : function(event) {
               dojo.publish("/encuestame/wipe/close", [this.optionsWidget.filter.id, "tp-options"]);
               this._hideAllSelected();
               this.optionsWidget.search.togglePanel(this._search);
               dojo.addClass(this, "selected");
            },

           /*
            *
            */
           _openOrder : function(event) {
  //             dojo.publish("/encuestame/wipe/close", [this.optionsWidget.order.id, "tp-options"]);
  //             this._hideAllSelected();
  //             this.optionsWidget.order.togglePanel(this._order);
            },

           /*
            *
            */
           _openSocial : function(event) {
               dojo.publish("/encuestame/wipe/close", [this.optionsWidget.social.id, "tp-options"]);
               this._hideAllSelected();
               this.optionsWidget.social.togglePanel(this._social);
            },

           /*
            *
            */
           _openVotes : function(event) {
  //             dojo.publish("/encuestame/wipe/close", [this.optionsWidget.votes.id, "tp-options"]);
  //             this._hideAllSelected();
  //             this.optionsWidget.votes.togglePanel(this._votes);
            }
    });
});