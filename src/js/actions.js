var stateTree = require('./tree');

var intl = require('./translations');

var uniqID = 10;

module.exports = {

    setLang: function (lang) {
        //Build up all the langs we accept
        var keys = [];
        for(var k in intl) keys.push(k);

        if (keys.indexOf(lang) != -1 ){
            var cursorLang = stateTree.select('language')
            cursorLang.edit(lang)
        }else{
            throw "Lang not found";
        }
    },

    updateTitle: function (id, title){

        if (title.length == 0){
            title = "<please set>";
        }

        var curserActive = stateTree.select('documents', function(item) {
            return item.id === parseInt(id);
        });

        var itemToSetInactive = curserActive.get();

        if(itemToSetInactive){
            itemToSetInactive.title = title;
            curserActive.edit(itemToSetInactive);
        }else{
            throw "No active item found";
        }

        stateTree.commit();

    },

    updateItem: function(itemID, newValue, datacursor){
        var curserActive = datacursor.select(function(item) {
            return item.id === parseInt(itemID);
        });

        var item = curserActive.get();

        if(item){
            item.title = newValue

            curserActive.edit(item);

            stateTree.commit();
        }else{
            throw "Item not found";
        }
    },


    getNewId: function(){
        uniqID = uniqID + 1;
        return uniqID;
    },


    setItemLevel: function(itemID, newLevel, datacursor){
        var curserActive = datacursor.select(function(item) {
            return item.id === parseInt(itemID);
        });


        var item = curserActive.get();

        if (item){
            item.level = newLevel

            curserActive.edit(item);

            stateTree.commit();
        }else{
            throw "Item not found";
        }

    },

    addItem: function(datacursor){

        var newItemId = this.getNewId();

        var newItemObj = {"title": "", id: newItemId, level:"primary"};

        datacursor.push(newItemObj);

        stateTree.commit();

        return newItemId;
    },

    deleteItem: function(itemID, datacursor){
        var curserActive = datacursor.select(function(item) {
            return item.id === parseInt(itemID);
        });


        var item = curserActive.get();

        if (item){
            curserActive.remove()

            stateTree.commit();
        }else{
            throw "Item not found";
        }

    },

    addAlert: function(title, text, duration, style ){

        if(!title){ throw "You need a title" ; }
        if(!text){  throw "You need a text" ; }
        if(!duration){ duration = 2000; }
        if(!style){ style = "warning"}


        var alertCursor = stateTree.select('alerts');

        var newAlert = {id: this.getNewId(), title:title, text:text, duration:parseInt(duration), style:style}

        alertCursor.push(newAlert);

    },


    removeAlert: function(alertId){
        var alertCursor = stateTree.select('alerts', function(item) {
            return item.id === parseInt(alertId);
        });

        var item = alertCursor.get();

        if (item){
            alertCursor.remove()

            stateTree.commit();
        }else{
            throw "Alert not found";
        }
    },


    deleteDoc: function(id){
        var curserActive = stateTree.select('documents', function(item) {
            return item.id === parseInt(id);
        });

        var itemToDelete = curserActive.get();

        if(itemToDelete){
            curserActive.remove();
            stateTree.commit();
        }else{
            throw "Can not find document";
        }

    },

    addActiveDoc:function(){

        var adid = this.getNewId();

        var docItem = {
                "id": adid,
                "title": "<please set>",
                "active": false,
                "pros":[],
                "cons":[]
        };

        var alertCursor = stateTree.select('documents');
        alertCursor.push(docItem);
        stateTree.commit();

        return adid;
    }
};
