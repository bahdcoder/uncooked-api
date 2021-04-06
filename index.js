const { cms } = require('@tensei/cms')
const { auth } = require('@tensei/auth')
const { rest } = require('@tensei/rest')
const { media } = require('@tensei/media')
const { tensei, welcome, resource, text, textarea, belongsTo, array, hasMany } = require('@tensei/core')

tensei()
    .root(__dirname)
    .resources([
        resource('Recipe')
            .canInsert(({ user }) => user)
            .fields([
                text('Name').rules('required', 'max:80'),
                textarea('Description').rules('required', 'max:2000'),
                belongsTo('User'),
                array('Instructions').of('string').rules('required'),
                array('Ingredients').of('string').rules('required')
            ]),
        resource('Comment')
            .canInsert(({ user }) => user)
            .fields([
                belongsTo('User').creationRules('required'),
                belongsTo('Recipe').creationRules('required'),
                textarea('Body').rules('required')
            ])
    ])
    .plugins([
        welcome(),
        cms().plugin(),
        media().plugin(),
        auth().setup(({ user }) => {
        	user.fields([
            	hasMany('Recipe'),
                hasMany('Comment')
            ])
        }).plugin(),
        rest().plugin()
    ])
    .databaseConfig({
        debug: true
    })
    .start()
    .catch(console.error)
