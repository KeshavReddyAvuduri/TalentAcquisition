Ext.define('JobOpenings.view.jobapplications.JobApplicationsfilterview', {
    extend: 'Ext.panel.Panel',
    xtype: 'jobapplicationfilterview',
    requires: [
        'JobOpenings.store.filtertoolbar.FilterbyStatus',
        'JobOpenings.view.jobapplications.JobApplicationsViewModel'
    ],
    viewModel:{
        type: 'jobapplicationsviewmodel'
    },
    reference: 'applicationfilterview',
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
        reference: 'jobsearchref_job_app_all',
        enableKeyEvents: true,
        emptyText: 'Search',
        cls: 'karmascore-search-field searchFields job-search-field',
        listeners: {
            keyup: 'onKeyUpJobSearch'
        }
    }, {
        xtype: 'button',
        cls: 'filter-btncls',
        listeners: {
            click: 'hideCombobox'
        }
    },
     {
        items: [{
            xtype: 'button',
            reference: 'dateFilterBtn',
            cls: "filterBtnsCls"
        }, {
            xtype: 'button',
            reference: 'dateFilterBtnCancel',
            cls: "filterBtnsClsCancel",
            text: 'x',
            listeners: {
                click: 'onCloseFilterClk'
            }
        }],
        hidden: true
    }, {
        items: [{
            xtype: 'button',
            reference: 'locationFilterBtn',
            cls: "filterBtnsCls"
        }, {
            xtype: 'button',
            reference: 'locationFilterBtnCancel',
            cls: "filterBtnsClsCancel",
            text: 'x',
            listeners: {
                click: 'onCloseFilterClk'
            }
        }],
        hidden: true
    }, {
        items: [{
            xtype: 'button',
            reference: 'departmentFilterBtn',
            cls: "filterBtnsCls"
        }, {
            xtype: 'button',
            reference: 'departmentFilterBtnCancel',
            cls: "filterBtnsClsCancel",
            text: 'x',
            listeners: {
                click: 'onCloseFilterClk'
            }
        }],
        hidden: true
    }, {
        xtype: 'tbfill'
    },
    {
        xtype: 'combobox',
        fieldLabel: 'Status',
        reference: 'jobstatuscomboref',
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        emptyText: 'All',
        cls: ['requestCombo-cls','request-combo-margin'],
        store: Ext.create('JobOpenings.store.filtertoolbar.FilterbyStatus'),
        autoLoadOnValue: true,
        listeners: {
            select: 'onStatusSelectionFilter'
        },
        hidden: true
    },{
        xtype:'tbspacer',
        width:20
    }]
});