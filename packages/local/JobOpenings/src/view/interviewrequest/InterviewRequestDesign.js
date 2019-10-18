Ext.define('JobOpenings.view.interviewrequest.InterviewRequestDesign', {
	extend: 'Ext.container.Container',
	xtype: 'interviewrequestdesign',
	requires: [
		'JobOpenings.view.interviewrequest.Interviewlistview',
		'JobOpenings.view.interviewrequest.InterviewRequestModel',
		'JobOpenings.view.interviewrequest.InterviewRequestController'
	],
	cls: 'myInterviewReq-cls noscrollbar',
	reference: 'interviewlistview',
	viewModel: {
        type: 'interviewrequestmodel'
	},
	listeners:{
		afterrender:function(){
			this.getViewModel().getStore('interviewRequestListStore').load({
                params: {
                    loginuser_id: Ext.getStore('login').data.items["0"].data.ddo_employee_id
                }
            });
		}
	},
    controller: 'interviewrequestcontroller',
	items: [{
		xtype: 'container',
		html: '<div class="jobtitle-cls">Interview Request</div>'
	},{
		xtype: 'interviewlistview'
    }, 
    {
		xtype: 'dataview',
		reference: 'interviewdatalistview',
		cls: 'jobdataviewcls',
		emptyText: '<div class="projects-emptytext-cls">No Interviews are schduled</div>',
		bind: {
			store: '{interviewRequestListStore}'
		},
		itemTpl: [
			'<div class="intervReqCls">',
			'<div class="jobsdiv-cls ddo-jobopening-item">',
			'<div class="title-div-cls" data-qtip="{firstname}-{lastname}"><span class="title-cls">{[this.showName(values)]}</span>',
			'<span> | </span>',
			'<span class="creator-cls">{[this.showCurrentjobtitle(values)]}</span>',
			'<div class="interview-cls">Interview<i class="interview-iconcls arrow-cls"></i></span></div>',
			'</div>',
			'<div class="loc-exp-interviewexp"><span><i class="exp-iconcls arrow-cls"></i>&nbsp{workexpyears}.{workexpmonths} Years Experience </span>',
			'<span><i class="location-iconcls arrow-cls"></i>&nbsp{[this.showCurrentlocation(values)]}</span>',
			'</div>',
			'<div class="loc-exp-interviewskill"><i class="skill-iconcls arrow-cls"></i>&nbsp{[this.showSkill(values)]}</div>',
			'<div class="loc-exp-interviewdec">',
			'</div>',
            '</div>',
            '<div class="status-div-cls-interviewreq myInterviewReq_details_bottom" style="height:72px;">',
			'<div class="status-div-phone"><span>{[this.showIntervwType(values)]}</div>',
			'<div class="status-div-date"><span><i class="date_iconcls_intrvw_req2 "></i>&nbsp {[this.showDate(values)]} &nbsp &nbsp</span></div>',
			'<div class="status-div-time"><span><i class="time_iconcls_intrvw_req2 "></i>&nbsp {[this.showIntrvwTime(values)]} &nbsp &nbsp</span></div>',
			'</div>',
			'</div>',
			{
				showCurrentlocation: function(values) { /* intending current location*/
                    var currentlocation = values.currentlocation;
                    if (currentlocation.length > 15) {
                        return currentlocation.substring(0, 12) + "...";
                    } else {
                        return currentlocation;
                    }
                },
                showCurrentjobtitle: function(values) { /* intending current job title*/
                    var currentjobtitle = values.currentjobtitle;
                    if (currentjobtitle.length > 12) {
                        return currentjobtitle.substring(0, 9) + "...";
                    } else {
                        return currentjobtitle;
                    }
                },
				showName: function(values) { /* intending name*/
					var fullname = values.firstname + " " + values.lastname;
					if (fullname.length > 20) {
                        return fullname.substring(0, 17) + "...";
                    } else {
                        return fullname;
                    }
				},
				showSkill: function(values) { /* for skills string*/
					var skillStr = "";
					try {
						var skillsArr = values.skillnames;
						skillsArr.forEach(function(item, index){
							skillStr += ((skillsArr.length-1)!=index)? "#" + item + ", ":"#" + item;
						});
					} catch(exce){}

					if (skillStr.length > 29) {
                        return skillStr.substring(0, 26) + "...";
                    } else {
                        return skillStr;
                    }
				},
				showDate: function(values) { /* to display date*/
					// return values.interviewdate.split('T')[0].split("-").reverse().join("/");
					var intervwDate = values.interviewdate;
                    return Ext.Date.format(new Date(intervwDate), 'd-m-Y');
				},
				showIntrvwTime: function(values) { /* to display time*/
					return values.interviewtime.replace('-', '.');
				},
				showIntervwType: function(values) { /* for interview type*/
					if (values.interviewmode == 1) {
						return "<span><i class='phone_iconcls_intrvw_req2 '></i>&nbsp  Telephonic &nbsp &nbsp</span>"
					}
					if (values.interviewmode == 2) {
						return "<span><i class='skype_iconcls_intrvw_req2 '></i>&nbsp Skype  &nbsp &nbsp</span>"
					}else{
						return "<span><i class='people_iconcls_intrvw_req2 '></i>&nbsp Face-to-Face  &nbsp &nbsp</span>"
					}
				}
			}
		],
		itemSelector: 'div.interview-cls',
		listeners: {
			itemclick: 'onIntervReqClick'
		}
	}]
 });