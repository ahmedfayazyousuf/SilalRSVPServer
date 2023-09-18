var Sib = require('sib-api-v3-sdk');
var defaultClient = Sib.ApiClient.instance;

const express = require('express')
const app = express();
require("dotenv").config()
var path = require('path');

// dotenv.config({path: './.env' });

require("./db/db");

var User = require('./model/User')
const  ObjectID = require('mongodb').ObjectId;

var cron = require('node-cron');

const schedule = require('node-schedule');

var request = require('request');






const MAIL_FROM = process.env.MAIL_FROM;
const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;


const bodyParser = require("body-parser")
const cors = require("cors")
const nodemailer = require("nodemailer")

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
const static_path = path.join(__dirname);
app.use(express.static(static_path));

app.use(cors({
    origin: "*",
}));

var loadBase64Image = function (url, callback) {
    // Required 'request' module
    var request = require('request');

    // Make request to our image url
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            // So as encoding set to null then request body became Buffer object
            var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
                , image = body.toString('base64');
            if (typeof callback == 'function') {
                callback(image, base64prefix);
            }
        } else {
            throw new Error('Can not download image');
        }
    });
};

// const job = schedule.scheduleJob('*/20 * * * * *', function(){
//     User.find({Status: "NA"}).then((user) => {
//         console.log(user[0].Email)

//         const trans = nodemailer.createTransport({
//             host: MAIL_HOST,
//             port: MAIL_PORT,
//             auth: {
//                 user: MAIL_USER,
//                 pass: MAIL_PASS
//             },
//             tls: {
//                 secureProtocol: "TLSv1_method"
//             }
    
//         })

//         user.map(async (user) => {
//             var url = `http://localhost:3000/user/${user._id}`;

//             await trans.sendMail({
//                 from: MAIL_FROM,
//                 to: `${user.Email}`,
//                 subject: "Invitation",
//                 attachments: [{
//                     filename: 'image.png',
//                     path:  `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}`,
//                     cid: 'unique@nodemailer.com' //same cid value as in the html img src
//                 }],
//                 html: `<!DOCTYPE html>
//                 <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
                
//                 <head>
//                     <title></title>
//                     <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
//                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                     <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
//                     <!--[if !mso]><!-->
//                     <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
//                     <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css">
//                     <!--<![endif]-->
//                     <style>
//                         * {
//                             box-sizing: border-box;
//                         }
                
//                         body {
//                             margin: 0;
//                             padding: 0;
//                         }
                
//                         a[x-apple-data-detectors] {
//                             color: inherit !important;
//                             text-decoration: inherit !important;
//                         }
                
//                         #MessageViewBody a {
//                             color: inherit;
//                             text-decoration: none;
//                         }
                
//                         p {
//                             line-height: inherit
//                         }
                
//                         .desktop_hide,
//                         .desktop_hide table {
//                             mso-hide: all;
//                             display: none;
//                             max-height: 0px;
//                             overflow: hidden;
//                         }
                
//                         @media (max-width:620px) {
//                             .desktop_hide table.icons-inner {
//                                 display: inline-block !important;
//                             }
                
//                             .icons-inner {
//                                 text-align: center;
//                             }
                
//                             .icons-inner td {
//                                 margin: 0 auto;
//                             }
                
//                             .image_block img.big,
//                             .row-content {
//                                 width: 100% !important;
//                             }
                
//                             .mobile_hide {
//                                 display: none;
//                             }
                
//                             .stack .column {
//                                 width: 100%;
//                                 display: block;
//                             }
                
//                             .mobile_hide {
//                                 min-height: 0;
//                                 max-height: 0;
//                                 max-width: 0;
//                                 overflow: hidden;
//                                 font-size: 0px;
//                             }
                
//                             .desktop_hide,
//                             .desktop_hide table {
//                                 display: table !important;
//                                 max-height: none !important;
//                             }
//                         }
//                     </style>
//                 </head>
                
//                 <body style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
//                     <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;">
//                         <tbody>
//                             <tr>
//                                 <td>
//                                     <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//                                         <tbody>
//                                             <tr>
//                                                 <td>
//                                                     <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
//                                                         <tbody>
//                                                             <tr>
//                                                                 <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
//                                                                     <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//                                                                         <tr>
//                                                                             <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
//                                                                                 <div class="alignment" align="center" style="line-height:10px"><img class="big" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/914968_899312/coverrr.png" style="display: block; height: auto; border: 0; width: 600px; max-width: 100%;" width="600"></div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     </table>
//                                                                     <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
//                                                                         <tr>
//                                                                             <td class="pad" style="padding-bottom:5px;padding-left:45px;padding-right:45px;padding-top:40px;">
//                                                                                 <div style="color:#101112;direction:ltr;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
//                                                                                     <p style="margin: 0;">Thank You for your information</p>
//                                                                                 </div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     </table>
//                                                                 </td>
//                                                             </tr>
//                                                         </tbody>
//                                                     </table>
//                                                 </td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                     <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//                                         <tbody>
//                                             <tr>
//                                                 <td>
//                                                     <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
//                                                         <tbody>
//                                                             <tr>
//                                                                 <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
//                                                                     <table class="text_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
//                                                                         <tr>
//                                                                             <td class="pad">
//                                                                                 <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
//                                                                                     <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #000000; line-height: 1.2;">
//                                                                                         <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><strong>Summary:</strong></p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     </table>
//                                                                 </td>
//                                                             </tr>
//                                                         </tbody>
//                                                     </table>
//                                                 </td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                     <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//                                         <tbody>
//                                             <tr>
//                                                 <td>
//                                                     <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; border-right: 0px solid #190A0A; width: 600px;" width="600">
//                                                         <tbody>
//                                                             <tr>
//                                                                 <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
//                                                                     <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
//                                                                         <tr>
//                                                                             <td class="pad" style="padding-top:5px;padding-bottom:5px;">
//                                                                                 <div style="color:#101112;font-size:12px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:14.399999999999999px;">
//                                                                                     <p style="margin: 0; margin-bottom: 5px;">Husam</p>
//                                                                                     <p style="margin: 0; margin-bottom: 5px;">Haris</p>
//                                                                                     <p style="margin: 0; margin-bottom: 5px;">Dubai</p>
//                                                                                     <p style="margin: 0; margin-bottom: 5px;">NSC</p>
//                                                                                     <p style="margin: 0; margin-bottom: 5px;">Chief Operating Officer</p>
//                                                                                     <p style="margin: 0; margin-bottom: 5px;">husam@thehanginghouse.com</p>
//                                                                                     <p style="margin: 0;">+971</p>
//                                                                                 </div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     </table>
//                                                                 </td>
//                                                                 <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
//                                                                     <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
//                                                                         <tr>
//                                                                             <td class="pad" style="padding-top:30px;padding-bottom:30px;">
//                                                                                 <div style="color:#101112;font-size:12px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:14.399999999999999px;">
//                                                                                     <p style="margin: 0; margin-bottom: 16px;">Male</p>
//                                                                                     <p style="margin: 0; margin-bottom: 16px;">Vegan</p>
//                                                                                     <p style="margin: 0;">No Allergy</p>
//                                                                                 </div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     </table>
//                                                                 </td>
//                                                             </tr>
//                                                         </tbody>
//                                                     </table>
//                                                 </td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                     <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//                                         <tbody>
//                                             <tr>
//                                                 <td>
//                                                     <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
//                                                         <tbody>
//                                                             <tr>
//                                                                 <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
//                                                                     <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//                                                                         <tr>
//                                                                             <td class="pad" style="width:100%;padding-left:60px;padding-right:0px;padding-top:5px;padding-bottom:5px;">
//                                                                                 <div class="alignment" align="center" style="line-height:10px"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/914968_899312/loco.png" style="display: block; height: auto; border: 0; width: 60px; max-width: 100%;" width="60" alt="I'm an image" title="I'm an image"></div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     </table>
//                                                                 </td>
//                                                                 <td class="column column-2" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
//                                                                     <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
//                                                                         <tr>
//                                                                             <td class="pad" style="padding-top:15px;padding-right:10px;padding-bottom:15px;padding-left:10px;">
//                                                                                 <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
//                                                                                     <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//                                                                                         <p style="margin: 0; font-size: 12px; text-align: left; mso-line-height-alt: 14.399999999999999px;"><strong><u>Click here for the direction to the venue</u></strong></p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     </table>
//                                                                 </td>
//                                                             </tr>
//                                                         </tbody>
//                                                     </table>
//                                                 </td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                     <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//                                         <tbody>
//                                             <tr>
//                                                 <td>
//                                                     <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
//                                                         <tbody>
//                                                             <tr>
//                                                                 <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
//                                                                     <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//                                                                         <tr>
//                                                                             <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
//                                                                                 <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//                                                                                     <tr>
//                                                                                         <td class="alignment" style="vertical-align: middle; text-align: center;">
//                                                                                             <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
//                                                                                             <!--[if !vml]><!-->
//                                                                                             <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation">
//                                                                                                 <!--<![endif]-->
//                                                                                                 <tr>
//                                                                                                     <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="https://www.designedwithbee.com/?utm_source=editor&utm_medium=bee_pro&utm_campaign=free_footer_link" target="_blank" style="text-decoration: none;"><img class="icon" alt="Designed with BEE" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/53601_510656/Signature/bee.png" height="32" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
//                                                                                                     <td style="font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="https://www.designedwithbee.com/?utm_source=editor&utm_medium=bee_pro&utm_campaign=free_footer_link" target="_blank" style="color: #9d9d9d; text-decoration: none;">Designed with BEE</a></td>
//                                                                                                 </tr>
//                                                                                             </table>
//                                                                                         </td>
//                                                                                     </tr>
//                                                                                 </table>
//                                                                             </td>
//                                                                         </tr>
//                                                                     </table>
//                                                                 </td>
//                                                             </tr>
//                                                         </tbody>
//                                                     </table>
//                                                 </td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table><!-- End -->
//                 </body>
                
