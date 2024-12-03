
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = 'https://lqyuluyuwrqwzdwdinfb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeXVsdXl1d3Jxd3pkd2RpbmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDczMzAsImV4cCI6MjA0ODc4MzMzMH0.6MIOTquPx74VeZfFDVb8S3Lq1Oqt_QwsfNGWG3-lqDA';

const supabase = createClient(supabaseUrl, supabaseKey);


supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        // console.log('User signed in:', session.user);
    } else if (event === 'SIGNED_OUT') {
        window.location.href = 'signing.html';
    }
});

// GETCH CURRENT SIGNED IN USER
const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
        console.error('Error retrieving user session:', error);
        return null;
    }

    if (data.session) {
        const user = data.session.user;
        let userName = user.identities[0].identity_data.fullname
        let nameOut = document.getElementById('fullname')
        nameOut.textContent = userName
        // console.log('Current signed-in user:', user);
        return user; // Returns the current signed-in user's details
    } else {
        window.location.href = 'signing.html';
        return null;
    }
};

// Call the function
getCurrentUser();




let productNameIn = document.getElementById('productName')
let productPriceIn = document.getElementById('productPrice')
let productImageIn = document.getElementById('productImage')

let writeProduct = document.getElementById('writeProduct')
let readProduct = document.getElementById('readProduct')
let updateProduct = document.getElementById('updateProduct')
let deleteProduct = document.getElementById('deleteProduct')





// WRITING TO THE DATABASE
const writeProductFunc = async () => {
    let productName = productNameIn.value
    let productPrice = productPriceIn.value


    const currentDate = new Date().toISOString().split("T")[0];

    if(productName === '' || productPrice === '' ){
        alert('No field should be left empty')
        return
    }else{

        let file = productImageIn.files[0]
        // console.log(file)
        var fileName = file.name
        const filePath = `PRODUCTS/${fileName}`
        const{data:uploadData, error:uploadError} = await supabase.storage
        .from('PRODUCTS')
        .upload(filePath, file)
        if(uploadError){
            console.error('Upload Error: ', uploadError.message)
            return;
        }
        // console.log('File Successfully Uploaded:', uploadData);

        // GETTING BACK THE UPLOAD URL
        const {data:publicUrlData} = await supabase.storage
        .from('PRODUCTS')
        .getPublicUrl(filePath)
        const fileUrl = publicUrlData.publicUrl
        // console.log('public url:', fileUrl);
        
        // SAVE THE DETAILS TO THE DATABASE
        const{data:dbData, error:dbError} = await supabase
        .from('PRODUCTS')
        .insert([
            {
                productName : productName,
                productPrice : productPrice,
                productImage : fileUrl,
            }
        ])
        if(dbError){
            alert('Database Error:', dbError)
        }else{
            alert('Post Successful:', dbData)
        }
        
    }
    productNameIn.value = ''
    productPriceIn.value = ''
}

writeProduct.addEventListener('click', writeProductFunc)



// READING FROM THE DATABASE
const readProductFunc = async () => {
    let productName = productNameIn.value
    const {data, error} = await supabase
    .from('PRODUCTS')
    .select()
    .eq('productName', productName)
    if(error){
        console.error(error)
    }else{
        productNameIn.textContent = data[0].productName
        productPriceIn.textContent = data[0].productPrice
        console.log(data);
    }
}

readProduct.addEventListener('click', readProductFunc)



// UPDATING THE PRODUCTS
const updateProductFunc = async () => {
    let productName = productNameIn.value
    let productPrice = productPriceIn.value


    if(productName === '' || productPrice === ''){
        alert('fill all empty spaces please')
    }else{
        const {data, error} = await supabase
        .from('PRODUCTS')
        .update([
            {
                productName : productName,
                productPrice : productPrice,
            }
        ])
        .eq('productName', productName)
        if(error){
            alert('Updating error:', error.message)
        }else{
            alert('Document Updated');
            
        }

    }
}

updateProduct.addEventListener('click', updateProductFunc)



// DELETING THE PRODUCT

const deleteProductFunc = async () => {
    let productName = productNameIn.value

    const{data, error} = await supabase
    .from('PRODUCTS')
    .delete()
    .eq('productName', productName)
    
    if(error){
        alert('Error Deleting:', error.message)
    }else{
        alert('Document Deleted')
        // console.log(data)
    }
}

deleteProduct.addEventListener('click', deleteProductFunc)
