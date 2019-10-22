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


            account: {
                READ: hostUrl + 'account',
                UPDATE: hostUrl + 'account',
                URLPATHAPI: hostUrl + 'companylogo/companyLogoUrlPath'
            },
           
            employee: {
                CREATE: hostUrl + 'employee',
                READ: hostUrl + 'employee',
                UPDATE: hostUrl + 'employee'
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