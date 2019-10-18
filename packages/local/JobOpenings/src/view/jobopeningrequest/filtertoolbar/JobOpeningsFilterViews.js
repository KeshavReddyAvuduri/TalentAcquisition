Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsFilterViews', {
	extend: 'Ext.panel.Panel',
	xtype: 'jobopeningsfilterviews',
	requires: [
		'JobOpenings.store.filtertoolbar.FilterbyStatus',
		'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'
	],
	viewModel: {
		type: 'filterviewmodel'
	},
	reference: 'filterview',
	layout: {
		type: 'hbox',
		width: '100%'
	},
	items: [{
		xtype: 'combobox',
		fieldLabel: 'Status',
		reference: 'jobstatuscomboref',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'id',
		emptyText: 'All',
		cls: 'requestCombo-cls',
		store: Ext.create('JobOpenings.store.filtertoolbar.FilterbyStatus',{autoLoad:true}),
		autoLoadOnValue: true,
		listeners: {
			select: 'onStatusSelectionFilter'
		}
	}]
});
