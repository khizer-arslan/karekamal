const express = require('express');
const router = express.Router();
const config = require('config');
const User = require('../../config/models/User');
const Requests=require('../../config/models/requests')
//  Route   post  api/users
//  Desc    Register user
//  Access  Public

router.post(
  '/',
  // Name and pass the second parameter as a custom error message
  async (req, res) => {
  try {
    console.log(req.body);
    const {name,hospitalName,phonenumber,business,cnic,amount,instituteName,city,requestType,Disease,hospitalPhoneNumber,familyMember,bloodGroup,requestBy}=req.body;
    let data=null
    if(requestType==='Rashan'){
         data=await Requests.create({name,familyMember,phonenumber,amount,cnic,business,requestType,requestBy})
    }

    if(requestType==='blood'){
         data=await Requests.create({name,phonenumber,cnic,hospitalName,city,bloodGroup,requestType,requestBy})
    }
    if(requestType==='medicine'){ 
     data=await Requests.create({name,phonenumber,hospitalName,Disease,amount,city,hospitalPhoneNumber,requestType,requestBy,requestBy})
    }

    if(requestType==='education'){
       data=await Requests.create({name,business,phonenumber,amount,cnic,instituteName,city,requestType,requestBy}) 
    }
console.log(data);
    res.status(201).json({
        status:true,
        data:data
    })
  } catch (err) {
    console.log(err,"===================");
    res.status(500).json({
        status:false,
        msg:"SERVER ERROR"
    })
  }

  }
);





router.get(
    '/:by',
    // Name and pass the second parameter as a custom error message
    async (req, res) => {
    try {
        const {by}=req.params   
        let data=null
        if(by==='all'){
            data=await Requests.find({}).populate('requestBy')
        }else{
            data=await Requests.find({requestType:by}).populate('requestBy')
        }

        res.json({
            status:true,
            data
        })
        
    } catch (err) {
      console.log(err,"===================");
      res.status(500).json({
          status:false,
          msg:"SERVER ERROR"
      })
    }
  
    }
  );





router.get(
    '/:requestBy/:approved',
    // Name and pass the second parameter as a custom error message
    async (req, res) => {
    try {
        const {requestBy,approved}=req.params  
        console.log(requestBy,approved);

            const data=await Requests.find({requestBy:requestBy,approved:approved})
        res.json({
            status:true,
            data
        })
        
    } catch (err) {
      console.log(err,"===================");
      res.status(500).json({
          status:false,
          msg:"SERVER ERROR"
      })
    }
  
    }
  );



  router.put(
    '/',
    // Name and pass the second parameter as a custom error message
    async (req, res) => {
    try {
        const {requestId,approve}=req.body  
            const data=await Requests.findByIdAndUpdate({_id:requestId},{approved:approve},{new:true,runValidators:true})
            console.log(data);
        res.json({
            status:true,
            data
        })
        
    } catch (err) {
      console.log(err,"===================");
      res.status(500).json({
          status:false,
          msg:"SERVER ERROR"
      })
    }
  
    }
  );

module.exports = router;
