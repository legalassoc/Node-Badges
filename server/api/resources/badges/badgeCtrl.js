'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
//cache service
const NodeCache = require( "node-cache" );
const memberCache = new NodeCache({ stdTTL: 1440  });

const niceName = (slug) => {
  let assocSlug = slug.split('_')[0];
  let mshipType = slug.split('top-')[1];
  console.log(assocSlug + ' ' + mshipType);
  if ((mshipType == '40-under-40' && assocSlug == 'NBL') || (mshipType == '40-under-40' && assocSlug == slug) ) {
    return `NBL - Top 40 Under 40`;
  } else if((mshipType == '100' && assocSlug == 'NBL') || (mshipType == '100' && assocSlug == slug)) {
    return `NBL - Top 100`;
  }
  else if (mshipType == '40-under-40' && assocSlug == 'NTL') {
    return `NTL - Top 40 Under 40`;
  } else if(mshipType == '100' && assocSlug == 'NTL') {
    return `NTL - Top 100`;
  }
  else{
  return `NTL - Top 100`;
}
}
async function getBadge(sfid, assoc,req,res) {
  //check if key exists & how long ttl
  let value = memberCache.get(sfid);
  if ( value !== undefined ){
    let ts = memberCache.getTtl(sfid);
    console.log('cache ttl', ts,value, sfid);
    if(ts > 0) {
      let mapSfidAssocs = value.associations.map((asc) => {
        if((asc.isValid && assoc === 'NBL_top-100') || (asc.isValid && assoc === 'top-100')) {
          let file = __dirname + `/NBL-100-success.png`;
          return res.sendFile(file);
        } else if ((!asc.isValid && assoc === 'NBL_top-100') || (!asc.isValid && assoc === 'top-100')){
          let file = __dirname + `/NBL-100-error.png`;
          return res.sendFile(file);
        } else if ((asc.isValid && assoc === 'NBL_top-40-under-40') || (asc.isValid && assoc === 'top-40-under-40')) {
          let file = __dirname + `/NBL-40-success.png`;
          return res.sendFile(file);
        } else if ((!asc.isValid && assoc === 'NBL_top-40-under-40') || (!asc.isValid && assoc === 'top-40-under-40')) {
          let file = __dirname + `/NBL-40-error.png`;
          return res.sendFile(file);
        } else if (asc.isValid && assoc === 'NTL_top-100') {
          let file = __dirname + `/NTL-100-success.png`;
          return res.sendFile(file);
        } else if (!asc.isValid && assoc === 'NTL_top-100') {
          let file = __dirname + `/NTL-100-error.png`;
          return res.sendFile(file);
        } else if (asc.isValid && assoc === 'NTL_top-40-under-40') {
          let file = __dirname + `/NTL-40-success.png`;
          return res.sendFile(file);
        } else if (asc.isValid && assoc === 'NTL_top-40-under-40') {
          let file = __dirname + `/NTL-40-error.png`;
          return res.sendFile(file);
        } else {
          let file = __dirname + `/Bad-URL.jpg`;
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
  let password = encodeURI('lbNyYr36W9m6QfwtU3M5MahYvUUD4QbE1ZUsI');
  let token = await axios.post(`https://login.salesforce.com/services/oauth2/token?grant_type=${grantType}&client_id=${clientId}&client_secret=${clientSecret}&username=${username}&password=${password}`)
  	.then(res => {
  		return res.data.access_token;
  	})
  	.catch(err=> console.log('error when getting token', err.response.statusText, err.response))
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
      console.log('error on contact grab', err.response.statusText, err.response.status);
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
            association: niceName(assoc),
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
  if((isValid && assoc === 'NBL_top-100') || (isValid && assoc === 'top-100')) {
  	let file = __dirname + `/NBL-100-success.png`;
 		return res.sendFile(file);
  } else if ((!isValid && assoc === 'NBL_top-100') || (!isValid && assoc === 'top-100')) {
  	let file = __dirname + `/NBL-100-error.png`;
 		return res.sendFile(file);
  } else if ((isValid && assoc === 'NBL_top-40-under-40') || (isValid && assoc === 'top-40-under-40')) {
    let file = __dirname + `/NBL-40-success.png`;
    return res.sendFile(file);
  } else if ((!isValid && assoc === 'NBL_top-40-under-40') || (!isValid && assoc === 'top-40-under-40')) {
    let file = __dirname + `/NBL-40-error.png`;
    return res.sendFile(file);
  } else if (isValid && assoc === 'NTL_top-100') {
  	let file = __dirname + `/NTL-100-success.png`;
 		return res.sendFile(file);
  } else if (!isValid && assoc === 'NTL_top-100') {
  	let file = __dirname + `/NTL-100-error.png`;
 		return res.sendFile(file);
  } else if (isValid && assoc === 'NTL_top-40-under-40') {
  	let file = __dirname + `/NTL-40-success.png`;
 		return res.sendFile(file);
  } else if (isValid && assoc === 'NTL_top-40-under-40') {
  	let file = __dirname + `/NTL-40-error.png`;
 		return res.sendFile(file);
  } else {
    let file = __dirname + `/Bad-URL.jpg`;
    return res.sendFile(file);
  }
  return res.status(200).json({message: `error id  was not nblmember instead it was ${sfid}`,});
}
module.exports = {getBadge};
