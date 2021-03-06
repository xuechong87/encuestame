define([ "dojo/parser",
         "dijit/registry",
         "dojo/_base/declare",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
     "dijit/_WidgetsInTemplateMixin",
     "me/web/widget/suggestion/Suggest",
     "me/core/URLServices",
     "me/core/enme",
     "me/core/main_widgets/EnmeMainLayoutWidget",
     "dojo/on",
     "dojo/dom",
     "dojo/dom-style",
     "dojo/mouse",
     "dojo/dom-class",
     "me/web/widget/menu/SearchSuggestItemsByType",
     "dojo/text!me/web/widget/menu/template/searchMenu.html",
     "dijit/form/TextBox"], function(
    parser,
    registry,
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    suggest,
    _URL,
    _ENME,
    main_widget,
    on,
    dom,
    domStyle,
    mouse,
    domClass,
    searchSuggestItemsByType,
    template) {


  var SearchMenu = declare([main_widget, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

    /*
     * template string.
     */
    templateString: template,

       /*
        * default label.
        */
       label : "Search",

       /*
        * suggest widget referece.
        */
       textBoxWidget : null,

       /*
        * store all items.
        */
       listItems : [],

       /*
        * default search params.
        */
       searchParam: { limitByItem : 5, keyword : ""},

       /*
        * index item selected.
        */
       _indexItem : -1,

       /*
        * store the item selected temp.
        */
       _selectedNode : null,

       /*
        * define if a key process is on curse.
        */
       _inProcessKey : false,

       /*
        * the time to delay key events.
        */
       _delay : 700,

       /*
        *
        */
       limitByItem : 5,

       /*
        * post create process.
        */
       postCreate: function() {
          this.textBoxWidget = registry.byId(this._suggest);
          if (this.textBoxWidget) {
              this._searchSuggestSupport();
          }
       },

       /*
        * set params
        * @param object of values.
        */
       _setParams: function(value){
           this.searchParam = value;
       },


       /*
        * hide with fade out the suggest box.
        */
       hide : function(){
           //console.info("HIDE");
           this.listItems = [];
           var fadeArgs = {
                   node: this._suggestItems
           };
           dojo.fadeOut(fadeArgs).play();
           this.clear();
       },

       /*
        *
        */
       clear : function(){
           if (this.textBoxWidget) {
               this._selectedNode = null;
               this.textBoxWidget.set("value", "");
           }
           dojo.empty(this._suggestItems);
       },

       /*
        *
        */
       _moveSelected : function(position) {
            dojo.query(".web-search-item").forEach(function(node, index, arr){
                 domClass.remove(node, "selected");
            });
           if (this._indexItem == -1) {
               if (position == "up") {
                   this._indexItem = this.listItems.length;
               } else {
                   this._indexItem = 0;
               }
           } else  if (this._indexItem == 0) {
               if (position == "up") {
                   this._indexItem = this.listItems.length - 1;
               } else if (position == "down") {
                   this._indexItem = this._indexItem + 1;
               }
           } else if (this._indexItem >= this.listItems.length) {
                if (position == "up") {
                    this._indexItem = this.listItems.length - 1;
                } else {
                    this._indexItem = 0;
                }
               this._indexItem = 0;
           } else {
               if (position == "up") {
                   this._indexItem = this._indexItem - 1;
               } else {
                   this._indexItem = this._indexItem + 1;
               }
           }
           //find node in the array.
           var node = this.listItems[this._indexItem];
           this._selectedNode = node;
           if (node) {
               this.textBoxWidget.attr("value", dojo.attr(node, "data-value"));
               domClass.add(node, "selected");
           }
       },

       /*
        * on press enter.
        * @param selectedItem the item selected by user.
        */
       processEnterAction : function(selectedItem) {
           //if item is null, search whith value in the input, if not use the data-value attribute.
           var searchUrl =  _ENME.config('contextPath');
           if (selectedItem == null || dojo.attr(selectedItem, "data-url") == undefined) {
               searchUrl = searchUrl.concat("/search?q=");
               searchUrl = searchUrl.concat(this.textBoxWidget.get("value"));
           } else {
               searchUrl = searchUrl.concat(dojo.attr(selectedItem, "data-url"));
           }
           document.location.href = searchUrl;
       },

       /**
        * Search suggest support.
        */
       _searchSuggestSupport : function() {
           /**
             * initialize the key up event.
             */
         on(this.textBoxWidget, "keypress", dojo.hitch(this, function(/* dojo event */e) {
                var text = this.textBoxWidget.get("value");
                // ENTER key
                if (dojo.keys.ENTER == e.keyCode) {
                     this.processEnterAction(this._selectedNode);
                // ESC key
                } else if (dojo.keys.ESCAPE == e.keyCode) {
                    this.hide();
                // UP ARROW KEY
                } else if (dojo.keys.UP_ARROW == e.keyCode) {
                    this._moveSelected("up");
                // DOWN ARROW KEY
                } else if (dojo.keys.DOWN_ARROW == e.keyCode) {
                    this._moveSelected("down");
                // THE REST OF KEYBOARD
                } else {
                    this._setParams(
                            { limit: _ENME.config('suggest_limit'),
                              keyword : text,
                              limitByItem : this.limitByItem,
                              excludes : this.exclude});
                    if (!encuestame.utilities.isEmpty(text) && text.length > 1) {
                        var parent = this;
                        if (!this._inProcessKey) {
                            this._inProcessKey = true;
                            setTimeout(function () {
                                parent._inProcessKey = false;
                                parent._searchCallService();
                            }, this._delay);
                        }
                    }
                }
                //this.textBoxWidget //TODO: this.hide() on lost focus.
            }));
       },

       /**
        * Make a call to search service.
        * {"error":{},"success":{"items":{"profiles":[],"questions":[],"attachments":[],
        *  "tags":[{"id":null,"hits":3000001,"typeSearchResult":"HASHTAG",
        *  "urlLocation":"/hashtag/nicaragua","score":100,
        *  "itemSearchTitle":"Nicaragua","itemSearchDescription":null}]},
        *  "label":"itemSearchTitle","identifier":"id"
        *  }}
        */
       _searchCallService : function() {
           var load = dojo.hitch(this, function(data) {
               //console.debug("social _searchCallService", data);
               dojo.empty(this._suggestItems);
               if("items" in data.success) {
                   var fadeArgs = {
                           node: this._suggestItems
                   };
                   //reset selected values.
                   this.listItems = [];
                   this._indexItem = -1;
                   this._selectedNode = null;
                   dojo.fadeIn(fadeArgs).play();
                   //print new items.
                   this.printItems(data.success.items);
               }
           });
           var error = function(error) {
               console.debug("error", error);
           };
           this.getURLService().get('encuestame.service.search.suggest', this.searchParam, load, error , dojo.hitch(this, function() {

           }));
       },

       /**
        * Create a list of item.
        * @param data suggested search item.
        */
       printItems : function(data) {
           var widget = new searchSuggestItemsByType(
                   {
                    data : data,
                    parentWidget : this
                    });
           this._suggestItems.appendChild(widget.domNode);
       }
    });


  return SearchMenu;
});