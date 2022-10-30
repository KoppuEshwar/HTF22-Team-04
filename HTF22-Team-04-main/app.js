const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const { ObjectId } = require("mongodb")
const methodOverride = require('method-override');
require('dotenv').config()
const alumni = require('./models/alumni');
const careerflow = require('./models/careerflow');
const nodemailer = require('nodemailer')

const db = require('./db')
db.initDb((err, db) => {
    if (err) {
        console.log(err)
    } else {
        console.log("connected")
        const port = process.env.PORT || 3001
        app.listen(port)
    }
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));





app.get('/', async (req, res) => {
    res.render("login")
   
})
app.get('/addevent', async (req, res) => {
    res.render("Add.ejs")
   
})




app.get('/logout', async (req, res) => {
    res.render("login")
   
})

app.get('/home', async (req, res) => {
    {
        const database = db.getDb().db("AlumniTracking")
        const eventList = await database.collection("Events").find().toArray();
        const { title } = req.query;
        if (title) {
            const event = await database.collection("Events").find({ _id: ObjectId(title) }).toArray()
            const eventList = event
            res.render("home", { eventList })
            
        }
        else {
            res.render("home", { eventList })
        }}
   
})






app.post('/home', async (req, res) => {

    if( (req.body.username)==='admin')
    {

    try {
        const database = db.getDb().db("AlumniTracking")
        const eventList = await database.collection("Events").find().toArray();
        const { title } = req.query;
        if (title) {
            const event = await database.collection("Events").find({ _id: ObjectId(title) }).toArray()
            const eventList = event
            res.render("home", { eventList })
            console.log(eventList)
        }
        else {
            res.render("home", { eventList })
        }
    }
    catch (err) {

        

    }
}

else if (req.body.username.includes("1601"))
{
    try {
        let id = req.body.username
        const database = db.getDb().db("AlumniTracking")
        

        const lst = await database.collection("Alumni").find({ year: 2024, rollno: id }).toArray();
        const rollno = lst[0].rollno
        const career = lst[0].careerflow
        const x=1
        const name = lst[0].name
        const branch = lst[0].Bs
        res.render('progress', { career, rollno,x,branch,name })


    } catch (error) {
        
    }
}
})



app.post('/mail/:id', async (req, res) => {
     
    const database = db.getDb().db("AlumniTracking")
    const lst = await database.collection("Alumni").find().toArray()

    const {id}= req.params
    const temp = await database.collection("Alumni").find({ year: 2024, rollno: id }).toArray();
  const mail = temp[0].email
  console.log("Hiiiiiiiiiiiiiiiiii")
  console.log(mail)
    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth :{
            user :'shivathejamp@gmail.com',
            pass : 'jhgtiylalreaexju'
        }
        });
      
        var mailoptions={
            from:'shivathejamp@gmail.com',
            to:mail,
            subject:'Invitation for an event',
            text:`${req.body.msg}`

        };
        transporter.sendMail(mailoptions,function(err,info){
            if(err){
                console.log(err);
            }
            else{
                console.log("sent");
            }
    })
  const x =0
    res.render("alumni",{lst,x})

})




app.get('/login', async (req, res) => {
    res.render("login")
})


app.get('/Invite', async (req, res) => {
    res.render("invite")
})


app.get('/admin', async (req, res) => {
    res.render("admin")
})

app.get('/alumni', async (req, res) => {
     console.log("hi")
    const database = db.getDb().db("AlumniTracking")

        const lst = await database.collection("Alumni").find({ year: 2024 }).toArray();
     const {title} = req.query
     console.log(title)
      
   
if(title)
{
    const lst = await database.collection("Alumni").find({ rollno:(title) }).toArray()
    const x =0
    res.render("alumni", { lst ,x})
      
}
else{
        
        const x=0
        res.render("alumni", { lst ,x})

}
})



app.get('/salumni', async (req, res) => {
    try {
        const database = db.getDb().db("AlumniTracking")

        const lst = await database.collection("Alumni").find({ year: 2024 }).toArray();
        console.log(lst)
        const x =1
        res.render("alumni", { lst ,x})

    }
    catch (error) {

    }
})


app.get('/alumni/:id', async (req, res) => {
    try {
        const database = db.getDb().db("AlumniTracking")
        const { id } = req.params;

        const lst = await database.collection("Alumni").find({ year: 2024, rollno: id }).toArray();
        const rollno = lst[0].rollno
        const name = lst[0].name
        const branch = lst[0].Bs
        const career = lst[0].careerflow
        const x=0
        res.render('progress', { career, rollno ,x,name,branch})

    } catch (error) {

    }
})



