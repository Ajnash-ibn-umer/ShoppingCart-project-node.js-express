//add mongodb lib
var mongoClient=require('mongodb')

//declare null db state for using database
let state;
//function for export to app.js this include connection congfig
module.exports.connect=(done)=>{
    //declare datas
let url='mongodb://localhost:27017'
let dbname='shopping'
//function for connect ddatabase
mongoClient.connect(url,(err,data)=>{
    if(err) return done(err)

  state=data.db(dbname)
    done()
})
}
//this function for get datas from database
module.exports.get=()=>{

return state

}