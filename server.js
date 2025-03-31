var express = require("express");
var mysql2 = require('mysql2');
var fileUploader=require("express-fileupload");
var cloudinary=require("cloudinary").v2;

var app = express();

//----------Sign Up & Login

let dbConfig="mysql://avnadmin:AVNS_iY0jWe9Bmz4wF5IXa4H@mysql-sonakshi-thapar-1fc5.i.aivencloud.com:14532/defaultdb"
let mySqlServer=mysql2.createConnection(dbConfig);

app.use(express.static("public"));

app.listen(2004,function(){
    console.log("Server Started");
})

app.get("/",function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/public/index.html";
    resp.sendFile(fullpath);
})

mySqlServer.connect(function(err){
    if(err!=null)
    {
        console.log(err.message);
    }
    else
        console.log("Connected to DB");
    
})

app.get("/save-details",function(req,resp){
    
        mySqlServer.query("INSERT INTO users VALUES (?,?,?,CURDATE(),?)", [req.query.x, req.query.y, req.query.z,"1"], function (err) {
            if (err == null) {
                resp.send("Record Saved Successfully.. Badhaiiii");
            } else {
                console.error("DB Error:", err);
                resp.status(500).send("Database Error: " + err.message);
            }
        });
    
    
})

app.get("/login-details",function(req,resp){
    
        mySqlServer.query("SELECT * from users where email=? and pwd=?", [req.query.x, req.query.y], function (err,resultAry)
         {
            if (err == null) {

            if(resultAry.length==0)
                 // resp.status(401).send("Invalid credentials");
                 resp.send("Invalid User Id or Password");
            else if(resultAry[0].statuss == 1) {
                    // resp.send("logged in successfully");
                    resp.send(resultAry[0].userType);
                }
                else {
                    resp.send("Blocked");
                }
        }
        else
        {
            resp.send(err.message)
        }
      }
    );     
})

app.get("/vol-kyc",function(req,resp){
    resp.sendFile(__dirname+"/public/vol-kyc.html");
})

app.get("/client-profile",function(req,resp){
    resp.sendFile(__dirname+"/public/client-profile.html");
})

app.get("/post-job",function(req,resp){
    resp.sendFile(__dirname+"/public/post-job.html");
})

app.get("/client-dash",function(req,resp){
    resp.sendFile(__dirname+"/public/client-dash.html");
})

app.get("/user-controller",function(req,resp){
    resp.sendFile(__dirname+"/public/user-controller.html");
})

app.get("/admin-dash",function(req,resp){
    resp.sendFile(__dirname+"/public/admin-dash.html");
})

app.get("/admin-client",function(req,resp){
    resp.sendFile(__dirname+"/public/admin-client.html");
})

app.get("/admin-vol-kyc",function(req,resp){
    resp.sendFile(__dirname+"/public/admin-vol-kyc.html");
})

app.get("/find-work",function(req,resp){
    resp.sendFile(__dirname+"/public/find-work.html");
})
app.get("/vol-dash",function(req,resp){
    resp.sendFile(__dirname+"/public/vol-dash.html");
})
app.get("/job-manager",function(req,resp){
    resp.sendFile(__dirname+"/public/job-manager.html");
})


//-----------------Vol-Kyc Page

app.use(express.urlencoded(true));
app.use(fileUploader());
cloudinary.config({ 
    cloud_name: 'dzyatea4p', 
    api_key: '387484976649137', 
    api_secret: 'rJ8jzNhQZnTiA5O9RKz89NYh6no' // Click 'View API Keys' above to copy your API secret
});


//-------------register

