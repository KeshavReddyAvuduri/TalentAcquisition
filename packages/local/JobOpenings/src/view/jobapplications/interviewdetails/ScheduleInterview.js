Ext.define('JobOpenings.view.jobapplications.interviewdetails.ScheduleInterview', {
    extend: 'Ext.container.Container',
    xtype: 'scheduleinterview',
    requires: [
        'JobOpenings.view.jobapplications.JobApplicationsViewModel',
        'JobOpenings.view.jobapplications.JobApplicationsViewController',
        'JobOpenings.view.jobapplications.interviewdetails.InterviewFeedBack',
        'JobOpenings.view.jobapplications.interviewdetails.InterviewDataview',
        'JobOpenings.view.jobapplications.interviewdetails.ScheduleFeedBackView',
        'JobOpenings.view.jobapplications.interviewdetails.AddInterviewSchedule',
        'JobOpenings.view.jobapplications.interviewdetails.InterviewCancelForm',
        'JobOpenings.view.jobapplications.interviewdetails.main.InterviewDetailsMain'
    ],
    reference: 'interviewschdref',
    margin: '10 0 0 10',
    cls: 'jobappviewcls noscrollbar',
    width: '100%',
    controller: 'jobapplicationsviewController',
    viewModel: {
        type: 'jobapplicationsviewmodel'
    },
    layout: {
        type: 'vbox'
    },
    items: [{
        xtype:'panel',
        width:'100%',
        items:[{
            xtype: 'toolbar',
            cls: 'inttoolbar-cls',
            dock: 'top',    
            items: [{
                xtype: 'button',
                scale: 'medium',
    
                iconCls: 'goalsbackbtn-cls',
                cls: 'jobback-btn-cls',
                style: {
                    border: 0
                },
    
                listeners: {
                    click: 'onBackClick'
                }
    
            }, {
                xtype:'label',
                html:'Back',
                cls: 'backlabel-cls'
            },{
                xtype:'tbspacer',
                width: 400
            },{
                xtype: 'label',
                html: 'Interview',
                cls: 'intTitle-cls',
                reference: 'jobapplications_interviewScreenTitle'
            }]
        }]
    },{
        xtype: 'container',
        layout: 'hbox',
        cls: 'dtcnt-cls',
        items: [{
                xtype: 'dataview',
                cls: 'jobsdataviewcls',
                bind: {
                    store: '{jobapplicantStore}'
                },
                itemTpl: [
                    '<div class="jobsdiv-cls ddo-jobopening-item">',
                    '<div class="datadiv-cls">',
                    '<div class="title-div-cls"><span class="title-cls">{[this.showTitle(values,16)]}</span>',
                    '<span> | </span>',
                    '<span class="creator-cls">{[this.showCurrentjobtitle(values)]}</span>',
                    '</div>',
                    '<div class="loc-exp"><span><i class="exp-iconcls arrow-cls"></i>&nbsp{workexpyears}.{workexpmonths} Years Experience </span>',
                    '<span><i class="location-iconcls arrow-cls"></i>&nbsp{[this.showCurrentlocation(values)]}</span>',
                    '</div>',
                    '<div class="detailscls"><i class="skill-iconcls arrow-cls"></i>{[this.showSkills(values)]}</div>',
                    '<div class="detailscls"><i class="education-iconcls arrow-cls"></i>{education} - {[this.showCollegename(values)]}</div>',
                    '<div><div class="detailscls emaildv"><i class="mobile-iconcls arrow-cls"></i>+91&nbsp{[this.showMobile(values, 10)]}</div>',
                    '<div class="detailscls" style="float:right;margin-right: 31%!important;"><i class="mail-iconcls arrow-cls"></i>{[this.showEmailId(values, 20)]}</div></div>',
                    '</div>',
                    '<div class="combosdiv-cls">',
                    '<div>',
                    '</div>',
                    '</div>',
                    '</div>',
                    {
                        showCurrentlocation: function(values) { /*intending current location*/
                            var currentlocation = (values.currentlocation!=undefined && values.currentlocation!=null)?values.currentlocation:"";
                            if (currentlocation.length > 15) {
                                return currentlocation.substring(0, 12) + "...";
                            } else {
                                return currentlocation;
                            }
                        },
                        showCollegename: function(values) { /*intending college name*/
                            var collegename = (values.collegename!=undefined && values.collegename!=null)?values.collegename:"";
                            if (collegename.length > 20) {
                                return collegename.substring(0, 17) + "...";
                            } else {
                                return collegename;
                            }
                        },
                        showCurrentjobtitle: function(values) {/*intending current job title*/
                            var currentjobtitle = (values.currentjobtitle!=undefined && values.currentjobtitle!=null)?values.currentjobtitle:"";
                            if (currentjobtitle.length > 12) {
                                return currentjobtitle.substring(0, 9) + "...";
                            } else {
                                return currentjobtitle;
                            }
                        },
                        showTitle: function(values, limit) {/*intending title*/
                            var title = values.appfirstname + " " + values.applastname;
                            if (title.length > limit) {
                                return title.substring(0, 13) + "...";
                            } else {
                                return title;
                            }
                        },
                        showMobile: function(values, limit) {/*intending mobile no*/
                            var mobile = (values.mobile!=undefined && values.mobile!=null)?values.mobile.toString():"";
                            if (mobile.length > limit) {
                                return mobile.substring(0, 10) + "...";
                            } else {
                                return mobile;
                            }
                        },
                        showEmailId: function(values, limit) {/*intending email address*/
                            var emailid = (values.emailid!=undefined && values.emailid!=null)?values.emailid:"";
                            if (emailid.length > limit) {
                                return emailid.substring(0, 17) + "...";
                            } else {
                                return emailid;
                            }
                        },
                        showSkills: function(values) {/*intending skills*/
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
                            // var skillArr = (values.skillnames!=undefined && values.skillnames!=null)?values.skillnames:[];
                            // var i = 0,
                            //     strr = "",
                            //     skillStr = "";
                            // try{
                            //     do{
                            //         strr = "#" + skillArr[i] + ", ";
                            //         skillStr += strr;
                            //         i++;
                            //     }while((skillArr.length-1) > i)
                            //     strr = "#" + skillArr[length-1];
                            // }catch(exce){}
                            // skillStr += strr;
                            // if (skillStr.length > 29) {
                            //     return skillStr.substring(0, 26) + "...";
                            // } else {
                            //     return skillStr;
                            // }
                        }
                    }
                ],
                itemSelector: 'div.status-div-cls'
            },
            {
                xtype: 'container',
                cls: 'dwnlodcntcls',
                layout: 'vbox',
                items: [{
                    xtype: 'button',
                    text: 'Download CV <span class="download-iconcls"></span>',
                    cls: 'cvdwnldbtn2',
                    iconcls: 'dwnldcv-cls',
                    listeners: {
                        click: "onDwnldCVClick"
                    }
                }, {
                    xtype: 'combo',
                    name: 'appstatus',
                    reference: 'interviewerref',
                    cls: 'appstatuscombo-cls appliStatus',
                    fieldLabel: 'Application Status',
                    labelAlign: 'top',
                    emptyText: 'Select Status',
                    displayField: 'name',
                    valueField: 'ddo_jobapplicationstatus_id',
                    queryMode: 'local',
                    forceSelection: true,
                    allowBlank:false,
                    matchFieldWidth: true,
                    clearOnBackspace: false,
                    //tagCustomiseMom: true,
                    //tagMomOwnerId: '123',
                    width: 176,
                    editable: false,
                    filterPickList: true,
                    typeAhead: false,
                    bind: {
                        // store: '{jobApplicationStatus}',
                        disabled:'{jobAppStatusDisable}'
                    }, 
                    listeners: {
                        select: 'onApplicationStatusSelected'
                    }
                }]
            }]
    }, {
        xtype:'interviewdetailsmain'
    }]
});