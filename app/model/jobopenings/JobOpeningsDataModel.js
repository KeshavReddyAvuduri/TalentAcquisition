Ext.define('JobsModule.model.jobopenings.JobOpeningsDataModel', {
	extend: 'Ext.data.Model',

	fields: ['title','recruiter_name', {
		name:'count'
	}]
});