'use strict';

//setting up node stuff
const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
//cache service
const NodeCache = require( "node-cache" );
const memberCache = new NodeCache({ stdTTL: 1440  });

//this function returns the association url/slug into the same strings contained as the memberships inside of Salesforce this is used in the function of the API call to tell if a URL matches to a member's membership association. 
//nbl has extra checks as it was the inital Association to use this server, and we had to change the URL structure.

const niceName = (slug) => {
  //get the association out of the url
  let assocSlug = slug.split('_')[0];
  //get the membership out of the url
  let mshipType = slug.split('top-')[1];
  console.log(assocSlug + ' ' + mshipType);
  if ((mshipType == '40-under-40' && assocSlug == 'NBL') || (mshipType == '40-under-40' && assocSlug == slug) ) {
    return `NBL - Top 40 Under 40`;
  } else if((mshipType == '100' && assocSlug == 'NBL') || (mshipType == '100' && assocSlug == slug)) {
    return `NBL - Top 100`;
  }
  else if (mshipType == '40' && assocSlug == 'NTL') {
    return `NTL - Civil Plaintiff - Top 40 under 40`;
  } else if(mshipType == '100' && assocSlug == 'NTL') {
    return `NTL - Civil Plaintiff - Top 100`;
  }
  else if(mshipType == 'motor-vehicle' && assocSlug == 'NTL') {
    return `NTL - Motor Vehicle - Top 25`;
  }
  else if(mshipType == 'national-aviation' && assocSlug == 'NTL') {
    return `NTL - National Aviation - Top 10`;
  }
  else if(mshipType == 'national-brain-injury' && assocSlug == 'NTL') {
    return `NTL - National Brain Injury - Top 25`;
  }
  else if(mshipType == 'environmental' && assocSlug == 'NTL') {
    return `NTL - Environmental - Top 10`;
  }
  else if(mshipType == 'class-action' && assocSlug == 'NTL') {
    return `NTL - Class Action - Top 25`;
  }
  else if(mshipType == 'railroad-accident' && assocSlug == 'NTL') {
    return `NTL - Railroad Accident - Top 10`;
  }
  else if(mshipType == 'workers-compensation' && assocSlug == 'NTL') {
    return `NTL - Workers Compensation - Top 25`;
  }
  else if(mshipType == 'national-women-trial-lawyers' && assocSlug == 'NTL') {
    return `NTL - National Women Trial Lawyers - Top 25`;
  }
  else if(mshipType == 'business-tort' && assocSlug == 'NTL') {
    return `NTL - Business Tort - Top 10`;
  }
  else if(mshipType == 'national-asbestos-mesothelioma' && assocSlug == 'NTL') {
    return `NTL - National Asbestos/Mesothelioma - Top 10`;
  }
  else if(mshipType == 'national-latino-trial-lawyers' && assocSlug == 'NTL') {
    return `NTL - National Latino Trial Lawyers - Top 10`;
  }
  else if(mshipType == 'insurance-bad-faith' && assocSlug == 'NTL') {
    return `NTL - Insurance Bad Faith - Top 10`;
  }
  else if(mshipType == 'medical-malpractice' && assocSlug == 'NTL') {
    return `NTL - Medical Malpractice - Top 25`;
  }
  else if(mshipType == 'nursing-home' && assocSlug == 'NTL') {
    return `NTL - Nursing Home - Top 10`;
  }
  else if(mshipType == 'wage-and-hour' && assocSlug == 'NTL') {
    return `NTL - Wage and Hour - Top 10`;
  }
  else if(mshipType == 'products-liability' && assocSlug == 'NTL') {
    return `NTL - Products Liability - Top 25`;
  }
  else if(mshipType == 'mass-tort' && assocSlug == 'NTL') {
    return `NTL - Mass Tort - Top 25`;
  }
  else if(mshipType == 'trucking' && assocSlug == 'NTL') {
    return `NTL - Trucking - Top 10`;
  }
  else if(mshipType == 'civil-rights-tla' && assocSlug == 'NTL') {
    return `NTL - Civil Rights TLA - Top 10`;
  }
  else if(mshipType == 'national-trial-lawyers-for-womens-rights' && assocSlug == 'NTL') {
    return `NTL - National Trial Lawyers for Womens Rights - Top 10`;
  }
  else{
  return `NTL - Civil Plaintiff - Top 100`;
}
}
//if we have this member cached in our cache, give them the badge that they match
async function getBadge(sfid, assoc,req,res) {
  //check if key exists & how long ttl
  let value = memberCache.get(sfid);
  if ( value !== undefined ){
    let ts = memberCache.getTtl(sfid);
    console.log('cache ttl', ts,value, sfid);
    //if the cache ttl is greater than 0, return the correct image
    //nbl has extra checks as it was the inital Association to use this server, and we had to change the URL structure.

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
        } else if (asc.isValid && assoc === 'NTL_top-40') {
          let file = __dirname + `/NTL-40-success.png`;
          return res.sendFile(file);
        }
        else if (!asc.isValid && assoc === 'NTL_top-40') {
          let file = __dirname + `/NTL-40-error.png`;
          return res.sendFile(file);
        }
         else if (asc.isValid && assoc === 'NTL_motor-vehicle') {
          let file = __dirname + `/MVTLA-Top-25.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_motor-vehicle') {
          let file = __dirname + `/MVTLA-Top-25-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_national-aviation') {
          let file = __dirname + `/NATLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_national-aviation') {
          let file = __dirname + `/NATLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_national-brain-injury') {
          let file = __dirname + `/BITLA-Top-25.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_national-brain-injury') {
          let file = __dirname + `/BITLA-Top-25-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_environmental') {
          let file = __dirname + `/ETLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_environmental') {
          let file = __dirname + `/ETLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_class-action') {
          let file = __dirname + `/CATLA-Top-25.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_class-action') {
          let file = __dirname + `/CATLA-Top-25-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_railroad-accident') {
          let file = __dirname + `/RATLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_railroad-accident') {
          let file = __dirname + `/RATLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_workers-compensation') {
          let file = __dirname + `/WCTLA-Top-25.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_workers-compensation') {
          let file = __dirname + `/WCTLA-Top-25-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_national-women-trial-lawyers') {
          let file = __dirname + `/NWTLA-Top-25.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_national-women-trial-lawyers') {
          let file = __dirname + `/NWTLA-Top-25-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_business-tort') {
          let file = __dirname + `/BTTLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_business-tort') {
          let file = __dirname + `/BTTLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_national-asbestos-mesothelioma') {
          let file = __dirname + `/AMTLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_national-asbestos-mesothelioma') {
          let file = __dirname + `/AMTLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_national-latino-trial-lawyers') {
          let file = __dirname + `/NLTLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_national-latino-trial-lawyers') {
          let file = __dirname + `/NLTLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_insurance-bad-faith') {
          let file = __dirname + `/IBFTLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_insurance-bad-faith') {
          let file = __dirname + `/IBFTLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_medical-malpractice') {
          let file = __dirname + `/MMTLA-Top-25.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_medical-malpractice') {
          let file = __dirname + `/MMTLA-Top-25-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_nursing-home') {
          let file = __dirname + `/NHTLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_nursing-home') {
          let file = __dirname + `/NHTLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_wage-and-hour') {
          let file = __dirname + `/WHTLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_wage-and-hour') {
          let file = __dirname + `/WHTLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_products-liability') {
          let file = __dirname + `/PrLTLA-Top-25.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_products-liability') {
          let file = __dirname + `/PrLTLA-Top-25-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_mass-tort') {
          let file = __dirname + `/MTTLA-Top-25.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_mass-tort') {
          let file = __dirname + `/MTTLA-Top-25-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_trucking') {
          let file = __dirname + `/TTLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_trucking') {
          let file = __dirname + `/TTLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_civil-rights-tla') {
          let file = __dirname + `/CRTLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_civil-rights-tla') {
          let file = __dirname + `/CRTLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else if (asc.isValid && assoc === 'NTL_national-trial-lawyers-for-womens-rights') {
          let file = __dirname + `/WRTLA-Top-10.png`;
          return res.sendFile(file);
        } 
        else if (!asc.isValid && assoc === 'NTL_national-trial-lawyers-for-womens-rights') {
          let file = __dirname + `/WRTLA-Top-10-Inactive.png`;
          return res.sendFile(file);
        }
        else {
          let file = __dirname + `/Bad-URL.jpg`;
          return res.sendFile(file);
        }
      });
      return;
    }
  }

  //setup Salesforce API stuff
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



    //lets start our Salesforce API call and check if the URL should return a valid member badge or not.
  let isValid = false;
  if(member !== false && member.Contact_s_MembershipsList_aa__c !== null) {
    //starting the loop
    let findMembership = await member.Contact_s_MembershipsList_aa__c.split(',').map((mship, index) => {
      let object = {};
      //check to see if the Salesforce name for the membership matches the URL by using the niceName function near the top of this file. 
      //If it matches, let's set the associations for this member into an object called obj and if it's falid or not so we can then use the valid variable in our code later and in the cached results
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

  //if we have set isValid  to true let's return the right image depeneding on the slug.
  //nbl has extra checks as it was the inital Association to use this server, and we had to change the URL structure.
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
  } else if (isValid && assoc === 'NTL_top-40') {
  	let file = __dirname + `/NTL-40-success.png`;
 		return res.sendFile(file);
  } else if (isValid && assoc === 'NTL_top-40') {
  	let file = __dirname + `/NTL-40-error.png`;
 		return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_motor-vehicle') {
    let file = __dirname + `/MVTLA-Top-25.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_motor-vehicle') {
    let file = __dirname + `/MVTLA-Top-25-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_national-aviation') {
    let file = __dirname + `/NATLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_national-aviation') {
    let file = __dirname + `/NATLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_national-brain-injury') {
    let file = __dirname + `/BITLA-Top-25.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_national-brain-injury') {
    let file = __dirname + `/BITLA-Top-25-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_environmental') {
    let file = __dirname + `/ETLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_environmental') {
    let file = __dirname + `/ETLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_class-action') {
    let file = __dirname + `/CATLA-Top-25.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_class-action') {
    let file = __dirname + `/CATLA-Top-25-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_railroad-accident') {
    let file = __dirname + `/RATLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_railroad-accident') {
    let file = __dirname + `/RATLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_workers-compensation') {
    let file = __dirname + `/WCTLA-Top-25.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_workers-compensation') {
    let file = __dirname + `/WCTLA-Top-25-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_national-women-trial-lawyers') {
    let file = __dirname + `/NWTLA-Top-25.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_national-women-trial-lawyers') {
    let file = __dirname + `/NWTLA-Top-25-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_business-tort') {
    let file = __dirname + `/BTTLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_business-tort') {
    let file = __dirname + `/BTTLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_national-asbestos-mesothelioma') {
    let file = __dirname + `/AMTLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_national-asbestos-mesothelioma') {
    let file = __dirname + `/AMTLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_national-latino-trial-lawyers') {
    let file = __dirname + `/NLTLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_national-latino-trial-lawyers') {
    let file = __dirname + `/NLTLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_insurance-bad-faith') {
    let file = __dirname + `/IBFTLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_insurance-bad-faith') {
    let file = __dirname + `/IBFTLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_medical-malpractice') {
    let file = __dirname + `/MMTLA-Top-25.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_medical-malpractice') {
    let file = __dirname + `/MMTLA-Top-25-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_nursing-home') {
    let file = __dirname + `/NHTLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_nursing-home') {
    let file = __dirname + `/NHTLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_wage-and-hour') {
    let file = __dirname + `/WHTLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_wage-and-hour') {
    let file = __dirname + `/WHTLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_products-liability') {
    let file = __dirname + `/PrLTLA-Top-25.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_products-liability') {
    let file = __dirname + `/PrLTLA-Top-25-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_mass-tort') {
    let file = __dirname + `/MTTLA-Top-25.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_mass-tort') {
    let file = __dirname + `/MTTLA-Top-25-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_trucking') {
    let file = __dirname + `/TTLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_trucking') {
    let file = __dirname + `/TTLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_civil-rights-tla') {
    let file = __dirname + `/CRTLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_civil-rights-tla') {
    let file = __dirname + `/CRTLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
  else if (isValid && assoc === 'NTL_national-trial-lawyers-for-womens-rights') {
    let file = __dirname + `/WRTLA-Top-10.png`;
    return res.sendFile(file);
  } 
  else if (!isValid && assoc === 'NTL_national-trial-lawyers-for-womens-rights') {
    let file = __dirname + `/WRTLA-Top-10-Inactive.png`;
    return res.sendFile(file);
  }
   else {
    let file = __dirname + `/Bad-URL.jpg`;
    return res.sendFile(file);
  }
  return res.status(200).json({message: `error id  was not nblmember instead it was ${sfid}`,});
}
module.exports = {getBadge};
