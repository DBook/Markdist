

jest.autoMockOff();

treeFile = '../src/js/tree.js';
actionFile = '../src/js/actions.js'

_ = require('underscore');

/*
 setLang
 */
describe('Language update', function() {

    it('Checks if the tree updates language', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);

        //Check that the Mock data is en
        expect(Tree.select('language').get()).toBe("en");

        //Set it to german
        Actions.setLang("de");

        //Commit as Baobab is async
        Tree.commit();

        //Result should be updated
        expect(Tree.select('language').get()).toBe("de");

    });

    it('Checks if the tree only accepts valid languages', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);

        //Check that the Mock data is en
        expect(Tree.select('language').get()).toBe("en");

        //Set it to something stupid

        expect( function(){ Actions.setLang("xx"); } ).toThrow(new Error("Lang not found"));

        //Commit as Baobab is async
        Tree.commit();

        //Result should be updated
        expect(Tree.select('language').get()).not.toBe("xx");
        expect(Tree.select('language').get()).not.toBe("de");
        expect(Tree.select('language').get()).toBe("en");

    });
});


/*
 updateTitle
 */
describe('Active item title update', function() {

    it('Check if the title updates', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);


        var curserActive = Tree.select('documents', function(item) {
            return item.id === 1;
        });

        expect(curserActive.get().title).toBe("AAA");

        Actions.updateTitle(1, "TESTING");

        expect(curserActive.get().title).toBe("TESTING");

    });

    it('Check that empty titles are not possible', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);


        var curserActive = Tree.select('documents', function(item) {
            return item.id === 1;
        });

        expect(curserActive.get().title).toBe("AAA");

        Actions.updateTitle(1, "");

        expect(curserActive.get().title).toBe("<please set>");
        expect(curserActive.get().title).not.toBe("");

    });


});


/*
 updateItem
*/
describe('Check if update item text works', function() {

    it('Lets set some text', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);

        var curserActive = Tree.select('documents', function(item) {
            return item.active === true;
        });

        var itemToTest = curserActive.select('pros');

        expect( _.isEqual(itemToTest.get()[0], { title: 'PRO1', id: 3, level: 'primary' }) ).toBe(true);

        Actions.updateItem(3, "Testing", itemToTest )

        expect( _.isEqual(itemToTest.get()[0], { title: 'Testing', id: 3, level: 'primary' }) ).toBe(true);

        Actions.updateItem("3", "Testing2", itemToTest )

        expect( _.isEqual(itemToTest.get()[0], { title: 'Testing2', id: 3, level: 'primary' }) ).toBe(true);

        expect( function(){
            Actions.updateItem("3000", "TestingXXX2", itemToTest )
        } ).toThrow(new Error("Item not found"));

        expect( _.isEqual(itemToTest.get()[0], { title: 'Testing2', id: 3, level: 'primary' }) ).toBe(true);
        expect( _.isEqual(itemToTest.get()[0], { title: 'TestingXXX2', id: 3, level: 'primary' }) ).not.toBe(true);

    });
});


/*
 getNewId
 */
describe('Check if we get new ids', function() {

    it('Just see if they increment', function() {
        var Actions = require(actionFile);

        var fistID = Actions.getNewId();

        expect(Actions.getNewId()).toBe(fistID + 1);
        expect(Actions.getNewId()).toBe(fistID + 2);
        expect(Actions.getNewId()).toBe(fistID + 3);

    });

});


/*
 setItemLevel
 */
describe('Check if we can modify the levels of an item', function() {

    it('should set the level to some values', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);

        var curserActive = Tree.select('documents', function(item) {
            return item.active === true;
        });

        var itemToTest = curserActive.select('pros');

        expect( _.isEqual(itemToTest.get()[0], { title: 'PRO1', id: 3, level: 'primary' }) ).toBe(true);

        Actions.setItemLevel("3", "testing", itemToTest)

        expect( _.isEqual(itemToTest.get()[0], { title: 'PRO1', id: 3, level: 'testing' }) ).toBe(true);

        Actions.setItemLevel("3", "Testing2", itemToTest )

        expect( _.isEqual(itemToTest.get()[0], { title: 'PRO1', id: 3, level: 'Testing2' }) ).toBe(true);

        expect( function(){
            Actions.setItemLevel("3000", "TestingXXX2", itemToTest )
        } ).toThrow(new Error("Item not found"));

        expect( _.isEqual(itemToTest.get()[0], { title: 'PRO1', id: 3, level: 'Testing2' }) ).toBe(true);
        expect( _.isEqual(itemToTest.get()[0], { title: 'PRO1', id: 3, level: 'TestingXXX2' }) ).not.toBe(true);

    });

});

/*
 addItem
 */
