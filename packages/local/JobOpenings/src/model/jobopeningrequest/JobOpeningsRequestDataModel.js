Ext.define('JobOpenings.model.jobopeningrequest.JobOpeningsRequestDataModel', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'title',
            type: 'string'
        },
        {
            name: 'noofpositions',
            type: 'number'
        },
        {
            name: 'minworkexperience',
            type: 'number'
        },
        {
            name: 'maxworkexperience',
            type: 'number'
        },

        {
            name: 'ddo_department_id',
            type: 'number'
        },
        {
            name: 'description',
            convert: function (value, record) {
                return Ext.util.Format.stripTags(record.data.job_desc);
            }
        },
        {
            name: 'recruiter_name'
        },
        {
            name: 'count'
        }, {
            name: 'jobupdateddate'
        }, {
            name: 'skill_ids',
            type: 'string'
        },
        {
            name: 'ddo_joblocation_id',
            type: 'number'
        },
        {
            name: 'interviewers_ids',
            type: 'string'
        },
        {
            name: 'ddo_jobopening_id',
            type: 'number'
        }, {
            name: 'ddo_jobopeningstatus_id',
            type: 'number'
        }]
});