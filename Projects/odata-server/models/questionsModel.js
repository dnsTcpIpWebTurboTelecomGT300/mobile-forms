module.exports = {
    quizId: String,
    text: String,
    isRequired: Boolean,
    questionType: String,
    answerFormat: String,
    isMulti: Boolean,
    variants:[{
        id: String,
        type: String,
        textValue: String,
        dateValue: Date,
        imageValue: String,
        geoValue: String
    }]
};