//                 </html>`
//                 // attachments: [{
//                 //     filename: 'image.png',
//                 //     path:  `${qr}`,
//                 //     cid: 'unique@nodemailer.com' //same cid value as in the html img src
//                 // }],
//             //     html: `<div className="email" style="
//             //     border: 1px solid black;
//             //     padding: 20px;
//             //     font-family: sans-serif;
//             //     line-height: 2;
//             //     font-size: 20px; 
//             //     ">
//             //     <h2>Here is your QR Code: -</h2>
//             //     <p></p>
        
//             //     <img src="cid:unique@nodemailer.com" height="300" width="300" alt="Red dot"/>
            
//             //     <p>Enjoy!</p>
//             //      </div>
//             // `
        
//             })
//         })
 
//        })
// //   console.log('The answer to life, the universe, and everything!');
// });

app.use(express.static('public')) 

// app.get('/send_mail', function (req, res) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Origin', 'https://rsvpadmin-ksbft05ap-adis0928.vercel.app/');
//     res.send('Hello World');
// })

app.post("/send_mail",async (req,res)=>{

    // res.header('Access-Control-Allow-Origin', 'https://rsvpadmin-ksbft05ap-adis0928.vercel.app/');

    // res.header('Access-Control-Allow-Origin', '*');
    // res.send('Hello World');
    // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    // res.header('Access-Control-Allow-Credentials', true); // If needed




    let { to, name } = req.body
    const trans = nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
        },
        tls: {
            secureProtocol: "TLSv1_method"
        }
        
    })



    const newUser = User({
        Email: to,
        Name: name
    })

   

    await newUser.save(async function(err,user){
        // var url2 = `http://localhost:3000/Success/${user._id}`;
        // var url = `http://localhost:3000/Registration/${user._id}`;
        // var urlname = `https://rsvpadmin.vercel.app/video/${name}`;
        var url=`https://nissanaftersalesconference.org/registration/${user._id}`
        var url2= `https://nissanaftersalesconference.org/Success/${user._id}`
        var urlname=`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://nissanaftersalesconference.org/video/${name}`
        var urlname2=`https://nissanaftersalesconference.org/video/${name}`
        const client = Sib.ApiClient.instance
    
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.API_KEY
    
    const sender = {
        email: 'rsvp@thehanginghouse.com',
        name: 'Nissan Aftersales Conference',
        // name: 'Anjan Shomodder',
    }
    
    const recivers = [
        {
            email: to,
        },
    ]
    
    const transactionalEmailApi = new Sib.TransactionalEmailsApi()
    let src;
    loadBase64Image(urlname, function (image, prefix) {
    src = prefix + image;
    console.log(src)

    loadBase64Image('https://firebasestorage.googleapis.com/v0/b/assetuploadformbuilder.appspot.com/o/images%2Fadiemails.png?alt=media&token=58332cd6-b7fb-4703-879d-98dcdf475714', function (image, prefix) {
    src2 = prefix + image;

    loadBase64Image('https://firebasestorage.googleapis.com/v0/b/assetuploadformbuilder.appspot.com/o/images%2Fno%20button.jpg?alt=media&token=466119cf-f854-4f51-9bb5-c47bd04ceefa', function (image, prefix) {
        src3 = prefix + image;

        loadBase64Image('https://firebasestorage.googleapis.com/v0/b/assetuploadformbuilder.appspot.com/o/images%2Fyes%20button.jpg?alt=media&token=01244678-1f21-4ffd-9353-48ab41f9453f', function (image, prefix) {
            src4 = prefix + image;

            loadBase64Image('https://firebasestorage.googleapis.com/v0/b/assetuploadformbuilder.appspot.com/o/images%2Fimage.png?alt=media&token=6e01b730-bfbf-486a-a773-367d3c275f18', function (image, prefix) {
                src5 = prefix + image;
                transactionalEmailApi
                .sendTransacEmail({
                    subject: 'Nissan Aftersales Conference Invitation Email',
                    sender,
                    to: recivers,
                    // textContent: `Cules Coding will teach you how to become a {{params.role}} developer.`,
                    htmlContent: `<!DOCTYPE html>
                    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
                    
                    <head>
                        <title></title>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
                        <!--[if !mso]><!-->
                        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
                        <!--<![endif]-->
                        <style>
                            * {
                                box-sizing: border-box;
                            }
                    
                            body {
                                margin: 0;
                                padding: 0;
                            }
                    
                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: inherit !important;
                            }
                    
                            #MessageViewBody a {
                                color: inherit;
                                text-decoration: none;
                            }
                    
                            p {
                                line-height: inherit
                            }
                    
                            .desktop_hide,
                            .desktop_hide table {
                                mso-hide: all;
                                display: none;
                                max-height: 0px;
                                overflow: hidden;
                            }
                    
                            @media (max-width:620px) {
                                .desktop_hide table.icons-inner {
                                    display: inline-block !important;
                                }
                    
                                .icons-inner {
                                    text-align: center;
                                }
                    
                                .icons-inner td {
                                    margin: 0 auto;
                                }
                    
                                .image_block img.big,
                                .row-content {
                                    width: 100% !important;
                                }
                    
                                .mobile_hide {
                                    display: none;
                                }
                    
                                .stack .column {
                                    width: 100%;
                                    display: block;
                                }
                    
                                .mobile_hide {
                                    min-height: 0;
                                    max-height: 0;
                                    max-width: 0;
                                    overflow: hidden;
                                    font-size: 0px;
                                }
                    
                                .desktop_hide,
                                .desktop_hide table {
                                    display: table !important;
                                    max-height: none !important;
                                }
                            }
                        </style>
                    </head>
                    
                    <body style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                        <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                        <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                            <tr>
                                                                                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                <div class="alignment" align="center" style="line-height:10px"><img class="big" src=${src2} style="display: block; height: auto; border: 0; width: 840px; max-width: 100%;" height=307 width="840"></div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                            <tr>
                                                                                <td class="pad" style="padding-bottom:35px;padding-left:45px;padding-right:45px;padding-top:15px;">
                                                                                    <div style="color:#101112;direction:ltr;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                                                                        <p style="margin: 0; margin-bottom: 16px;">Dear ${name},</p>
                                                                                        <p style="margin: 0; margin-bottom: 16px;">Every day, we at Nissan invest our best efforts to create innovation that Excites for our customers. This year, we're please to introduce innovation that creates efficient customer experiences too!</p>
                                                                                        <p style="margin: 0;">Please join us as we take Nissan service excellence to the next level!</p>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                            <tr>
                                                                                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                    <div class="alignment" align="center" style="line-height:10px"><a href="${urlname2}"><img class="big" src=${src5} style="display: block; height: auto; border: 0; width: 390px; max-width: 100%;" width="390"></a></div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                        <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                            <tr>
                                                                                <td class="pad">
                                                                                    <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                                        <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #000000; line-height: 1.2;">
                                                                                            <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px; line-height: 200%;"><strong>Date: </strong>25-26 January 2023<strong> | Time: </strong>9 AM - 4 PM<strong> | Venue: </strong>The Ritz-Carlton, Dubai <br> <br> <strong>Dinner Venue: </strong>Tamoka, The Ritz-Carlton, Dubai<strong> | Date: </strong>25 January 2023<strong> | Time: </strong>7 PM</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                            <tr>
                                                                                <td class="pad">
                                                                                    <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                                        <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #000000; line-height: 1.2;">
                                                                                            <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">We look forward to welcoming you.</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table class="text_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                            <tr>
                                                                                <td class="pad">
                                                                                    <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                                        <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #000000; line-height: 1.2;">
                                                                                            <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:14px;"><strong>Thierry Sabbagh</strong></span></p>
                                                                                            <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">President, Nissan Saudi Arabia, INFINITI Middle East</p>
                                                                                            <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">Managing Director, Nissan Middle East</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table class="text_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                            <tr>
                                                                                <td class="pad">
                                                                                    <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                                        <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #000000; line-height: 1.2;">
                                                                                            <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;"><strong>RSVP closes on 10 January 2023. (</strong></span><span style="font-size:12px;"><strong>Please note this invitation is strictly non-transferable.)</strong></span></p>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table class="divider_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                            <tr>
                                                                                <td class="pad">
                                                                                    <div class="alignment" align="center">
                                                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                            <tr>
                                                                                                <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span>&#8202;</span></td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding:30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                        <table class="button_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                            <tr style"padding:20px;">
                                                                                <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px; text-align:center;">
                                                                                    <div class="alignment style=" height:100%; width:100%;" align="center">
                                                                                        <a href=${url2}><img src=${src3} width=250 height=44 /></a>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                        <table class="button_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                            <tr>
                                                                                <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px; text-align:center;">
                                                                                    <div class="alignment" style="height:100%; width:100%;" align="center">
                                                                                    <a href=${url}><img src=${src4} width=250 height=44 /></a>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                        <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                            <tr>
                                                                                <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                        <tr>
                                                                                            <td class="alignment" style="vertical-align: middle; text-align: center;">
                                                                                                <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                                <!--[if !vml]><!-->
                                                                                                <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                    <!--<![endif]-->
                                                                                                    <tr>
                                                                                                        
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table><!-- End -->
                    </body>
                    
                    </html>
                    `
                }
                ).then(console.log)
                .catch(console.log)
            })


            
        })



    })

    


});

    
});




    //     await trans.sendMail({
    //         from: MAIL_FROM,
    //         to: `${to}`,
    //         subject: "Invitation",
    //         attachments: [{
    //             filename: 'image.png',
    //             path:  `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${urlname}`,
    //             cid: 'unique@nodemailer.com' //same cid value as in the html img src
    //         }],
    //         html: `<!DOCTYPE html>
    //         <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
            
    //         <head>
    //             <title></title>
    //             <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //             <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
    //             <!--[if !mso]><!-->
    //             <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
    //             <!--<![endif]-->
    //             <style>
    //                 * {
    //                     box-sizing: border-box;
    //                 }
            
    //                 body {
    //                     margin: 0;
    //                     padding: 0;
    //                 }
            
    //                 a[x-apple-data-detectors] {
    //                     color: inherit !important;
    //                     text-decoration: inherit !important;
    //                 }
            
    //                 #MessageViewBody a {
    //                     color: inherit;
    //                     text-decoration: none;
    //                 }
            
    //                 p {
    //                     line-height: inherit
    //                 }
            
    //                 .desktop_hide,
    //                 .desktop_hide table {
    //                     mso-hide: all;
    //                     display: none;
    //                     max-height: 0px;
    //                     overflow: hidden;
    //                 }
            
    //                 @media (max-width:620px) {
    //                     .desktop_hide table.icons-inner {
    //                         display: inline-block !important;
    //                     }
            
    //                     .icons-inner {
    //                         text-align: center;
    //                     }
            
    //                     .icons-inner td {
    //                         margin: 0 auto;
    //                     }
            
    //                     .image_block img.big,
    //                     .row-content {
    //                         width: 100% !important;
    //                     }
            
    //                     .mobile_hide {
    //                         display: none;
    //                     }
            
    //                     .stack .column {
    //                         width: 100%;
    //                         display: block;
    //                     }
            
    //                     .mobile_hide {
    //                         min-height: 0;
    //                         max-height: 0;
    //                         max-width: 0;
    //                         overflow: hidden;
    //                         font-size: 0px;
    //                     }
            
    //                     .desktop_hide,
    //                     .desktop_hide table {
    //                         display: table !important;
    //                         max-height: none !important;
    //                     }
    //                 }
    //             </style>
    //         </head>
            
    //         <body style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
    //             <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent;">
    //                 <tbody>
    //                     <tr>
    //                         <td>
    //                             <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                 <tbody>
    //                                     <tr>
    //                                         <td>
    //                                             <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
    //                                                 <tbody>
    //                                                     <tr>
    //                                                         <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                             <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                 <tr>
    //                                                                     <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
    //                                                                         <div class="alignment" align="center" style="line-height:10px"><img class="big" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/914968_899312/coverrr.png" style="display: block; height: auto; border: 0; width: 600px; max-width: 100%;" width="600"></div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                             <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
    //                                                                 <tr>
    //                                                                     <td class="pad" style="padding-bottom:35px;padding-left:45px;padding-right:45px;padding-top:15px;">
    //                                                                         <div style="color:#101112;direction:ltr;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
    //                                                                             <p style="margin: 0; margin-bottom: 16px;">Dear ${name},</p>
    //                                                                             <p style="margin: 0; margin-bottom: 16px;">Every day Nissan dedicates itself to the sole purpose of creating Innovation that Excites. This year we're excited to introduce Innovation that creates efficient customer experiences.&nbsp;</p>
    //                                                                             <p style="margin: 0;">Please join us as we take Nissan service excellence to the next level! We have allocated a virtual vehicle to you to ensure that you have the best experience of what the future has in store.</p>
    //                                                                         </div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                         </td>
    //                                                     </tr>
    //                                                 </tbody>
    //                                             </table>
    //                                         </td>
    //                                     </tr>
    //                                 </tbody>
    //                             </table>
    //                             <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                 <tbody>
    //                                     <tr>
    //                                         <td>
    //                                             <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
    //                                                 <tbody>
    //                                                     <tr>
    //                                                         <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                             <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
    //                                                                 <tr>
    //                                                                     <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
    //                                                                         <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
    //                                                                             <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
    //                                                                                 <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Date: 25-26 January 2022</span></p>
    //                                                                                 <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Conference: 10 AM - 4 PM</span></p>
    //                                                                                 <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Venue: The Ritz-Carlton, Dubai&nbsp;</span></p>
    //                                                                             </div>
    //                                                                         </div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                             <table class="divider_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                 <tr>
    //                                                                     <td class="pad">
    //                                                                         <div class="alignment" align="center">
    //                                                                             <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                                 <tr>
    //                                                                                     <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span>&#8202;</span></td>
    //                                                                                 </tr>
    //                                                                             </table>
    //                                                                         </div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                             <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
    //                                                                 <tr>
    //                                                                     <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
    //                                                                         <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
    //                                                                             <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
    //                                                                                 <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Dinner Venue: Tamoka, The Ritz-Carlton, Dubai</span></p>
    //                                                                                 <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Date: 25 January 2022</span></p>
    //                                                                                 <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Time: 7 PM - 9 PM</span></p>
    //                                                                                 <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">&nbsp;</p>
    //                                                                             </div>
    //                                                                         </div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                         </td>
    //                                                         <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                             <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                 <tr>
    //                                                                     <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:5px;">
    //                                                                         <div class="alignment" align="center" style="line-height:10px"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/914968_899312/qr.png" style="display: block; height: auto; border: 0; width: 90px; max-width: 100%;" width="90" alt="I'm an image" title="I'm an image"></div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                             <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
    //                                                                 <tr>
    //                                                                     <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
    //                                                                         <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
    //                                                                             <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
    //                                                                                 <p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:12px;">Scan the QR code with your phone to unlock your personal invitation.</span></p>
    //                                                                             </div>
    //                                                                         </div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                         </td>
    //                                                     </tr>
    //                                                 </tbody>
    //                                             </table>
    //                                         </td>
    //                                     </tr>
    //                                 </tbody>
    //                             </table>
    //                             <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                 <tbody>
    //                                     <tr>
    //                                         <td>
    //                                             <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
    //                                                 <tbody>
    //                                                     <tr>
    //                                                         <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                             <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
    //                                                                 <tr>
    //                                                                     <td class="pad">
    //                                                                         <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
    //                                                                             <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #000000; line-height: 1.2;">
    //                                                                                 <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;"><strong>RSVP closes on 00 Month 2022. We look forward to welcoming you.</strong></span></p>
    //                                                                                 <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;"><strong>Please note this invitation is strictly non-transferable.</strong></span></p>
    //                                                                             </div>
    //                                                                         </div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                             <table class="divider_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                 <tr>
    //                                                                     <td class="pad">
    //                                                                         <div class="alignment" align="center">
    //                                                                             <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                                 <tr>
    //                                                                                     <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span>&#8202;</span></td>
    //                                                                                 </tr>
    //                                                                             </table>
    //                                                                         </div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                         </td>
    //                                                     </tr>
    //                                                 </tbody>
    //                                             </table>
    //                                         </td>
    //                                     </tr>
    //                                 </tbody>
    //                             </table>
    //                             <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                 <tbody>
    //                                     <tr>
    //                                         <td>
    //                                             <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
    //                                                 <tbody>
    //                                                     <tr>
    //                                                         <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                             <table class="button_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                 <tr>
    //                                                                     <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
    //                                                                         <div class="alignment" align="center">
    //                                                                             <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="fb.com" style="height:38px;width:253px;v-text-anchor:middle;" arcsize="11%" stroke="false" fillcolor="#000000"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:14px"><![endif]--><a href="${url2}" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#000000;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:14px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:50px;padding-right:50px;font-size:14px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="margin: 0; word-break: break-word; line-height: 28px;">I will not be attending</span></span></a>
    //                                                                             <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
    //                                                                         </div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                         </td>
    //                                                         <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                             <table class="button_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                 <tr>
    //                                                                     <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
    //                                                                         <div class="alignment" align="center">
    //                                                                             <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="in.com" style="height:38px;width:246px;v-text-anchor:middle;" arcsize="11%" stroke="false" fillcolor="#000000"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:14px"><![endif]--><a href="${url}" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#000000;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:14px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:60px;padding-right:60px;font-size:14px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="margin: 0; word-break: break-word; line-height: 28px;">I will be attending</span></span></a>
    //                                                                             <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
    //                                                                         </div>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                         </td>
    //                                                     </tr>
    //                                                 </tbody>
    //                                             </table>
    //                                         </td>
    //                                     </tr>
    //                                 </tbody>
    //                             </table>
    //                             <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                 <tbody>
    //                                     <tr>
    //                                         <td>
    //                                             <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
    //                                                 <tbody>
    //                                                     <tr>
    //                                                         <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                             <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                 <tr>
    //                                                                     <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
    //                                                                         <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                             <tr>
    //                                                                                 <td class="alignment" style="vertical-align: middle; text-align: center;">
    //                                                                                     <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
    //                                                                                     <!--[if !vml]><!-->
    //                                                                                     <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation">
    //                                                                                         <!--<![endif]-->
    //                                                                                     </table>
    //                                                                                 </td>
    //                                                                             </tr>
    //                                                                         </table>
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             </table>
    //                                                         </td>
    //                                                     </tr>
    //                                                 </tbody>
    //                                             </table>
    //                                         </td>
    //                                     </tr>
    //                                 </tbody>
    //                             </table>
    //                         </td>
    //                     </tr>
    //                 </tbody>
    //             </table><!-- End -->
    //         </body>
            
    //         </html>`
    //     //     // attachments: [{
    //     //     //     filename: 'image.png',
    //     //     //     path:  `${qr}`,
    //     //     //     cid: 'unique@nodemailer.com' //same cid value as in the html img src
    //     //     // }],
    //     // //     html: `<div className="email" style="
    //     // //     border: 1px solid black;
    //     // //     padding: 20px;
    //     // //     font-family: sans-serif;
    //     // //     line-height: 2;
    //     // //     font-size: 20px; 
    //     // //     ">
    //     // //     <h2>Here is your QR Code: -</h2>
    //     // //     <p></p>
    
    //     // //     <img src="cid:unique@nodemailer.com" height="300" width="300" alt="Red dot"/>
        
    //     // //     <p>Enjoy!</p>
    //     // //      </div>
    //     // // `
       
    //     // })

    // });

    res.send({status:200});

    


})

})

