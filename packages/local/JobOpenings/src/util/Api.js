/**
 * @class Api
 * This file holds th API url to be used throughout the application.
 * @singleton
 */

Ext.define('JobOpenings.util.Api', {
    singleton: true,

    alternateClassName: ['Api'],

    URL: (function () {
        
        //Service url
        var  hostUrl = "http://192.168.1.135:3400/";
        // To read  images from S3 bucket
        var imageUrl = "https://testingnewnew.s3.amazonaws.com/";      

        return {
            //for extjs ajax request API's
            hostUrl:hostUrl,
            imageUrl : imageUrl,
            ddonominate: {
                nomination: '/ddonominate',
                calulateKarmaScore: '/ddonominate/calculatekarmascore',
                selfNomination: '/ddonominate/selfnomination',
                selfcalculatekarmascore: '/ddonominate/selfcalculatekarmascore'
            },

            todo: {
                READ: hostUrl + 'task/get',
                CREATE: hostUrl + 'task/create',
                UPDATE: hostUrl + 'task/update',
                DESTROY: hostUrl + 'task/delete',
                TODODETAILREAD: hostUrl + 'task/getcompleted'
            },

            karma: {
                READ: hostUrl + 'karma/getAllkarmascores'
            },

            feed: {
                READ: hostUrl + 'feed/get',
                FEEDS_EDIT_UPLOAD_IMAGES: hostUrl + 'feed/feedsPostedPics',
                FEEDS_UPLOAD_IMAGES: hostUrl + 'feeduploadimages/feedsPostedPics'
            },

            dashboard: {
                READ: hostUrl + 'dashboard/employeeavailability/groupedresources'
            },

            about: {
                READ: hostUrl + 'profile'
            },

            jobs: {
                READ: hostUrl + 'experience',
                CREATE: hostUrl + 'experience',
                UPDATE: hostUrl + 'experience'
                // ,DESTROY: hostUrl + 'profile/jobs/remove'
            },

            education: {
                READ: hostUrl + 'education',
                CREATE: hostUrl + 'education',
                UPDATE: hostUrl + 'education'
            },

            interests: {
                READ: hostUrl + 'interest',
                CREATE: hostUrl + 'interest',
                DESTROY: hostUrl + 'interest'
            },

            skills: {
                READ: hostUrl + 'skill',
                CREATE: hostUrl + 'skill'
            },

            profile: {
                GETBYEMPID_BASE_URL: hostUrl + 'profile/',
                USER_PROFILE_PIC: hostUrl + 'image/profilePicture',
                USER_COVER_PIC: hostUrl + 'image/coverPicture',
                EMPDETAILS: hostUrl + 'employee/employeeDetails'
            },

            groups: {
                READ: hostUrl + 'groups',
                CREATE: hostUrl + 'groups'
            },

            postlikes: {
                READ: hostUrl + 'postlike',
                CREATE: hostUrl + 'postlike'
            },

            // jobApplicants: {
            //     READ: hostUrl + 'jobApplicants/get'
            // },

            projects: {
                READ: hostUrl + 'projectNote',
                CREATE: hostUrl + 'projectNote',
                UPDATE: hostUrl + 'projectNote',
                DELETE: hostUrl + 'projectNote',
                ROLEREAD: hostUrl + 'projectrole',
                ALLOCEMPRECS: hostUrl + 'projectresources/allocemployees'
            },

            wallet: {
                READ: hostUrl + 'wallet/get',
                CREATE: hostUrl + 'wallet/create',
                UPDATE: hostUrl + 'wallet/update'
            },

            karmaicon: {
                READ: hostUrl + 'karmarating',
                UPDATE: hostUrl + 'karmarating'
            },

            karmarule: {
                CREATE: hostUrl + 'karmarule/create',
                READ: hostUrl + 'karmarule/get',
                UPDATE: hostUrl + 'karmarule/update',
                DELETE: hostUrl + 'karmarule/delete'
            },

            karmacategory: {
                CREATE: hostUrl + 'karmacat/create',
                READ: hostUrl + 'karmacat/get',
                UPDATE: hostUrl + 'karmacat/update',
                DELETE: hostUrl + 'karmacat/delete'
            },

            ddokarma: {
                CREATE: hostUrl + 'ddokarma',
                READ: hostUrl + 'ddokarma',
                UPDATE: hostUrl + 'ddokarma'
            },

            karmaprorated: {
                CREATE: hostUrl + 'karmaproratedinstance',
                READ: hostUrl + 'karmaproratedinstance',
                UPDATE: hostUrl + 'karmaproratedinstance',
                DELETE: hostUrl + 'karmaproratedinstance'
            },

            karmarangeinstance: {
                CREATE: hostUrl + 'karmarangeinstance',
                READ: hostUrl + 'karmarangeinstance',
                UPDATE: hostUrl + 'karmarangeinstance',
                DELETE: hostUrl + 'karmarangeinstance'

            },

            karmaratinginstance: {
                CREATE: hostUrl + 'karmaratinginstance',
                READ: hostUrl + 'karmaratinginstance',
                UPDATE: hostUrl + 'karmaratinginstance'

            },

            sharablewallet: {
                READ: hostUrl + 'wallet/sharablewallet'
            },

            karmaapproval: {
                READ: hostUrl + 'ddonominate/pendingapproval',
                ACCEPT: hostUrl + 'ddonominate/approvenomination',
                REJECT: hostUrl + 'ddonominate/rejectnomination'
            },

            department: {
                CREATE: hostUrl + 'department',
                READ: hostUrl + 'department',
                UPDATE: hostUrl + 'department',
                DELETE: hostUrl + 'department'
            },

            role: {
                CREATE: hostUrl + 'role',
                READ: hostUrl + 'role',
                UPDATE: hostUrl + 'role'
            },

            designation: {
                CREATE: hostUrl + 'designation',
                READ: hostUrl + 'designation',
                UPDATE: hostUrl + 'designation'
            },

            employeesetup: {
                CREATE: hostUrl + 'employeesetup',
                READ: hostUrl + 'employeesetup',
                UPDATE: hostUrl + 'employeesetup'
            },

            account: {
                READ: hostUrl + 'account',
                UPDATE: hostUrl + 'account',
                URLPATHAPI: hostUrl + 'companylogo/companyLogoUrlPath'
            },
            redeemgrid: {
                CREATE: hostUrl + 'redeemhistory',
                READ: hostUrl + 'redeemhistory/get',
                UPDATE: hostUrl + 'redeemhistory'
            },
            attribute: {
                READ: hostUrl + 'productattribute',
                CREATE: hostUrl + 'productattribute',
                UPDATE: hostUrl + 'productattribute',
                DESTROY: hostUrl + 'productattribute'
            },
            attributevalue: {
                READ: hostUrl + 'productattributevalues',
                CREATE: hostUrl + 'productattributevalues',
                UPDATE: hostUrl + 'productattributevalues',
                DESTROY: hostUrl + 'productattributevalues'
            },
            categoryvalue: {
                READ: hostUrl + 'productcategory',
                CREATE: hostUrl + 'productcategory',
                UPDATE: hostUrl + 'productcategory',
                DESTROY: hostUrl + 'productcategory'
            },
            product: {
                READ: hostUrl + 'product',
                CREATE: hostUrl + 'product',
                UPDATE: hostUrl + 'product',
                DESTROY: hostUrl + 'product'

            },
            setproductattributes: {
                READ: hostUrl + 'setproductattributes',
                CREATE: hostUrl + 'setproductattributes',
                UPDATE: hostUrl + 'setproductattributes',
                DESTROY: hostUrl + 'setproductattributes'
            },
            productimg: {
                READ: hostUrl + 'productimage',
                CREATE: hostUrl + 'productimage',
                UPDATE: hostUrl + 'productimage',
                DESTROY: hostUrl + 'productimage'

            },
            employee: {
                CREATE: hostUrl + 'employee',
                READ: hostUrl + 'employee',
                UPDATE: hostUrl + 'employee'
            },

            work: {
                CREATE: hostUrl + 'workdetails',
                READ: hostUrl + 'workdetails',
                UPDATE: hostUrl + 'workdetails'
            },

            empsetup: {
                CREATE: hostUrl + 'employee',
                READ: hostUrl + 'employeedetail',
                UPDATE: hostUrl + 'employee'
            },

            goal: {
                READ: hostUrl + 'goal',
                UPDATE: hostUrl + 'goal',
                CREATE: hostUrl + 'goal'
            },

            goaltask: {
                READ: hostUrl + 'goaltask',
                CREATE: hostUrl + 'goaltask',
                UPDATE: hostUrl + 'goaltask',
                DELETE: hostUrl + 'goaltask'
            },

            allgoals: {
                READ: hostUrl + 'goal/allgoals'
            },

            goalnotes: {
                READ: hostUrl + 'goalnote',
                CREATE: hostUrl + 'goalnote'
                //UPDATE: hostUrl + 'goaltask',
                //DELETE: hostUrl + 'goaltask'
            },
            goalstatus: {
                READ: hostUrl + 'goalstatus'
            },
            goalsettings: {
                READ: hostUrl + 'settings/goalsettings'
            },
            financialyear: {
                CREATE: hostUrl + 'financialyear',
                READ: hostUrl + 'financialyear',
                UPDATE: hostUrl + 'financialyear',
                DELETE: hostUrl + 'financialyear'
            },
            karmaaccess: {
                READ: hostUrl + 'karmaaccess',
                CREATE: hostUrl + 'karmaaccess',
                UPDATE: hostUrl + 'karmaaccess'
            },
            utilization: {
                READ: hostUrl + 'employeeutil/emputilizationsummary'
            },
            utilgrid: {
                READ: hostUrl + 'employeeutil/emputilizationdetails'
            },
            nonbillableemp: {
                READ: hostUrl + 'employeeutil/getNonBillableEmpDetails'

            },
            availablemp: {
                READ: hostUrl + 'employeeutil/getAvilableEmpDetails'
            },
            jobopenings: {
                CREATE: hostUrl + 'jobopeningrequest',
                READ: hostUrl + 'jobopeningrequest',
                UPDATE : hostUrl + 'jobopeningrequest/',
                DELETE: hostUrl + 'jobopeningrequest/'
            },
            joblocation:{
                READ : hostUrl + 'jobopeningrequest/getLocationData'
            },
            jobdepartments:{
                READ : hostUrl + 'dashboard/getDepartmentNames'
            },
            jobinterviewrs : {
                READ : hostUrl + 'utility/getempbasiclist'
            },
            jobskills : {
                READ : hostUrl + 'skill/combo'
            },
            jobopeningrecruiters :{
                READ : hostUrl + 'jobopeningrequest/jobrecruiters'
            },
            jobstatus :{
                READ : hostUrl + 'jobopeningrequest/getJobStatusData',
                UPDATE : hostUrl + 'jobopeningrequest/updateJobStatus'
            },
            
            feedspiestore:{
                READ : hostUrl + 'getposttypecount/get'

            },


            karmabarstore:{
                READ : hostUrl + 'getposttypecount/getmonthlykarma'

            },
            karmapiestore:{
                READ : hostUrl + 'getposttypecount/getyearlykarma'

            },
            feeds:{
                READ : hostUrl +'feed/get'

            },
            groupsAndEmployee:{
                READ : hostUrl + 'groupMembers/groupsandemployees'
              
            },
            searchfeeds:{
                READ : hostUrl + 'feed/get'

            },
            selectedempstore:{
            //    READ : hostUrl + 'groupmembers/groups',
             READ : hostUrl + 'groupmembers'
            

            },
            selectedemptagstore:{
                READ : hostUrl +  'employeegroups/getTaggedGroupEmployees'

            },
            currentjobopenings:{
                READ : hostUrl +  'jobOpenings/getCurrentJobOpenings'

            },
            jobrecruiter:{
                READ : hostUrl +  'jobopeningrequest/getRecruitersList'

            },
            departmentcombostore:{
                READ : hostUrl +  'dashboard/getDepartmentNames'

            },
            designationcombostore:{
                READ : hostUrl +  'designation'

            },
            primaryskillscombostore:{
                READ : hostUrl +  'skill/combo'

            },
            projectcombostore:{
                READ : hostUrl +  'karma/projects'

            },
            supervisorcombostore:{
                READ : hostUrl +  'utility/getsupervisorlist'

            },
            employeecombostore:{
                READ : hostUrl +  'utility/getempbasiclist'

            },
            wallettype:{
                READ : hostUrl +  'utility/getwalletbasiclist'
            },
            yearcombostore:{
                READ : hostUrl +  'wallet/years'

            },
            registrationcitycombostore:{
                READ : hostUrl +  'reg/getcityRegcombo'

            },
            registrationcountrycombostore:{
                READ : hostUrl +  'reg/getcountryRegcombo'

            },
            registrationstatecombostore:{
                READ : hostUrl +  'reg/getstateRegcombo'

            },
           
            momcomponent:{
                READ : hostUrl +  'momcomponent'

            },
            orgchartdepartmentstore:{
                READ : hostUrl +  'dashboard/getDepartmentNames'

            },
            orgchartempnamesstore:{
                READ : hostUrl +  'dashboard/getEmployeeNames'

            },
            orgchartstore:{
                READ : hostUrl +  'dashboard/organization'

            },
            appaccesssummarystore:{
                READ : hostUrl +  'useraccessapp/accessappsummary'

            },
            details:{
                READ : hostUrl +  'userProfilePics/userdetails'

            },
            nominatenames:{
                READ : hostUrl +  'nominate/getNominateNames'

            },
            nominatestore:{
                READ : hostUrl +  'nominate/createNominate'

            },
            projectsummarystore:{
                READ : hostUrl +  'utility/getempprojectsummary'

            },
            usertimelinestore:{
                READ : hostUrl +  'profile/user/timelineview'

            },
            progressbarstore:{
                READ : hostUrl +  'ddonominate/potentialkarma'

            },
            allocationemployee:{
                READ : hostUrl +  'projectpeople/allocemployees'

            },
            peopleviewstore:{
                READ : hostUrl +  'projectresources'

            },
            selectedemployeestore:{
                READ : hostUrl +  'groupmembers'

            },
            empnamestore:{
                READ : hostUrl +  'dashboard/getEmployeeNames'

            },
            feedbackcombostore:{
                READ : hostUrl +  'projectfeedback'

            },
            momviewstore:{
                READ : hostUrl +  'projectMom'

            },
            projectdashboardstore:{
                READ : hostUrl +  'project'

            },
            projectsclientstore:{
                READ : hostUrl +  'projecttechnologies/projectclients'

            },
            technologiesstore:{
                READ : hostUrl +  'projecttechnologies'

            },
            redeemhistoryitemsgridstore:{
                READ : hostUrl +  'redeemhistory/items'

            },
            resources:{
                READ : hostUrl +  'dashboard/employeeavailability/groupedresources'

            },
            rolesstore:{
                READ : hostUrl +  'roleviewaccess/getAllRoles'

            },
            rolesviewstore:{
                READ : hostUrl +  'appviews'

            },
            goalsettings:{
                READ : hostUrl +  'settings/goalsettings'

            },
            departmentcombo:{
                READ : hostUrl +  'department'

            },
            citycombostore:{
                READ : hostUrl +  'account/getcitycombo'

            },
            countrycombostore:{
                READ : hostUrl +  'account/getcountrycombo'

            },
            primaryskillcombostore:{
                READ : hostUrl +  'karma/primaryskill'

            },
            repoprtingstore:{
                READ : hostUrl +  'utility/getempbasiclist'

            },
            accountcitycombostore:{
                READ : hostUrl +  'account/getcitycombo'

            },
            accountcountrycombostore:{
                READ : hostUrl +  'account/getcountrycombo'

            },
            accountstatecombostore:{
                READ : hostUrl +  'account/getstatecombo'

            },
            setupdesignationcombostore:{
                READ : hostUrl +  'designation'

            },
            setupsupervisorcombostore:{
                READ : hostUrl +  'utility/getsupervisorlist'

            },
            profileskillscombostore:{
                READ : hostUrl +  'skill/combo'

            },
            karmahistorystore:{
                READ : hostUrl +  'wallet/rewardhistory'

            },
            wallethistorystore:{
                READ : hostUrl +  'wallet/wallethistory'
            },
            utility:{
                READ : hostUrl +  'auth/checksession'
            },
            karmareport :{
                READ : hostUrl + 'karma/karmareport'
            },
            login:{
                READ : hostUrl +  'auth'
                
            },
            logout:{
                LOGOUT: hostUrl + 'auth/logout'
            },
userDetails:{
    READ : hostUrl + 'auth/userdetails'
},
           
            preferenceList : {
                READ : hostUrl + 'preference/categories'
            },
            preferenceData:{
READ:hostUrl + 'preference/preferencedata',
UPDATE:hostUrl + 'preference/preferencedata',
CREATE:hostUrl + 'preference/preferencedata',
DELETE:hostUrl + 'preference/preferencedata',
            },
            jobapplication:{
                
                READ:hostUrl + 'jobapplication',
                uploadResume:hostUrl +"jobapplication/uploadResume",
                getIdDetails:hostUrl+"jobapplication/getIdDetails",
                getJobeducation:hostUrl+'jobapplication/getJobeducation'
            },
            jobAppinterViewAppStatus:{
                
                READ:hostUrl + 'jobappinterview/appstatus',
            },
            jobappinterview:{
                READ:hostUrl + 'jobappinterview',
                getInterviewRating:hostUrl + 'jobappinterview/getInterviewRating',
                getinterviewrequests: hostUrl + 'jobappinterview/getinterviewrequests',
                getInterviewPanelMembers:hostUrl +'jobappinterview/getInterviewPanelMembers',
                jobapplications:hostUrl+'jobapplication/jobapplications'
            }
            

        };
    })()
});