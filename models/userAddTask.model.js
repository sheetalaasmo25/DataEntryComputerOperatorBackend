const mongoose = require("mongoose");

const userAddtaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    maritalStatus: { type: String, required: true },
    education: { type: String, required: true },
    educationDetails: { type: String },
    occupation: { type: String, required: true },
    religion: { type: String, required: true },
    caste: { type: String, required: true },
    subCaste: { type: String },
    gothra: { type: String },
    motherTongue: { type: String, required: true },
    horoscopeMatch: { type: Boolean, default: false },
    star: { type: String },
    raasiMoonSign: { type: String },
    doshamManglik: { type: String },
    height: {
        feet: { type: Number },
        cms: { type: Number },
        inches: { type: Number }
    },
    weight: {
        kg: { type: Number },
        lbs: { type: Number }
    },
    citizenship: { type: String, required: true },
    homeState: { type: String, required: true },
    homeCityDistrict: { type: String, required: true },
    countryLivingIn: { type: String, required: true },
    stateCityLivingIn: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    retypeEmail: { type: String, required: true },
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
    password: { type: String, required: true },
    retypePassword: { type: String, required: true },
    howToKnowAboutUs: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("UserAddTask", userAddtaskSchema);
