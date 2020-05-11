'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
//cache service
const NodeCache = require( "node-cache" );
const memberCache = new NodeCache({ stdTTL: 1440  });

const niceName = (slug) => {
  let assoc = slug.split('top-')[1];
  let mshipType = '';
  if (assoc === '40-under-40') {
    mshipType = '40 Under 40';
  } else {
    mshipType = '100'
  }
  return `NBL - Top ${mshipType}`;
}
async function getBadge(sfid, assoc,req,res) {
  //check if key exists & how long ttl
  let value = memberCache.get(sfid);
  if ( value !== undefined ){
    let ts = memberCache.getTtl(sfid);
    console.log('cache ttl', ts,value, sfid);
    if(ts > 0) {
      let mapSfidAssocs = value.associations.map((asc) => {
        if(asc.isValid && assoc === 'top-100') {
          let file = __dirname + `/success.png`;
          return res.sendFile(file);
        } else if (!asc.isValid && assoc === 'top-100'){
          let file = __dirname + `/error.png`;
          return res.sendFile(file);
        } else if (asc.isValid && assoc === 'top-40-under-40') {
          let file = __dirname + `/success40.png`;
          return res.sendFile(file);
        } else {
          let file = __dirname + `/error40.png`;
          return res.sendFile(file);
        }
      });
      return;
    }
  }

  let grantType = 'password';
  let clientId = '3MVG9mclR62wycM2iQebdxuMeCM7moEvm3wlMKZc14g81OnuAk3fS7NZVWIh1qQqMB01F0CMo0PVZbW_.NeZH';
  let clientSecret = '4E73B4E3DA565780E7B7E57919C8B236951EA19FB91D5CD4EE4A0794CB91FFE5';
  let username = 'lamtech%40associationsmgt.com';
  let password = '3p6SIixC0Z8n';
  let token = await axios.post(`https://login.salesforce.com/services/oauth2/token?grant_type=${grantType}&client_id=${clientId}&client_secret=${clientSecret}&username=${username}&password=${password}`)
  	.then(res => {
  		return res.data.access_token;
  	})
  	.catch(err=> console.log('error', err.response.message, err.response.status))
  let member = await axios({
    method: 'get',
    url: `https://lamprod.my.salesforce.com/services/data/v30.0/sobjects/Contact/${sfid}`,
    headers: {
      Authorization: `Bearer ${token}`
    },})
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log('error on contact grab', err.response, err.response.status);
      return false;
    });
  let isValid = false;
  if(member !== false && member.Contact_s_MembershipsList_aa__c !== null) {
    let findMembership = await member.Contact_s_MembershipsList_aa__c.split(',').map((mship, index) => {
      let object = {};
      if(mship === niceName(assoc)) {
        isValid = true;
        let obj = {
          associations: [{
            association: assoc,
            isValid: true,  
          }],
        }
        let success = memberCache.set(sfid, obj);
        if(success) {
          console.log('cache set')
        }
      }
    })
  }
  if(isValid && assoc === 'top-100') {
  	let file = __dirname + `/success.png`;
 		return res.sendFile(file);
  } else if (!isValid && assoc === 'top-100'){
  	let file = __dirname + `/error.png`;
 		return res.sendFile(file);
  } else if (isValid && assoc === 'top-40-under-40') {
    let file = __dirname + `/success40.png`;
    return res.sendFile(file);
  } else {
    let file = __dirname + `/error40.png`;
    return res.sendFile(file);
  }
  return res.status(200).json({message: `error id  was not nblmember instead it was ${sfid}`,});
}
module.exports = {getBadge};