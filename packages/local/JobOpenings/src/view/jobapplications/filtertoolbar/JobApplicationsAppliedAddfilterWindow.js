Ext.define('JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedAddfilterWindow', {
	extend: 'Ext.window.Window',
	xtype: 'jobapplicationsappliedaddfilterwindow',
	requires: [
		'JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterComboboxes'
	],
	title: 'Add Filter',
	modal: true,
	minHeight:200,
	maxHeight: 300,
	width: 620,
	margin: '5 50 0 0',
	layout: {
		type: 'fit'
	},
	closeAction: 'hide',
	reference:'filterapplicationwinref',
	resizable: false,
	cls: 'ddo-filter-window',
	title: 'Add Filters',
	initComponent: function() { /*filter init component*/
		var me = this;
		me.callParent(arguments);
		me.mon(Ext.getBody(), 'click', function (el, e) {
			me.close(me.closeAction);
		}, me, { delegate: '.x-mask' });
	},
	items: [{
		xtype: 'jobapplicationsappliedfiltercomboboxes'
	}]
});