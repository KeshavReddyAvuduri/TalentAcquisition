Ext.define('JobOpenings.view.referrals.JobOpeningsMyReferralsView', {
	extend: 'Ext.container.Container',
	xtype: 'jobopenigsmyreferralsview',
	requires: [
		'JobOpenings.view.referrals.filtertoolbar.JobMyReferralsFilter',
		'JobOpenings.view.referrals.JobReferralsController',
		'JobOpenings.view.jobapplications.JobApplicationsViewModel'
	],
	cls: 'myreferrals-cls noscrollbar',
	reference: 'jobmyreferralsview',
	viewModel: {
		type: 'jobapplicationsviewmodel'
	},
	controller: 'jobreferralscontroller',
	items: [{
		xtype: 'jobopenigsmyreferralsfilterview'
	}, {
		xtype: 'dataview',
		reference: 'jobmyreferralsdata',
		cls: 'jobdataviewcls',
		emptyText: '<div class="projects-emptytext-cls">No Jobs available</div>',
		bind: {
			store: '{jobapplicationsappliedstore}'
		},
		itemTpl: [
			'<div class="my-referral-class-all-views">',
			'<div class="jobsdiv-cls ddo-jobopening-item ">',
			'<div class="title-div-cls"><span class="title-cls">{appfirstname} {applastname}</span>',
			'<tpl if="this.showCurrentJobTitle(values)">',
			'<span> | </span>',
			'<span class="creator-cls">{title}</span>',
			'</tpl>',
			'</div>',
			'<tpl if="skillnames">',
			'<div class="loc-exp-myreferrals"><i class="skill-iconcls arrow-cls"></i>{[this.showSkill(values)]}</div>',
			'</tpl>',
			'<div class="loc-exp-myreferrals">',
			'<span><i class="mobile-iconcls arrow-cls"></i>&nbsp+91&nbsp{mobile} &nbsp &nbsp</span>',
			'<span><i class="mail-iconcls arrow-cls"></i>&nbsp{emailid}</span>',
			'</div>',
			'</div>',
			'<div class="status-div-cls"><div class="status-textcls">Status: <span class="{job_status_name}" style="color:{colorcode};">{appstatus}</span></div>',
			'<div class="status-combo-cls"><a href={resumepath} target="_blank" download={resumename} style="text-decoration: none;"><span class="download-cls">DownloadCV <i class="download-iconcls arrow-cls"></i></span></a>',
			'</div>',
			'</div>',
			'</div>',
			{
				showSkill: function(values) { /* for skills string*/
		          	var skillStr = "";
		          	try {
			            var skillsArr = values.skillnames;
			            skillsArr.forEach(function(item, index){
			              skillStr += ((skillsArr.length-1)!=index)? "#" + item + ", ":"#" + item;
			            });
		          	} catch(exce){}
		          	return skillStr;
	        	},
	        	showCurrentJobTitle: function(values) { /* intending job title*/
	        		var jobtitle = values.title;
	        		if(jobtitle === null){
	        			return false;
	        		}else{
						return jobtitle;
					} 
	        	}
			}
		],
		itemSelector: 'div.my-referral-class-all-views',
		//itemSelector: 'div.status-div-cls',
		listeners: {
			itemclick: 'onJobOpeningClick'
		}
	}]
 });