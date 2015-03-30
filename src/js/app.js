
var React = require('react');
var _ = require('underscore');

var ReactIntl = require('react-intl');
var IntlMixin       = ReactIntl.IntlMixin;

var Router = require('react-router');

var bootstrap = require('react-bootstrap');
var DropdownButton  = require('react-bootstrap/lib/DropdownButton');
var MenuItem  = require('react-bootstrap/lib/MenuItem');
var ListGroup  = require('react-bootstrap/lib/ListGroup');
var ListGroupItem  = require('react-bootstrap/lib/ListGroupItem');
var DropdownButton  = require('react-bootstrap/lib/DropdownButton');
var Button  = require('react-bootstrap/lib/Button');
var Input  = require('react-bootstrap/lib/Input');
var Glyphicon  = require('react-bootstrap/lib/Glyphicon');
var Modal  = require('react-bootstrap/lib/Modal');
var ModalTrigger  = require('react-bootstrap/lib/ModalTrigger');
var Label  = require('react-bootstrap/lib/Label');
var Alert  = require('react-bootstrap/lib/Alert');
var ButtonGroup  = require('react-bootstrap/lib/ButtonGroup');
var ProgressBar  = require('react-bootstrap/lib/ProgressBar');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var stateTree = require('./tree');

var intl = require('./translations');

var Actions = require('./actions')

var LangMixin = {
    getDefaultProps: function() {
        return intl[stateTree.select('language').get()];
    }
};

var MyHelpDia = React.createClass({
    render: function(){
        return(
         <Modal {...this.props} bsStyle='primary' title='Help' animation={true} closeButton={true}>
             <div className='modal-body'>
                 <h4>Only in English</h4>
                 <p>This will be filled at some stage</p>
             </div>
             <div className='modal-footer'>
                 <Button onClick={this.props.onRequestHide}>Close</Button>
             </div>
         </Modal>
     )
   }
});

var AnalyticsDia = React.createClass({
    render: function(){

        var docId= this.props.docId;

        var curserActive = stateTree.select('documents', function(item) {
            return item.id === parseInt(docId);
        });

        var itemToFilter = curserActive.get();

        //ToDo: Normalize this, currently it is assuming 100 items

        var pro_primary = _.where(itemToFilter["pros"], {level:"primary"}).length;
        var pro_warning = _.where(itemToFilter["pros"], {level:"warning"}).length;
        var pro_danger = _.where(itemToFilter["pros"], {level:"danger"}).length;


        var con_primary = _.where(itemToFilter["cons"], {level:"primary"}).length;
        var con_warning = _.where(itemToFilter["cons"], {level:"warning"}).length;
        var con_danger = _.where(itemToFilter["cons"], {level:"danger"}).length;


        return(
            <Modal {...this.props} bsStyle='primary' title='Your Analytics' animation={true} closeButton={true}>
                <div className='modal-body'>
                    <h4>Pros</h4>
                    <ProgressBar>
                        <ProgressBar bsStyle='primary' now={pro_primary} key={1} />
                        <ProgressBar bsStyle='warning' now={pro_warning} key={2} />
                        <ProgressBar bsStyle='danger' now={pro_danger} key={3} />
                    </ProgressBar>
                    <h4>Cons</h4>
                    <ProgressBar>
                        <ProgressBar bsStyle='primary' now={con_primary} key={1} />
                        <ProgressBar bsStyle='warning' now={con_warning} key={2} />
                        <ProgressBar bsStyle='danger' now={con_danger} key={3} />
                    </ProgressBar>

                </div>
                <div className='modal-footer'>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        )
    }
});


var AlertBox = React.createClass({

    handleAlertDismiss: function(){
        Actions.removeAlert(this.props.alertNode.id)
    },

    render: function(){
        return (
            <Alert bsStyle={this.props.alertNode.style} dismissAfter={this.props.alertNode.duration} onDismiss={this.handleAlertDismiss}>
                <strong>{this.props.alertNode.title}</strong> {this.props.alertNode.text}
            </Alert>
        );
    }

});

var AlertList = React.createClass({

    mixins: [stateTree.mixin],

    cursors: {
        alerts: ['alerts']
    },

    alertNodeNodes: function (alertNode) {
        return (
            <AlertBox key={alertNode.id} alertNode={alertNode} />
        );
    },

    render: function() {
        return (
            <div>
                    {this.state.cursors.alerts.map(this.alertNodeNodes)}
            </div>
        );
    }
});



