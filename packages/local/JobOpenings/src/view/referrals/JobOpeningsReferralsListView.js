Ext.define('JobOpenings.view.referrals.JobOpeningsReferralsListView',{
	extend: 'Ext.container.Container',
	xtype: 'jobopeningsreferralslistview',
	requires:[
  	'JobOpenings.view.referrals.JobReferralsView',
  	'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel',
    'JobOpenings.view.referrals.JobReferralsController'
	],
	cls: 'jobopening-cls noscrollbar',
  controller: 'jobreferralscontroller',
  viewModel:{
    type: 'filterviewmodel'
  },
  reference: 'referralslistview',
  listeners:{
    afterrender:function(){
      this.getViewModel().getStore('jobReferralsDataViewStore').load();
    }
  },
	items:[{
		xtype: 'container',
		html:'<div class= "jobtitle-cls">Job Openings </div>'
	},{
		xtype: 'jobreferralsfilterview'
	},{
		xtype: 'dataview',
    reference: 'jobdataviewreferrals',
    cls: 'jobdataviewcls',
    emptyText: '<div class="projects-emptytext-cls">No Jobs available</div>',
    bind: {
      store: '{jobReferralsDataViewStore}'
    },
    itemTpl: [
      '<div class="jobsdiv-cls ddo-jobopening-item">',
			'<div class="title-div-cls" data-qtip="{title}-{department_name}"><span class="title-cls">{[this.showTitle(values,15)]}</span>',
			'<span> | </span>',
			'<span class="creator-cls" data-qtip="{firstname}">Created by {[this.showName(values,8)]}</span></div>',
			'<div class="positions-cls">( {count_status}/{noofpositions} ) Positions</div>', //{minworkexperience}
			'<div class="loc-exp-referrals"><span><i class="exp-iconcls arrow-cls"></i>&nbsp{minworkexperience} - {maxworkexperience} Years Experience </span>',
			'<span><i class="location-iconcls arrow-cls"></i>&nbsp{location_name}</span>',
			'</div>',
			'<div class="skill-cls"><i class="skill-iconcls arrow-cls"></i>{[this.showSkill(values)]}</div>',
			'<div class="desc-cls">{[this.showDescription(values,100)]}</div>',
			'</div>',
			'<div class="status-div-cls status-div-referrals-cls">',
			'<div class="act-cls create-jobreferrals-btn-cls ">Refer a Friend',
			'</div>',
			'</div>',
			'</div>',
      {
        listRecruiter: function(values) { /* for recruiters list*/
          var lists = [];
          var jobOpeningsStore = Ext.getStore('jobopenings.JobRecruiter');
          if (jobOpeningsStore) {
            jobOpeningsStore.each(function (rec) {
              lists.push('<li><i class="checkImg"></i>' + rec.get('recruiter_name') + '</li>');
            });
          }
          var assignVisible = values.isAssignVisible ? "act-showcls" : "act-removecls";
          return '<div class="rec-assigncls">Assign To <i class="x-fa fa-sort-desc arrow-cls"></i><div class="' + assignVisible + '"><ul>' + lists.toString().replace(/,/g, '') + '</ul></div></div>';
        },
        showDescription: function(values, limit) {/* intending description*/
          var desc = values.job_desc;
          if (desc.length >= limit) {
            return '<div style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:411px; height: 36px;">' + desc + "</div>";
            //return desc.substring(0, 80) + "... ";
          } else {
            return desc;
          }
        },
        showTitle: function (values, limit) { /* intending title*/
          var department = values.department_name;
          if (department == null || department == "") {
            department = '';
          } else {
            department = ' - ' + department
          }
          var title = values.title + department;
          if (title.length >= limit) {
            return title.substring(0, 22) + "...";
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
        showSkill: function(values) { /* for skills string */
          var skillStr = "";
          try {
            var skillsArr = values.skillnames;
            skillsArr.forEach(function(item, index){
              skillStr += ((skillsArr.length-1)!=index)? "#" + item + ", ":"#" + item;
            });
          } catch(exce){}
          return skillStr;
        }
      }
    ],
    // itemSelector: 'div.status-div-cls',
    listeners: {
      itemclick: 'onJobOpeningClick'
    }
	}]
});