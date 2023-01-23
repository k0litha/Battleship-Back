const expect = require("chai").expect;
const request = require("supertest");
const server = require("../server.js");

var app =request.agent(server);





describe("Register Request with existing username",function (){
    it("Should return 'Failed! Username is already in use!'",function (){
        app.post("/api/auth/signup").send({
            username:"test",
            email:"test@test.com",
            password:"testtest"
        }).end((err,res) =>{
            expect(res.body.message).to.equal("Failed! Username is already in use!");
        })
    })
});



describe("Login Request with incorrect password",function (){
    it("Should return 'Invalid Password!'",function (){
        app.post("/api/auth/signin").send({
            username:"test",
            password:"*******"
        }).end((err,res) =>{
            expect(res.body.message).to.equal("Invalid Password!");
        })
    })
});
describe("Login Request with correct credentials",function (){
    it("Succes should return true",function (){
        app.post("/api/auth/signin").send({
            username:"test",
            password:"testtest"
        }).end((err,res) =>{
            expect(res.body.success).to.equal(true);
        })
    })
});
describe("Login Request with incorrect username",function (){
    it("Should return 'User Not found'",function (){
        app.post("/api/auth/signin").send({
            username:"******",
            password:"testtest"
        }).end((err,res) =>{
            expect(res.body.message).to.equal("User Not found.");
        })
    })
});






describe("LogOut Request",function (){
    it("Should return 'You've been signed out!'",function (){
        app.post("/api/auth/signout").send().end((err,res) =>{
            expect(res.body.message).to.equal("You've been signed out!" );
        })
    })
});




describe("Score save Request",function (){
    it("Should return 'Score saved successfully!'",function (){
        app.post("/api/test/savescore").send({
            username:"test",
            state:"test",
            sinked:"test"
        }).end((err,res) =>{
            expect(res.body.message).to.equal("Score saved successfully!");
        })
    })
});

describe("Score show Request",function (){
    it("Should return 'Score retrieved successfully!'",function (){
        app.post("/api/test/showscore").send().end((err,res) =>{
            expect(res.body.success).to.equal(true);
        })
    })
});