app.post("/send_all",cors(),async (req,res)=>{
    let { to, id, name } = req.body
    
    const trans = nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
        },
        tls: {
            secureProtocol: "TLSv1_method"
        }

    })

   



    var url2 = `http://localhost:3000/Success/${id}`;
    var url = `http://localhost:3000/Registration/${id}`;
    var urlname = `https://rsvpadmin.vercel.app/video/${name}`;
    console.log(urlname)

    await trans.sendMail({
        from: MAIL_FROM,
        to: `${to}`,
        subject: "Invitation",
        attachments: [{
            filename: 'image.png',
            path:  `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${urlname}`,
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }],
        html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        
        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
            <!--[if !mso]><!-->
            <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
            <!--<![endif]-->
            <style>
                * {
                    box-sizing: border-box;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                }
        
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: inherit !important;
                }
        
                #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                }
        
                p {
                    line-height: inherit
                }
        
                .desktop_hide,
                .desktop_hide table {
                    mso-hide: all;
                    display: none;
                    max-height: 0px;
                    overflow: hidden;
                }
        
                @media (max-width:620px) {
                    .desktop_hide table.icons-inner {
                        display: inline-block !important;
                    }
        
                    .icons-inner {
                        text-align: center;
                    }
        
                    .icons-inner td {
                        margin: 0 auto;
                    }
        
                    .image_block img.big,
                    .row-content {
                        width: 100% !important;
                    }
        
                    .mobile_hide {
                        display: none;
                    }
        
                    .stack .column {
                        width: 100%;
                        display: block;
                    }
        
                    .mobile_hide {
                        min-height: 0;
                        max-height: 0;
                        max-width: 0;
                        overflow: hidden;
                        font-size: 0px;
                    }
        
                    .desktop_hide,
                    .desktop_hide table {
                        display: table !important;
                        max-height: none !important;
                    }
                }
            </style>
        </head>
        
        <body style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent;">
                <tbody>
                    <tr>
                        <td>
                            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                        <div class="alignment" align="center" style="line-height:10px"><img class="big" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/914968_899312/coverrr.png" style="display: block; height: auto; border: 0; width: 600px; max-width: 100%;" width="600"></div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad" style="padding-bottom:35px;padding-left:45px;padding-right:45px;padding-top:15px;">
                                                                        <div style="color:#101112;direction:ltr;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                                                            <p style="margin: 0; margin-bottom: 16px;">Dear ${name},</p>
                                                                            <p style="margin: 0; margin-bottom: 16px;">Every day Nissan dedicates itself to the sole purpose of creating Innovation that Excites. This year we're excited to introduce Innovation that creates efficient customer experiences.&nbsp;</p>
                                                                            <p style="margin: 0;">Please join us as we take Nissan service excellence to the next level! We have allocated a virtual vehicle to you to ensure that you have the best experience of what the future has in store.</p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                                        <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                            <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                                                                <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Date: 25-26 January 2022</span></p>
                                                                                <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Conference: 9 AM - 4 PM</span></p>
                                                                                <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Venue: The Ritz-Carlton, Dubai&nbsp;</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="divider_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div class="alignment" align="center">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                <tr>
                                                                                    <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span>&#8202;</span></td>
                                                                                </tr>
                                                                            </table>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                                                        <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                            <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                                                                <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Dinner Venue: Tamoka, The Ritz-Carlton, Dubai</span></p>
                                                                                <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Date: 25 January 2022</span></p>
                                                                                <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;">Time: 7 PM - 9 PM</span></p>
                                                                                <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">&nbsp;</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                        <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:5px;">
                                                                        <div class="alignment" align="center" style="line-height:10px"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/914968_899312/qr.png" style="display: block; height: auto; border: 0; width: 90px; max-width: 100%;" width="90" alt="I'm an image" title="I'm an image"></div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                                                        <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                            <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                                                                <p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:12px;">Scan the QR code with your phone to unlock your personal invitation.</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                            <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #000000; line-height: 1.2;">
                                                                                <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;"><strong>RSVP closes on 00 Month 2022. We look forward to welcoming you.</strong></span></p>
                                                                                <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:12px;"><strong>Please note this invitation is strictly non-transferable.</strong></span></p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="divider_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div class="alignment" align="center">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                <tr>
                                                                                    <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span>&#8202;</span></td>
                                                                                </tr>
                                                                            </table>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="button_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
                                                                        <div class="alignment" align="center">
                                                                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="fb.com" style="height:38px;width:253px;v-text-anchor:middle;" arcsize="11%" stroke="false" fillcolor="#000000"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:14px"><![endif]--><a href="${url2}" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#000000;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:14px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:50px;padding-right:50px;font-size:14px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="margin: 0; word-break: break-word; line-height: 28px;">I will not be attending</span></span></a>
                                                                            <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                        <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="button_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
                                                                        <div class="alignment" align="center">
                                                                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="in.com" style="height:38px;width:246px;v-text-anchor:middle;" arcsize="11%" stroke="false" fillcolor="#000000"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:14px"><![endif]--><a href="${url}" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#000000;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:14px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:60px;padding-right:60px;font-size:14px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="margin: 0; word-break: break-word; line-height: 28px;">I will be attending</span></span></a>
                                                                            <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                            <tr>
                                                                                <td class="alignment" style="vertical-align: middle; text-align: center;">
                                                                                    <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                    <!--[if !vml]><!-->
                                                                                    <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation">
                                                                                        <!--<![endif]-->
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table><!-- End -->
        </body>
        
        </html>`

    
    })

})
https://firebasestorage.googleapis.com/v0/b/assetuploadformbuilder.appspot.com/o/images%2Ffood%20icon.png?alt=media&token=9eb30af2-02b4-47c2-a433-57836c08b85c
app.post("/send_confirmation",cors(),async (req,res)=>{
    let { id, firstname, surname, city, opdiv, jobtitle, email, mob, gender, smoking, preferences, dietreq, physcon } = req.body
    
    const trans = nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
        },
        tls: {
            secureProtocol: "TLSv1_method"
        }

    })

   



    // var url2 = `http://localhost:3000/Success/${id}`;
    // var url = `http://localhost:3000/Registration/${id}`;
    // var urlname = `https://rsvpadmin.vercel.app/video/${name}`;


        const client = Sib.ApiClient.instance
    
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.API_KEY
    
    const sender = {
        email: 'rsvp@thehanginghouse.com',
        name: 'Nissan Aftersales Conference',
        // name: 'Anjan Shomodder',
    }
    
    const recivers = [
        {
            email: email,         
        },
    ]
    
    const transactionalEmailApi = new Sib.TransactionalEmailsApi()

    loadBase64Image('https://firebasestorage.googleapis.com/v0/b/assetuploadformbuilder.appspot.com/o/images%2Fadiemails.png?alt=media&token=58332cd6-b7fb-4703-879d-98dcdf475714', function (image, prefix) {
        var src = prefix + image;
        loadBase64Image('https://firebasestorage.googleapis.com/v0/b/video-a9a2d.appspot.com/o/Location%406x-100.jpg?alt=media&token=2f59e371-8c3e-49c2-a287-84bba806af59', function (image, prefix) {

            
            var src2 = prefix + image;
            loadBase64Image('https://firebasestorage.googleapis.com/v0/b/video-a9a2d.appspot.com/o/food%406x-100.jpg?alt=media&token=bc31a4a6-1d35-4f0b-8044-6208a8f2af32', function (image, prefix) {
                var src3 = prefix + image;

                transactionalEmailApi
            .sendTransacEmail({
                subject: 'Nissan Aftersales Conference Registration Confirmation Email',
                sender,
                to: recivers,
                // textContent: `Cules Coding will teach you how to become a {{params.role}} developer.`,
                htmlContent: `<!DOCTYPE html>
                <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
                
                <head>
                    <title></title>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
                    <!--[if !mso]><!-->
                    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
                    <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css">
                    <!--<![endif]-->
                    <style>
                        * {
                            box-sizing: border-box;
                        }
                
                        body {
                            margin: 0;
                            padding: 0;
                        }
                
                        a[x-apple-data-detectors] {
                            color: inherit !important;
                            text-decoration: inherit !important;
                        }
                
                        #MessageViewBody a {
                            color: inherit;
                            text-decoration: none;
                        }
                
                        p {
                            line-height: inherit
                        }
                
                        .desktop_hide,
                        .desktop_hide table {
                            mso-hide: all;
                            display: none;
                            max-height: 0px;
                            overflow: hidden;
                        }
                
                        @media (max-width:620px) {
                
                            .desktop_hide table.icons-inner,
                            .row-4 .column-1 .block-2.image_block img,
                            .row-5 .column-1 .block-2.image_block img {
                                display: inline-block !important;
                            }
                
                            .icons-inner {
                                text-align: center;
                            }
                
                            .icons-inner td {
                                margin: 0 auto;
                            }
                
                            .image_block img.big,
                            .row-content {
                                width: 100% !important;
                            }
                
                            .mobile_hide {
                                display: none;
                            }
                
                            .stack .column {
                                width: 100%;
                                display: block;
                            }
                
                            .mobile_hide {
                                min-height: 0;
                                max-height: 0;
                                max-width: 0;
                                overflow: hidden;
                                font-size: 0px;
                            }
                
                            .desktop_hide,
                            .desktop_hide table {
                                display: table !important;
                                max-height: none !important;
                            }
                
                            .row-4 .column-1 .block-2.image_block td.pad,
                            .row-5 .column-1 .block-2.image_block td.pad {
                                padding: 0 !important;
                            }
                
                            .row-4 .column-1 .block-2.image_block .alignment,
                            .row-5 .column-1 .block-2.image_block .alignment {
                                text-align: center !important;
                            }
                        }
                    </style>
                </head>
                
                <body style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                    <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;">
                        <tbody>
                            <tr>
                                <td>
                                    <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                        <tbody>
                                                            <tr>
                                                                <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                    <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                <div class="alignment" align="center" style="line-height:10px"><img class="big" src=${src}  style="display: block; height: auto; border: 0; width: 840px; max-width: 100%;" height=307 width="840"></div>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                        <tr>
                                                                            <td class="pad" style="padding-bottom:5px;padding-left:45px;padding-right:45px;padding-top:40px;">
                                                                                <div style="color:#101112;direction:ltr;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                                                                    <p style="margin: 0;">Thank You for your information</p>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                        <tbody>
                                                            <tr>
                                                                <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                    <table class="text_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                        <tr>
                                                                            <td class="pad">
                                                                                <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                                    <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #000000; line-height: 1.2;">
                                                                                        <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><strong>Summary:</strong></p>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-right: 0px; border-left:0px; border-top:0px; border-bottom:0px;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-right: 0px; color: #000000; width: 600px;" width="600">
                                                    <tbody>
                                                        <tr>
                                                            <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px solid; border-bottom: 0px; border-left: 0px;">
                                                                <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                    <tr>
                                                                        <td class="pad" style="padding-top:5px;padding-bottom:5px;">
                                                                            <div style="color:#101112;direction:ltr;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                                                                <p style="margin: 0; margin-bottom: 5px;">Firstname:  ${firstname}</p>
                                                                                <p style="margin: 0; margin-bottom: 5px;">Surname:  ${surname}</p>
                                                                                <p style="margin: 0; margin-bottom: 5px;">City:  ${city}</p>
                                                                                <p style="margin: 0; margin-bottom: 5px;">Company Name:  ${opdiv}</p>
                                                                                <p style="margin: 0; margin-bottom: 5px;">Job Title:  ${jobtitle}</p>
                                                                                <p style="margin: 0; margin-bottom: 5px;">Email:  ${email}</p>
                                                                                <p style="margin: 0;">Mobile: ${mob}</p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                    <tr>
                                                                        <td class="pad" style="padding-bottom:30px;padding-top:30px;">
                                                                            <div style="color:#101112;direction:ltr;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                                                                <p style="margin: 0; margin-bottom: 16px;">Gender: ${gender}</p>
                                                                                <p style="margin: 0; margin-bottom: 16px;">Allergy: ${physcon} </p>
                                                                                <p style="margin: 0;">Dietery Requirments: ${preferences}</p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                    <table class="row row-4" align="center" width="100%" border=0 cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-right: 0px;">
                                        <tbody border=0  style="border-right: 0px;">
                                            <tr border=0  style="border-right: 0px;">
                                                <td border=0  style="border-right: 0px;">
                                                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-right: 0px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                        <tbody style="border-right: 0px;">
                                                            <tr  border=0  style="border-right: 0px;">
                                                                <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                    <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td class="pad" style="padding-left:60px;width:100%;padding-right:0px;padding-top:10px;">
                                                                                <div class="alignment" align="right" style=""><img src= ${src2} style="display: block; height: auto; border: 0; width: 40px; max-width: 100%; margin-right: 5px;" height="25" width="25" alt="I'm an image" title="I'm an image"> </div>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <td class="column column-2" width="66.66666666666667%" style="padding-top:15px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                    <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                        <tr>
                                                                            <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                                                <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                                    <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                                                                    <a href="https://www.google.com/maps/place/The+Ritz-Carlton,+Dubai/@25.0825342,55.1356567,17z/data=!3m1!4b1!4m8!3m7!1s0x3e5f14acada23f6f:0xd4a2ba61b2a78f79!5m2!4m1!1i2!8m2!3d25.0825342!4d55.1378454" style="margin: 0; color:black; text-decoration: none; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><strong><u>Click here for the direction to the venue</u></strong></a>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table  border="0" class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                        <tbody>
                                                            <tr>
                                                                <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                    <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td class="pad" style="padding-left:60px;width:100%;padding-right:0px;padding-top:10px;">
                                                                                <div class="alignment" align="right" style="line-height:10px"><img src= ${src3} style="display: block; height: auto; border: 0; width: 40px; max-width: 100%;" height="25" width="25" alt="I'm an image" title="I'm an image"></div>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <td class="column column-2" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                    <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                        <tr>
                                                                            <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                                                <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                                                    <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                                                                    <a href="https://goo.gl/maps/QoNMCdwoVLiyaaeN8" style="margin: 0; color:black; text-decoration: none; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><strong><u>Click here for the direction to the dinner venue</u></strong></a>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                        <tbody>
                                                            <tr>
                                                                <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                    <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                    <tr>
                                                                                        <td class="alignment" style="vertical-align: middle; text-align: center;">
                                                                                            <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                            <!--[if !vml]><!-->
                                                                                            <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                <!--<![endif]-->
                                                                                                <tr>
                                                                                                    
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table><!-- End -->
                </body>
                
                </html>
                `
            }
            )
            .then(console.log)
            .catch(console.log)
            })

            
});
});
    


        res.send({status:200})

    // await trans.sendMail({
    //     from: MAIL_FROM,
    //     to: `${to}`,
    //     subject: "Invitation",
    //     attachments: [{
    //         filename: 'image.png',
    //         path:  `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${urlname}`,
    //         cid: 'unique@nodemailer.com' //same cid value as in the html img src
    //     }],
    //     html: `<!DOCTYPE html>
    //     <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        
    //     <head>
    //         <title></title>
    //         <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
    //         <!--[if !mso]><!-->
    //         <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
    //         <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css">
    //         <!--<![endif]-->
    //         <style>
    //             * {
    //                 box-sizing: border-box;
    //             }
        
    //             body {
    //                 margin: 0;
    //                 padding: 0;
    //             }
        
    //             a[x-apple-data-detectors] {
    //                 color: inherit !important;
    //                 text-decoration: inherit !important;
    //             }
        
    //             #MessageViewBody a {
    //                 color: inherit;
    //                 text-decoration: none;
    //             }
        
    //             p {
    //                 line-height: inherit
    //             }
        
    //             .desktop_hide,
    //             .desktop_hide table {
    //                 mso-hide: all;
    //                 display: none;
    //                 max-height: 0px;
    //                 overflow: hidden;
    //             }
        
    //             @media (max-width:620px) {
    //                 .desktop_hide table.icons-inner {
    //                     display: inline-block !important;
    //                 }
        
    //                 .icons-inner {
    //                     text-align: center;
    //                 }
        
    //                 .icons-inner td {
    //                     margin: 0 auto;
    //                 }
        
    //                 .image_block img.big,
    //                 .row-content {
    //                     width: 100% !important;
    //                 }
        
    //                 .mobile_hide {
    //                     display: none;
    //                 }
        
    //                 .stack .column {
    //                     width: 100%;
    //                     display: block;
    //                 }
        
    //                 .mobile_hide {
    //                     min-height: 0;
    //                     max-height: 0;
    //                     max-width: 0;
    //                     overflow: hidden;
    //                     font-size: 0px;
    //                 }
        
    //                 .desktop_hide,
    //                 .desktop_hide table {
    //                     display: table !important;
    //                     max-height: none !important;
    //                 }
    //             }
    //         </style>
    //     </head>
        
    //     <body style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
    //         <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;">
    //             <tbody>
    //                 <tr>
    //                     <td>
    //                         <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                             <tbody>
    //                                 <tr>
    //                                     <td>
    //                                         <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
    //                                             <tbody>
    //                                                 <tr>
    //                                                     <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                         <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                             <tr>
    //                                                                 <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
    //                                                                     <div class="alignment" align="center" style="line-height:10px"><img class="big" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/914968_899312/coverrr.png" style="display: block; height: auto; border: 0; width: 600px; max-width: 100%;" width="600"></div>
    //                                                                 </td>
    //                                                             </tr>
    //                                                         </table>
    //                                                         <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
    //                                                             <tr>
    //                                                                 <td class="pad" style="padding-bottom:5px;padding-left:45px;padding-right:45px;padding-top:40px;">
    //                                                                     <div style="color:#101112;direction:ltr;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
    //                                                                         <p style="margin: 0;">Thank You for your information</p>
    //                                                                     </div>
    //                                                                 </td>
    //                                                             </tr>
    //                                                         </table>
    //                                                     </td>
    //                                                 </tr>
    //                                             </tbody>
    //                                         </table>
    //                                     </td>
    //                                 </tr>
    //                             </tbody>
    //                         </table>
    //                         <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                             <tbody>
    //                                 <tr>
    //                                     <td>
    //                                         <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
    //                                             <tbody>
    //                                                 <tr>
    //                                                     <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                         <table class="text_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
    //                                                             <tr>
    //                                                                 <td class="pad">
    //                                                                     <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
    //                                                                         <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #000000; line-height: 1.2;">
    //                                                                             <p style="margin: 0; text-align: center; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><strong>Summary:</strong></p>
    //                                                                         </div>
    //                                                                     </div>
    //                                                                 </td>
    //                                                             </tr>
    //                                                         </table>
    //                                                     </td>
    //                                                 </tr>
    //                                             </tbody>
    //                                         </table>
    //                                     </td>
    //                                 </tr>
    //                             </tbody>
    //                         </table>
    //                         <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                             <tbody>
    //                                 <tr>
    //                                     <td>
    //                                         <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; border-right: 0px solid #190A0A; width: 600px;" width="600">
    //                                             <tbody>
    //                                                 <tr>
    //                                                     <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                         <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
    //                                                             <tr>
    //                                                                 <td class="pad" style="padding-top:5px;padding-bottom:5px;">
    //                                                                     <div style="color:#101112;font-size:12px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:14.399999999999999px;">
    //                                                                         <p style="margin: 0; margin-bottom: 5px;">Husam</p>
    //                                                                         <p style="margin: 0; margin-bottom: 5px;">Haris</p>
    //                                                                         <p style="margin: 0; margin-bottom: 5px;">Dubai</p>
    //                                                                         <p style="margin: 0; margin-bottom: 5px;">NSC</p>
    //                                                                         <p style="margin: 0; margin-bottom: 5px;">Chief Operating Officer</p>
    //                                                                         <p style="margin: 0; margin-bottom: 5px;">husam@thehanginghouse.com</p>
    //                                                                         <p style="margin: 0;">+971</p>
    //                                                                     </div>
    //                                                                 </td>
    //                                                             </tr>
    //                                                         </table>
    //                                                     </td>
    //                                                     <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                         <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
    //                                                             <tr>
    //                                                                 <td class="pad" style="padding-top:30px;padding-bottom:30px;">
    //                                                                     <div style="color:#101112;font-size:12px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:14.399999999999999px;">
    //                                                                         <p style="margin: 0; margin-bottom: 16px;">Male</p>
    //                                                                         <p style="margin: 0; margin-bottom: 16px;">Vegan</p>
    //                                                                         <p style="margin: 0;">No Allergy</p>
    //                                                                     </div>
    //                                                                 </td>
    //                                                             </tr>
    //                                                         </table>
    //                                                     </td>
    //                                                 </tr>
    //                                             </tbody>
    //                                         </table>
    //                                     </td>
    //                                 </tr>
    //                             </tbody>
    //                         </table>
    //                         <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                             <tbody>
    //                                 <tr>
    //                                     <td>
    //                                         <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
    //                                             <tbody>
    //                                                 <tr>
    //                                                     <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                         <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                             <tr>
    //                                                                 <td class="pad" style="width:100%;padding-left:60px;padding-right:0px;padding-top:5px;padding-bottom:5px;">
    //                                                                     <div class="alignment" align="center" style="line-height:10px"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/914968_899312/loco.png" style="display: block; height: auto; border: 0; width: 60px; max-width: 100%;" width="60" alt="I'm an image" title="I'm an image"></div>
    //                                                                 </td>
    //                                                             </tr>
    //                                                         </table>
    //                                                     </td>
    //                                                     <td class="column column-2" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                         <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
    //                                                             <tr>
    //                                                                 <td class="pad" style="padding-top:15px;padding-right:10px;padding-bottom:15px;padding-left:10px;">
    //                                                                     <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
    //                                                                         <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
    //                                                                             <p style="margin: 0; font-size: 12px; text-align: left; mso-line-height-alt: 14.399999999999999px;"><strong><u>Click here for the direction to the venue</u></strong></p>
    //                                                                         </div>
    //                                                                     </div>
    //                                                                 </td>
    //                                                             </tr>
    //                                                         </table>
    //                                                     </td>
    //                                                 </tr>
    //                                             </tbody>
    //                                         </table>
    //                                     </td>
    //                                 </tr>
    //                             </tbody>
    //                         </table>
    //                         <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                             <tbody>
    //                                 <tr>
    //                                     <td>
    //                                         <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
    //                                             <tbody>
    //                                                 <tr>
    //                                                     <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
    //                                                         <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                             <tr>
    //                                                                 <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
    //                                                                     <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    //                                                                         <tr>
    //                                                                             <td class="alignment" style="vertical-align: middle; text-align: center;">
    //                                                                                 <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
    //                                                                                 <!--[if !vml]><!-->
    //                                                                                 <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation">
    //                                                                                     <!--<![endif]-->
    //                                                                                     <tr>
    //                                                                                         <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="https://www.designedwithbee.com/?utm_source=editor&utm_medium=bee_pro&utm_campaign=free_footer_link" target="_blank" style="text-decoration: none;"><img class="icon" alt="Designed with BEE" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/53601_510656/Signature/bee.png" height="32" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
    //                                                                                         <td style="font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="https://www.designedwithbee.com/?utm_source=editor&utm_medium=bee_pro&utm_campaign=free_footer_link" target="_blank" style="color: #9d9d9d; text-decoration: none;">Designed with BEE</a></td>
    //                                                                                     </tr>
    //                                                                                 </table>
    //                                                                             </td>
    //                                                                         </tr>
    //                                                                     </table>
    //                                                                 </td>
    //                                                             </tr>
    //                                                         </table>
    //                                                     </td>
    //                                                 </tr>
    //                                             </tbody>
    //                                         </table>
    //                                     </td>
    //                                 </tr>
    //                             </tbody>
    //                         </table>
    //                     </td>
    //                 </tr>
    //             </tbody>
    //         </table><!-- End -->
    //     </body>
        
    //     </html>`

    
    // })

})

