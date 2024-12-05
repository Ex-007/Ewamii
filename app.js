// Project url = https://lqyuluyuwrqwzdwdinfb.supabase.co
// API key = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeXVsdXl1d3Jxd3pkd2RpbmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDczMzAsImV4cCI6MjA0ODc4MzMzMH0.6MIOTquPx74VeZfFDVb8S3Lq1Oqt_QwsfNGWG3-lqDA

import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = 'https://lqyuluyuwrqwzdwdinfb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeXVsdXl1d3Jxd3pkd2RpbmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDczMzAsImV4cCI6MjA0ODc4MzMzMH0.6MIOTquPx74VeZfFDVb8S3Lq1Oqt_QwsfNGWG3-lqDA';

const supabase = createClient(supabaseUrl, supabaseKey);






// POPULATING THE PRODUCT PAGE
// READING FROM THE DATABASE AND POPULATING THE PRODUCTS PAGE
let displayAll = document.getElementById('displayAll')
const readProductFunc = async () => {
    const {data, error} = await supabase
    .from('PRODUCTS')
    .select()
    if(error){
        console.error(error)
    }else{
        console.log(data);
        data.forEach(element => {
            let newDiv = document.createElement('div')
            newDiv.setAttribute('class', 'col-lg-3 col-sm-6')
            newDiv.innerHTML = `
               <div class="product_box">
                    <h4 class="bursh_text">${element.productName}</h4>
                    <img src="${element.productImage}" class="image_1" alt="${element.productName}">
                    <div class="btn_main">
                        <div class="buy_bt">
                            <ul>
                                <li class="buyNow">Buy Now</li>
                            </ul>
                        </div>
                        <h3 class="price_text">&#x20A6;${element.productPrice}</h3>
                    </div>
                </div> 
            `;
            newDiv.querySelector('.buyNow').addEventListener('click', () => {
                const productName = element.productName
                const productPrice = element.productPrice

                 // check local storage for customer's info, if it exists, send, if it doesnt, collect their phone number and email.
          const customerDetails = JSON.parse(localStorage.getItem('customerDetails'))
          if(!customerDetails){
            const fullName = prompt('Enter Full name')
            const phoneNumber = prompt('Enter Phone Number')
            const email = prompt('Enter Email')

            if(phoneNumber && email && fullName){
              const newCustomerDetails = {phoneNumber, email, fullName}
              localStorage.setItem('customerDetails', JSON.stringify(newCustomerDetails))
              setTimeout(() => {
                sendToTelegram(customerDetails, productName, productPrice)
              },2000)
            }else{
              alert('Both Phone Number and Email are required for delivery')
            }
          }else{
            sendToTelegram(customerDetails, productName, productPrice)
          }
            })
            displayAll.appendChild(newDiv)
        });
    }
}

readProductFunc()

    // sending to telegram
    function sendToTelegram(customerDetails, productName, productPrice){
        const API_KEY = '8074076986:AAG4c8g2emIGmHTfkKM9uNR7k7Rtpcla24k'
        const chat_id = 5979443967

        const message = `
          New Order:
          Product: ${productName}
          Price: ${productPrice}
          Customer Name: ${customerDetails.fullName}
          Customer Phone: ${customerDetails.phoneNumber}
          Customer Email: ${customerDetails.email}
         `
      ;

fetch(`https://api.telegram.org/bot${API_KEY}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        chat_id: `${chat_id}`,
        text: message,
    }),
})
.then(response => response.json())
.then(data =>  {
  console.log('Message sent:', data)
  if(data.ok){
    alert(`Order of ${productName} placed`)
  }
})
.catch(error => console.error('Error sending message:', error));
}




// HOMEPAGE CAROUSEL
let carousell = document.getElementById('carousell')
const hompePopulation = async () => {
    const { data, error } = await supabase
    .from('PRODUCTS')
    .select()
    .order('created_at', { ascending: false })
    .limit(4);

    if(error){
        console.log('error: ', error.message)
    }else{
        console.log(data);
        data.forEach(element => {

            let newDiv = document.createElement('div')
            newDiv.setAttribute('class', 'carousel-item')
            newDiv.innerHTML = `
                <div class="container">
                    <div class="row">
                    <div class="col-sm-6">
                        <h1 class="banner_taital">${element.productName}</h1>
                        <div class="read_bt"><a href="#">Buy Now</a></div>
                    </div>
                    <div class="col-sm-6">
                        <div class="banner_img"><img src="${element.productImage}"></div>
                    </div>
                    </div>
                </div>
            `
            carousell.appendChild(newDiv)
        })
    }
}

hompePopulation()




// HOME FEATURES PRODUCTS
let featuredProd = document.getElementById('featuredProd')
const displayHomeFew = async () => {
    const { data, error } = await supabase
    .from('PRODUCTS')
    .select()
    .order('created_at', { ascending: false })
    .limit(7);

    if(error){
        console.log(error)
    }else{
        console.log(data);
        data.forEach(element => {

            let newDiv = document.createElement('div')
            newDiv.setAttribute('class', 'col-lg-3 col-sm-6')
            newDiv.innerHTML = `
            <div class="product_box">
                    <h4 class="bursh_text">${element.productName}</h4>
                    <img src="${element.productImage}" class="image_1" alt="${element.productName}">
                    <div class="btn_main">
                        <div class="buy_bt">
                            <ul>
                                <li class="buyNow">Buy Now</li>
                            </ul>
                        </div>
                        <h3 class="price_text">&#x20A6;${element.productPrice}</h3>
                    </div>
                </div> 
            `;
            newDiv.querySelector('.buyNow').addEventListener('click', () => {
                const productName = element.productName
                const productPrice = element.productPrice

                 // check local storage for customer's info, if it exists, send, if it doesnt, collect their phone number and email.
          const customerDetails = JSON.parse(localStorage.getItem('customerDetails'))
          if(!customerDetails){
            const fullName = prompt('Enter Full name')
            const phoneNumber = prompt('Enter Phone Number')
            const email = prompt('Enter Email')

            if(phoneNumber && email && fullName){
              const newCustomerDetails = {phoneNumber, email, fullName}
              localStorage.setItem('customerDetails', JSON.stringify(newCustomerDetails))
              setTimeout(() => {
                sendToTelegram(customerDetails, productName, productPrice)
              },2000)
            }else{
              alert('Both Phone Number and Email are required for delivery')
            }
          }else{
            sendToTelegram(customerDetails, productName, productPrice)
          }
            })
            featuredProd.appendChild(newDiv)
        })
    }
}

displayHomeFew()