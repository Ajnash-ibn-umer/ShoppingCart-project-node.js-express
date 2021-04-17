

let sample=  setTimeout(()=>{
     let s='hellow'
      return s
  },3000)
  



sample().then((s)=>{
    console.log(s);
})