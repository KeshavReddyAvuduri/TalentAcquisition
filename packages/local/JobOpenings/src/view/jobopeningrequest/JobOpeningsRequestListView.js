Ext.define('JobOpenings.view.jobopeningrequest.JobOpeningsRequestListView', {
  extend: 'Ext.container.Container',
  xtype: 'jobopeningsrequestlistview',
  requires: [
    'JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsFilterView',
    'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel',
    // 'JobsModule.store.jobopenings.JobopeningsActions'
  ],
  cls: 'jobopening-cls noscrollbar',
  reference: 'listview',
  viewModel: {
    type: 'filterviewmodel'
  },
  listeners:{
    afterrender:function(){
      this.getViewModel().getStore('jobOpeningDataViewStore').load();
    }
        },

  items: [{
    xtype: 'container',
    html: '<div class="jobtitle-cls">Job Opening Requests</div>'
  }, {
    xtype: 'jobopeningsfilterview'
  }, {
    xtype: 'dataview',
    reference: 'jobdataview',
    cls: 'jobdataviewcls',
    emptyText: '<div class="projects-emptytext-cls">No Jobs available</div>',
    bind: {
      store: '{jobOpeningDataViewStore}'
    },
  
    itemTpl: [
      '<div class="jobOpenFormView">',
      '<div class="jobsdiv-cls ddo-jobopening-item">',
      '<div class="title-div-cls" data-qtip="{title}-{department_name}"><span class="title-cls">{[this.showTitle(values,15)]}</span>',
      '<span> | </span>',
      '<span class="creator-cls" data-qtip="{firstname}">Created by {[this.showName(values,8)]}</span>',
      '{[this.workOnPriorityShow(values)]}',
      '<div class="positions-cls">( {noofpositions} ) Positions</div>',
      '</div>',
      '<div class="loc-exp"><span><i class="exp-iconcls arrow-cls"></i>&nbsp{minworkexperience} - {maxworkexperience} Years Experience </span>',
      '<span><i class="location-iconcls arrow-cls"></i>&nbsp{location_name}</span>',
      '</div>',
      '<div class="skill-cls"><i class="skill-iconcls arrow-cls"></i>{[this.getSkillNames(values)]}</div>',
      '<div class="desc-cls">{[this.showDescription(values,100)]}</div>',
      '</div>',
      '<div class="status-div-cls"><div class="status-textcls">Status: <span class="{job_status_name}">{job_status_name}</span></div>',
      '<div class="status-combo-cls">{[this.listRecruiter(values)]}',
      '<span> | </span>',
      '<div class="act-cls">Actions <i class="x-fa fa-sort-desc act-arrow arrow-cls"></i>',
      '<div class="act-removecls">{[this.getActions(values)]}',
      '</div></div>',
      '</div>',
      '</div>',
      '</div>',
      {
        getActions: function (values) { /* to get actions*/
          
          var view = Ext.ComponentQuery.query('mainviewport')[0],
            viewModel = view.getViewModel(),
            showAction = viewModel.data.showAction,
            jobStatus = values.job_status_name,
            jobAppCount = values.count;
          var actions = [],
            actionsStore = Ext.getStore('jobopeningsactions');
         
   // actionsStore = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].getViewModel().getStore('JobopeningsActions');
          
            if (actionsStore) {
            actionsStore.each(function (rec) {
              var actionName = rec.get('action_name');
              if (viewModel.get('editAction') == true && actionName == "Edit") {
                actions.push('<li>' + rec.get('action_name') + '</li>');
              }
              if (viewModel.get('deleteAction') == true && actionName == "Delete") {
                if (jobStatus == "Awaiting Approval" || jobStatus == "Drafted") {
                  actions.push('<li>' + rec.get('action_name') + '</li>');
                } else if (jobStatus == "Rejected" && jobAppCount == 0 || jobStatus == "Closed" && jobAppCount == 0) {
                  actions.push('<li>' + rec.get('action_name') + '</li>');
                }
              }
              if (viewModel.get('closeAction') == true && actionName == "Close") {
                actions.push('<li>' + rec.get('action_name') + '</li>');
              }
              if (viewModel.get('approveAction') == true && actionName == "Approve") {
                actions.push('<li>' + rec.get('action_name') + '</li>');
              }
              if (viewModel.get('rejectAction') == true && actionName == "Reject") {
                actions.push('<li>' + rec.get('action_name') + '</li>');
              }
            })
          }
          return '<ul>' + actions.toString().replace(/,/g, '') + '</ul>';
        },
        listRecruiter: function (values) { /* to list out recruiters*/
          var lists = [],
            jobOpeningsStore = Ext.getStore('jobopenings.JobRecruiter');
          if (jobOpeningsStore) {
            jobOpeningsStore.each(function (rec) {
              var str = values.recruiter_id,
                recList = JSON.parse("[" + values.recruiter_id + "]");
              if (values.recruiter_id != null && recList[recList.indexOf(rec.data.ddo_employee_id)] == rec.data.ddo_employee_id || rec.data.isChecked == true ) {
                lists.push('<li class="' + rec.get("recruiter_name") + '"></span><i class="uncheckImg"></i>' + rec.get('recruiter_name') + '</li>');
              } else {
                lists.push('<li  class="' + rec.get("recruiter_name") + '"></span><i class="checkImg"></i>' + rec.get('recruiter_name') + '</li>');
              }
            });
          }
          var assignVisible = values.isAssignVisible ? "act-showcls" : "act-removecls";
          return '<div class="rec-assigncls">Assign To <i class="x-fa fa-sort-desc assign-arrow arrow-cls"></i><div class="' + assignVisible + '"><ul>' + lists.toString().replace(/,/g, '') + '</ul></div></div>';
        },
        showDescription: function (values, limit) { /* to show description*/
          var desc = values.job_desc;
          if (desc.length >= limit) {
            return '<div style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:411px; height: 36px;">' + desc + "</div>"; //desc.substring(0, 142) + "... ";
          } else {
            return desc;
          }
        },
        showTitle: function (values, limit) { /* intending title*/
          var title = values.title //+ " - " + values.department_name;
          if (title.length >= limit) {
            return title.substring(0, 17) + "...";
          } else {
            return title;
          }
        },
        showName: function (values, limit) {
          var name = values.firstname;
          if (name.length >= limit) {
            return name.substring(0, 8) + "...";
          } else {
            return name;
          }
        },
        getSkillNames: function (values) { /* for skills string*/
          var skillnames = values.skillnames,
            skills = skillnames.toString();

          return skills;
        },
        workOnPriorityShow: function (values) { /*to display if work on priority*/
          if (values.work_on_priority == "Y") {
            return '<div class="create-jobapplication-starbtn-cls"><span><i class="star-cls arrow-cls"></i></span></div>';
          } else {
            return '';
          }
        }
      }
    ],
    //itemSelector: 'div.status-div-cls',
    itemSelector: 'div.jobOpenFormView',
    listeners: {
      itemclick: 'onJobOpeningClick',
      containerClick: 'onContainerClick'
    }
  }]
});