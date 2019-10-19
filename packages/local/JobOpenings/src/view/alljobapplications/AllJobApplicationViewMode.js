Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationViewMode',{
	extend: 'Ext.panel.Panel',
	alias: 'widget.alljobapplicationviewmode',
	requires : [
		'JobOpenings.view.alljobapplications.AllJobApplicationsFormViewMode',
		'JobOpenings.view.alljobapplications.AllJobApplicationsController',
		'JobOpenings.view.alljobapplications.AllJobApplicationsViewModel'
	],
	viewModel: {
		type:'alljobapplicationsviewmodel' 
	}, 
	controller: 'alljobapplicationscontroller',
	cls: 'job-header',
	tools:[{
		xtype: 'button',
		scale: 'medium',
		iconCls: 'x-fa fa-arrow-left',
		cls: 'jobback-btn-cls',
		style:{
			border: 0
		},
		listeners:{
			click:'onAllJobApplicationBackButtonClick'
		}
	},{
		xtype:'label',
		html:'Back',
		cls: 'backlabel-cls'
	},{
		xtype:'label',
		html:'Intern UI Development/View Application Details',
		cls: 'titlelabel-cls',
		reference:'title_applicationCreatRef',
		margin: 20
	}],
	items: [{
		xtype: 'alljobapplicationsformviewmode'
	}]
});