app.post("/do-insert",async function(req,resp){
    let emailid = req.body.txtEmail;
    let name = req.body.txtname;
    let contact = req.body.txtno;
    let address = req.body.txtAddress;
    let city = req.body.txtCity;
    let gender = req.body.txtGender;
    let dob = req.body.txtdob;
    let quali = req.body.txtQualification;
    let occu = req.body.txtOccupation;
    let info = req.body.txtarea;
    
    let picpath = "user.png";
     if(req.files!=null && req.files.propic){
  
     picpath=req.files.propic.name;
  
     let locationToSave = 
     __dirname+"/public/pic/"+picpath;//file path
     req.files.propic.mv(locationToSave);//saving file in upload folder
    
     try{
     await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
     picpath=picUrlResult.url;
        //will give u the url of ur pic on cloudinary server
     });
    }
    catch(err){
        console.log(err.message);
    }
    }

    //-----------adhar
    let idpath = "ahar_card.png";
     if(req.files!=null && req.files.addpic){
  
     idpath=req.files.addpic.name;
  
     let locationToSave = __dirname+"/public/pic/"+idpath;//file path
     req.files.addpic.mv(locationToSave);//saving file in upload folder
     
     try{
     await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
     idpath=picUrlResult.url;
        //will give u the url of ur pic on cloudinary server
     });
    }
    catch(err){
        console.log(err.message);
    }
    }

    
                mySqlServer.query("INSERT INTO volkyc(emailid, fullname, contact, address, city, gender, dob, quali, occu, info, picpath, idpath) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", 
                    [emailid,name, contact, address, city, gender, dob, quali, occu, info, picpath, idpath], function (err, res2) {
                    if(!err){
                    resp.send("KYC Completed successfully!")
                    }
                    else{console.log(err.message)}
                }) 
  
  })


  //-----------------------------------------

  app.get("/do-fetch",function(req,resp){
    let txtEmail = req.query.x; 
    mySqlServer.query("select * from volkyc where emailid=?",[txtEmail],function(err,resultArray){
      //console.log(result);
      /*if(resultArray.length==0)
        resp.send("Invalid Email ID");
      else*/
        resp.send(resultArray);
      
    })
  })


  //---------------update

  app.post("/do-update",async function(req,resp){
    let emailid = req.body.txtEmail;
    let name = req.body.txtname;
    let contact = req.body.txtno;
    let address = req.body.txtAddress;
    let city = req.body.txtCity;
    let gender = req.body.txtGender;
    let dob = req.body.txtdob;
    let quali = req.body.txtQualification;
    let occu = req.body.txtOccupation;
    let info = req.body.txtarea;
    
    let picpath = "user.png";
     if(req.files!=null && req.files.propic){
  
     picpath=req.files.propic.name;
  
     let locationToSave = 
     __dirname+"/public/pic/"+picpath;//file path
     req.files.propic.mv(locationToSave);//saving file in upload folder
    
     try{
     await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
     picpath=picUrlResult.url;
        //will give u the url of ur pic on cloudinary server
     });
    }
    catch(err){
        console.log(err.message);
    }
    }
    else{
        picpath = req.body.hdnprof;
    }

    //-----------adhar
    let idpath = "ahar_card.png";
     if(req.files!=null && req.files.addpic){
  
     idpath=req.files.addpic.name;
  
     let locationToSave = __dirname+"/public/pic/"+idpath;//file path
     req.files.addpic.mv(locationToSave);//saving file in upload folder
     
     try{
     await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
     idpath=picUrlResult.url;
        //will give u the url of ur pic on cloudinary server
     });
    }
    catch(err){
        console.log(err.message);
    }
    }
    else{
        idpath = req.body.hdnadd;
    }

    
                mySqlServer.query("update volkyc set fullname=?, contact=?, address=?, city=?, gender=?, dob=?, quali=?, occu=?, info=?, picpath=?, idpath=? where emailid=?", 
                    [name, contact, address, city, gender, dob, quali, occu, info, picpath, idpath,emailid], function (err, res2) {
                    if(!err){
                    resp.send("Updated");
                    }
                    else{console.log(err.message)}
                }) 
  
  })

  app.get("/client-fetch",function(req,resp){
    let txtEmail = req.query.x; 
    mySqlServer.query("select * from cprofile where email=?",[txtEmail],function(err,resultArray){
     
        resp.send(resultArray);
      
    })
  })


  app.post("/client-insert",async function(req,resp){
    let email = req.body.txtEmail;
    let name = req.body.txtName;
    let business = req.body.txtBussi;
    let bprofile = req.body.txtBussiprof;
    let address = req.body.txtAddr;
    let city = req.body.txtCity;
    let contact = req.body.txtContact;
    let idproof = req.body.inputid;
    let idpnumber = req.body.txtID;
    let info = req.body.txtOthers;
    
    
                mySqlServer.query("INSERT INTO cprofile VALUES(?,?,?,?,?,?,?,?,?,?)", 
                    [email,name,business,bprofile,address,city,contact,idproof,idpnumber,info], function (err,response) {
                    if(!err){
                    resp.send("Client Completed successfully!")
                    }
                    else{console.log(err.message)}
                }) 
  
  })

  

  app.post("/client-update",async function(req,resp){
    let email = req.body.txtEmail;
    let name = req.body.txtName;
    let business = req.body.txtBussi;
    let bprofile = req.body.txtBussiprof;
    let address = req.body.txtAddr;
    let city = req.body.txtCity;
    let contact = req.body.txtContact;
    let idproof = req.body.inputid;
    let idpnumber = req.body.txtID;
    let info = req.body.txtOthers;
    
    
                mySqlServer.query("update cprofile set fullname=?,business=?,bprofile=?,address=?, city=?, contact=?,idproof=?,idpnumber=?,info=? where email=?", 
                    [name,business,bprofile,address,city,contact,idproof,idpnumber,info,email], function (err,response) {
                    if(!err){
                    resp.send("Client Updated")
                    }
                    else{console.log(err.message)}
                })
  
  })


  app.post("/publish-job",async function(req,resp){
    let cid = req.body.txtEmail;
    let jobtitle = req.body.txtType;
    let jobtype = req.body.inputtime;
    let address = req.body.txtAddr;
    let city = req.body.txtCity;
    let edu = req.body.txtState;
    let contact = req.body.txtno;
    
                mySqlServer.query("INSERT INTO jobs VALUES(?,?,?,?,?,?,?,?)", 
                    [null,cid,jobtitle,jobtype,address,city,edu,contact], function (err,response) {
                    if(!err){
                    resp.send("Job Posted successfully!")
                    }
                    else{console.log(err.message)}
                }) 
  
  })



  //------------------------------------------------------

  app.get("/all-records",function(req,resp){
     
    mySqlServer.query("select * from users",function(err,resultArray){
      //console.log(result);
      /*if(resultArray.length==0)
        resp.send("Invalid Email ID");
      else*/
        resp.send(resultArray);
      
    })
  })

  app.get("/block-one",function(req,resp){
    mySqlServer.query("update users set statuss=? where email=?",[0,req.query.email],function(err,result){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send("blocked");
    })
  })

  app.get("/unblock-one",function(req,resp){
    mySqlServer.query("update users set statuss=? where email=?",[1,req.query.email],function(err,result){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send("unblocked");
    })
  })

  app.get("/fetch-clients",function(req,resp){
     
    mySqlServer.query("select * from cprofile",function(err,resultArray){
        resp.send(resultArray);
      
    })
  })

  app.get("/fetch-vol",function(req,resp){
     
    mySqlServer.query("select * from volkyc",function(err,resultArray){
        resp.send(resultArray);
      
    })
  })

  //-------------------------------

  app.get("/fetch-cities",function(req,resp){
     
    mySqlServer.query("select  DISTINCT city from jobs",function(err,resultArray){
        resp.send(resultArray);
      
    })
  })
  app.get("/fetch-titles",function(req,resp){
     
    mySqlServer.query("select  DISTINCT jobtitle from jobs",function(err,resultArray){
        resp.send(resultArray);
      
    })
  })

  app.get("/fetch-selected-jobs",function(req,resp){
     
    mySqlServer.query("select * from jobs where city=? and jobtitle=? and edu=?",[req.query.city,req.query.job,req.query.education],function(err,resultArray){
        resp.send(resultArray);
      
    })
  })

  //------------------------
  app.get("/fetch-all",function(req,resp){
     
    mySqlServer.query("select * from jobs where cid=?",[req.query.email],function(err,resultArray){
        resp.send(resultArray);
      
    })
  })

  app.get("/delete-one",function(req,resp){
     
    mySqlServer.query("delete from jobs where jobid=?",[req.query.jobid],function(err,resultArray){
        if (err) {
            console.error("Database Error:", err);
            return resp.send("Database Error");
        }
        
        else if (resultArray.affectedRows == 1) {
            resp.send("Record Deleted Successfully");
        } else {
            resp.send("No record found with this email");
        }
      
    })
  })