var HeaderBox = React.createClass({

    mixins: [IntlMixin, LangMixin, stateTree.mixin],

    cursors: {
        language: ['language']
    },


    _onLangSetClick: function(lang) {
        Actions.setLang(lang);
    },


    render: function() {

        this.props.messages = intl[this.state.cursors.language].messages

        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">MarkEx</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">

                        <DropdownButton title={this.getIntlMessage('nav.change_lang')} className="nav navbar-nav navbar-right navbar-form ">
                            <MenuItem onSelect={this._onLangSetClick.bind(null, "en")}>{this.getIntlMessage('nav.lang_en')}</MenuItem>
                            <MenuItem onSelect={this._onLangSetClick.bind(null, "de")}>{this.getIntlMessage('nav.lang_de')}</MenuItem>
                        </DropdownButton>

                        <ModalTrigger modal={<MyHelpDia />}>
                            <Button bsStyle='primary' className="pheight navbar-right navbar-form" bsSize='medium'>{this.getIntlMessage('nav.help')}</Button>
                        </ModalTrigger>

                        <form className="navbar-form navbar-right">
                            <input type="text" className="form-control" placeholder={this.getIntlMessage('nav.search')} />
                        </form>
                    </div>
                </div>
            </nav>
        );
    }
});


var DocumentButtons = React.createClass({

    mixins: [IntlMixin, LangMixin, stateTree.mixin],

    cursors: {
        language: ['language']
    },

    contextTypes: {
        router: React.PropTypes.func
    },


    _onShareClick: function(){
        Actions.addAlert("You can share this document with this url:" , document.URL, 5000, "info")
    },

    _onDeleteDocClick:function() {
        Actions.deleteDoc(this.props.docId);
        Actions.addAlert("Deleted", "Your document has been deleted", 5000, "danger");

        var curserInActive = stateTree.select('documents', 0);

        if (curserInActive) {
            itsa = curserInActive.get();
            this.context.router.transitionTo('documents', {docId: itsa.id});
        }
    },


    render: function() {

        this.props.messages = intl[this.state.cursors.language].messages

        return (
            <ButtonGroup className="float-right">
                <Button onClick={this._onShareClick}>{this.getIntlMessage('nav.share')}</Button>
                <Button onClick={this._onDeleteDocClick}>{this.getIntlMessage('items.delete')}</Button>
                <Button href="mailto:didi@rebelproject.org">{this.getIntlMessage('nav.feedback')}</Button>
                <ModalTrigger modal={<AnalyticsDia docId={this.props.docId} />}>
                    <Button>{this.getIntlMessage('nav.analytics')}</Button>
                </ModalTrigger>

            </ButtonGroup>
        );
    }
});

var DocumentListItem = React.createClass({

    contextTypes: {
        router: React.PropTypes.func
    },

    render: function() {

        docId = parseInt(this.context.router.getCurrentParams().docId);

        var text = this.props.data.id == docId ? 'active' : '';

        return (
            <li className={text} >
                <Link to="documents" params={{docId: this.props.data.id}}>
                    {this.props.data.title}
                </Link>
            </li>
        );
    }


});


var DocumentList = React.createClass({

    mixins: [stateTree.mixin, LangMixin, IntlMixin],

    cursors: {
        documents: ['documents'],
        language: ['language']

    },

    contextTypes: {
        router: React.PropTypes.func
    },

    _onDocumentItemClick: function(){
        var docId = Actions.addActiveDoc();

        this.context.router.transitionTo('documents', {docId: docId});
    },

    documentNodes: function (docNode) {
        return (
            <DocumentListItem key={docNode.id} data={docNode} />
        );
    },

    render: function() {

        this.props.messages = intl[this.state.cursors.language].messages

        return (
            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-sidebar">
                    {this.state.cursors.documents.map(this.documentNodes)}
                </ul>
                <Button bsStyle='primary' bsSize='large' onClick={this._onDocumentItemClick}>{this.getIntlMessage('nav.add_new_doc')}</Button>

            </div>
        );
    }
});

