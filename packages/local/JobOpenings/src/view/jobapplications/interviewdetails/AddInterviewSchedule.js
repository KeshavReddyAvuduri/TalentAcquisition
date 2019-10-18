Ext.define('JobOpenings.view.jobapplications.interviewdetails.AddInterviewSchedule', {
    extend: 'Ext.container.Container',
    xtype: 'addinterviewschedule',
    width:'100%',
    cls:'addintvwsch-cls',    
    html: [
        '<div clss="addintvwcls">',
        '<div class="jobtimelinecls">',
        '</div>',
        '</div></div>',
        '<div class ="schviewcls">',
        '<div class="schtextcls">Schedule Interview</div>',
        '</div></div>'
    ],
    items:[{
        xtype:'button',
        cls:'schroundcls',
        iconCls:'plus-icon intvwplus-icon',
        listeners:{
            click:'onInteviewAddBtnClick'
        }
    }]
});