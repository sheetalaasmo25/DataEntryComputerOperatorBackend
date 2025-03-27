const mongoose = require("mongoose");

const userAddtaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: { type: String },
    gender: { type: String},
    age: { type: Number},
    maritalStatus: { type: String},
    education: { type: String },
    educationDetails: { type: String },
    occupation: { type: String},
    religion: { type: String},
    caste: { type: String},
    subCaste: { type: String },
    gothra: { type: String },
    motherTongue: { type: String},
    horoscopeMatch: { type: String},
    star: { type: String },
    raasiMoonSign: { type: String },
    doshamManglik: { type: String },
    height: {
        feet: { type: String },
        cms: { type: String },
        inches: { type: String }
    },
    weight: {
        kg: { type: String },
        lbs: { type: String }
    },
    citizenship: { type: String},
    homeState: { type: String},
    homeCityDistrict: { type: String },
    countryLivingIn: { type: String },
    stateCityLivingIn: { type: String },
    email: { type: String },
    retypeEmail: { type: String},
    bodyType: { type: String },
    complexion: { type: String },
    physicalStatus: { type: String },
    eatingHabit: { type: String },
    drinkingHabit: { type: String },
    smokingHabit: { type: String },
    familyValue: { type: String },
    familyType: { type: String },
    familyStatus: { type: String },
    annualIncome: { type: String },
    aboutParentsSiblings: { type: String },
    moreAboutSelf: { type: String },
    yourExpectation: { type: String },
    password: { type: String },
    retypePassword: { type: String },
    howToKnowAboutUs: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("UserAddTask", userAddtaskSchema);
