Ext.define('JobOpenings.view.referrals.filtertoolbar.JobMyReferralsFilter', {
    extend: 'Ext.panel.Panel',
    xtype: 'jobopenigsmyreferralsfilterview',
    requires: [
        'JobOpenings.store.filtertoolbar.FilterbyStatus',
        'JobOpenings.view.referrals.JobReferralsController',
        'JobOpenings.view.jobapplications.JobApplicationsViewModel'
    ],
    viewModel: {
        type: 'jobapplicationsviewmodel'
    },
    controller: 'jobreferralscontroller',
    reference: 'myreferralsfilterview',
    layout: {
        type: 'hbox',
        width: '100%'
    },
    cls: 'filtertoolbar-cls',
    dockedItems: [{
        xtype: 'toolbar',
        cls: 'tooltip-cls',
        dock: 'top',
        items: [{
            xtype: 'button',
            scale: 'medium',
            iconCls: 'goalsbackbtn-cls',
            cls: 'jobback-btn-cls',
            style: {
                border: 0
            },
            listeners: {
                click: 'onBackClick'
            }
        }, {
            xtype: 'label',
            html: 'Back',
            cls: 'backlabel-cls'
        },{
            xtype:'label',
            html:'My Referrals',
            cls: 'titlelabelMyreferrals-cls',
            margin: 20
       }]
    }],
    items: [{
        xtype: 'button',
        width: 6,
        cls: 'karmascore-search-icon-field job-search-icon',
        height: 6,
        padding: '-8 11 14 12'
    }, {
        xtype: 'textfield',
        width: '30%',
        reference: 'jobsearchref_job_referrals',
        emptyText: 'Search',
        enableKeyEvents: true,
        cls: 'karmascore-search-field searchFields job-search-field',
        listeners: {
            keyup: 'onKeyUpJobSearch'
        }
    }, {
        xtype: 'button',
        cls: 'filter-btncls',
        listeners: {
            click: 'hideComboboxMyReferrals'
        }
    }, {
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
                click: 'onCloseFilterClkMyReferrals'
            }
        }],
        hidden: true
    },{
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
                click: 'onCloseFilterClkMyReferrals'
            }
        }],
        hidden: true
    },{
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
                click: 'onCloseFilterClkMyReferrals'
            }
        }],
        hidden: true
    }]
});