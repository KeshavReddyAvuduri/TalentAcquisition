Ext.define('JobOpenings.view.referrals.JobReferralsView',{
	extend: 'Ext.panel.Panel',
	xtype: 'jobreferralsfilterview',
	requires: [
		'JobOpenings.store.filtertoolbar.FilterbyStatus',
		'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel',
		'JobOpenings.view.referrals.JobReferralsController'
	],
	viewModel: {
		type: 'filterviewmodel'
	},
	controller: 'jobreferralscontroller',
	reference: 'referralsfilterview',
	layout: {
		type: 'hbox',
		width: '100%'
	},
	cls: 'filtertoolbar-cls',
	items: [{
		xtype: 'button',
		width: 6,
		cls: 'karmascore-search-icon-field job-search-icon',
		height: 6,
		padding: '-8 11 14 12'
	}, {
		xtype: 'textfield',
		width: '30%',
		reference: 'jobsearchref_job_ref',
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
		    	click: 'onreferralCloseFilterClk'
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
		    	click: 'onreferralCloseFilterClk'
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
		    	click: 'onreferralCloseFilterClk'
		    }
		}],
		hidden: true
	}, {
		xtype: 'tbfill'
	}, {
		xtype: 'button',
		text: 'My Referrals',
		width: 132,
		height: 40,
		textAlign: 'center',
		cls: 'myreferrals-btn-cls',
		 listeners:{
		 	click: 'onMyReferralsView'
        }
	},{
        	xtype:'tbspacer',
        	width: 19
       }]
});