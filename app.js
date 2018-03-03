var express = require("express");
var app     = express();
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
var ejs  = require('ejs');
mongoose.connect("mongodb://razor:hailhydra@ds243418.mlab.com:43418/mtaiitsubs");

 
app.use(morgan('dev'));                                         // log every request to the console           // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/assets"));
app.set("view engine", "ejs");
app.use(morgan());
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
var farmerInfo = mongoose.model('farmerinfo', {
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

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    if (req.body.name=="admin" && req.body.password=="admin") {
        res.redirect("/farmer/new");
    } else {
        res.redirect("/");
    }
});

app.get("/farmer", function(req, res){
    farmerInfo.find({}, function(err, allFarmerInfo){
        if (err) {
            console.log("Error");
        }
        res.render("allfarmers", {allFarmerInfo: allFarmerInfo});
    });
});

app.get("/farmer/new", function(req, res){
    res.render("new");
});

app.get("/farmer/:id", function(req, res){
    farmerInfo.findById(req.params.id, function(err, foundFarmerInfo){
        if (err) {
            console.log(err);
        } else {
            console.log(foundFarmerInfo);
            res.render("farmer", {farmer: foundFarmerInfo});
        }
    });
});

app.post("/farmer/new", function(req, res){
    console.log(req.body);
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
            farmerInfo.findOne({"mobile": req.body.mobile}, function(err, foundFarmer) {
                if (err) {
                    res.send(err) }
                res.redirect("/farmer/"+ foundFarmer.id);
            });
        });
    });

app.get("/*", function(req, res){
    res.send("URL you requested cannot be found"); 
 });
 
 //Setting up server
 app.listen(5080, process.env.IP, function(){
    console.log("Server is up and running! Go ahead make your move.");
 });