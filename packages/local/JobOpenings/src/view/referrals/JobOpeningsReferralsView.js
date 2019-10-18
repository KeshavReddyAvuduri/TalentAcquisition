Ext.define('JobOpenings.view.referrals.JobOpeningsReferralsView',{
	extend: 'Ext.container.Container',
	xtype: 'jobopeningsreferralsview',
	requires:[
		'JobOpenings.view.referrals.JobOpeningsReferralsListView',
        'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel',
        'JobOpenings.view.referrals.JobOpeningsMyReferralsView',
        'JobOpenings.view.referrals.JobReferralsController',
        'JobOpenings.view.referrals.ReferralsMain',
		'JobOpenings.view.referrals.ReferralsMainView',
		'JobOpenings.view.jobopeningrequest.JobOpeningsFormDataViewMode'
    ],
	layout: {
		type: 'card',
		activeItem: 0
	},
	margin: '10 0 0 10' ,
    viewModel: {
        type: 'filterviewmodel'
    },
    controller: 'jobreferralscontroller',
    reference: 'jobreferralsreference',
	items:[{
		xtype: 'jobopeningsreferralslistview',
		id: 'referralsList'
	},{
		xtype: 'referralsmain',
		id: 'referralMain'
	},{
		xtype: 'jobopenigsmyreferralsview',
		id: 'myreferrals'
	},{
		xtype: 'referralsmainview',
		id: 'myreferralsview'
	},{
		xtype: 'jobOpeningsFormDataViewMode'
	}]
});