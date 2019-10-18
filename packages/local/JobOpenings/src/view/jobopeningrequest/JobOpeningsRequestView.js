Ext.define('JobOpenings.view.jobopeningrequest.JobOpeningsRequestView', {
    extend: 'Ext.container.Container',
    xtype: 'jobopeningsrequestview',
    requires: [
        'JobOpenings.view.jobopeningrequest.JobOpeningsRequestListView',
        'JobOpenings.view.jobopeningrequest.JobOpeningsViewForm',
        'JobOpenings.view.jobopeningrequest.JobOpenFormController',
        'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel',
        'JobOpenings.view.jobopeningrequest.JobOpeningsFormDataViewMode'
    ],
    layout: {
        type: 'card',
        activeItem: 0
    },
    reference: 'jobmainview',
    controller: 'jobopenformcontroller',
    viewModel: {
        type: 'filterviewmodel'
    },
    margin: '10 0 0 10',
    items: [{
        xtype: 'jobopeningsrequestlistview',
        id: 'list'
    }, {
        xtype: 'jobopeningsviewform',
        id: 'form'
    }, {
        xtype: 'jobOpeningsFormDataViewMode',
        id: 'viewform'
    }]

});