describe('Check if we can add an item', function() {

    it('should add a new item', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);

        var curserActive = Tree.select('documents', function(item) {
            return item.id === 1;
        });

        var itemToTest = curserActive.select('pros');

        expect( itemToTest.get().length ).toBe(2);

        Actions.addItem(itemToTest)

        expect( itemToTest.get().length ).toBe(3);

        expect( _.isEqual(itemToTest.get()[2], { title: '', id: 11, level: 'primary' }) ).toBe(true);

        //Do the same with cons
        var itemToTest = curserActive.select('cons');

        expect( itemToTest.get().length ).toBe(2);

        Actions.addItem(itemToTest)

        expect( itemToTest.get().length ).toBe(3);

        expect( _.isEqual(itemToTest.get()[2], { title: '', id: 12, level: 'primary' }) ).toBe(true);

    });
});


/*
 deleteItem
 */
describe('Check if delete item works', function() {

    it('should delete an item', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);

        var curserActive = Tree.select('documents', function(item) {
            return item.id === 1;
        });

        var itemToTest = curserActive.select('pros');

        expect( itemToTest.get().length ).toBe(2);

        Actions.deleteItem(3, itemToTest)

        expect( itemToTest.get().length ).toBe(1);

        expect( _.isEqual(itemToTest.get()[0], {"title": "PRO2", id:4, level:"primary" }) ).toBe(true);

        expect( function(){
            Actions.deleteItem(3, itemToTest)
        } ).toThrow(new Error("Item not found"));


    });
});

/*
 addAlert
 */

describe('Check if we can add an Alert', function() {

    it('should add alerts', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);

        var alertCursor = Tree.select('alerts');

        expect( alertCursor.get().length ).toBe(0);

        Actions.addAlert("title", "text", 1000, "style" );

        Tree.commit();

        expect( alertCursor.get().length ).toBe(1);

        var toBe = { id: 11,
            title: 'title',
            text: 'text',
            duration: 1000,
            style: 'style' };

        expect( _.isEqual(alertCursor.get()[0], toBe) ).toBe(true);

        // Now let's test with defaults
        Actions.addAlert("title", "text");

        Tree.commit();

        expect( alertCursor.get().length ).toBe(2);

        var toBe = { id: 12,
            title: 'title',
            text: 'text',
            duration: 2000,
            style: 'warning' };

        expect( _.isEqual(alertCursor.get()[1], toBe) ).toBe(true);

        expect( function(){
            Actions.addAlert("title");
        } ).toThrow(new Error("You need a text"));

        expect( function(){
            Actions.addAlert(null, "text");
        } ).toThrow(new Error("You need a title"));


    });
});



/*
 removeAlert
 */

describe('Check if we delete an alert', function() {

    it('should first add an alert and then delete it', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);

        var alertCursor = Tree.select('alerts');

        expect( alertCursor.get().length ).toBe(0);

        Actions.addAlert("title", "text", 1000, "style" );

        Tree.commit();

        expect( alertCursor.get().length ).toBe(1);

        //Now really remove something

        Actions.removeAlert(11);

        expect( alertCursor.get().length ).toBe(0);

        expect( function(){
            Actions.removeAlert(11);
        } ).toThrow(new Error("Alert not found"));


    });
});




/*
 deleteDoc
 */
describe('Delete documents', function() {

    it('should set the level to some values', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);

        var curserActive = Tree.select('documents');

        expect( curserActive.get().length ).toBe(2);

        Actions.deleteDoc(1);

        expect( curserActive.get().length ).toBe(1);

        docLast = {
            "id": 2,
            "title": "BBBB",
            "text": "TEXT B",
            "active": false,
            "pros":[
            ],
            "cons":[
            ]

        };

        expect( _.isEqual(curserActive.get()[0], docLast) ).toBe(true);

        expect( function(){
            Actions.deleteDoc(1);
        } ).toThrow(new Error("Can not find document"));

        Actions.deleteDoc(2);

        expect( curserActive.get().length ).toBe(0);

        expect( _.isEqual(curserActive.get(), []) ).toBe(true);

        expect( function(){
            Actions.deleteDoc(2);
        } ).toThrow(new Error("Can not find document"));

    });
});



/*
 addActiveDoc
 */
describe('Add a new document', function() {

    it('should add one empty document', function() {
        var Actions = require(actionFile);
        var Tree = require(treeFile);

        var curserActive = Tree.select('documents');

        expect( curserActive.get().length ).toBe(2);

        dociId = Actions.addActiveDoc();

        expect( curserActive.get().length ).toBe(3);

        var docItem = {
            "id": dociId,
            "title": "<please set>",
            "active": false,
            "pros":[],
            "cons":[]
        };

        expect( _.isEqual(curserActive.get()[2], docItem) ).toBe(true);

    });
});
