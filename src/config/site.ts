export const siteConfig = {
  name: "Dream Agent Car Vision",
  logo: "/logo.svg",
  logoOnDark: "/logo-on-dark.svg",
  tagline: "Dhaka",
  description:
    "Japanese New and Reconditioned car importer. Call/whatsapp +8801714211956 (10am-8pm) ☎️ +88 (02) 583 16539.",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://dreamagentcarvision.com",
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://backend.dreamagentcarvision.com/api",
  contact: {
    email: "car_vision71@yahoo.com",
    phone: "01714211956",
    address: "Dream Agent Car Vision, 37 Purana Paltan Line, Dhaka 1205, Bangladesh.",
    googleMaps: {
      placeName: "Dream Agent Car Vision",
      url: "https://www.google.com/maps/place/Dream+Agent+Car+Vision/@23.7370766,90.4118018,18z/data=!4m6!3m5!1s0x3755b8f56eb9cebd:0x1a22fdaa024ac5e4!8m2!3d23.7370766!4d90.4118018!16s%2Fg%2F11f_zl_5gc",
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5845.549!2d90.4118018!3d23.7370766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8f56eb9cebd%3A0x1a22fdaa024ac5e4!2sDream%20Agent%20Car%20Vision!5e0!3m2!1sen!2sbd!4v1730000000000!5m2!1sen!2sbd",
    },
    businessHours: [
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "9 AM–7 PM" },
      { day: "Sunday", hours: "9 AM–7 PM" },
      { day: "Monday", hours: "9 AM–7 PM" },
      { day: "Tuesday", hours: "9 AM–7 PM" },
      { day: "Wednesday", hours: "9 AM–7 PM" },
      { day: "Thursday", hours: "9 AM–7 PM" },
    ] as const,
  },
  career: {
    email: "car_vision71@yahoo.com",
  },
  offices: {
    corporate: {
      name: "Office Address",
      address: "37, Purana Paltan Line, Dhaka 1205, Bangladesh.",
      phone: "01714211956",
      email: "car_vision71@yahoo.com",
    },
  },
  links: {
    login: "/login",
    catalog: "/cars",
  },
  social: {
    facebook: "https://www.facebook.com/DreamAgentCarVision/",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
  },
};
