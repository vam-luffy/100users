const { faker } = require('@faker-js/faker');

const mysql = require('mysql2');

const express=require('express');

const methodoverride=require("method-override")

const app=express();
const port=8080;
const path=require("path");
app.use(methodoverride("_method"));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    database: 'delta_app',
    password:'vamban0940'
  });
  let getRandomUser=() => {
    return [
         faker.string.uuid(),
         faker.internet.userName(),
         faker.internet.email(),
        faker.internet.password(),
    ];
}


app.listen(port,()=>{
    
    console.log("litsemning to port")
  })
  //home page
app.get("/",(req,res)=>{
    let q=`select count(*) from user`;
      try {
      connection.query(q, (err, result) => {
          if (err) throw err;
          let count=result[0]["count(*)"];
          res.render("home.ejs",{count})
      });
  } catch (err) {
      console.log(err);
      res.send("some error in Db")
  }
    
});
  

//show users
app.get("/user",(req,res)=>{
   let q=`select * from user`;
   try {
    connection.query(q, (err, users) => {
        if (err) throw err;
        // let count=result[0]["count(*)"];
        // console.log(result)
        res.render("showusers.ejs",{users})
    });
} catch (err) {
    console.log(err);
    res.send("some error in Db")
}
});

// editroute
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id="${id}"`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            // let count=result[0]["count(*)"];
            let user=result[0];
            res.render("edit.ejs",{user});
        });
    } catch (err) {
        console.log(err);
        res.send("some error in Db");
    }
    });

    //EDITor UPDATE
    app.patch("/user/:id",(req,res) =>{
        
        let {id}=req.params;
        let { username: newusername, password: formpass } = req.body;
        let q=`select * from user where id="${id}"`;
        
        try {
            connection.query(q, (err, result) => {
                if (err) throw err;
                let user=result[0];
                if (formpass !== user.password){
                    res.send("wrong");
                }
                else{
                    let q2=`update user set username='${newusername}' where id='${id}'`;
                    connection.query(q2,(err,result)=>{
                        if(err) throw err;
                        res.redirect("/user");
                    })
                }
            });
        } catch (err) {
            console.log(err);
            res.send("some error in Db");
        }
        });






 













