Ext.define('JobOpenings.view.referrals.filtertoolbar.JobMyReferralsAddfilterWindow', {
	extend: 'Ext.window.Window',
	xtype: 'jobmyreferralsaddfilterwindow',
	requires: [
		'JobOpenings.view.referrals.filtertoolbar.JobMyReferralsFilterComboboxes'
	],
	title: 'Add Filter',
	modal: true,
	height: 300,
	width: 620,
	margin: '5 50 0 0',
	layout: {
		type: 'fit'
	},
	closeAction: 'hide',
	reference:'filtermyreferwinref',
	resizable: false,
	cls: 'ddo-filter-window',
	title: 'Add Filters',
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.mon(Ext.getBody(), 'click', function(el, e) {
			me.close(me.closeAction);
		}, me, { delegate: '.x-mask' });
	},
	items: [{
		xtype: 'jobmyreferralsfiltercomboboxes'
	}]
});