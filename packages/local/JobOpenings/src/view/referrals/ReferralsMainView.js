Ext.define('JobOpenings.view.referrals.ReferralsMainView', {
  extend: 'Ext.panel.Panel',
 	alias: 'widget.referralsmainview',
  requires : [
    'JobOpenings.view.referrals.ReferralsFormView',
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
      click: function() {
        Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0].getLayout().setActiveItem(2);
      }
    }
  }, {
    xtype:'label',
    html:'Back',
    cls: 'backlabel-cls'
  }, {
    xtype:'label',
    html:'Intern UI Development/Refer a friend',
    reference:'referralTitleRef',
    cls: 'titlelabel-cls',
    margin: 20
  }],
	items: [{
		xtype: 'referralsformview',
    id: 'referralsviewformid'
	}]
});