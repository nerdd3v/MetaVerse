
function Navbar() {
    const elements = ["product", "testimonials", "about us"];

  return (
    <div style={{
        height: "10vh",
        width: "100vw",
        backgroundColor: "transparent"
      }}> 
      <div style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h1 style={{fontSize: "2vw", fontFamily: "monospace", fontWeight: "100",  height: "100%", width:"33%", paddingLeft:"3vw", paddingTop: "2vh"}}>QWARF</h1>
        <div style={{display: "flex", flexDirection: "row", height:"100%", width: "34%", border: "2px solid black", borderRadius: "2vw"}}>
            {elements.map((e, idx)=>{
                return(
                    <div key={idx} style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        width: '100%'
                    }} >
                        <h3>{e}</h3>
                    </div>
                )
            })}
        </div>

            <div style={{height: "100%", width: "33%", display: "flex", justifyContent: "center", gap: "2vw"}}>
                <button onClick={()=>{

                }}>Signup</button>
                <button>Signin</button>
            </div>

      </div>
    </div>
  )
}

export default Navbar
