var express = require("express");
var app     = express();
var passport = require("passport");
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');
var fileUpload = require('express-fileupload');

var path = require('path'),
    fs = require('fs');
// var User = require("./user");      // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var ejs  = require('ejs');
mongoose.connect("mongodb://razor:hailhydra@ds243418.mlab.com:43418/mtaiitsubs");
var LocalStrategy = require("passport-local");
// var passportLocalMongoose = require("passport-local-mongoose");
app.use(morgan('dev'));                                         // log every request to the console           // parse application/x-www-form-urlencoded
 // parse application/vnd.api+json as json
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
   username: String,
   password: String
});
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", userSchema);
app.use(methodOverride());
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser({uploadDir:'/uploads'}));
app.use(fileUpload());

app.use(express.static(__dirname + "/assets"));
app.set("view engine", "ejs");
app.use(morgan());
app.use(require("express-session")({
    secret: "Rusty is a very cute and nice dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
  //  res.locals.error = req.flash("error");
 //   res.locals.success = req.flash("success");
    next();
 });
// app.use(bodyParser.urlencoded({extended: true}));
passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

app.get("/register", function(req, res){
    res.render("register"); 
});
app.post("/register", function(req, res){
    var user = req.body.username;
    var pass = req.body.password;
    User.register(new User({username: user}), pass, function(err, user){
       if(err){
           console.log(err);
           return res.render("/register");
       } else {
           passport.authenticate("local")(req, res, function(){
              res.redirect("/farmer"); 
           });
       }
    });
});

app.get("/secret", isLoggedIn, function(req, res){
   res.send("secret page!"); 
});

app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/farmer",
    failureRedirect: "/login"
}), function(req, res){
    
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
     res.redirect("/login");
}
 

// module.exports = mongoose.model("User", User);

var farmerInfo = mongoose.model('farmerinfo', {
    role: String, 
    file: String,
    name: String, 
    fhname: String, 
    village: String,
    hobli: String,
    date_created: {type: Date, default: Date.now},
    taluq: String,
    age: String,
    education: String,
    family: {
        male: String,
        female: String,
        children: String
    },
    working_member: {
        male: String,
        female: String
    },
    workers_required: {
        numb: String,
        excess: String,
        short_fall: String
    },
    family_occupation: String,
    annual_income: String,
    house_status: {
        moulded: String,
        roof_hut: String,
        rented: String
    },
    mobile: String,
    email: String,
    aadhar: String,
    bank_details: {
        bank_name: String,
        branch: String,
        acc_no: String,
        ifsc: String
    },
    land_details: {
        irrigated: {
            extent: String,
            survey_no: String,
            village: String,
            name: String,
            total_irrigated: String
        },
        rain_fed: {
            extent: String,
            survey_no: String,
            village: String,
            name: String,
            total_rain_fed: String
        },
        lease: {
            extent: String,
            survey_no: String,
            village: String,
            name: String,
            total_under_lease: String
        },
        leased_out: {
            extent: String,
            survey_no: String,
            village: String,
            name: String,
            total_leased_out: String,
            total_land_holding: String
        }
    },
    irrigation_source: {
        borewell: String,
        depth_borewell: String,
        yield: String,
        lakeorpond: String,
        stream: String,
        rain_water_harvesting: String
    },
    domestic_animals: {
        cows: String,
        calves: String,
        buffalo: String,
        ox: String,
        cock: String,
        hen: String,
        sheep: String,
        goat: String,
        others: String
    },
    sericulture: {
        extent_mulbery_cultivation: String,
        silk_worm_rearing_house: String,
        mulbery_self_consumption: String,
        mulbery_selling: String
    },
    farming_machines: {
        tractor: String,
        power_tiller: String,
        plougher: String,
        rotomator: String,
        bulloc_cart: String,
        spraying_machine: String,
        sprinkler: String,
        drip_irrigation: String,
        source_farm_equipments: String,
        willing_to_rent_farm_equipments: String
    },
    poly_house: {
        extent: String
    },
    crop_details: {
        extent: String,
        crop: String,
        irrigated: String, 
        rain_fed: String,
        species: String,
        date_seeding: String,
        expected_date_of_yield: String,
        expected_production: String,
        unit: String,
        soil_type: String,
        soil_test: String,
        ph_value: String,
        organic_carbon: String,
        n: String,
        p: String,
        k: String,
        others: String
    },
    sales: {
        local: String,
        village_fairs: String,
        apmc: String
    },
    willing_to_sell_online: String,
    farming_suggestions: String,
    nursery: String,
    bank: {
        branch: String,
        loan_amount: String,
        purpose: String,
        repayment_date: String
    },
    any_other_information: String,
    data_collected_by: String
    
});

