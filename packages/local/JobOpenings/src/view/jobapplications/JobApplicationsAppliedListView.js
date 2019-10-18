Ext.define('JobOpenings.view.jobapplications.JobApplicationsAppliedListView', {
	extend: 'Ext.container.Container',
	xtype: 'jobapplicationsappliedlistview',
	requires: [
		'JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterView',
		'JobOpenings.view.jobapplications.JobApplicationsViewModel'
	],
	cls: 'jobopening-cls noscrollbar',
	reference: 'appliedlistview',
	controller: 'jobappliedformcontroller',
	viewModel: {
		type: 'jobapplicationsviewmodel'
	},
	listeners:{
afterrender:function(){
	this.getViewModel().getStore('jobapplicationsappliedstore').load();
}
	},
	items: [{
		xtype: 'jobapplicationsappliedfilterview'
	}, {
		xtype: 'dataview',
		reference: 'jobapplicationdataview',
		cls: 'jobdataviewcls',
		emptyText: '<div class="projects-emptytext-cls">No Jobs available</div>',
		bind: {
			store: '{jobapplicationsappliedstore}'
		},
		itemTpl: [
			'<div class="itemSelecCls">',
			'<div class="jobsdiv-cls ddo-jobopening-item">',
			'<div class="title-div-cls"><span class="title-cls">{[this.showName(values)]}</span>',
			'<span> | </span>',
			'<span class="creator-cls">{[this.showCurrentjobtitle(values)]}</span>',
			'<div class="interview-cls" style="{[this.intervwDisabled(values)]}">Interview<i class="interview-iconcls arrow-cls"></i></span></div>',
			'</div>',
			'<div class="loc-exp-applications"><span><i class="exp-iconcls arrow-cls"></i>&nbsp{workexpyears}.{workexpmonths} Years Experience </span>',
			'<span><i class="location-iconcls arrow-cls"></i>&nbsp{currentlocation}</span>',
			'</div>',
			'<div class="loc-exp-applications-skills"><i class="skill-iconcls arrow-cls"></i>&nbsp{[this.getAllSkills(values)]}</div>',
			'<div class="loc-exp-applications-edu"><i class="education-iconcls arrow-cls"></i>&nbsp{education} - {[this.showCollegename(values)]}</div>',
			'<div class="loc-exp-applications-con">',
			'<span><i class="phone_iconcls_intrvw_req"></i>&nbsp+91&nbsp{[this.showMobile(values)]} &nbsp &nbsp</span>',
			'<span><i class="mail-iconcls arrow-cls"></i>&nbsp {[this.showEmailId(values)]}</span>',
			'</div>',
			'</div>',
			'<div class="status-div-cls"><div class="status-textcls">Status: <span class="{job_status_name}" style="color:{colorcode};">{appstatus}</span></div>',
			'<div class="status-combo-cls"><a href={resumepath} target="_blank" download ={resumename} style="text-decoration: none;"><span class="download-cls">DownloadCV <i class="download-iconcls arrow-cls"></i></span></a>',
			'<span> | </span>',
			'<div class="act-cls">Actions <i class="x-fa fa-sort-desc arrow-cls"></i>',
			'<div class="act-removecls">{[this.getActions(values)]}',
			'</div></div>',
			'</div>',
			'</div>',
			'</div>',
			{
				showMobile: function(values) {/* intending mobile no*/
                    var mobile = (values.mobile!=undefined && values.mobile!=null)?values.mobile.toString():"";
                    if (mobile.length > 10) {
                        return mobile.substring(0, 10) + "...";
                    } else {
                        return mobile;
                    }
                },
                showEmailId: function(values) {/* intending email address*/
                    var emailid = (values.emailid!=undefined && values.emailid!=null)?values.emailid:"";
                    if (emailid.length > 25) {
                        return emailid.substring(0, 22) + "...";
                    } else {
                        return emailid;
                    }
                },
				showCollegename: function(values){/* intending college name*/
                    var collegename = (values.collegename!=undefined && values.collegename!=null)? values.collegename: "";
                    if (collegename.length > 20) {
                        return collegename.substring(0, 17) + "...";
                    } else {
                        return collegename;
                    }
                },
				showName: function(values) {/* intending name*/
					var fullname = values.appfirstname + " " + values.applastname;
					if (fullname.length > 20) {
                        return fullname.substring(0, 17) + "...";
                    } else {
                        return fullname;
                    }
				},
				showCurrentjobtitle: function(values) {/* intending current job title*/
                    var currentjobtitle = (values.currentjobtitle!=undefined && values.currentjobtitle!=null)? values.currentjobtitle: "";
                    if (currentjobtitle.length > 12) {
                        return currentjobtitle.substring(0, 9) + "...";
                    } else {
                        return currentjobtitle;
                    }
                },
                intervwDisabled: function(values) {/* show if interview button disabled*/
                	if (values.currentjobtitle==undefined || values.currentjobtitle==null) {
                		return "background-color: #908d8d;";
                	}
                },
				getAllSkills: function(values) {/* for skills string*/
					var skillStr = "";
					try {
						var skillsArr = (values.skillnames!=undefined && values.skillnames!=null)?values.skillnames:[];
						skillsArr.forEach(function (item, index) {
							skillStr += ((skillsArr.length - 1) != index) ? "#" + item + ", " : "#" + item;
						});
					} catch (exce) { }

					if (skillStr.length > 29) {
                        return skillStr.substring(0, 26) + "...";
                    } else {
                        return skillStr;
                    }
				},
				getActions: function(values) {
					
					var view = Ext.ComponentQuery.query('mainviewport')[0],
						viewModel = view.getViewModel(),
						showAction = viewModel.data.showAction;
					var actions = [],
						actionsStore = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].getViewModel().getStore('JobopeningsActions');


					if (actionsStore) {
						actionsStore.each(function (rec) {
							var actionName = rec.get('action_name');
							if (viewModel.get('editJobApplication') == true && actionName == "Edit") {
								actions.push('<li>' + rec.get('action_name') + '</li>');
							}
							if (viewModel.get('deleteJobApplication') == true && actionName == "Delete") {
								actions.push('<li>' + rec.get('action_name') + '</li>');
							}
						})
					}
					return '<ul>' + actions.toString().replace(/,/g, '') + '</ul>';
				}
			}
		],
		itemSelector: 'div.itemSelecCls',
		listeners: {
			itemclick: 'onJobOpeningClick',
			containerClick: 'onContainerClick'
		}
	}]
});