Ext.define('JobOpenings.view.referrals.filtertoolbar.JobReferralsAddfilterWindow', {
	extend: 'Ext.window.Window',
	xtype: 'filterwindow',
	requires: [
		'JobOpenings.view.referrals.filtertoolbar.JobReferralsFilterComboboxes'
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
	reference:'filterreferwinref',
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
		xtype: 'jobreferralsfiltercomboboxes'
	}]
});