app.get("/", function(req, res){
    res.render("index");
});

// app.get("/login", function(req, res){
//     res.render("login");
// });

// app.post("/login", function(req, res){
//     if (req.body.name=="admin" && req.body.password=="admin") {
//         res.redirect("/farmer/new");
//     } else {
//         res.redirect("/");
//     }
// });

app.get("/farmer", isLoggedIn ,function(req, res){
    farmerInfo.find({}, function(err, allFarmerInfo){
        if (err) {
            console.log("Error");
        }
        console.log(allFarmerInfo);
        res.render("allfarmers", {allFarmerInfo: allFarmerInfo});
    });
});

app.get("/farmer/new",isLoggedIn , function(req, res){
    res.render("new");
});

app.get("/farmer/:id", isLoggedIn ,function(req, res){
    farmerInfo.findById(req.params.id, function(err, foundFarmerInfo){
        if (err) {
            console.log(err);
        } else {
            // console.log(foundFarmerInfo);
            // res.sendfile(path.resolve('./uploads/'+ foundFarmerInfo['aadhar'] +'.png'));
            res.render("farmer", {farmer: foundFarmerInfo});
        }
    });
});

app.post("/farmer/new",isLoggedIn  ,function(req, res){
    console.log(req.body);
    // var sampleFile = req.files.file;
    //     // targetPath = path.resolve('./uploads/'+req.body.aadhar +'.png');
    // if (path.extname(req.files.file.name).toLowerCase() === '.png') {
    //     // fs.rename(tempPath, targetPath, function(err) {
    //     //     if (err) throw err;
    //     //     console.log("Upload completed!");
    //     // });
    //     sampleFile.mv('./uploads/'+ req.body.aadhar + '.png', function(err) {
    //         if (err)
    //           return res.status(500).send(err);
         
    //         console.log('Upload');
    //       }); 
    // }
    // } else {
    //     fs.unlink(tempPath, function () {
    //         if (err) throw err;
    //         console.error("Only .png files are allowed!");
    //     });
    // }
    farmerInfo.create(
        {
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            fhname: req.body.fhname,
            village: req.body.village,
            taluq: req.body.taluq,
            education: req.body.education,
            hobli: req.body.hobli,
            aadhar: req.body.aadhar,
            annual_income: req.body.annual_income,
            bank_details: req.body.bank_details,
            house_status: req.body.house_status,
            domestic_animals: req.body.domestic_animals
        }
        , function(err, review) {
            if (err) {
                res.send(err);
            }
            // get and return all the reviews after you create another
            // farmerInfo.findOne({"mobile": req.body.mobile}, function(err, foundFarmer) {
            //     if (err) {
            //         res.send(err) }
            //     res.redirect("/farmer/"+ foundFarmer.id);
            // });
            res.redirect("/farmer");
        });
    });

app.get("/*", function(req, res){
    res.send("URL you requested cannot be found"); 
 });
 
 //Setting up server
 app.listen(5090, process.env.IP, function(){
    console.log("Server is up and running! Go ahead make your move.");
 });