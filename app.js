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
mongoose.connect("mongodb://localhost/farmer_portal", {useMongoClient: true});
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
    house_status: String,
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
        source: String,
        extent: String,
        survey_no: String,
        village: String,
        name: String,
        total_on_source: String,
        total_land_holding: String
    },
    irrigation_source: String,
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
    var family = {
        male: req.body.family_male,
        female: req.body.family_female,
        children: req.body.family_children
    };
    var working_member = {
        male:req.body.working_member_male,
        female:req.body.working_member_female
    };
    var workers_required = {
        numb:req.body.workers_required_numb,
        excess:req.body.workers_required_excess,
        short_fall:req.body.workers_required_short_fall
    };
    var sericulture = {
        extent_mulbery_cultivation: req.body.extent_mulbery_cultivation,
        silk_worm_rearing_house: req.body.silk_worm_rearing_house,
        mulbery_self_consumption: req.body.mulbery_self_consumption,
        mulbery_selling: req.body.mulbery_selling
    };
    var farming_machines = {
        tractor: req.body.farming_machines_tractor,
        power_tiller: req.body.farming_machines_power_tiller,
        plougher: req.body.farming_machines_plougher,
        rotomator: req.body.farming_machines_rotomator,
        bulloc_cart: req.body.farming_machines_bulloc_cart,
        spraying_machine: req.body.farming_machines_spraying_machine,
        sprinkler: req.body.farming_machines_sprinkler,
        drip_irrigation: req.body.farming_machines_drip_irrigation,
        source_farm_equipments: req.body.farming_machines_source_farm_equipments,
        willing_to_rent_farm_equipments: req.body.farming_machines_willing_to_rent_farm_equipments
    };
    var domestic_animals ={
        cow:req.body.cow_count,
        calves:req.body.calf_count,
        buffalo:req.body.buffalo_count,
        ox:req.body.ox_count,
        cock:req.body.cock_count,
        hen:req.body.hen_count,
        sheep:req.body.sheep_count,
        goat:req.body.goat_count,
        others:req.body.others_count
    };
    var land_det = {
        source: req.body.land_details,
        extent: req.body.land_extent,
        survey_no: req.body.land_survey_no,
        village: req.body.land_village,
        name: req.body.land_name,
        total_on_source: req.body.total_land_query,
        total_land_holding: req.body.total_land_holding
    };
    var poly_house= {
        extent:req.body.poly_house_extent
    };
    var crop_details = {
        extent: req.body.crop_details_extent,
        crop: req.body.crop_details_crop,
        irrigated: req.body.crop_details_irrigated,
        rain_fed: req.body.crop_details_rain_fed,
        species: req.body.crop_details_species,
        date_seeding: req.body.crop_details_date_seeding,
        expected_date_of_yield: req.body.crop_details_expected_date_of_yield,
        expected_production: req.body.crop_details_expected_production,
        unit: req.body.crop_details_unit,
        soil_type: req.body.crop_details_soil_type,
        soil_test: req.body.crop_details_soil_test,
        ph_value: req.body.crop_details_ph_value,
        organic_carbon: req.body.crop_details_organic_carbon,
        n: req.body.crop_details_n,
        p: req.body.crop_details_p,
        k: req.body.crop_details_k,
        others: req.body.crop_details_others
    };
    var sales = {
        local: req.body.sales_local,
        village_fairs: req.body.sales_village_fairs,
        apmc: req.body.sales_apmc
    };
    var bank={
        branch: req.body.bank_branch,
        loan_amount: req.body.bank_loan_amount,
        purpose: req.body.bank_purpose,
        repayment_date: req.body.bank_repayment_date,
    };


    farmerInfo.create(
        {
            name: req.body.name,
            age: req.body.age,
            mobile: req.body.mobile,
            email: req.body.email,
            fhname: req.body.fhname,
            village: req.body.village,
            taluq: req.body.taluq,
            education: req.body.education,
            hobli: req.body.hobli,
            aadhar: req.body.aadhar,
            family: family,
            working_member: working_member,
            workers_required: workers_required,
            family_occupation: req.body.family_occupation,
            annual_income: req.body.annual_income,
            house_status: req.body.house_status,
            bank_details: req.body.bank_details,
            land_details: land_det,
            irrigation_source: req.body.irrigation_source,
            domestic_animals: domestic_animals,
            sericulture: sericulture,
            farming_machines: farming_machines,
            poly_house: poly_house,
            crop_details: crop_details,
            sales: sales,
            willing_to_sell_online: req.body.willing_to_sell_online,
            farming_suggestions: req.body.farming_suggestions,
            nursery: req.body.nursery,
            bank: bank,
            any_other_information: req.body.any_other_information,
            data_collected_by: req.body.data_collected_by
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