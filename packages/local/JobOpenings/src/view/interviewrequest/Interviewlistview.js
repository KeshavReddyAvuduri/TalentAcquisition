Ext.define('JobOpenings.view.interviewrequest.Interviewlistview', {
    extend: 'Ext.panel.Panel',
    xtype: 'interviewlistview',
    requires: [
        'JobOpenings.store.filtertoolbar.FilterbyStatus',
        'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'

    ],
    viewModel: {
        type: 'filterviewmodel'
    },
    reference: 'interviewrequestlistview',

    layout: {
        type: 'hbox',
        width: '100%'
    },
    cls: 'filtertoolbar-cls',
    
    items: [{
            xtype: 'button',
            width: 6,
            cls: 'karmascore-search-icon-field job-search-icon',
            iconCls: 'x-fa fa-search',
            height: 6,
            padding: '-8 11 14 12'
        }, {
            xtype: 'textfield',
            width: '30%',
            reference: 'jobsearchref_interv_req',
            enableKeyEvents: true,
            emptyText:'Search',
            cls: 'karmascore-search-field searchFields job-search-field', 
            listeners: {
                keyup: 'onKeyUpJobSearch'
            }

        }]
});