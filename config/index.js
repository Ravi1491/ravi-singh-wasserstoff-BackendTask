export const applicationConfig = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,

  loadBalancer: {
    url1: "https://ravi-singh-wasserstoff-backendtask-1.onrender.com",
    url2: "https://ravi-singh-wasserstoff-backendtask-2.onrender.com",
    url3: "https://ravi-singh-wasserstoff-backendtask-3.onrender.com",
  },
};
