export interface InterviewListItem {
    id: String,
    designation: String,
    companyName: String,
    date: String,
    time: String,
    location: {
      lat: number,
      lng: number
    },
    address?: string
    showLocationBtn: boolean
  }