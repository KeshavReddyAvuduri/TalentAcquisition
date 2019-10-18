Ext.define('JobOpenings.view.jobapplications.interviewdetails.main.OnInterviewScheduled', {
    extend: 'Ext.container.Container',
    xtype: 'oninterviewscheduled',
    requires: [
        'JobOpenings.view.jobapplications.interviewdetails.main.InterviewRequestDetailsAll',
        'JobOpenings.view.jobapplications.interviewdetails.main.InterviewRequestDetailsForm'
    ],
    margin: '10 0 0 10',
    reference: 'oninterviewscheduledref',
    items: [{
        xtype: 'container',
        width:'100%',
        cls: 'add-interview-cls',
        html: [
            '<div clss="addintvwcls">',
            '<div class="jobtimelinecls">',
            '</div>',
            '</div></div>',
            '<div class ="schviewcls">',
            '<div class="schtextcls2">Schedule Interview</div>',
            '</div></div>'
        ],
        items:[{
            xtype:'button',
            cls:'schroundcls2',
            reference:'addInterviewPlusIconRef',
            iconCls:'plus-icon intvwplus-icon',
            listeners:{
                click:'onInteviewAddBtnClick2'
            }
        }]
    }, {
        xtype: 'interviewrequestdetailsform'
    }, {
        xtype: 'interviewrequestdetailsall'
    }]
});