var PcListItem = React.createClass({

    mixins: [stateTree.mixin, LangMixin, IntlMixin],

    cursors: {
        language: ['language']
    },

    _onItemChange: function(e) {
        Actions.updateItem(this.props.item.id, e.target.value, this.props.datacursor);
    },

    _onItemSelect: function(key, href, target) {
        Actions.setItemLevel(this.props.item.id, target, this.props.datacursor);

    },

    _onItemDelete: function(key, href, target) {
        Actions.deleteItem(this.props.item.id, this.props.datacursor);
        Actions.addAlert(this.getIntlMessage('items.deleted'), this.getIntlMessage('items.deleted_long'))
    },

    render: function() {

        this.props.messages = intl[this.state.cursors.language].messages

        var selectorname = "selector-" + this.props.item.id

        var innerButton = (
            <DropdownButton title={this.getIntlMessage('items.more')} bsStyle={this.props.item.level}>
                <MenuItem target= "danger" onSelect={this._onItemSelect} key='1'><Label bsStyle='danger'>{this.getIntlMessage('items.important')}</Label></MenuItem>
                <MenuItem target= "warning" onSelect={this._onItemSelect} key='2'><Label bsStyle='warning'>{this.getIntlMessage('items.medium')}</Label></MenuItem>
                <MenuItem target= "primary" onSelect={this._onItemSelect} key='3'><Label bsStyle='primary'>{this.getIntlMessage('items.normal')}</Label></MenuItem>
                <MenuItem divider />
                <MenuItem onSelect={this._onItemDelete} key='5'>{this.getIntlMessage('items.delete')}</MenuItem>
            </DropdownButton>
        );
        return (
                <Input onChange={this._onItemChange} name={selectorname} buttonAfter={innerButton}  bsSize="medium" type='text' value={this.props.item.title} />
        );
    }
});

var PcList = React.createClass({

    mixins: [stateTree.mixin, LangMixin, IntlMixin],

    cursors: {
        documents: ['documents'],
        language: ['language']

    },

    _onAddItemClick: function(e) {
        id = Actions.addItem(this.props.datacursor);

        //Give react some time to render everything
        setTimeout(function(){
            document.querySelector('[name="selector-'+id+'"]').focus();
        }, 200);

    },


    render: function() {
        var datacursor = this.props.datacursor;

        this.props.messages = intl[this.state.cursors.language].messages


        var pclist = this.props.dataselector.map(function (item) {
            return (
                <PcListItem key={item.id} datacursor={datacursor} item={item} />
            );
        });

        return (
            <div className="col-lg-6">
                <h3>{this.props.name}</h3>
                    {pclist}
                <Button bsStyle='primary' bsSize='large' onClick={this._onAddItemClick}>{this.getIntlMessage('items.add_item')}</Button>

            </div>

        );
    }

});

var ListArea = React.createClass({
    mixins: [stateTree.mixin],

    cursors: {
        documents: ['documents']
    },

    contextTypes: {
        router: React.PropTypes.func
    },

    _onTitleChange: function(e) {
        Actions.updateTitle(this.context.router.getCurrentParams().docId , e.target.value);
    },

    render: function() {

        docId = this.context.router.getCurrentParams().docId;

        var curserActive = stateTree.select('documents', function(item) {
            return item.id === parseInt(docId);
        });

        var activeItem = curserActive.get();

        var data = [{
            label: 'somethingA',
            values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
        }];

        if (activeItem){
            return (
                <div>
                    <h2 className="page-header"><input type="text" className="input-wide-header" onChange={this._onTitleChange} value={activeItem.title} /><DocumentButtons docId={docId}/></h2>
                    <PcList name="Pros" dataselector={activeItem.pros} datacursor={curserActive.select("pros")} />
                    <PcList name="Cons" dataselector={activeItem.cons} datacursor={curserActive.select("cons")}/>
                </div>
            );

        }else{
            return(
                <p>Could not find the Document you are looking for</p>
            );
        }


    }

});

var MainApp = React.createClass({

    render: function() {
        return (
            <div className="pageWrapper">
                <HeaderBox />
                <div className="container-fluid">
                    <div className="row">
                        <DocumentList />
                        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                            <AlertList />
                            <RouteHandler/>
                        </div>
                    </div>
                </div>
            </div>
            );
    }
});

var routes = (
    <Route handler={MainApp}>

            <Route name="documents" path=":docId" handler={ListArea}/>
            <DefaultRoute handler={ListArea}/>


    </Route>
);


Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});


