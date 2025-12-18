const getProduct = async(id)=>{
    try{
        let res= await fetch(`http://localhost:3000/api/secrect/product/newProduct/productByCategoryId?id=${id}`, { method: "GET" } ,{cache: 'force-cache' })
        const data = await res.json()
        return data.data

    }
    catch(e){
        return []
    }
}

export default getProduct