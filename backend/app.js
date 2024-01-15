const nodemailer = require("nodemailer")
const path = require('path')

var mongoVar = require("./variables");
var MongoClient = require('mongodb').MongoClient;
var database = null;
var myMongoClient = null; 
var standardConnectionString ="mongodb://localhost:27017"
//var standardConnectionString = "mongodb://admin:M%40CAutomation1@127.0.0.1:27017/"
myMongoClient = new MongoClient(standardConnectionString, { useNewUrlParser: true, socketTimeoutMS: 1000 })
var theTagData = {};
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")
const express = require("express");
const signer = "This is the token signer string that i have decided to use and it is really long"
var queryData = {}
var lockRead = false

 
usercollection = "HawkEyeUsers"
pagecollection = "HawkEyePages"



class QueryData
{
    Users = []
    UserPages = []
    Drivers = []
    CloudWorks = []
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



var confirmUser = (req, res, next) => 
{

    console.log("Here")
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token,signer)
        next()
    }
    catch(err)
    {
        res.status(401).json({result:"Auth Failed!"})
    }
}

app.use((req,res,next) => {

    GetDB()

    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With,Content-Type,Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,OPTIONS");
    next();
});



app.post('/api/login' ,Login)
async function Login(req, res, next)
{  
    console.log("Find me")
    
    var output = "";
    var post = req.body

    switch(post.requesttype)
    {
        
        case ("user login"):
        {
            console.log(post.userdata.email + " Login Request!")
            var email = post.userdata.email
            var password = post.userdata.password

            if(email && password)
            {
                var userEntry = await GetSecureUserEntry(email,password)
    
                output = {}
                var status = 200

                if(userEntry != null)
                {
                    const token = jwt.sign({email:userEntry.email, userid: userEntry.userid},signer,{expiresIn:"12h"})
                    output = { result: "User Logged In!", token:token, validperiod:43200000} 

                    var siteread = {}
                    
                    if(!userEntry.developer && !userEntry.admin)
                    {
                        siteread["pages"] = GetUserPages(userEntry)
                    }
                    else
                        siteread["pages"] = GetDeveloperPages(userEntry)

                    var dev = queryData.Drivers 
            
                    if(userEntry.developer != undefined)
                    {
                        if(userEntry.developer == true)
                        {
                            siteread["developerTags"] = GetDeveloperTags(dev)
                            var cwT = GetCloudWorksTags(queryData.CloudWorks)
                            Object.assign(siteread.developerTags, cwT)
                            siteread["driverdata"] = dev
                        }
                    }

                    output.userdata = siteread
                    
                    output.userdata.customers = []

                    for(var x in userEntry.pages)
                    {
                        output.userdata.customers.push(x)
                    }

                    if(userEntry.developer != undefined)
                        output.userdata.developer = userEntry.developer
                    if(userEntry.admin != undefined)
                        output.userdata.admin = userEntry.admin
                    if(userEntry.superuser != undefined)
                        output.userdata.superuser = userEntry.superuser
                    
                    console.log(post.userdata.email + " Login Success!")
                    
                }
                else
                {
                    status = 404
                    output = {result: "Bad User Details!"}
                    console.log(post.userdata.email + " Login Failed!")
                }
                
                

                res.status(status).json(output);
            }
            else
            {
                console.log(post.userdata.email + " Login Failed!")
                res.status(201).json({result:"Failed To Login"});
            }
            break;   
        }
    }
    next()
}

