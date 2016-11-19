    db.createCollection ( "users", {
        validator: {
            authType: { $type: "string" },
            firstName: { $type: "string" }
        },
        validationAction: "error",
        validationLevel: "strict"
    });
    db.users.createIndex( { "externalId": 1 }, { unique: true } );

    db.createCollection( "quizes", { 
    	validator: { 
            userId: { $type: "string" },
            name: { $type: "string" },
            description: { $type: "string" },
            creationDate: { $type: "date"},
            isPublished: { $type: "bool" }
        },
       validationAction: "error",
       validationLevel: "strict"
    });

    db.createCollection( "questions", {
    	validator: {
    		quizId: { $type: "string" },
    		text: { $type: "string"},
    		isRequired : { $type: "bool"},
            questionType: { $type: "string" },
    		$or: [
                { 
                    answerFormat: { $type: "string" }
                },
                { 
                    $and: [
                        { questionType: { $type: "string" } },
                        { isMulti: {$type: "bool"} },
                        { "variants.0": { $exists: true } } 
                    ]
                }
            ]
    	},
    	validationAction: "error",
    	validationLevel: "strict"
    });

    db.createCollection("userAnswers", {
    	validator: {
    		quizId: { $type: "string" },
    		userId: { $type: "string"},
    		date : { $type: "date"},
            "answers.0": { $exists: true }
    	},
    	validationAction: "error",
    	validationLevel: "strict"
    });