app.post("/send_thankyou",cors(),async (req,res)=>{
    let { to, id, name } = req.body
    
    const trans = nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
        },
        tls: {
            secureProtocol: "TLSv1_method"
        }

    })

   



    var url2 = `http://localhost:3000/Success/${id}`;
    var url = `http://localhost:3000/Registration/${id}`;
    var urlname = `https://rsvpadmin.vercel.app/video/${name}`;
    console.log(urlname)

    await trans.sendMail({
        from: MAIL_FROM,
        to: `${to}`,
        subject: "Invitation",
        attachments: [{
            filename: 'image.png',
            path:  `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${urlname}`,
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }],
        html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        
        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
            <!--[if !mso]><!-->
            <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
            <!--<![endif]-->
            <style>
                * {
                    box-sizing: border-box;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                }
        
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: inherit !important;
                }
        
                #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                }
        
                p {
                    line-height: inherit
                }
        
                .desktop_hide,
                .desktop_hide table {
                    mso-hide: all;
                    display: none;
                    max-height: 0px;
                    overflow: hidden;
                }
        
                @media (max-width:620px) {
                    .desktop_hide table.icons-inner {
                        display: inline-block !important;
                    }
        
                    .icons-inner {
                        text-align: center;
                    }
        
                    .icons-inner td {
                        margin: 0 auto;
                    }
        
                    .image_block img.big,
                    .row-content {
                        width: 100% !important;
                    }
        
                    .mobile_hide {
                        display: none;
                    }
        
                    .stack .column {
                        width: 100%;
                        display: block;
                    }
        
                    .mobile_hide {
                        min-height: 0;
                        max-height: 0;
                        max-width: 0;
                        overflow: hidden;
                        font-size: 0px;
                    }
        
                    .desktop_hide,
                    .desktop_hide table {
                        display: table !important;
                        max-height: none !important;
                    }
                }
            </style>
        </head>
        
        <body style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent;">
                <tbody>
                    <tr>
                        <td>
                            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                        <div class="alignment" align="center" style="line-height:10px"><img class="big" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/914968_899312/coverrr.png" style="display: block; height: auto; border: 0; width: 600px; max-width: 100%;" width="600"></div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad" style="padding-bottom:35px;padding-left:45px;padding-right:45px;padding-top:15px;">
                                                                        <div style="color:#101112;direction:ltr;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                                                            <p style="margin: 0; margin-bottom: 16px;">Hi, ${name},</p>
                                                                            <p style="margin: 0; margin-bottom: 16px;">Thank you for attending the Nissan Aftersales Conference.</p>
                                                                            <p style="margin: 0; margin-bottom: 16px;">We are excited to drive things forward with our Intelligent Services.</p>
                                                                            <p style="margin: 0; margin-bottom: 16px;">With your expertise, and the latest innovations, let’s make the future happen today and together.</p>
                                                                            <p style="margin: 0; margin-bottom: 16px;">Please stay tuned for the service rollout and other news.</p>
                                                                            <p style="margin: 0; margin-bottom: 16px;">Thank you.</p>
                                                                            <p style="margin: 0;"><strong>Nissan Aftersales Conference team.</strong></p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table><!-- End -->
        </body>
        
        </html>`

    
    })

})



app.put('/user_update', async (req,res) => {

    let {user_id, status} = req.body;
    await User.findOneAndUpdate({ _id: user_id }, { Status: status });
})

// app.listen((process.env.PORT || 4000, () =>{
//     console.log("Server is listening to port 4000")
// }))

app.get('/user_accepted', (req,res) =>{
 User.find({Status: "Accepted"}).then(user => {
    res.json(user)
   })
})

app.get('/user_rejected', (req,res) =>{
    User.find({Status: 'Rejected'}).then(user => {
        console.log(user)
        res.json(user)
       })
})

app.get('/user_na', (req,res) => {
    User.find({Status: "NA"}).then(user => {
        res.json(user)
       })
})

app.get('/user_attended', (req,res) => {
    User.find({Status: "Attended"}).then(user => {
        res.json(user)
       })
})

app.get('/user_all', (req,res) => {
    User.find({}).then(user => {
        res.json(user)
       })
})

app.get('/user_one/:id', (req,res) => {
    var ObjectId = require('mongodb').ObjectId;
    User.find({"_id": ObjectId(req.params.id) }).then(user => {
        res.json(user)
       })
})


app.put('/register_update', async (req,res) => {

    let { id, firstname, surname, city, opdiv, jobtitle, email, mob, gender, smoking, preferences, dietreq, physcon} = req.body;
    await User.findOneAndUpdate({ _id: id }, { firstname: firstname, surname: surname, city: city, opdiv: opdiv, jobtitle: jobtitle, email:email, mob:mob, gender:gender, smoking:smoking, preferences: preferences, dietreq: dietreq, physcon: physcon });

    res.send({status:200});
})

var PORT = process.env.PORT || 4000;
 
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})


