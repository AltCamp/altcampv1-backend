const { createMentor } = require('./controller')

const mentorRouter = require('express').Router()


mentorRouter
    .route('/')
    .post(createMentor)



module.exports = mentorRouter