app.get('/salumni/:id', async (req, res) => {
    try {
        const database = db.getDb().db("AlumniTracking")
        const { id } = req.params;

        const lst = await database.collection("Alumni").find({ year: 2024, rollno: id }).toArray();
        const rollno = lst[0].rollno
        const name = lst[0].name
        const branch = lst[0].Bs
        const career = lst[0].careerflow
        const x=1
        res.render('progress', { career, rollno ,x,name,branch})

    } catch (error) {

    }
})



app.get('/alumni/:id/Addprogress', async (req, res) => {
    const { id } = req.params;

    res.render("new", { id })

})

app.post('/alumni/:id/Addprogress', async (req, res) => {
    const { id } = req.params;
    const data = req.body.food;
    const database = db.getDb().db("AlumniTracking")
    const lst = await database.collection("Alumni").find({ year: 2024, rollno: id }).toArray();
    const career = lst[0].careerflow;
    career.push(data);
    await database.collection("Alumni").updateOne({ rollno: id }, { $set: { careerflow: career } })
    //res.send("updated")
    res.redirect(`/salumni/${id}`);
})

app.post('/Addevent', async (req, res) => {
    try {
        console.log(req.body.food)
        const database = db.getDb().db("AlumniTracking");
        await database.collection("Events").insert(req.body.food);
        res.redirect(`/Addevent`)
    } catch (error) {

    }
})

app.post('/invite', async (req, res) => {
    try {
        // const {dept,companies}
        const database = db.getDb().db("AlumniTracking")
        console.log(req.body.dept);
        // const database=db.getDb().db("AlumniTracking")
        // // const lst=await database.collection("Alumni").find({})
        // const lst1=[]
        // for(let i=0;i<req.body.companies.length;++i){

        // }
        let obj = req.body.dept
        // console.log(obh``)
        let mail1=[]
        let mail2=[]
        let cmp=[]
        let obj1 = req.body.companies
        if(obj1!==undefined){
            for (let item of Object.entries(obj1)) {
               cmp.push(item[0])
            }
        }
        let filter1 = []
        const list = await database.collection("Alumni").find().toArray();
        for(let i=0;i<cmp.length;++i){
            for(let j=0;j<list.length;++j){
                
                for(let k=0;k<list[j].careerflow.length;++k){
                    //console.log(list[j].careerflow[k].Organization)
                    if(list[j].careerflow[k].Organization===cmp[i]){
                        filter1.push(list[j]._id);
                        mail1.push(list[j].email)
                    }
                }
            }
        }
        console.log(filter1)
        
        
let dpt = []
if (obj1 !== undefined) {
    for (let item of Object.entries(obj)) {
        dpt.push(item[0])
    }
    console.log(dpt)
}
    let filter2 = []
       for(let i=0;i<filter1.length;i++)
       {
        const temp = await database.collection("Alumni").find({_id:filter1[i]}).toArray();
        console.log(temp[0].Bs)
        
        for(let j=0; j<dpt.length; j++)
        {   
            console.log(dpt[j])
            if(temp[0].Bs===dpt[j])
            {
                filter2.push(temp[0]._id)
                mail2.push(temp[0].email)
            }
        }
       }

       
      //  console.log(filter1)
        //console.log(filter2)
        //console.log(mail2)
        //res.send("Selected")
         
        var transporter = nodemailer.createTransport({
            service:'gmail',
            auth :{
                user :'shivathejamp@gmail.com',
                pass : 'jhgtiylalreaexju'
            }
            });
            for(let i=0;i<mail2.length;i++){
                var mailoptions={
                from:'shivathejamp@gmail.com',
                to:mail2[i],
                subject:'Invitation for an event',
                text:`${req.body.message}`
    
            };
            transporter.sendMail(mailoptions,function(err,info){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("sent");
                }
        })



    }
     
       for(let i=0;i<list.length;++i){
         const invs=list[i].invitaionsReceived;
         console.log(invs);
         invs.push(req.body.message);
         console.log(invs);
         await database.collection("Alumni").updateOne({_id:list[i]._id},{$set:{invitaionsReceived:invs}})
       }

     
       res.render("invite")

     }
    catch (err) {

    }
})





