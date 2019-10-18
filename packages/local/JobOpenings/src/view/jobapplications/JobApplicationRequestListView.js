Ext.define('JobOpenings.view.jobapplications.JobApplicationRequestListView',{
	extend:'Ext.container.Container',
	xtype:'jobapplicationrequest',
	requires: [
		'JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsFilterView',
		'JobOpenings.view.jobapplications.JobApplicationsViewModel',
		'JobOpenings.view.jobapplications.JobApplicationsfilterview',
		'JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterView'
	],
	cls: 'jobopening-cls noscrollbar',
	controller: 'jobappliedformcontroller',
    viewModel: {
        type: 'jobapplicationsviewmodel'
    },
	reference: 'jobapplicationrequestlistview',
	items: [{
		xtype: 'container',
		html: '<div class="jobtitle-cls">Job Applications</div>'
	}, {
		xtype: 'jobapplicationfilterview'
	}, {
		xtype: 'dataview',
		reference: 'jobapplieddataview',
		cls: 'jobdataviewcls',
		emptyText:'<div class="projects-emptytext-cls">No Jobs available</div>',
		bind: {
			store: '{jobApplicationsDataViewStore}'
		},
		itemTpl: [
			'<div class="jobsdiv-cls ddo-jobopening-item-applications">',
			'<div class="title-div-cls" data-qtip="{title}-{department_name}"><span class="title-cls">{[this.showTitle(values,15)]}</span>',
			'<span> | </span>',
			'<span class="creator-cls" data-qtip="{firstname}">Created by {[this.showName(values,8)]}</span></div>',

			'{[this.workOnPriorityShow(values)]}',

			'<div class="positions-cls">( {count_status}/{noofpositions} ) Positions</div>',
			'<div class="loc-exp"><span><i class="exp-iconcls arrow-cls"></i>&nbsp{minworkexperience} - {maxworkexperience} Years Experience </span>',
			'<span><i class="location-iconcls arrow-cls"></i>&nbsp{location_name}</span>',
			'</div>',
			'<div class="skill-cls"><i class="skill-iconcls arrow-cls"></i>{[this.showSkill(values)]}</div>',
			'<div class="desc-cls">{[this.showDescription(values,100)]}</div>',
			'</div>',
			'<div class="status-div-cls"><div class="status-textcls"><span >{count} Applications</span></div>',

			'<div class=" create-jobapplication-btn-cls forNewAppli">View Applications',
			'</div>',
			'</div>',
			'</div>',
			{
				showDescription: function(values, limit) {/* to display description*/
					var desc = values.job_desc;
					if (desc.length >= limit) {
						return '<div style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:411px; height: 36px;">' + desc + "</div>";
						//return desc.substring(0, 80) + "... ";
					} else {
						return desc;
					}
				},
				showTitle: function(values, limit) {/*to display title propely*/
					var title = values.title + " - " + values.department_name;
					if (title.length >= limit) {
						return title.substring(0, 17) + "...";
					} else {
						return title;
					}
				},
				showName: function(values,limit){
					var name = values.firstname;
					if(name.length >= limit){
						return name.substring(0,8) + "...";
					}else{
						return name;
					}
				},
				showSkill: function(values) {/* to display job skills string*/
					var skillStr = "";
					try {
						var skillsArr = values.skillnames;
						skillsArr.forEach(function(item, index){
							skillStr += ((skillsArr.length-1)!=index)? "#" + item + ", ":"#" + item;
						});
					} catch(exce){}
					return skillStr;
				},
				workOnPriorityShow: function(values) {/*to display if work on priority*/
					if (values.work_on_priority == "Y") {
						return '<div class="create-jobapplication-starbtn-cls"><span><i class="star-cls arrow-cls"></i></span></div>';
					} else {
						return '';
					}
				}
			}
		],
		itemSelector: 'div.status-div-cls',
		listeners : {
			itemclick: 'onViewApplicationClick'
			//containerClick: 'onContainerClick'
		}
	}]
});