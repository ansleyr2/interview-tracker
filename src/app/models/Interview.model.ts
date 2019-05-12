export interface Interview{
    id: String,
    designation: String,
    company:{
        name: String,
        address:{
            addressLine: String,
            city: String,
            state: String,
            zipCode: String
        }
    },
    jobDescription?: String,
    date: String,
    time: String,
    location?:{
        lat: Number,
        long: Number
    },
    contact?:{
        name: String,
        email?: String,
        phone?: String
    }

}