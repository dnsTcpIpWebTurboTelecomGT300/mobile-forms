module.exports = {
    quizId: String,
    text: String,
    isRequired: Boolean,
    questionType: String,
    answerFormat: String,
    isMulti: Boolean,
    variants:[{
        variantType: String,
        textValue: String,
        dateValue: Date,
        imageValue: String,
        geoValue: String
    }]
};
