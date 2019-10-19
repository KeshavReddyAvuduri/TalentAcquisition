Ext.define('JobOpenings.view.referrals.ReferralsMain', {
  extend: 'Ext.panel.Panel',
 	alias: 'widget.referralsmain',
  requires : [
    'JobOpenings.view.referrals.Referralsadd',
    'JobOpenings.view.referrals.JobReferralsController',
    'JobOpenings.view.referrals.ReferralsViewmodel'
  ],
  viewModel: {
    type: 'referralviewmodel'
  }, 
  controller: 'jobreferralscontroller',
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
      click:'BackButtonClick'
    }
  }, {
    xtype:'label',
    html:'Back',
    cls: 'backlabel-cls'
  }, {
    xtype:'label',
    html:'Intern UI Development/Refer a friend',
    reference:'title_myreferralsCreationRef',
    cls: 'titlelabel-cls',
    margin: 20
  }],
	items: [{
		xtype: 'referralsadd',
    id: 'referralsform'
	}]
});