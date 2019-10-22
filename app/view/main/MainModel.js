/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('JobsModule.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.mainviewport',

    data: {
        name: 'Talent Acquisition',
        currentView: null,
        hashTag: null,
        id: null,
        newFeedsCount: 0,
        profileImg: null,
        profileBgUrl: 'resources/images/user-bg/10-bg.png',
        titleName: null,
        headerTitleCls: '',
        profileBtnMobileVisible: false,
        modernKarmaLoad: false,
        modernTodoLoad: false,
        showkarmascorefilters:true,
        showkarmascorelogo:true,
        projectId:null,
        scrolltopbtn:true,
        showJobsCreateBtn:true,
        showJobAppCreateBtn:true,
        showAction:"display:block",
        editAction:true,
        deleteAction:true,
        closeAction:true,
        rejectAction:true,
        approveAction:true,
        editJobApplication:true,
        deleteJobApplication:true,
        addIntvwschviewHide:true,
        addInterviewShow:false,
        cancelReschedulebtnsHide:true,
        jobAppStatusDisable:true,
        //company logo default
        companyLogoUrl: 'resources/images/engazewell_logo_head.png',

        //access roles
        roleAccessingle: false,
        nonRoleRouteId: null,
        addNewProject:true,
        projectNewResources:true,
        dateObj:null
    }

    //TODO - add data, formulas and/or methods to support your view
});