app.post('/api/posts', confirmUser,PostRouting)
async function PostRouting(req, res, next)
{
    var output = "";
    var post = req.body

    switch(post.requesttype)
    {
        case ("user data"):
        {
            console.log(post.user + " Requested Pages!")
            output = {}

            var userEntry = GetUserEntry(post.user)

            //output["pages"] = GetUserPages(userEntry)
            output.userdata = {}

            if(!userEntry.developer && !userEntry.admin)
            {
                output.userdata["pages"] = GetUserPages(userEntry)
            }
            else
                output.userdata["pages"] = GetDeveloperPages(userEntry)


            var dev = queryData.Drivers 
    
            
            if(userEntry.developer != undefined)
            {
                if(userEntry.developer == true)
                {
                    output.userdata["developerTags"] = GetDeveloperTags(dev)
                    var cwT = GetCloudWorksTags(queryData.CloudWorks)



                    Object.assign(output.userdata.developerTags, cwT)
                    output.userdata["driverdata"] = dev
                }
            }

            output.userdata.customers = []

            for(var x in userEntry.pages)
            {
                output.userdata.customers.push(x)
            }

            if(userEntry.developer != undefined)
                output.userdata.developer = userEntry.developer
            if(userEntry.admin != undefined)
                output.userdata.admin = userEntry.admin
            if(userEntry.superuser != undefined)
                output.userdata.superuser = userEntry.superuser
    
            console.log("Sent Pages to " + post.user)
    
            res.status(201).json(output);
            break;   
        }
        case ("variable information"):
        {
            console.log(post.user + " Requested Variables!")
            var userEntry = GetUserEntry(post.user)

            var userPages = null

            if(!userEntry.developer && !userEntry.admin)
            {
                userPages = GetUserPages(userEntry)
            }
            else
                userPages = GetDeveloperPages(userEntry)
        
            var varaibleGroupings = {}
    
            for(var i = 0; i<userPages.length; i++)
            {
                GetTag(userPages[i],varaibleGroupings)
            }
    
            queryForTags = { "$or" : [] }
    
            for(let driverN in varaibleGroupings)
            {
                var newItem = { driverName: driverN}
                queryForTags["$or"].push(newItem);
            }
        
            var responseData = queryData.Drivers.filter((value) => {     
                                                                                    for(var i = 0; i < queryForTags.$or.length; i++)
                                                                                    {
                                                                                        if(value.driverName == queryForTags.$or[i].driverName)
                                                                                            return true
                                                                                    }
                                                                                        return false
                                                                                    })

            var responseCloudWorksData = queryData.CloudWorks.filter((value) => {     
                                                                                    for(var i = 0; i < queryForTags.$or.length; i++)
                                                                                    {
                                                                                        if(value.SiteName == queryForTags.$or[i].driverName)
                                                                                            return true
                                                                                    }
                                                                                        return false
                                                                                    })
    
            SetTags(varaibleGroupings, responseData);

            SetTags(varaibleGroupings,responseCloudWorksData);
    
            console.log("Sent Variables to " + post.user)

            res.status(201).json(varaibleGroupings);
            break;   
        }
        case ("add page"):
        {
            
            if(setLock())
            {
                if(post.user != undefined && post.page != undefined)
                {
                    console.log(post.user + " Requested Add/Update Page: " + post.page.pageName)
                    if(post.page.pageName != undefined)
                    {
                        var userEntry = GetUserEntry(post.user)

                        if(userEntry)
                        {
                            var index = -1
                            for(var i = 0; i < queryData.UserPages.length;i++)
                            {
                                if(queryData.UserPages[i].id == post.page.id)
                                {
                                    index = i
            
                                    break;
                                }
            
                            }
                            
                            delete post.page._id
                            if(index > -1)
                            {
                                var oldcustomer = null
                                var removeid = -1
                                

                                for(var i = 0; i <queryData.UserPages.length;i++)
                                {
                                    if(queryData.UserPages[i].id == post.page.id)
                                    {
                                        if(queryData.UserPages[i].customer != post.page.customer)
                                        {
                                            oldcustomer = queryData.UserPages[i].customer
                                            removeid = post.page.id
                                            break;
                                        }
                                        
                                        queryData.UserPages[i] = post.page
                                    }    
                                }

                                if(removeid > -1 && oldcustomer != null)
                                {
                                    for(var userdata of queryData.Users)
                                    {
                                        if(userdata.pages[oldcustomer] != undefined)
                                        {
                                            var index = -1

                                            for(var i = 0;i < userdata.pages[oldcustomer].length; i++)
                                            {
                                                if(userdata.pages[oldcustomer][i] == removeid)
                                                {
                                                    index = i
                                                    break;
                                                }
                                            }

                                            if(index != -1)
                                            {
                                                delete userdata._id
                                                userdata.pages[oldcustomer].splice(index,1)
                                                console.log("Removing Page: " + removeid + " From User: " + userdata.email)
        
                                                await updateItemDB(usercollection,{email:userdata.email},{$set:userdata})
                                                console.log("Removed Page: " + removeid + " From User: " + userdata.email)
                                            }
                                            
                                        }
                                    }
                                }
                                
                                console.log(post.user + " Updating Page: " + post.page.pageName)
                                await updateItemDB(pagecollection,{$and:[{id:post.page.id}]},{$set:post.page})
                                console.log(post.user + " Updated Page: " + post.page.pageName)
                            }
                            else
                            {
                                console.log(post.user + " Adding Page: " + post.page.pageName)

                                var indexlist = await fieldFilterDB(pagecollection,{},"id")
                                var pageid = 0

                                for(var i = 0; i<indexlist.length;i++)
                                {
                                    if(pageid == indexlist[i])
                                    {
                                        pageid++
                                    }
                                }
                                
                                post.page.id = pageid
                                queryData.UserPages.push(post.page)
                                await insertItemDB(pagecollection,post.page)

                                // var userData = await getFromDB("HawkEyeUsers",{email:post.user},{})

                                // if(userData[0].pages[post.page.customer].filter((value)=>
                                // { 
                                //     value == post.page.id ? true:false 
                                // }).length == 0)

                                // {
                                    // userData[0].pages[post.page.customer].push(post.page.id)
                                    userEntry.pages[post.page.customer].push(post.page.id)
                                    await updateItemDB(usercollection,{email:post.user},{$set:userEntry})//userData[0]})        
                                // }
                                console.log(post.user + " Added Page: " + post.page.pageName)
                            }
                            
                            res.status(201).json({response:post.page.id});
                        }
                        else
                            BadResponse(res)
                    }
                    else
                    {
                        BadResponse(res)
                    }
                    console.log(post.user + " Request for Add/Update Page Complete")
                }
                else
                {
                    BadResponse(res)
                }
                freeLock()
            }
            else
            {
                BadResponse(res)
            }
            break;   
        }
        case ("delete page"):
        {
            var successful = false
            if(setLock())
            {
                if(post.user != undefined && post.pageid != undefined)
                {
                    if(post.pageid != undefined)
                    {
                    console.log(post.user + " Requested Delete Page: " + post.pageid)

                        var userEntry = GetUserEntry(post.user)

                        if(userEntry)
                        {
                            var pages = GetUserPages(userEntry).filter((value)=> {return value.id == post.pageid})

                            if(pages && pages.length > 0)
                            {


                                for(var iOP = 0;iOP < queryData.UserPages;iOP++)
                                {
                                    if(queryData.UserPages[iOP].id == post.pageid)
                                    {
                                        queryData.UserPages.splice(iOP,1)
                                    }
                                }

                                console.log(post.user + " Deleting Page: " + post.pageid)
                                await removeItemDB(pagecollection,{id:post.pageid})
                                console.log(post.user + " Deleted Page: " + post.pageid)

                                for(var userdata of queryData.Users)
                                {
                                    var index = -1
                                    var customerName = ""

                                    for (var customer in userdata.pages)
                                    {
                                        for(var i = 0; i < userdata.pages[customer].length;i++)
                                        {
                                            if(post.pageid == userdata.pages[customer][i])
                                            {
                                                index = i
                                                customerName = customer
                                            }
                                        }
                                    }

                                    if(index > -1)
                                    {
                                        delete userdata._id
                                        userdata.pages[customerName].splice(index,1)
                                        console.log("Removing Page: " + post.pageid + " From User: " + userdata.email)

                                        await updateItemDB(usercollection,{email:userdata.email},{$set:userdata})
                                        console.log("Removed Page: " + post.pageid + " From User: " + userdata.email)
                                    }
                                }

                                console.log(post.user + " Delete Page Completed ")


                                res.status(201).json("change applied");
                                successful = true
                            }
                        }
                    }
                }

                freeLock()
            }

            if(!successful)
            {
                BadResponse(res)
            }

            break;   
        }
        case ("add driver"):
        {
            if(setLock())
            {
                if(post.driver != undefined && post.driver != "")
                {
                    output = Analyze(post.driver)
                    await insertItemDB("NMBM_drivers", output)
                    res.status(201).json(output);
                }
                else
                {
                    BadResponse(res)
                }
                freeLock()
            }
            else
            {
                BadResponse(res)
            }
            break;   
        }
        case ("trend"):
        {
            if(post.sites)
            {
                var data = []

                for(var i = 0; i < post.sites.length; i++)
                {
                   var currentData = {site:post.sites[i],data:null}
                   currentData.data = await getFromDB(currentData.site,{date:{$gte:new Date(post.start),$lte:new Date(post.end)}},{date:1})
                   data.push(currentData)
                }            
                res.status(200).json(data)
            }
            else
            {
                BadResponse()
            }
            
            break;
        }
        case ("get page assignments"):
        {
            if(post.customers)
            {
                var AssignmentGroup = []

                for(var i = 0; i < queryData.Users.length; i++)
                {
                    var currentUser = {}
                    currentUser.email = queryData.Users[i].email
                    currentUser.pages = {}
                    
                    
                    for(var x in queryData.Users[i].pages)
                    {
                        for(var arr of post.customers)
                        {
                            if(arr == x)
                            {
                                currentUser.pages[arr] = queryData.Users[i].pages[arr]
                                break
                            }
                            
                        }
                    }

                    var emptyAssignments = true

                    for(var x in currentUser.pages)
                    {
                        emptyAssignments = false
                    }
    
                    if(!emptyAssignments)
                    {
                        AssignmentGroup.push(currentUser)
                    }
                }
    
                res.status(201).json(AssignmentGroup);
            }
            else
                BadResponse(res)
            

            break
        }
        case ("set page assignments"):
        {
            if(post.assignments)
            {
                if(queryData.Users.filter((value)=>{
                                                    return value.email == post.user
                                                })[0].admin)
                {
                    for(var userdata of queryData.Users)
                    {
                        for(var assignment of post.assignments)
                        {
                            if(assignment.email == userdata.email)
                            {

                                for(var assign in assignment.pages)
                                {
                                    userdata.pages[assign] = assignment.pages[assign]
                                }

                                
                                await updateItemDB(usercollection,{email:userdata.email},{$set:userdata})
                                break
                            }
                        }
                    }
                    res.status(200).json("All Good")
                }
                else
                {BadResponse(res)}

                
            }
            else
                BadResponse(res)
            break
        }
        case ("get users"):
        {

            var successful = false

            if(post.user)
            {
                userEntry = GetUserEntry(post.user)

                if(userEntry.admin)
                {
                    var usergroup = queryData.Users.filter((value) =>   {

                                                                            var foundone = false
                                                                            if(userEntry.superuser || (!value.superuser && userEntry.admin && (value.admin || value.developer)) || (!value.admin && !value.developer && !value.superuser))
                                                                            {
                                                                                for(var userSites in value.pages)
                                                                                {
                                                                                    

                                                                                    for(var referenceSites in userEntry.pages)
                                                                                    {
                                                                                        if(userSites == referenceSites)
                                                                                        {
                                                                                            foundone = true
                                                                                            break 
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                            
                                                                            return foundone
                                                                        })

                    var CopyOfUserGroup = JSON.parse(JSON.stringify(usergroup))

                    for(var useritem of CopyOfUserGroup)
                    {
                        delete useritem.password
                        delete useritem._id
                    }

                    res.status(200).json(CopyOfUserGroup)
                    successful = true
                }
            }

            if(!successful)
                BadResponse(res)

            break
        }
        case ("create user"):
        {
            var successful = false
            var outputid = -1

            if(post.user && post.userdata)
            {
                var userEntry = GetUserEntry(post.user)

                if(post.userdata.userid != undefined && userEntry.admin)
                {
                    outputid = post.userdata.userid
                    for(var i = 0; i < queryData.Users.length; i++)
                    {
                        if(queryData.Users[i].email == post.userdata.email)
                        {

                            for(var userproperty in post.userdata)
                            {
                                if(userproperty!="password" && userproperty != "pages") 
                                {
                                    queryData.Users[i][userproperty] = post.userdata[userproperty]
                                }
                                
                                if(userproperty == "pages")
                                {
                                    var todelete = []
                                    for(var page in queryData.Users[i].pages)
                                    {
                                        for(var parentpage in userEntry.pages)
                                        {
                                            if(page == parentpage)
                                            {
                                                if(post.userdata.pages[page] == undefined)
                                                {
                                                    todelete.push(page)
                                                }
                                                break;
                                            }
                                        }
                                    }

                                    for(var page in post.userdata.pages)
                                    {
                                        queryData.Users[i].pages[page] = post.userdata.pages[page]
                                    }

                                    for(var page of todelete)
                                    {
                                        delete queryData.Users[i].pages[page]
                                    }
                                }
                            }
                            await updateItemDB(usercollection,{email:post.userdata.email},{$set:queryData.Users[i]})
                            successful = true
                            break

                        }
                    }
                }
                else
                {
                    if(userEntry.admin)
                    {
                        var indexlist = await fieldFilterDB(usercollection,{},"userid")
                        var newuserid = 0
    
                        for(var i = 0; i<indexlist.length;i++)
                        {
                            if(newuserid == indexlist[i])
                            {
                                newuserid++
                            }
                        }
                    
                        outputid = newuserid
                        post.userdata.userid = newuserid

                        var randpass = RandomPassword()

                        sendEmail(post.userdata.email,"Hawkeye Password","Hi, \r\nThis is your password: " + randpass + ". Login here: www.mac-creations-demo.co.za. \r\n\r\nKind Regards,\r\nHawkeye.");

                        post.userdata.password = await bcrypt.hash(randpass,10)

                        if(post.userdata.email != undefined)
                        {
                            if(queryData.Users.filter((value) => {return value.email == post.userdata.email}).length == 0)
                            {
                                await insertItemDB(usercollection,post.userdata)
                                queryData.Users.push(post.userdata)
                                successful = true
                            }
                        }
                    }
                }


                
            }

            if(!successful)
                BadResponse(res)
            else
                res.status(200).json({userid:outputid})

            break
        }
        case("delete user"):
        {
            var successful = false

            if(post.user && post.userdata)
            {
                var userEntry = GetUserEntry(post.user)

                if(post.userdata.userid != undefined && userEntry.admin)
                {
                    var index = -1;
                    for(var i = 0; i < queryData.Users.length; i++)
                    {
                        if(queryData.Users[i].email == post.userdata.email)
                        {


                            index = i
                            await removeItemDB(usercollection,{email:post.userdata.email})
                            successful = true
                            break

                        }
                    }

                    if(index > -1)
                    {
                        queryData.Users.splice(index,1)
                    }
                }
            }

            if(!successful)
                BadResponse(res)
            else
                res.status(200).json("Modification Successful!")

            break
        }
        case("set user password"):
        {
            var successful = false

            if(post.user != undefined && post.newpassword != undefined && post.oldpassword != undefined)
            {
                console.log("Change Password Requested For: " + post.user)

                for(var i =0; i < queryData.Users.length;i++ )
                {
                    
                    if(queryData.Users[i].email == post.user)
                    {
                        if(await bcrypt.compare(post.oldpassword,queryData.Users[i].password))
                    {
                        var hashedpw = await bcrypt.hash(post.newpassword,10)

                        queryData.Users[i].password = hashedpw

                        if(queryData.Users[i]._id)
                            delete queryData.Users[i]["_id"]

                        await updateItemDB(usercollection,{email:queryData.Users[i].email},{$set:queryData.Users[i]})

                        console.log("Changed Password For User: " + post.user)

                        successful = true
                    }
                    }
                }

                
            }

            if(!successful)
            {
                BadResponse(res)
                console.log("Failed To Change Password For User: " + post.user)
            }
            else
                res.status(200).json("Success")

            break
        }
        default:
        {
            BadResponse(res)
            break;
        }
    }
}

function RandomPassword() {
    let pass = '';
    let str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_*';
 
    for (let i = 1; i <= 8; i++) 
    {
        let char = Math.floor(Math.random() * str.length + 1);
        pass += str[char]
    }
 
    return pass;
}

function BadResponse(resObj)
{
    SendResponse(resObj,400,{Response:"Request Failed!"})
}

function SendResponse(resObj,status,packet)
{
    resObj.status(status).json(packet);
}

function GetUserEntry(email)
{
    var userEntries = queryData.Users.filter((value) => {   if(value.email == email)
                                                            return true
                                                        else
                                                            return false
                                                        })


    for(var i = 0; i < userEntries.length; i++)
    {
        if(userEntries[i].email == email)
        {
            return userEntries[i]
        }
    }

    return null
}

async function GetSecureUserEntry(email,password)
{
    while(queryData.Users == undefined || queryData.Users == null)
    {

    }

    var userEntries = queryData.Users.filter((value) => {   if(value.email == email)
                                                                return true
                                                            else
                                                                return false
                                                             })//await getFromDB("HawkEyeV2Users",{email:email},{})


    for(var i = 0; i < userEntries.length; i++)
    {
        if(userEntries[i].email == email)
        {
            if(await bcrypt.compare(password,userEntries[i].password))
            {
                return userEntries[i] 
            }
        }
    }
    return null
}

function GetUserPages(userEntry)
{

    return queryData.UserPages.filter((value) =>   {   
        for(var project in userEntry.pages)
        {
            for(var i = 0; i < userEntry.pages[project].length;i++)
            {
                if(value.id == userEntry.pages[project][i])
                {
                    return true
                }
            }
        }
        
        return false
    })

}

function GetDeveloperPages(userEntry)
{
    return queryData.UserPages.filter((value) =>   {   
        var Customers = []

        for(var cust in userEntry.pages)
        {
            if(cust = value.customer)
            {
                return true
            }
        }
        
        return false
    })
}

async function GetHawkEyeDataStructure()
{
    try
    {        
        if(database == null)
        {
            database = myMongoClient.db("HawkEye");
        }
        var nData = await getFromDB("FirstAttempt",{},{});

        return nData;
    }
    catch(Ex)
    {
    }
}

function Analyze(inputData)
{
	var splitData = inputData.split("\r\n")
	var indexer = null
	var headingsIndex = -1;

	var overallObject = {driverName:"",ipAddress:"",description:"",dataArray:[],TerminateDriver:false}

	var basicData = splitData[1].split(",")
	
	overallObject.driverName = basicData[0]
	overallObject.ipAddress = basicData[1]
	overallObject.description = basicData[2]
	
	splitData.splice(0,2)
	
	for(var itemName in splitData)
	{
		var item = splitData[itemName]
		if(indexer != null)
		{
			var newItem = {}
			var tempStorage = item
			var tempSplit = tempStorage.split(",")
			newItem["trend_control"] = false
			for(var splitItem in tempSplit)
			{
				if(tempSplit[splitItem] != "")
				{
					if(Number(splitItem) < indexer.length)
					{
						tempLower = tempSplit[splitItem].toLowerCase()
						if(tempLower == "false")
						{
							newItem[indexer[splitItem]] = false
						}
						else if(tempLower == "true")
						{
							newItem[indexer[splitItem]] = true
						}
						else
						{
							newItem[indexer[splitItem]] = tempSplit[splitItem]
						}
					}
					
					if(indexer[splitItem] == "periodDropDownValue")
						newItem["trend_control"] == true
					
					
				}
			}
			if(newItem["bit"] != undefined && newItem["register"] != undefined)
			{
				newItem["register"] += "." + newItem["bit"]
				delete newItem["bit"]
			}
			splitData[itemName] = newItem
		}
		else
		{
			var lowerItem = item.toLowerCase()
			if(lowerItem.includes("tagname") && lowerItem.includes("description") && lowerItem.includes("trendperiod"))
			{
				headingsIndex = itemName
				indexer = lowerItem.split(",")
				for(var indexVal in indexer)
				{
					if(indexer[indexVal] == "tagname")
					{
						indexer[indexVal] = "tagName"
					}
					if(indexer[indexVal] == "type")
					{
						indexer[indexVal] = "typeDropDownValue"
					}
					if(indexer[indexVal] == "units")
					{
						indexer[indexVal] = "unit"
					}
					if(indexer[indexVal] == "trendperiod")
					{
						indexer[indexVal] = "periodDropDownValue"
					}
					if(indexer[indexVal] == "wordswap")
					{
						indexer[indexVal] = "word_swap_control"
					}
					if(indexer[indexVal] == "bit_value")
					{
						indexer[indexVal] = "bit"
					}
				}
			}
		}
	}

	if(headingsIndex > -1)
	{
		splitData.splice(0,headingsIndex + 1)
	}
	
	while(true)
	{
		var baseIndex = -1
		var lastIndex = -1
		for(var vari in splitData)
		{
			var item = splitData[vari]
			if(item["bit"] != undefined && item["register"] == undefined && item["tagName"] == undefined && baseIndex == -1)
			{
				baseIndex = vari - 1
			}
			else if(item["tagName"] != undefined && baseIndex != -1)
			{
				lastIndex = vari - 1
				break
			}
		}
		
		if(baseIndex == -1)
		{
			break;
		}
		
		if(lastIndex == -1)
		{
			lastIndex = splitData.length - 1
		}
		
		if(splitData[baseIndex]["descriptions"] == undefined)
			splitData[baseIndex]["descriptions"] = {}
		
		for(var i = baseIndex + 1; i <= lastIndex; i++)
		{
			splitData[baseIndex]["descriptions"][splitData[i].bit] = splitData[i].description
		}
		var removeCount = lastIndex - (baseIndex+1) + 1
		splitData.splice(baseIndex+1,removeCount)
	}
	
	if(splitData[splitData.length - 1].tagName == undefined)
	{
		splitData.splice(splitData.length-1,1)
	}

	overallObject.dataArray = splitData
	
	
	return overallObject
}

function GetDeveloperTags(input)
{
    var output = {}

    for(var i = 0; i < input.length; i++)
    {
        output[input[i].driverName] = []
        for(var x = 0; x < input[i].dataArray.length; x++)
        {
            output[input[i].driverName].push(input[i].dataArray[x].tagName)
        }
    }

    return output;
}

function GetCloudWorksTags(drivers)
{
    var output = {}

    for(var i = 0; i < drivers.length; i++)
    {
        if(drivers[i].SiteName != undefined)
        {
            output[drivers[i].SiteName] = []
            if(drivers[i].SiteName != undefined)
            {

                for(var x = 0; x < drivers[i].SiteData.Tags.length; x++)
                {
                    if(drivers[i].SiteData.Tags[x].TagName != "" && drivers[i].SiteData.Tags[x].TagName != undefined)
                    {
                        output[drivers[i].SiteName].push(drivers[i].SiteData.Tags[x].TagName)
                    }

                    if(drivers[i].SiteData.Tags[x].RateName != "" && drivers[i].SiteData.Tags[x].RateName != undefined)
                    {
                        output[drivers[i].SiteName].push(drivers[i].SiteData.Tags[x].RateName)
                    }
                }
            }
        }
    }

    for(var x in output)
    {
        output[x].push("battery_status")
        output[x].push("wakeupperiod")
    }

    return output
}

function SetTags(variableData, databaseData)
{
    for(var driverName in variableData)
    {
        for(var i = 0 ; i < databaseData.length; i++)
        {
            if(databaseData[i].driverName == driverName || databaseData[i].SiteName == driverName)
            {
                for(var variableName in variableData[driverName])
                {
                    if(databaseData[i].CurrentValues[variableName] != undefined)
                    {
                        variableData[driverName][variableName] = databaseData[i].CurrentValues[variableName]
                        
                        if(databaseData[i].dataArray != undefined)
                        {
                            for(var item of databaseData[i].dataArray)
                            {
                                if(item.tagName == variableName)
                                {
                                    if(item.descriptions != undefined)
                                    {
                                        if(variableData.lists == undefined)
                                        {
                                            variableData.lists = {}
                                        }
                                        variableData.lists[item.tagName] = item.descriptions
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function GetTag(structureData,OutVar)
{
    if(structureData.components!=undefined)
    {
        for(var i =0; i < structureData.components.length; i++)
        {
            GetTag(structureData.components[i],OutVar);
        }
    }

    if(structureData.driverName != undefined)
    {
        if(OutVar == undefined)
        {
            OutVar = {}
        }

        if(OutVar[structureData.driverName] == undefined || OutVar[structureData.driverName] == null )
        {
            OutVar[structureData.driverName] ={};
        }

        OutVar[structureData.driverName][structureData.tagName] = "";
    }
}

function GetDB()
{
    if(database == null)
    {
        database = myMongoClient.db("HawkEye");
    }
}

async function getFromDB(collection,filter,sort) 
{
    GetDB()
    return new Promise((resolve, reject) => 
    {
            database.collection(collection).find(filter).sort(sort).toArray((err, result) => {
            if (err) 
            {
            console.error("Error retrieving data from MongoDB:", err);
            reject(err);
            } 
            else 
            {
            resolve(result);
            }
            });
    });
}

async function updateItemDB(collection,filter,update) 
{
    GetDB()
    await database.collection(collection).updateOne(filter,update)
    database.collection(collection).find()
    return null
}

async function insertItemDB(collection,data) 
{
    return await database.collection(collection).insertOne(data)
}

async function removeItemDB(collection,filter)
{
    return await database.collection(collection).deleteOne(filter)
}

async function fieldFilterDB(collection,filter,field)
{
    var out = await database.collection(collection).distinct(field)
    var realOut = []
    for(var x of out)
    {
        realOut.push(x)
    }
    return realOut.sort()
}

function setLock()
{
    if(lockRead)
        return false
    
    lockRead = true
    return lockRead
}

function freeLock()
{
    if(!lockRead)
        return false

    lockRead = false
    return !lockRead
}

function getLock()
{
    return lockRead
}


module.exports={app,myMongoClient,database,queryData,getFromDB, QueryData, getLock};




async function sendEmail(emailList,subject,Message) 
{
	var emailBody = Message

	let transporter = nodemailer.createTransport	({	
														host: "mail.macautomation.co.za",
														port: 465,secure: true,
														// auth: {user: 'dewaldt@macautomation.co.za',pass: "Beanstalk2022",},
														auth: {user: 'brandon@macautomation.co.za',pass: "Brandon#2023",},
														tls:{rejectUnauthorized:false}
													})


	let info = await transporter.sendMail	({
												from: '"Brandon" <brandon@macautomation.co.za>',
												to: emailList,
												cc:"",
												subject: subject,
												text: emailBody,
												// attachments:[{filename: "How To Install and Use Hawkeye.pdf",path: attachmentPath}]
											})
}