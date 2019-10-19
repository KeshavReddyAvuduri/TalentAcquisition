Ext.define('JobOpenings.view.jobapplications.JobApplyMain',{
	extend: 'Ext.panel.Panel',
	alias: 'widget.jobapplymain',
	requires : [
		'JobOpenings.view.jobapplications.NewJobApplyForm',
		'JobOpenings.view.jobapplications.JobApplyController',
		'JobOpenings.view.jobapplications.JobApplicationsViewModel'
	],
	viewModel: {
		type:'jobapplicationsviewmodel' 
	}, 
	controller: 'jobapplycontroller',
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
			click:'onInterviewBackButtonClick'
		}
	},{
		xtype:'label',
		html:'Back',
		cls: 'backlabel-cls'
	},{
		xtype:'label',
		html:'Intern UI Development/Add Application',
		cls: 'titlelabel-cls',
		reference:'title_applicationCreationRef',
		margin: 20
	}],
	items: [{
		xtype: 'newjobapplyform'
	}]
});