module.exports = {
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  testMatch: ["<rootDir>/tests/**/*.js"],
  transform: {
    "^.+\\.(js)$": "babel-jest",
},

};
