const expect = require("chai").expect;
const request = require("supertest");
const server = require("../server.js");

var app =request.agent(server);


describe("Register Request with existing username",function (){
    it("Should return 'Failed! Username is already in use!'",function (){
        app.post("/api/auth/signup").send({
            username:"kolitha",
            email:"kolitha@gmail.com",
            password:"wrong"
        }).end((err,res) =>{
            expect(res.body.message).to.equal("Failed! Username is already in use!");
        })
    })
});


describe("Register Request with existing username",function (){
    it("Should return 'Failed! Username is already in use!'",function (){
        app.post("/api/auth/signup").send({
            username:"kolitha",
            email:"kolitha@gmail.com",
            password:"wrong"
        }).end((err,res) =>{
            expect(res.body.message).to.equal("Failed! Username is already in use!");
        })
    })
});



describe("Login Request with correct credentials",function (){
    it("Succes should return true",function (){
        app.post("/api/auth/signin").send({
            username:"kolitha",
            password:"kolitha"
        }).end((err,res) =>{
            expect(res.body.success).to.equal(true);
        })
    })
});



describe("Login Request with incorrect username",function (){
    it("Should return 'User Not found'",function (){
        app.post("/api/auth/signin").send({
            username:"******",
            password:"kolitha"
        }).end((err,res) =>{
            expect(res.body.message).to.equal("User Not found.");
        })
    })
});


describe("Login Request with incorrect password",function (){
    it("Should return 'Invalid Password!'",function (){
        app.post("/api/auth/signin").send({
            username:"kolitha",
            password:"*******"
        }).end((err,res) =>{
            expect(res.body.message).to.equal("Invalid Password!" );
        })
    })
});

message: "Invalid Password!" 